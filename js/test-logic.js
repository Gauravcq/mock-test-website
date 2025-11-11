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
     * It handles spaces, converts to lowercase, and standardizes common math/currency symbols.
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

    function initializeQuiz(questions, testInfo) {
        let currentQuestionIndex = 0; let currentReviewIndex = 0; let questionStates = []; let timerInterval;
        let timeRemaining = 25 * 60; let isPaused = false;

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
        const nextBtn = document.getElementById('next-btn'); // This is now SAVE & NEXT
        const markReviewBtn = document.getElementById('mark-review-btn'); // This is now MARK FOR REVIEW & NEXT
        const clearResponseBtn = document.getElementById('clear-response-btn'); const submitTestBtn = document.getElementById('submit-test-btn');
        const reviewTestBtn = document.getElementById('review-test-btn'); const reviewPrevBtn = document.getElementById('review-prev-btn'); const reviewNextBtn = document.getElementById('review-next-btn');
        
        // --- START OF NEW BADGE IMPLEMENTATION ---
        document.getElementById('test-main-title').innerHTML = `
            🎓 ${testInfo.date} - ${testInfo.title}
            ${testInfo.isNew ? '<span class="new-badge">NEW</span>' : ''}
        `;
        // --- END OF NEW BADGE IMPLEMENTATION ---

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
                    // Update Time Left Display
                    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; 
                } 
                if (timeRemaining <= 0) { 
                    clearInterval(timerInterval); 
                    calculateAndShowResults(true); // Auto-submit on time up
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

        /**
         * UPDATED: Calculates and displays results using a structured HTML format
         * for better styling control on the results page.
         */
        // ... (Previous parts of test-logic.js)

        /**
         * UPDATED: Calculates and displays results using a structured HTML format
         * for better styling control on the results page.
         */
        // Inside the calculateAndShowResults function in test-logic.js
function calculateAndShowResults(autoSubmit = false) {
    // ... (Your existing calculation logic) ...

    // --- Enhanced Result Page HTML Structure ---
    const resultStatsEl = document.getElementById('result-stats-full');
    
    // 1. Clear the main results container
    resultStatsEl.innerHTML = ''; 

    // 2. Define the inner content for the result card
    // We will use a main flex/grid container to hold the left info/buttons and the right stats.
    const resultsContentHtml = `
        <div class="result-top-row">
            <div class="test-info-column">
                <div class="test-details">
                    <p class="shift-info">Shift 1</p>
                    <p class="question-info">Total Questions: ${questions.length} | Max Marks: ${questions.length * 2}</p>
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
    
    // The main result container must be the .result-box-card in the HTML. 
    // Since #result-stats-full is usually where you inject, we'll assume #result-stats-full is inside .result-box-card.
    resultStatsEl.innerHTML = resultsContentHtml; 
    
    // ... (rest of the JS logic) ...
}
            
            // 4. Re-assign the listener since the button was re-rendered
            document.getElementById('review-test-btn').addEventListener('click', () => { 
                resultSummaryPage.classList.add('hidden'); 
                reviewPage.classList.remove('hidden'); 
                showReviewQuestion(0); 
            });

            quizUI.classList.add('hidden'); 
            resultSummaryPage.classList.remove('hidden');
        }

// ... (Rest of the test-logic.js)

        // --- All other functions ---
        function createPalette() { questionPalette.innerHTML = ''; questions.forEach((_, index) => { const btn = document.createElement('button'); btn.className = 'palette-btn'; btn.textContent = index + 1; btn.dataset.index = index; btn.addEventListener('click', () => { saveCurrentAnswer(); showQuestion(index); }); questionPalette.appendChild(btn); }); }
        function showQuestion(index) { currentQuestionIndex = index; const question = questions[index]; const state = questionStates[index]; if (state.status === 'not-visited') { state.status = 'not-answered'; } questionTitle.textContent = `Question ${index + 1} of ${questions.length}`; questionArea.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p><div class="options-container">${question.options.map(option => `<label class="option"><input type="radio" name="option" value="${option}" ${state.userAnswer === option ? 'checked' : ''}><span>${option}</span></label>`).join('')}</div>`; if (window.MathJax) { window.MathJax.typeset(); } updateNavigation(); updatePalette(); }
        function updateNavigation() { 
            prevBtn.disabled = currentQuestionIndex === 0; 
            
            // NOTE: The nextBtn text is now always "Save & Next" to match the mock interface,
            // as the function handles saving AND moving to the next question.
            nextBtn.textContent = 'Save & Next'; 
            
            // The Mark/Unmark logic remains on the dedicated Mark for Review button
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

        function showReviewQuestion(index) { currentReviewIndex = index; const question = questions[index]; const state = questionStates[index]; const reviewArea = document.getElementById('review-question-area'); document.getElementById('review-question-title').textContent = `Reviewing Question ${index + 1} of ${questions.length}`; const optionsHtml = question.options.map(option => { 
            const isCorrect = normalizeString(option) === normalizeString(question.correctAnswer); 
            const isUserChoice = option === state.userAnswer; 
            let optionClass = 'review-option'; if (isCorrect) optionClass += ' correct'; if (isUserChoice && !isCorrect) optionClass += ' incorrect'; return ` <div class="${optionClass}"><div class="review-option-text"><span class="radio-icon"></span><span>${option}</span></div> ${isUserChoice ? `<span class="user-pick-indicator">✔️ Your Pick</span>` : ''}</div>`; }).join(''); reviewArea.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p><div class="options-container">${optionsHtml}</div><div class="solution-box"><h4>Solution:</h4><p>${question.explanation}</p></div>`; if (window.MathJax) { window.MathJax.typeset(); } reviewPrevBtn.disabled = index === 0; reviewNextBtn.disabled = index === questions.length - 1; }

        // --- Event Listeners ---
        pauseBtn.addEventListener('click', pauseTest); resumeBtn.addEventListener('click', resumeTest);
        submitTestBtn.addEventListener('click', showSubmissionSummary);
        finalSubmitBtn.addEventListener('click', () => calculateAndShowResults());
        cancelSubmitBtn.addEventListener('click', () => submitSummaryModal.classList.add('hidden'));
        
        // --- UPDATED NEXT BUTTON LOGIC (Save & Next) ---
        nextBtn.addEventListener('click', () => { 
            saveCurrentAnswer(); 
            updatePalette(); 
            if (currentQuestionIndex < questions.length - 1) { 
                showQuestion(currentQuestionIndex + 1); 
            }
        });
        
        // --- UPDATED MARK FOR REVIEW BUTTON LOGIC (Mark for Review & Next) ---
        markReviewBtn.addEventListener('click', () => { 
            const state = questionStates[currentQuestionIndex]; 
            
            // 1. Toggle Mark/Unmark State
            state.markedForReview = !state.markedForReview; 

            // 2. Save Answer (if one is selected)
            saveCurrentAnswer();
            
            // 3. Move to Next Question
            updatePalette();
            updateNavigation();
            if (currentQuestionIndex < questions.length - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        });
        
        // --- PREVIOUS Button Logic ---
        prevBtn.addEventListener('click', () => { saveCurrentAnswer(); updatePalette(); if (currentQuestionIndex > 0) { showQuestion(currentQuestionIndex - 1); } });
        
        // --- Clear Response Logic ---
        clearResponseBtn.addEventListener('click', () => { const state = questionStates[currentQuestionIndex]; state.userAnswer = null; state.status = 'not-answered'; showQuestion(currentQuestionIndex); });
        
        // --- Review Navigation ---
        reviewNextBtn.addEventListener('click', () => { if (currentReviewIndex < questions.length - 1) { showReviewQuestion(currentReviewIndex + 1); } });
        reviewPrevBtn.addEventListener('click', () => { if (currentReviewIndex > 0) { showReviewQuestion(currentReviewIndex - 1); } });
    }
});