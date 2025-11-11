document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');
    if (!testId) { document.body.innerHTML = "<h1>Error: Test ID not specified.</h1>"; return; }
    if (typeof ALL_TESTS === 'undefined') { document.body.innerHTML = `<h1>Fatal Error: ALL_TESTS list not found.</h1>`; return; }
    const testInfo = ALL_TESTS.find(t => t.id === testId);
    if (!testInfo) { document.body.innerHTML = `<h1>Error: Test with ID "${testId}" not found.</h1>`; return; }
    if (typeof QUESTIONS_DATABASE === 'undefined') { document.body.innerHTML = `<h1>Fatal Error: QUESTIONS_DATABASE not found.</h1>`; return; }
    const questions = QUESTIONS_DATABASE[testId];
    if (!questions) { document.body.innerHTML = `<h1>Error: Questions for test ID "${testId}" not found.</h1>`; return; }

    const instructionsModal = document.getElementById('instructions-modal');
    const startTestBtn = document.getElementById('start-test-btn');
    const quizUI = document.getElementById('quiz-ui');

    startTestBtn.addEventListener('click', () => {
        instructionsModal.classList.add('hidden');
        quizUI.classList.remove('hidden');
        initializeQuiz(questions, testInfo);
    });

    /**
     * Helper function for robust string comparison.
     */
    function normalizeString(str) {
        if (str === null) return '';
        return String(str)
            .replace(/[\u20b9₹]/g, '') 
            .replace(/m\u00b2/g, 'm^2')
            .replace(/\u00b0/g, 'deg') 
            .replace(/\s+/g, '')
            .toLowerCase();
    }

    function initializeQuiz(questions, testInfo) {
        let currentQuestionIndex = 0; let currentReviewIndex = 0; let questionStates = []; let timerInterval;
        let testDurationMinutes = testInfo.durationMinutes || 25; 
        let timeRemaining = testDurationMinutes * 60; 
        let isPaused = false;

        const resultSummaryPage = document.getElementById('result-summary-page');
        const reviewPage = document.getElementById('review-page');
        const timerEl = document.getElementById('timer');
        const pauseBtn = document.getElementById('pause-btn'); const pauseOverlay = document.getElementById('pause-overlay'); const resumeBtn = document.getElementById('resume-btn');
        const submitSummaryModal = document.getElementById('submit-summary-modal');
        const submissionStatsEl = document.getElementById('submission-stats');
        const finalSubmitBtn = document.getElementById('final-submit-btn');
        const cancelSubmitBtn = document.getElementById('cancel-submit-btn');
        const questionArea = document.getElementById('question-area'); const questionTitle = document.getElementById('question-title'); const questionPalette = document.getElementById('question-palette');
        const prevBtn = document.getElementById('prev-btn'); 
        const nextBtn = document.getElementById('next-btn'); 
        const markReviewBtn = document.getElementById('mark-review-btn');
        const clearResponseBtn = document.getElementById('clear-response-btn'); const submitTestBtn = document.getElementById('submit-test-btn');
        const reviewTestBtn = document.getElementById('review-test-btn'); const reviewPrevBtn = document.getElementById('review-prev-btn'); const reviewNextBtn = document.getElementById('review-next-btn');
        
        // --- Test Title and Badge ---
        document.getElementById('test-main-title').innerHTML = `
            🎓 ${testInfo.date} - ${testInfo.title}
            ${testInfo.isNew ? '<span class="new-badge">NEW</span>' : ''}
        `;

        questionStates = questions.map(() => ({ status: 'not-visited', userAnswer: null, markedForReview: false }));
        createPalette();
        startTimer();
        showQuestion(0);
        
        window.addEventListener('beforeunload', (e) => { e.preventDefault(); e.returnValue = ''; });
        
        function startTimer() { 
            timerInterval = setInterval(() => { 
                if (isPaused) return; 
                timeRemaining--; 
                const minutes = Math.floor(timeRemaining / 60); 
                const seconds = timeRemaining % 60; 
                if (timerEl) { 
                    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; 
                } 
                if (timeRemaining <= 0) { 
                    clearInterval(timerInterval); 
                    calculateAndShowResults(true); 
                } 
            }, 1000); 
        }
        function pauseTest() { isPaused = true; pauseOverlay.classList.remove('hidden'); }
        function resumeTest() { isPaused = false; pauseOverlay.classList.add('hidden'); }
        
        function showSubmissionSummary() {
            const answered = questionStates.filter(s => s.userAnswer !== null).length;
            const marked = questionStates.filter(s => s.markedForReview).length;
            submissionStatsEl.innerHTML = `
                <div>Answered: <span>${answered} / ${questions.length}</span></div>
                <div>Not Answered: <span>${questions.length - answered} / ${questions.length}</span></div>
                <div>Marked for Review: <span>${marked}</span></div>
            `;
            submitSummaryModal.classList.remove('hidden');
        }

        // --- FULL CALCULATE AND SHOW RESULTS FUNCTION (Includes result alignment fix) ---
        function calculateAndShowResults(autoSubmit = false) {
            clearInterval(timerInterval);

            // Calculate Time Taken
            const timeTakenSecondsTotal = (testDurationMinutes * 60) - timeRemaining;
            const timeTakenMinutes = Math.floor(timeTakenSecondsTotal / 60);
            const timeTakenSeconds = timeTakenSecondsTotal % 60;
            
            let correctCount = 0;
            let incorrectCount = 0;
            let unattemptedCount = 0;
            let score = 0;

            // Scoring logic (+2/-0.5 based on typical mock tests)
            questionStates.forEach((state, index) => {
                const question = questions[index];
                const isAnswered = state.userAnswer !== null;

                if (isAnswered) {
                    const userAnswerNormalized = normalizeString(state.userAnswer);
                    const correctAnswerNormalized = normalizeString(question.correctAnswer);
                    
                    if (userAnswerNormalized === correctAnswerNormalized) {
                        correctCount++;
                        score += 2; 
                    } else {
                        incorrectCount++;
                        score -= 0.5;
                    }
                } else {
                    unattemptedCount++;
                }
            });

            // Calculate Accuracy
            const attemptedCount = correctCount + incorrectCount;
            const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
            
            // --- Enhanced Result Page HTML Structure ---
            const resultStatsEl = document.getElementById('result-stats-full');
            resultStatsEl.innerHTML = ''; 

            const resultsContentHtml = `
                <div class="result-top-row">
                    <div class="test-info-column">
                        <div class="test-details">
                            <p class="shift-info">${testInfo.title}</p> <p class="question-info">Total Questions: ${questions.length} | Max Marks: ${questions.length * 2}</p>
                        </div>
                        <div class="result-header-actions">
                            <button id="review-test-btn" class="action-btn primary">Review Test</button>
                            <a href="index.html" class="action-btn secondary">Go to Tests</a>
                        </div>
                    </div>

                    <div class="stats-grid-column">
                        <div class="stat-card total-score">
                            <div class="stat-value">${score.toFixed(2)}</div>
                            <div class="stat-label">YOUR SCORE</div>
                        </div>
                        <div class="stat-card correct">
                            <div class="stat-value">${correctCount}</div>
                            <div class="stat-label">CORRECT</div>
                        </div>
                        <div class="stat-card incorrect">
                            <div class="stat-value">${incorrectCount}</div>
                            <div class="stat-label">INCORRECT</div>
                        </div>
                        <div class="stat-card unattempted">
                            <div class="stat-value">${unattemptedCount}</div>
                            <div class="stat-label">UNATTEMPTED</div>
                        </div>
                        <div class="stat-card time-taken">
                            <div class="stat-value">${String(timeTakenMinutes).padStart(2, '0')}:${String(timeTakenSeconds).padStart(2, '0')}</div>
                            <div class="stat-label">TIME TAKEN</div>
                        </div>
                        <div class="stat-card accuracy">
                            <div class="stat-value">${accuracy.toFixed(1)}%</div>
                            <div class="stat-label">ACCURACY</div>
                        </div>
                    </div>
                </div>
            `;
            
            resultStatsEl.innerHTML = resultsContentHtml; 
            
            // Re-assign the listener for the Review button (since it was just re-rendered)
            document.querySelector('#review-test-btn').addEventListener('click', () => { 
                resultSummaryPage.classList.add('hidden'); 
                reviewPage.classList.remove('hidden'); 
                showReviewQuestion(0); 
            });

            quizUI.classList.add('hidden'); 
            resultSummaryPage.classList.remove('hidden');
        } // End calculateAndShowResults function

        // --- All other functions ---
        function createPalette() { questionPalette.innerHTML = ''; questions.forEach((_, index) => { const btn = document.createElement('button'); btn.className = 'palette-btn'; btn.textContent = index + 1; btn.dataset.index = index; btn.addEventListener('click', () => { saveCurrentAnswer(); showQuestion(index); }); questionPalette.appendChild(btn); }); }
        function showQuestion(index) { currentQuestionIndex = index; const question = questions[index]; const state = questionStates[index]; if (state.status === 'not-visited') { state.status = 'not-answered'; } questionTitle.textContent = `Question ${index + 1} of ${questions.length}`; questionArea.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p><div class="options-container">${question.options.map(option => `<label class="option"><input type="radio" name="option" value="${option}" ${state.userAnswer === option ? 'checked' : ''}><span>${option}</span></label>`).join('')}</div>`; if (window.MathJax) { window.MathJax.typeset(); } updateNavigation(); updatePalette(); }
        function updateNavigation() { 
            prevBtn.disabled = currentQuestionIndex === 0; 
            nextBtn.textContent = 'Save & Next'; 
            markReviewBtn.textContent = questionStates[currentQuestionIndex].markedForReview ? 'Unmark Review' : 'Mark for Review'; 
        }
        function updatePalette() { document.querySelectorAll('.palette-btn').forEach((btn, index) => { const state = questionStates[index]; btn.className = 'palette-btn'; if (state.markedForReview) { btn.classList.add(state.status === 'answered' ? 'answered-marked-review' : 'marked-review'); } else if (state.status === 'answered') { btn.classList.add('answered'); } else if (state.status === 'not-answered') { btn.classList.add('not-answered'); } else { btn.classList.add('not-visited'); } if (index === currentQuestionIndex) { btn.classList.add('current'); } }); }
        
        function saveCurrentAnswer() { 
            const selectedOption = document.querySelector('input[name="option"]:checked'); 
            const state = questionStates[currentQuestionIndex]; 
            if (selectedOption) { 
                state.userAnswer = selectedOption.value; 
                state.status = 'answered'; 
            } 
        }

        function showReviewQuestion(index) { 
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
                
                return ` <div class="${optionClass}"><div class="review-option-text"><span class="radio-icon"></span><span>${option}</span></div> ${isUserChoice ? `<span class="user-pick-indicator">✔️ Your Pick</span>` : ''}</div>`; 
            }).join(''); 
            
            reviewArea.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p><div class="options-container">${optionsHtml}</div><div class="solution-box"><h4>Solution:</h4><p>${question.explanation}</p></div>`; 
            if (window.MathJax) { window.MathJax.typeset(); } 
            reviewPrevBtn.disabled = index === 0; 
            reviewNextBtn.disabled = index === questions.length - 1; 
        }

        // --- Event Listeners ---
        pauseBtn.addEventListener('click', pauseTest); resumeBtn.addEventListener('click', resumeTest);
        submitTestBtn.addEventListener('click', showSubmissionSummary);
        
        // --- FINAL FIX: Hide modal before calculating results ---
        finalSubmitBtn.addEventListener('click', () => {
            submitSummaryModal.classList.add('hidden'); // HIDE THE MODAL FIRST
            calculateAndShowResults();
        });
        
        cancelSubmitBtn.addEventListener('click', () => submitSummaryModal.classList.add('hidden'));
        
        // --- Navigation Logic ---
        nextBtn.addEventListener('click', () => { 
            saveCurrentAnswer(); 
            updatePalette(); 
            if (currentQuestionIndex < questions.length - 1) { 
                showQuestion(currentQuestionIndex + 1); 
            }
        });
        
        markReviewBtn.addEventListener('click', () => { 
            const state = questionStates[currentQuestionIndex]; 
            state.markedForReview = !state.markedForReview; 
            saveCurrentAnswer();
            updatePalette();
            updateNavigation();
            if (currentQuestionIndex < questions.length - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        });
        
        prevBtn.addEventListener('click', () => { saveCurrentAnswer(); updatePalette(); if (currentQuestionIndex > 0) { showQuestion(currentQuestionIndex - 1); } });
        
        clearResponseBtn.addEventListener('click', () => { 
            const state = questionStates[currentQuestionIndex]; 
            state.userAnswer = null; 
            state.status = 'not-answered'; 
            state.markedForReview = false; 
            showQuestion(currentQuestionIndex); 
        });
        
        reviewNextBtn.addEventListener('click', () => { if (currentReviewIndex < questions.length - 1) { showReviewQuestion(currentReviewIndex + 1); } });
        reviewPrevBtn.addEventListener('click', () => { if (currentReviewIndex > 0) { showReviewQuestion(currentReviewIndex - 1); } });
    }
});