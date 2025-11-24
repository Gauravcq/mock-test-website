document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId') || urlParams.get('id');

    // --- DOM Element Declarations (Declared ONCE in main scope) ---
    const instructionsModal = document.getElementById('instructions-modal');
    const startTestBtn = document.getElementById('start-test-btn');
    const quizUI = document.getElementById('quiz-ui'); 
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
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const markReviewBtn = document.getElementById('mark-review-btn');
    const clearResponseBtn = document.getElementById('clear-response-btn');
    const submitTestBtn = document.getElementById('submit-test-btn');
    const reviewPrevBtn = document.getElementById('review-prev-btn');
    const reviewNextBtn = document.getElementById('review-next-btn');
    const resultTabsContainer = document.querySelector('#result-summary-page .results-header-nav');
    const reviewTabsContainer = document.querySelector('#review-page .results-header-nav');
    const languageSelect = document.querySelector('.language-select');
    const reviewArea = document.getElementById('review-question-area');
    const reviewQuestionTitle = document.getElementById('review-question-title');


    // --- Initial Validation and Setup ---
    if (!testId) { document.body.innerHTML = "<h1>Error: Test ID not specified.</h1>"; return; }
    if (typeof ALL_TESTS === 'undefined') { document.body.innerHTML = "<h1>Fatal Error: ALL_TESTS list not found.</h1>"; return; }
    const testInfo = ALL_TESTS.find(t => String(t.id) === testId);
    if (!testInfo) { document.body.innerHTML = "<h1>Error: Test with ID " + testId + " not found.</h1>"; return; }
    if (typeof QUESTIONS_DATABASE === 'undefined') { document.body.innerHTML = "<h1>Fatal Error: QUESTIONS_DATABASE not found.</h1>"; return; }
    
    // Get questions
    let questions = QUESTIONS_DATABASE[testId];
    if (!questions) { document.body.innerHTML = "<h1>Error: Questions for test ID " + testId + " not found.</h1>"; return; }

const singleSubjectName = testInfo.subject; 

