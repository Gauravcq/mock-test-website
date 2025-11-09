document.addEventListener('DOMContentLoaded', () => {

    // --- SETUP AND DATA VALIDATION ---
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');
    if (!testId) { document.body.innerHTML = "<h1>Error: Test ID not specified.</h1>"; return; }
    if (typeof ALL_TESTS === 'undefined') { document.body.innerHTML = `<h1>Fatal Error: ALL_TESTS list not found.</h1>`; return; }
    const testInfo = ALL_TESTS.find(t => t.id === testId);
    if (!testInfo) { document.body.innerHTML = `<h1>Error: Test with ID "${testId}" not found.</h1>`; return; }
    if (typeof QUESTIONS_DATABASE === 'undefined') { document.body.innerHTML = `<h1>Fatal Error: QUESTIONS_DATABASE not found.</h1>`; return; }
    const questions = QUESTIONS_DATABASE[testId];
    if (!questions) { document.body.innerHTML = `<h1>Error: Questions for test ID "${testId}" not found.</h1>`; return; }

    initializeQuiz(questions, testInfo);

    // --- MAIN QUIZ FUNCTION ---
    function initializeQuiz(questions, testInfo) {
        let currentQuestionIndex = 0;
        let currentReviewIndex = 0;
        let questionStates = [];
        let timerInterval;
        let timeRemaining = 20 * 60;
        let isPaused = false; // NEW: Pause state variable

        // DOM Elements
        const quizUI = document.getElementById('quiz-ui');
        const resultSummaryPage = document.getElementById('result-summary-page');
        const reviewPage = document.getElementById('review-page');
        const timerEl = document.getElementById('timer');
        const pauseBtn = document.getElementById('pause-btn'); // NEW
        const pauseOverlay = document.getElementById('pause-overlay'); // NEW
        const resumeBtn = document.getElementById('resume-btn'); // NEW
        const questionArea = document.getElementById('question-area');
        const questionTitle = document.getElementById('question-title');
        // ... (other DOM elements are the same)
        const questionPalette = document.getElementById('question-palette');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const markReviewBtn = document.getElementById('mark-review-btn');
        const clearResponseBtn = document.getElementById('clear-response-btn');
        const submitTestBtn = document.getElementById('submit-test-btn');
        const reviewTestBtn = document.getElementById('review-test-btn');
        const reviewPrevBtn = document.getElementById('review-prev-btn');
        const reviewNextBtn = document.getElementById('review-next-btn');

        document.getElementById('test-main-title').textContent = `🎓 ${testInfo.date} - ${testInfo.title}`;
        
        questionStates = questions.map(() => ({ status: 'not-visited', userAnswer: null, markedForReview: false }));
        createPalette();
        startTimer();
        showQuestion(0);
        
        // --- TIMER AND PAUSE/RESUME LOGIC ---
        function startTimer() {
            timerInterval = setInterval(() => {
                if (isPaused) return; // NEW: If paused, do nothing

                timeRemaining--;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                if (timerEl) { timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    alert("Time's up! The test will be submitted automatically.");
                    calculateAndShowResults();
                }
            }, 1000);
        }

        function pauseTest() {
            isPaused = true;
            pauseOverlay.classList.remove('hidden');
        }

        function resumeTest() {
            isPaused = false;
            pauseOverlay.classList.add('hidden');
        }

        // --- Other functions (showQuestion, calculateAndShowResults, etc. are unchanged) ---
        function createPalette() { questionPalette.innerHTML = ''; questions.forEach((_, index) => { const btn = document.createElement('button'); btn.className = 'palette-btn'; btn.textContent = index + 1; btn.dataset.index = index; btn.addEventListener('click', () => { saveCurrentAnswer(); showQuestion(index); }); questionPalette.appendChild(btn); }); }
        function showQuestion(index) { currentQuestionIndex = index; const question = questions[index]; const state = questionStates[index]; if (state.status === 'not-visited') { state.status = 'not-answered'; } questionTitle.textContent = `Question ${index + 1} of ${questions.length}`; questionArea.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p><div class="options-container">${question.options.map(option => `<label class="option"><input type="radio" name="option" value="${option}" ${state.userAnswer === option ? 'checked' : ''}><span>${option}</span></label>`).join('')}</div>`; if (window.MathJax) { window.MathJax.typeset(); } updateNavigation(); updatePalette(); }
        function updateNavigation() { prevBtn.disabled = currentQuestionIndex === 0; nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Save' : 'Save & Next'; markReviewBtn.textContent = questionStates[currentQuestionIndex].markedForReview ? 'Unmark' : 'Mark'; }
        function updatePalette() { document.querySelectorAll('.palette-btn').forEach((btn, index) => { const state = questionStates[index]; btn.className = 'palette-btn'; if (state.markedForReview) { btn.classList.add(state.status === 'answered' ? 'answered-marked-review' : 'marked-review'); } else if (state.status === 'answered') { btn.classList.add('answered'); } else if (state.status === 'not-answered') { btn.classList.add('not-answered'); } else { btn.classList.add('not-visited'); } if (index === currentQuestionIndex) { btn.classList.add('current'); } }); }
        function saveCurrentAnswer() { const selectedOption = document.querySelector('input[name="option"]:checked'); const state = questionStates[currentQuestionIndex]; if (selectedOption) { state.userAnswer = selectedOption.value; state.status = 'answered'; } }
        function calculateAndShowResults() { clearInterval(timerInterval); saveCurrentAnswer(); let score = 0, correctCount = 0, incorrectCount = 0, unattemptedCount = 0; questionStates.forEach((state, index) => { if (state.userAnswer !== null) { if (state.userAnswer === questions[index].correctAnswer) { score += 2; correctCount++; } else { score -= 0.5; incorrectCount++; } } else { unattemptedCount++; } }); document.getElementById('result-score').textContent = score.toFixed(2); document.getElementById('result-correct').textContent = correctCount; document.getElementById('result-incorrect').textContent = incorrectCount; document.getElementById('result-unattempted').textContent = unattemptedCount; quizUI.classList.add('hidden'); resultSummaryPage.classList.remove('hidden'); }
        function showReviewQuestion(index) { currentReviewIndex = index; const question = questions[index]; const state = questionStates[index]; const reviewArea = document.getElementById('review-question-area'); document.getElementById('review-question-title').textContent = `Reviewing Question ${index + 1} of ${questions.length}`; const optionsHtml = question.options.map(option => { const isCorrect = option === question.correctAnswer; const isUserChoice = option === state.userAnswer; let optionClass = 'review-option'; if (isCorrect) optionClass += ' correct'; if (isUserChoice && !isCorrect) optionClass += ' incorrect'; return ` <div class="${optionClass}"><div class="review-option-text"><span class="radio-icon"></span><span>${option}</span></div> ${isUserChoice ? `<span class="user-pick-indicator">✔️ Your Pick</span>` : ''}</div>`; }).join(''); reviewArea.innerHTML = `<p class="question-text">${index + 1}. ${question.question}</p><div class="options-container">${optionsHtml}</div><div class="solution-box"><h4>Solution:</h4><p>${question.explanation}</p></div>`; if (window.MathJax) { window.MathJax.typeset(); } reviewPrevBtn.disabled = index === 0; reviewNextBtn.disabled = index === questions.length - 1; }

        // --- EVENT LISTENERS ---
        pauseBtn.addEventListener('click', pauseTest); // NEW
        resumeBtn.addEventListener('click', resumeTest); // NEW
        nextBtn.addEventListener('click', () => { saveCurrentAnswer(); updatePalette(); if (currentQuestionIndex < questions.length - 1) { showQuestion(currentQuestionIndex + 1); } });
        prevBtn.addEventListener('click', () => { saveCurrentAnswer(); updatePalette(); if (currentQuestionIndex > 0) { showQuestion(currentQuestionIndex - 1); } });
        markReviewBtn.addEventListener('click', () => { const state = questionStates[currentQuestionIndex]; state.markedForReview = !state.markedForReview; saveCurrentAnswer(); updatePalette(); updateNavigation(); });
        clearResponseBtn.addEventListener('click', () => { const state = questionStates[currentQuestionIndex]; state.userAnswer = null; state.status = 'not-answered'; showQuestion(currentQuestionIndex); });
        submitTestBtn.addEventListener('click', () => { if (confirm("Are you sure you want to submit the test?")) { calculateAndShowResults(); } });
        reviewTestBtn.addEventListener('click', () => { resultSummaryPage.classList.add('hidden'); reviewPage.classList.remove('hidden'); showReviewQuestion(0); });
        reviewNextBtn.addEventListener('click', () => { if (currentReviewIndex < questions.length - 1) { showReviewQuestion(currentReviewIndex + 1); } });
        reviewPrevBtn.addEventListener('click', () => { if (currentReviewIndex > 0) { showReviewQuestion(currentReviewIndex - 1); } });
    }
});