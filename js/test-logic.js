document.addEventListener('DOMContentLoaded', () => {

    // --- STEP 1: GET THE TEST ID FROM THE URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');

    if (!testId) {
        document.body.innerHTML = "<h1>Error: Test ID not specified. Please go back to the homepage and select a test.</h1>";
        return;
    }

    // --- STEP 2: VERIFY ALL REQUIRED DATA IS LOADED ---
    if (typeof ALL_TESTS === 'undefined') {
        document.body.innerHTML = `<h1>Fatal Error: The master test list (ALL_TESTS) was not found. Check if js/tests-list.js is loaded correctly in the HTML.</h1>`;
        return;
    }
    const testInfo = ALL_TESTS.find(t => t.id === testId);

    if (!testInfo) {
        document.body.innerHTML = `<h1>Error: Test with ID "${testId}" not found in js/tests-list.js.</h1>`;
        return;
    }

    if (typeof QUESTIONS_DATABASE === 'undefined') {
        document.body.innerHTML = `<h1>Fatal Error: The question database (QUESTIONS_DATABASE) was not found. Check if js/questions-db.js is loaded correctly in the HTML.</h1>`;
        return;
    }
    const questions = QUESTIONS_DATABASE[testId];

    if (!questions) {
        document.body.innerHTML = `<h1>Error: Questions for test ID "${testId}" were not found in js/questions-db.js.</h1><p>Make sure there is a key in QUESTIONS_DATABASE that exactly matches the test ID.</p>`;
        return;
    }

    // If all data is found, run the main test logic
    initializeQuiz(questions, testInfo);


    // This function contains all the logic for running the actual test.
    function initializeQuiz(questions, testInfo) {
        let currentQuestionIndex = 0;
        let currentReviewIndex = 0;
        let questionStates = [];
        let timerInterval;
        let timeRemaining = 20 * 60; // 20 minutes

        // Grab all HTML elements needed for the test
        const quizUI = document.getElementById('quiz-ui');
        const resultSummaryPage = document.getElementById('result-summary-page');
        const reviewPage = document.getElementById('review-page');
        const timerEl = document.getElementById('timer');
        const questionArea = document.getElementById('question-area');
        const questionTitle = document.getElementById('question-title');
        const questionPalette = document.getElementById('question-palette');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const markReviewBtn = document.getElementById('mark-review-btn');
        const clearResponseBtn = document.getElementById('clear-response-btn');
        const submitTestBtn = document.getElementById('submit-test-btn');
        const reviewTestBtn = document.getElementById('review-test-btn');
        const reviewPrevBtn = document.getElementById('review-prev-btn');
        const reviewNextBtn = document.getElementById('review-next-btn');

        // Set the test title in the header
        document.getElementById('test-main-title').textContent = `🎓 ${testInfo.date} - ${testInfo.title}`;

        // Start the test process
        questionStates = questions.map(() => ({ status: 'not-visited', userAnswer: null, markedForReview: false }));
        createPalette();
        startTimer();
        showQuestion(0);

        // --- All the functions that make the test work ---

        function startTimer() {
            timerInterval = setInterval(() => {
                timeRemaining--;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                if (timerEl) {
                    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    alert("Time's up! The test will be submitted automatically.");
                    calculateAndShowResults();
                }
            }, 1000);
        }

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
            if (state.status === 'not-visited') {
                state.status = 'not-answered';
            }
            questionTitle.textContent = `Question ${index + 1} of ${questions.length}`;
            questionArea.innerHTML = `
                <p class="question-text">${index + 1}. ${question.question}</p>
                <div class="options-container">
                    ${question.options.map(option => `
                        <label class="option">
                            <input type="radio" name="option" value="${option}" ${state.userAnswer === option ? 'checked' : ''}>
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            updateNavigation();
            updatePalette();
        }

        function updateNavigation() {
            prevBtn.disabled = currentQuestionIndex === 0;
            nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Save' : 'Save & Next';
            markReviewBtn.textContent = questionStates[currentQuestionIndex].markedForReview ? 'Unmark' : 'Mark';
        }

        function updatePalette() {
            document.querySelectorAll('.palette-btn').forEach((btn, index) => {
                const state = questionStates[index];
                btn.className = 'palette-btn';
                if (state.markedForReview) {
                    btn.classList.add(state.status === 'answered' ? 'answered-marked-review' : 'marked-review');
                } else if (state.status === 'answered') {
                    btn.classList.add('answered');
                } else if (state.status === 'not-answered') {
                    btn.classList.add('not-answered');
                } else {
                    btn.classList.add('not-visited');
                }
                if (index === currentQuestionIndex) {
                    btn.classList.add('current');
                }
            });
        }

        function saveCurrentAnswer() {
            const selectedOption = document.querySelector('input[name="option"]:checked');
            const state = questionStates[currentQuestionIndex];
            if (selectedOption) {
                state.userAnswer = selectedOption.value;
                state.status = 'answered';
            }
        }

        function calculateAndShowResults() {
            clearInterval(timerInterval);
            saveCurrentAnswer();
            let score = 0, correctCount = 0, incorrectCount = 0, unattemptedCount = 0;
            questionStates.forEach((state, index) => {
                if (state.userAnswer !== null) {
                    if (state.userAnswer === questions[index].correctAnswer) {
                        score += 2;
                        correctCount++;
                    } else {
                        score -= 0.5;
                        incorrectCount++;
                    }
                } else {
                    unattemptedCount++;
                }
            });
            document.getElementById('result-score').textContent = score.toFixed(2);
            document.getElementById('result-correct').textContent = correctCount;
            document.getElementById('result-incorrect').textContent = incorrectCount;
            document.getElementById('result-unattempted').textContent = unattemptedCount;
            quizUI.classList.add('hidden');
            resultSummaryPage.classList.remove('hidden');
        }

        function showReviewQuestion(index) {
            currentReviewIndex = index;
            const question = questions[index];
            const state = questionStates[index];
            const reviewArea = document.getElementById('review-question-area');
            document.getElementById('review-question-title').textContent = `Reviewing Question ${index + 1} of ${questions.length}`;
            const optionsHtml = question.options.map(option => {
                const isCorrect = option === question.correctAnswer;
                const isUserChoice = option === state.userAnswer;
                let optionClass = 'review-option';
                if (isCorrect) optionClass += ' correct';
                if (isUserChoice && !isCorrect) optionClass += ' incorrect';
                return `
                    <div class="${optionClass}">
                        <div class="review-option-text">
                            <span class="radio-icon"></span>
                            <span>${option}</span>
                        </div>
                        ${isUserChoice ? `<span class="user-pick-indicator">✔️ Your Pick</span>` : ''}
                    </div>
                `;
            }).join('');
            reviewArea.innerHTML = `
                <p class="question-text">${index + 1}. ${question.question}</p>
                <div class="options-container">${optionsHtml}</div>
                <div class="solution-box">
                    <h4>Solution:</h4>
                    <p>${question.explanation}</p>
                </div>
            `;
            reviewPrevBtn.disabled = index === 0;
            reviewNextBtn.disabled = index === questions.length - 1;
        }

        // Add all the button event listeners
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