// 2. Map through all questions and assign the single subject name.
questions = questions.map(q => {
    // This assigns "Maths", "Reasoning", or "English" to every question.
    // The subject name is then used to look up the correct time (25/20/15 minutes).
    return { 
        ...q, 
        subject: singleSubjectName, 
        sectionQNum: 1, // Reset to 1 since there is only one section
        sectionTotal: 25 // Assuming all single-subject tests have 25 questions
    };
});
    startTestBtn.addEventListener('click', () => {
        instructionsModal.classList.add('hidden');
        quizUI.classList.remove('hidden');
        // Pass only data to the initialization function
        initializeQuiz(questions, testInfo);
    });

    // --- Global Variables (Preserved) ---
    let reviewQuestionList = [];
    let questionStates = [];
    let currentReviewIndex = 0;
    let currentLanguage = 'en';
    let sectionTimeRemaining = {}; // Moved to main scope so it's accessible by all functions
    let totalInitialTime = 0; // Moved to main scope


    // --- Helper Functions (Preserved) ---
    function normalizeString(str) {
        if (str === null) return '';
        return String(str).replace(/[\u20b9₹]/g, '').replace(/m\u00b2/g, 'm^2').replace(/\u00b0/g, 'deg').replace(/\s+/g, '').toLowerCase();
    }

    function filterQuestions(category) {
        const questionsWithState = questions.map((q, index) => ({ ...q, index: index, state: questionStates[index] }));
        switch (category) {
            case 'all': case 'overview': return questionsWithState;
            case 'correct': return questionsWithState.filter(item => item.state.resultCategory === 'correct');
            case 'incorrect': return questionsWithState.filter(item => item.state.resultCategory === 'incorrect');
            case 'unattempted': return questionsWithState.filter(item => item.state.resultCategory === 'unattempted');
            case 'marked for review': return questionsWithState.filter(item => item.state.markedForReview);
            default: return [];
        }
    }

    function showReviewPalette() {
        const reviewPalette = document.getElementById('review-palette');
        if (!reviewPalette) return;
        reviewPalette.innerHTML = '';
        reviewQuestionList.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className = 'palette-btn';
            btn.textContent = item.index + 1;
            btn.dataset.index = index;

            if (item.state.resultCategory === 'correct') btn.classList.add('answered');
            else if (item.state.resultCategory === 'incorrect') btn.classList.add('not-answered');

            if (item.state.markedForReview) {
                if (item.state.userAnswer !== null) {
                    btn.classList.remove('answered', 'not-answered');
                    btn.classList.add('answered-marked-review');
                } else {
                    btn.classList.add('marked-review');
                }
            }
            if (index === currentReviewIndex) btn.classList.add('current');
            btn.addEventListener('click', () => { showReviewQuestion(index); });
            reviewPalette.appendChild(btn);
        });
    }

    function showReviewQuestion(index) {
        currentReviewIndex = index;
        if (reviewQuestionList.length === 0 || index < 0 || index >= reviewQuestionList.length || !reviewArea) return;

        const reviewItem = reviewQuestionList[index];
        const question = questions[reviewItem.index];
        const state = questionStates[reviewItem.index];

        if (reviewQuestionTitle) reviewQuestionTitle.textContent = "Reviewing Question " + (index + 1) + " of " + reviewQuestionList.length + " (Original Q" + (reviewItem.index + 1) + ")";

        const optionsHtml = question.options.map(option => {
            const isCorrect = normalizeString(option) === normalizeString(question.correctAnswer);
            const isUserChoice = normalizeString(option) === normalizeString(state.userAnswer);
            let optionClass = 'review-option';
            if (isCorrect) optionClass += ' correct';
            if (isUserChoice && !isCorrect) optionClass += ' incorrect';
            if (isUserChoice && isCorrect) optionClass += ' correct-user-choice';
            let html = '<div class="' + optionClass + '">';
            html += '<div class="review-option-text"><span class="radio-icon"></span><span>' + option + '</span></div>';
            if (isUserChoice) html += '<span class="user-pick-indicator">✔️ Your Pick</span>';
            if (isCorrect && !isUserChoice) html += '<span class="correct-indicator">✅ Correct Answer</span>';
            html += '</div>';
            return html;
        }).join('');

        const questionText = (typeof question.question === 'object') ? question.question[currentLanguage] : question.question;
        const explanationText = (typeof question.explanation === 'object') ? question.explanation[currentLanguage] : question.explanation;

        reviewArea.innerHTML =
            '<p class="question-text">' + (reviewItem.index + 1) + '. ' + questionText + '</p>' +
            '<div class="options-container">' + optionsHtml + '</div>' +
            '<div class="solution-box"><h4>Solution:</h4><p>' + explanationText + '</p></div>' +
            (state.userAnswer === null ? '<p class="unattempted-note">**This question was unattempted.**</p>' : '');

        if (window.MathJax) { window.MathJax.typeset(); }
        if (reviewPrevBtn) reviewPrevBtn.disabled = index === 0;
        if (reviewNextBtn) reviewNextBtn.disabled = index === reviewQuestionList.length - 1;
        showReviewPalette();
    }

    function tabClickHandler(e) {
        e.preventDefault();
        const category = e.target.textContent.toLowerCase().trim();

        [resultTabsContainer, reviewTabsContainer].forEach(container => {
             if (container) {
                 container.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                 const activeTab = Array.from(container.querySelectorAll('a')).find(a => a.textContent.toLowerCase().trim() === category);
                 if (activeTab) activeTab.classList.add('active');
             }
        });

        if (category === 'overview') {
            if (reviewPage) reviewPage.classList.add('hidden');
            if (resultSummaryPage) resultSummaryPage.classList.remove('hidden');
            return;
        }

        reviewQuestionList = filterQuestions(category);

        if (resultSummaryPage) resultSummaryPage.classList.add('hidden');
        if (reviewPage) reviewPage.classList.remove('hidden');

        if (reviewQuestionList.length > 0) {
            showReviewQuestion(0);
        } else {
             if (reviewArea) reviewArea.innerHTML = '<p style="text-align:center; padding: 50px;">No questions found in this category.</p>';
             document.getElementById('review-question-title').textContent = "Reviewing Question 0 of 0";
             if (reviewPrevBtn) reviewPrevBtn.disabled = true;
             if (reviewNextBtn) reviewNextBtn.disabled = true;
             document.getElementById('review-palette').innerHTML = '';
        }
    }


    // ==========================================================
    //  INITIALIZE QUIZ (MAIN LOGIC) - Now only takes data
    // ==========================================================
