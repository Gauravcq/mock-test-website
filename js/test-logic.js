document.addEventListener('DOMContentLoaded', () => {

    // --- INITIALIZATION & DATA LOADING ---
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');
    
    // Check for necessary data files
    if (!testId) { document.body.innerHTML = "<h1>Error: Test ID not specified. Please select a test from the home page.</h1>"; return; }
    if (typeof ALL_TESTS === 'undefined') { document.body.innerHTML = `<h1>Fatal Error: ALL_TESTS list not found.</h1>`; return; }
    if (typeof QUESTIONS_DATABASE === 'undefined') { document.body.innerHTML = `<h1>Fatal Error: QUESTIONS_DATABASE not found.</h1>`; return; }
    
    const testInfo = ALL_TESTS.find(t => t.id === testId);
    const questions = QUESTIONS_DATABASE[testId];

    if (!testInfo || !questions) { 
        document.body.innerHTML = `<h1>Error: Questions for test ID "${testId}" not found in database.</h1>`; 
        return; 
    }

    // --- ELEMENT REFERENCES ---
    const instructionsModal = document.getElementById('instructions-modal');
    const startTestBtn = document.getElementById('start-test-btn');
    const quizUI = document.getElementById('quiz-ui');

    // --- HELPER FUNCTIONS ---
    /**
     * Helper function for robust string comparison. 
     * Handles spaces, converts to lowercase, and standardizes common math symbols.
     */
    function normalizeString(str) {
        if (str === null) return '';
        return String(str)
            .replace(/[\u20b9₹]/g, '') // Remove Rupee symbols (₹)
            .replace(/m\u00b2/g, 'm^2') // Standardize m² to m^2
            .replace(/\u00b0/g, 'deg') // Standardize degree symbol (°)
            .replace(/\s+/g, '') // Remove all internal whitespace
            .toLowerCase();
    }

    // --- QUIZ START ---
    startTestBtn.addEventListener('click', () => {
        instructionsModal.classList.add('hidden');
        quizUI.classList.remove('hidden');
        initializeQuiz(questions, testInfo);
    });

    // --- CORE QUIZ LOGIC ---

    function initializeQuiz(questions, testInfo) {
        let currentQuestionIndex = 0;
        let currentReviewIndex = 0;
        let questionStates = []; 
        let timerInterval;
        let timeRemaining = (testInfo.minutes || 25) * 60; // Use minutes from testInfo
        let isPaused = false;

        // --- Element References (Inside Quiz) ---
        const resultSummaryPage = document.getElementById('result-summary-page');
        const reviewPage = document.getElementById('review-page');
        const timerEl = document.getElementById('timer');
        const pauseBtn = document.getElementById('pause-btn');
        const pauseOverlay = document.getElementById('pause-overlay');
        const resumeBtn = document.getElementById('resume-btn');
        const submitSummaryModal = document.getElementById('submit-summary-modal');
        const submissionStatsEl = document.getElementById('submission-stats');
        const finalSubmitBtn = document.getElementById('final-submit-btn');
        const cancelSubmitBtn = document.getElementById('cancel-submit-btn');
        const questionArea = document.getElementById('question-area');
        const questionTitle = document.getElementById('question-title');
        const questionPalette = document.getElementById('question-palette');
        
        // Navigation buttons in the palette panel (These handle Save & Next / Submit)
        const nextBtn = document.getElementById('next-btn');
        const markReviewBtn = document.getElementById('mark-review-btn');
        const submitTestBtn = document.getElementById('submit-test-btn');

        // Analysis panel elements
        const totalAnsweredEl = document.getElementById('total-answered');
        const analysisAnsweredEl = document.getElementById('analysis-answered');
        const analysisNotAnsweredEl = document.getElementById('analysis-not-answered');
        const lastMinuteTimerEl = document.getElementById('last-minute-timer-value');


        // Set the main test title and info
        document.getElementById('test-main-title').textContent = `${testInfo.subject} - ${testInfo.date} ${testInfo.title}`;
        
        // Initialize state array
        questionStates = questions.map(() => ({ 
            status: 'unvisited', 
            userAnswer: null, 
            markedForReview: false 
        }));
        
        createPalette();
        startTimer();
        showQuestion(0);
        updateAnalysisPanel();
        
        // Prevent accidental closing
        window.addEventListener('beforeunload', (e) => { 
            if (!isPaused && timeRemaining > 0) {
                 e.preventDefault(); 
                 e.returnValue = ''; 
            }
        });

        // --- TIMER FUNCTIONS ---
        function startTimer() { 
            timerInterval = setInterval(() => { 
                if (isPaused) return; 
                timeRemaining--; 
                
                const minutes = Math.floor(timeRemaining / 60); 
                const seconds = timeRemaining % 60; 
                
                if (timerEl) { 
                    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; 
                } 

                if (lastMinuteTimerEl) {
                    lastMinuteTimerEl.textContent = `${minutes} Minutes`;
                }
                
                if (timeRemaining <= 0) { 
                    clearInterval(timerInterval); 
                    calculateAndShowResults(true); // Auto-submit on time zero
                } 
            }, 1000); 
        }
        function pauseTest() { isPaused = true; pauseOverlay.classList.remove('hidden'); }
        function resumeTest() { isPaused = false; pauseOverlay.classList.add('hidden'); }
        
        // --- ANALYSIS PANEL UPDATE ---
        function updateAnalysisPanel() {
            const answeredCount = questionStates.filter(s => s.userAnswer !== null).length;
            const notAnsweredCount = questions.length - answeredCount;

            totalAnsweredEl.textContent = answeredCount;
            analysisAnsweredEl.textContent = answeredCount;
            // The screenshot shows "Not Answered" counting only the ones that were visited but not answered.
            // We'll update the logic to reflect the visible palette state (Not Answered includes unvisited too, but for this small panel, we often count unvisited + not-answered).
            analysisNotAnsweredEl.textContent = questionStates.filter(s => s.status !== 'answered').length; 
        }

        // --- RESULT & SUBMISSION FUNCTIONS ---
        function showSubmissionSummary() {
            // Ensure the last viewed question's answer is saved
            saveCurrentAnswer(); 

            const answered = questionStates.filter(s => s.userAnswer !== null).length;
            const notAnswered = questions.length - answered;
            const marked = questionStates.filter(s => s.markedForReview).length;

            const answeredMarked = questionStates.filter(s => s.markedForReview && s.userAnswer !== null).length;
            const unansweredMarked = marked - answeredMarked;
            const unvisited = questionStates.filter(s => s.status === 'unvisited').length;

            submissionStatsEl.innerHTML = `
                <div>Answered: <span>${answered}</span></div>
                <div>Not Answered: <span>${notAnswered}</span></div>
                <div>Answered & Marked: <span>${answeredMarked}</span></div>
                <div>Not Answered & Marked: <span>${unansweredMarked}</span></div>
                <div>Unvisited: <span>${unvisited}</span></div>
            `;
            submitSummaryModal.classList.remove('hidden');
        }

        function calculateAndShowResults(autoSubmit = false) {
            if (!autoSubmit) { submitSummaryModal.classList.add('hidden'); }
            clearInterval(timerInterval);
            
            let score = 0, correctCount = 0, incorrectCount = 0, attemptedCount = 0;
            const positiveMark = 2; // +2 for correct
            const negativeMark = 0.5; // -0.5 for incorrect
            
            questionStates.forEach((state, index) => { 
                if (state.userAnswer !== null) { 
                    attemptedCount++; 
                    
                    const userAnswerNormalized = normalizeString(state.userAnswer);
                    const correctAnswerNormalized = normalizeString(questions[index].correctAnswer);

                    if (userAnswerNormalized === correctAnswerNormalized) { 
                        score += positiveMark; 
                        correctCount++; 
                    } else { 
                        score -= negativeMark; 
                        incorrectCount++; 
                    } 
                } 
            });
            
            const resultStatsEl = document.getElementById('result-stats-full');
            resultStatsEl.innerHTML = `
                <div class="stat-card score"><span class="value">${score.toFixed(2)}</span><span class="label">Score</span></div>
                <div class="stat-card correct"><span class="value">${correctCount}</span><span class="label">Correct</span></div>
                <div class="stat-card incorrect"><span class="value">${incorrectCount}</span><span class="label">Incorrect</span></div>
                <div class="stat-card unattempted"><span class="value">${questions.length - attemptedCount}</span><span class="label">Unattempted</span></div>
            `;
            
            // Show the results page
            quizUI.classList.add('hidden'); 
            resultSummaryPage.classList.remove('hidden');
        }

        // --- QUESTION HANDLING & PALETTE ---
        function createPalette() { 
            questionPalette.innerHTML = ''; 
            questions.forEach((_, index) => { 
                const btn = document.createElement('button'); 
                btn.className = 'palette-btn'; 
                btn.textContent = index + 1; 
                btn.dataset.index = index; 
                btn.addEventListener('click', () => { 
                    saveCurrentAnswer(); 
                    showQuestion(index); 
                }); 
                questionPalette.appendChild(btn); 
            }); 
        }

        function showQuestion(index) { 
            currentQuestionIndex = index; 
            const question = questions[index]; 
            const state = questionStates[index]; 

            // Update status if it was 'unvisited'
            if (state.status === 'unvisited') { 
                state.status = 'not-answered'; 
            } 
            
            questionTitle.textContent = `Question : ${index + 1}`; 
            
            // Render the options with user's saved answer checked
            const optionsHtml = question.options.map(option => 
                `<label class="option ${state.userAnswer === option ? 'selected' : ''}">
                    <input type="radio" name="option" value="${option}" ${state.userAnswer === option ? 'checked' : ''}>
                    <span>${option}</span>
                </label>`
            ).join('');

            questionArea.innerHTML = `<p class="question-text">${question.question}</p><div class="options-container">${optionsHtml}</div>`; 

            // Re-bind click handler for the new options (to handle 'selected' class)
            questionArea.querySelectorAll('.option').forEach(label => {
                label.addEventListener('click', function() {
                    // Remove 'selected' from all siblings
                    this.parentNode.querySelectorAll('.option').forEach(l => l.classList.remove('selected'));
                    // Add 'selected' to the clicked label
                    this.classList.add('selected');
                });
            });

            if (window.MathJax) { 
                window.MathJax.typeset(); 
            } 
            updateNavigation(); 
            updatePalette(); 
            updateAnalysisPanel();
        }

        function saveCurrentAnswer() { 
            const selectedOption = document.querySelector('input[name="option"]:checked'); 
            const state = questionStates[currentQuestionIndex]; 
            
            if (selectedOption) { 
                state.userAnswer = selectedOption.value; 
                state.status = 'answered'; // Status is 'answered' if an answer is selected
            } else if (state.status !== 'unvisited') {
                 // If answer is cleared, revert to 'not-answered'
                 state.userAnswer = null;
                 if (!state.markedForReview) {
                     state.status = 'not-answered';
                 }
            }
        }

        function updateNavigation() { 
            // Update Mark/Unmark button text
            markReviewBtn.textContent = questionStates[currentQuestionIndex].markedForReview ? 'Unmark Review' : 'Mark for Review'; 
        }

        function updatePalette() { 
            document.querySelectorAll('.palette-btn').forEach((btn, index) => { 
                const state = questionStates[index]; 
                btn.className = 'palette-btn'; // Reset classes
                
                // Determine the correct status class based on the combined state
                if (state.markedForReview) { 
                    btn.classList.add(state.userAnswer !== null ? 'answered-marked' : 'marked-unanswered'); 
                } else if (state.userAnswer !== null) { 
                    btn.classList.add('answered'); 
                } else if (state.status === 'not-answered') { 
                    btn.classList.add('not-answered'); 
                } else { // 'unvisited'
                    btn.classList.add('unvisited'); 
                } 
                
                if (index === currentQuestionIndex) { 
                    btn.classList.add('current'); // Highlight the currently viewed question
                } 
            }); 
        }

        // --- REVIEW PAGE FUNCTIONS ---
        function showReviewQuestion(index) { 
             // ... (Review function logic remains the same from previous step) ...
             currentReviewIndex = index; 
            const question = questions[index]; 
            const state = questionStates[index]; 
            const reviewArea = document.getElementById('review-question-area'); 

            document.getElementById('review-question-title').textContent = `Reviewing Question ${index + 1} of ${questions.length}`; 
            
            const optionsHtml = question.options.map(option => { 
                const isCorrect = normalizeString(option) === normalizeString(question.correctAnswer); 
                const isUserChoice = option === state.userAnswer; 
                
                let optionClass = 'review-option'; 
                if (isCorrect) optionClass += ' correct'; 
                if (isUserChoice && !isCorrect) optionClass += ' incorrect'; 
                
                return `
                    <div class="${optionClass}">
                        <div class="review-option-text"><span class="radio-icon"></span><span>${option}</span></div> 
                        ${isUserChoice ? `<span class="user-pick-indicator">✔️ Your Pick</span>` : ''}
                        ${isCorrect && !isUserChoice ? `<span class="correct-answer-indicator">✅ Correct Answer</span>` : ''}
                    </div>`; 
            }).join(''); 
            
            reviewArea.innerHTML = `
                <p class="question-text">${index + 1}. ${question.question}</p>
                <div class="options-container">${optionsHtml}</div>
                <div class="solution-box">
                    <h4>Solution:</h4>
                    <p>${question.explanation}</p>
                </div>`; 
                
            if (window.MathJax) { 
                window.MathJax.typeset(); 
            } 
            document.getElementById('review-prev-btn').disabled = index === 0; 
            document.getElementById('review-next-btn').disabled = index === questions.length - 1; 
        }

        // --- EVENT LISTENERS ---
        pauseBtn.addEventListener('click', pauseTest); 
        resumeBtn.addEventListener('click', resumeTest);
        
        submitTestBtn.addEventListener('click', showSubmissionSummary);
        finalSubmitBtn.addEventListener('click', () => calculateAndShowResults());
        cancelSubmitBtn.addEventListener('click', () => submitSummaryModal.classList.add('hidden'));

        // Listener for the "Save & Next" button in the palette panel
        nextBtn.addEventListener('click', () => { 
            saveCurrentAnswer(); 
            updatePalette(); 
            updateAnalysisPanel();
            if (currentQuestionIndex < questions.length - 1) { 
                showQuestion(currentQuestionIndex + 1); 
            } else {
                // If on the last question, Save & Next implies moving to the submission step
                showSubmissionSummary();
            }
        });
        
        // Listener for the Mark for Review button
        markReviewBtn.addEventListener('click', () => { 
            const state = questionStates[currentQuestionIndex]; 
            state.markedForReview = !state.markedForReview; 
            updatePalette(); 
            updateNavigation(); 
            // Note: Clear Response button is not present in the new UI, 
            // so we rely on the user selecting a different option to change the answer.
        });
        
        // Listeners for the temporary Save/Report buttons (optional, based on your screenshot)
        document.getElementById('save-btn')?.addEventListener('click', () => {
            saveCurrentAnswer();
            updatePalette();
            updateAnalysisPanel();
            alert("Answer Saved!");
        });
        document.getElementById('report-btn')?.addEventListener('click', () => {
            alert("Question Reported.");
        });


        // Listeners for the Review Test buttons (if implemented)
        document.getElementById('review-test-btn')?.addEventListener('click', () => { 
            resultSummaryPage.classList.add('hidden'); 
            reviewPage.classList.remove('hidden'); 
            showReviewQuestion(0); 
        });

        document.getElementById('review-next-btn')?.addEventListener('click', () => { 
            if (currentReviewIndex < questions.length - 1) { 
                showReviewQuestion(currentReviewIndex + 1); 
            } 
        });

        document.getElementById('review-prev-btn')?.addEventListener('click', () => { 
            if (currentReviewIndex > 0) { 
                showReviewQuestion(currentReviewIndex - 1); 
            } 
        });

        // Listener for the Instructions button to re-open the modal
        document.getElementById('instructions-btn')?.addEventListener('click', () => {
            if (!isPaused) pauseTest(); // Pause the test if it's running
            instructionsModal.classList.remove('hidden');
        });
        
    }
});