// ==========================================================
//  UPDATED INITIALIZE QUIZ (MAIN LOGIC) - FIX APPLIED
// ==========================================================
function initializeQuiz(questions, testInfo) {
    let currentQuestionIndex = 0;
    let timerInterval;
    let isPaused = false;

    // 1. DEFINE SECTION DURATIONS - SET CLEAR TIMES
    const sectionDurations = {
        "Maths": 25,    // 25 minutes
        "Reasoning": 20, // 20 minutes
        "English": 15,  // 15 minutes
        "Time Left": 20 // The explicit default/fallback time
    };

    // 2. INITIALIZE TIMER BANKS (Uses global sectionTimeRemaining/totalInitialTime)
    sectionTimeRemaining = {};
    totalInitialTime = 0;

    const uniqueSubjects = [...new Set(questions.map(q => q.subject))];
    uniqueSubjects.forEach(subj => {
        // Use the duration for the subject, or 20 minutes if the subject is unknown/unlisted.
        const minutes = sectionDurations[subj] || 20; 
        sectionTimeRemaining[subj] = minutes * 60;
        totalInitialTime += (minutes * 60);
    });

        // Event listener for language change
        if (languageSelect) {
            languageSelect.value = currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                currentLanguage = e.target.value;
                const isQuizActive = !quizUI.classList.contains('hidden');
                const isReviewActive = !reviewPage.classList.contains('hidden');
                if (isQuizActive) showQuestion(currentQuestionIndex);
                else if (isReviewActive) showReviewQuestion(currentReviewIndex);
            });
        }

        const badgeHtml = testInfo.isNew ? '<span class="new-badge">NEW</span>' : '';
        document.getElementById('test-main-title').innerHTML = testInfo.date + ' - ' + testInfo.title + ' ' + badgeHtml;

        questionStates = questions.map(() => ({
            status: 'not-visited', userAnswer: null, markedForReview: false, resultCategory: null
        }));

        createPalette();
        startTimer();
        showQuestion(0);

        window.addEventListener('beforeunload', (e) => { e.preventDefault(); e.returnValue = ''; });

        function getCurrentSubject() {
            return questions[currentQuestionIndex].subject;
        }

        // --- TIMER FUNCTION (Preserved) ---
        function startTimer() {
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                if (isPaused) return;

                const currentSubject = getCurrentSubject();

                if (sectionTimeRemaining[currentSubject] > 0) {
                    sectionTimeRemaining[currentSubject]--;

                    // Update Display
                    const t = sectionTimeRemaining[currentSubject];
                    const minutes = Math.floor(t / 60);
                    const seconds = t % 60;

                    if (timerEl) {
                        // Display the correct subject name (Maths, Reasoning, English, or Time Left)
                        timerEl.textContent = `${currentSubject}: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    }
                } else {
                    handleSectionTimeout(currentSubject);
                }

            }, 1000);
        }

        function handleSectionTimeout(finishedSubject) {
            clearInterval(timerInterval);
            alert(`Time is up for ${finishedSubject}! Moving to next section.`);

            // Find the first question of a subject that still has time
            const nextIndex = questions.findIndex(q =>
                q.subject !== finishedSubject && sectionTimeRemaining[q.subject] > 0
            );

            if (nextIndex !== -1) {
                showQuestion(nextIndex);
                startTimer();
            } else {
                // No time left in ANY section
                calculateAndShowResults(true);
            }
        }

        function pauseTest() { isPaused = true; pauseOverlay.classList.remove('hidden'); }
        function resumeTest() { isPaused = false; pauseOverlay.classList.add('hidden'); }

        function showSubmissionSummary() {
            const answered = questionStates.filter(s => s.userAnswer !== null).length;
            const marked = questionStates.filter(s => s.markedForReview).length;
            const answeredAndMarked = questionStates.filter(s => s.userAnswer !== null && s.markedForReview).length;
            submissionStatsEl.innerHTML =
                '<div>Answered: <span>' + answered + ' / ' + questions.length + '</span></div>' +
                '<div>Not Answered: <span>' + (questions.length - answered) + ' / ' + questions.length + '</span></div>' +
                '<div>Marked for Review: <span>' + marked + '</span></div>' +
                '<div>Answered & Marked for Review: <span>' + answeredAndMarked + '</span></div>';
            submitSummaryModal.classList.remove('hidden');
        }

        function calculateAndShowResults(autoSubmit = false) {
            clearInterval(timerInterval);

            // Calculate Total Time Taken
            let totalRemainingSeconds = 0;
            for (let subj in sectionTimeRemaining) {
                totalRemainingSeconds += sectionTimeRemaining[subj];
            }

            const timeTakenSecondsTotal = totalInitialTime - totalRemainingSeconds;
            const timeTakenMinutes = Math.floor(timeTakenSecondsTotal / 60);
            const timeTakenSeconds = timeTakenSecondsTotal % 60;

            let correctCount = 0, incorrectCount = 0, unattemptedCount = 0, score = 0;

            questionStates.forEach((state, index) => {
                const question = questions[index];
                if (state.userAnswer !== null) {
                    const userAnswerNormalized = normalizeString(state.userAnswer);
                    const correctAnswerNormalized = normalizeString(question.correctAnswer);
                    if (userAnswerNormalized === correctAnswerNormalized) {
                        correctCount++; score += 2; state.resultCategory = 'correct';
                    } else {
                        incorrectCount++; score -= 0.5; state.resultCategory = 'incorrect';
                    }
                } else {
                    unattemptedCount++; state.resultCategory = 'unattempted';
                }
            });

            const attemptedCount = correctCount + incorrectCount;
            const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;

            reviewQuestionList = filterQuestions('all');
            const testInfoAndActionsWrapper = document.querySelector('.test-info-and-actions');

            const testDetailsHtml =
                '<div class="test-details">' +
                '<h3>' + (testInfo.title || 'Shift 1') + '</h3>' +
                '<p>Total Questions: ' + questions.length + '</p>' +
                '<p>Max Marks: ' + (questions.length * 2) + '</p>' +
                '</div>';

            const reviewButtonHtml =
                '<div class="action-buttons">' +
                '<button id="review-test-btn" class="btn primary review">Review Test</button>' +
                '<a href="index.html" class="btn secondary go-to-tests">Go to Tests</a>' +
                '</div>';

            if (testInfoAndActionsWrapper) testInfoAndActionsWrapper.innerHTML = testDetailsHtml + reviewButtonHtml;

            const statsCardsArea = document.getElementById('stats-cards-area');
            const statsCardsHtml =
                '<div class="stats-grid-container">' +
                '<div class="stat-card total-score"><div class="stat-value">' + score.toFixed(2) + '</div><div class="stat-name">YOUR SCORE</div></div>' +
                '<div class="stat-card correct"><div class="stat-value">' + correctCount + '</div><div class="stat-name">CORRECT</div></div>' +
                '<div class="stat-card incorrect"><div class="stat-value">' + incorrectCount + '</div><div class="stat-name">INCORRECT</div></div>' +
                '<div class="stat-card unattempted"><div class="stat-value">' + unattemptedCount + '</div><div class="stat-name">UNATTEMPTED</div></div>' +
                '<div class="stat-card time-taken"><div class="stat-value">' + String(timeTakenMinutes).padStart(2, '0') + ':' + String(timeTakenSeconds).padStart(2, '0') + '</div><div class="stat-name">TIME TAKEN</div></div>' +
                '<div class="stat-card accuracy"><div class="stat-value">' + accuracy.toFixed(1) + '%</div><div class="stat-name">ACCURACY</div></div>' +
                '</div>';

            if (statsCardsArea) statsCardsArea.innerHTML = statsCardsHtml;

            const reviewTestBtn = document.querySelector('#review-test-btn');
            if (reviewTestBtn) {
                reviewTestBtn.removeEventListener('click', handleReviewTestClick);
                reviewTestBtn.addEventListener('click', handleReviewTestClick);
            }

            function handleReviewTestClick() {
                const allTab = document.querySelector('#result-summary-page .results-header-nav a:nth-child(2)');
                if (allTab) tabClickHandler({ preventDefault: () => {}, target: allTab });
            }

            [resultTabsContainer, reviewTabsContainer].forEach(container => {
                if (container) {
                    container.querySelectorAll('a').forEach(tab => {
                        tab.removeEventListener('click', tabClickHandler);
                        tab.addEventListener('click', tabClickHandler);
                    });
                }
            });

            quizUI.classList.add('hidden');
            resultSummaryPage.classList.remove('hidden');
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
            // Security check: Prevent going to a section with 0 time
            const targetSubject = questions[index].subject;
            if (sectionTimeRemaining[targetSubject] <= 0) {
                alert(`Time for ${targetSubject} is over. You cannot access this section.`);
                return; // Do not change question
            }

            currentQuestionIndex = index;
            const question = questions[index];
            const state = questionStates[index];

            if (state.status === 'not-visited') state.status = 'not-answered';

            // Update Header to show Section Name
            questionTitle.textContent = `${question.subject} | Q${index + 1} of ${questions.length}`;

            const questionText = (typeof question.question === 'object') ? question.question[currentLanguage] : question.question;

            const optionsHtml = question.options.map(option =>
                '<label class="option">' +
                '<input type="radio" name="option" value="' + option + '" ' + (state.userAnswer === option ? 'checked' : '') + '>' +
                '<span>' + option + '</span>' +
                '</label>'
            ).join('');

            questionArea.innerHTML =
                '<p class="question-text">' + (index + 1) + '. ' + questionText + '</p>' +
                '<div class="options-container">' + optionsHtml + '</div>';

            if (window.MathJax) window.MathJax.typeset();
            updateNavigation();
            updatePalette();
            // Re-start timer for the new section if subject has changed
            // This is essential for the timer display to show the correct remaining time
            startTimer(); 
        }

        function updateNavigation() {
            prevBtn.disabled = currentQuestionIndex === 0;
            nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? 'Submit Test' : 'Save & Next';

            const state = questionStates[currentQuestionIndex];
            const isMarked = state.markedForReview;
            const isAnswered = state.userAnswer !== null;

            if (isMarked && isAnswered) markReviewBtn.textContent = 'Unmark & Save (Answered)';
            else if (isMarked) markReviewBtn.textContent = 'Unmark Review';
            else if (isAnswered) markReviewBtn.textContent = 'Mark for Review (Answered)';
            else markReviewBtn.textContent = 'Mark for Review';
        }

        function updatePalette() {
            document.querySelectorAll('#question-palette .palette-btn').forEach((btn, index) => {
                const state = questionStates[index];
                btn.className = 'palette-btn';
                const isAnswered = state.userAnswer !== null;
                const isMarked = state.markedForReview;

                if (isAnswered && isMarked) btn.classList.add('answered-marked-review');
                else if (isMarked && !isAnswered) btn.classList.add('marked-review');
                else if (isAnswered) btn.classList.add('answered');
                else if (state.status === 'not-answered') btn.classList.add('not-answered');
                else btn.classList.add('not-visited');

                if (index === currentQuestionIndex) btn.classList.add('current');
            });
        }

        function saveCurrentAnswer() {
            const selectedOption = document.querySelector('input[name="option"]:checked');
            const state = questionStates[currentQuestionIndex];
            if (selectedOption) {
                state.userAnswer = selectedOption.value;
                if (!state.markedForReview) state.status = 'answered';
            } else {
                state.userAnswer = null;
                if (!state.markedForReview) state.status = 'not-answered';
            }
        }

        function clearCurrentAnswer() {
            const state = questionStates[currentQuestionIndex];
            state.userAnswer = null;
            state.status = 'not-answered';
            document.querySelectorAll('input[name="option"]:checked').forEach(radio => radio.checked = false);
            updatePalette();
            updateNavigation();
        }

        pauseBtn.addEventListener('click', pauseTest);
        resumeBtn.addEventListener('click', resumeTest);
        submitTestBtn.addEventListener('click', showSubmissionSummary);
        clearResponseBtn.addEventListener('click', clearCurrentAnswer);
        finalSubmitBtn.addEventListener('click', () => { submitSummaryModal.classList.add('hidden'); calculateAndShowResults(); });
        cancelSubmitBtn.addEventListener('click', () => submitSummaryModal.classList.add('hidden'));

        nextBtn.addEventListener('click', () => {
            saveCurrentAnswer();
            updatePalette();
            if (currentQuestionIndex < questions.length - 1) showQuestion(currentQuestionIndex + 1);
            else if (currentQuestionIndex === questions.length - 1) showSubmissionSummary();
        });

        markReviewBtn.addEventListener('click', () => {
            const state = questionStates[currentQuestionIndex];
            state.markedForReview = !state.markedForReview;
            saveCurrentAnswer();
            updatePalette();
            updateNavigation();
            // Do NOT automatically go to next question after mark/unmark - this is an important UI flow fix.
            // if (currentQuestionIndex < questions.length - 1) showQuestion(currentQuestionIndex + 1); 
        });

        prevBtn.addEventListener('click', () => {
            saveCurrentAnswer();
            updatePalette();
            if (currentQuestionIndex > 0) showQuestion(currentQuestionIndex - 1);
        });

        // Add review navigation listeners to the elements defined in the main scope
        if (reviewNextBtn) reviewNextBtn.addEventListener('click', () => { if (currentReviewIndex < reviewQuestionList.length - 1) showReviewQuestion(currentReviewIndex + 1); });
        if (reviewPrevBtn) reviewPrevBtn.addEventListener('click', () => { if (currentReviewIndex > 0) showReviewQuestion(currentReviewIndex - 1); });
    }
});