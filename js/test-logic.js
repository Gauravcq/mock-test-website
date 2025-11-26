// test-logic.js  (supports BOTH old + new question formats)
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

    // --- Question Normalizer: supports old + new DB formats ---
    // Old:
    //   options: ["Fairness | निष्पक्षता", ...]
    //   correctAnswer: "Fairness | निष्पक्षता"
    // New:
    //   options: [{en,hi}, ...]
    //   correctAnswer: {en,hi}
    function normalizeQuestion(raw) {
        if (!raw) return raw;
        if (raw._normalized) return raw; // avoid double-normalizing

        const q = { ...raw };

        // QUESTION
        if (typeof q.question === 'string') {
            q.question = { en: q.question, hi: q.question };
        } else {
            q.question = {
                en: q.question?.en || '',
                hi: q.question?.hi || ''
            };
        }

        // OPTIONS
        if (Array.isArray(q.options)) {
            if (typeof q.options[0] === 'string') {
                // OLD FORMAT: "English | Hindi"
                q.options = q.options.map(str => {
                    const [enPart, hiPart] = String(str).split('|');
                    return {
                        en: (enPart || '').trim(),
                        hi: (hiPart || '').trim()
                    };
                });
            } else if (typeof q.options[0] === 'object') {
                // NEW FORMAT: already objects
                q.options = q.options.map(o => ({
                    en: (o.en || '').trim(),
                    hi: (o.hi || '').trim()
                }));
            }
        } else {
            q.options = [];
        }

        // CORRECT ANSWER
        if (typeof q.correctAnswer === 'string') {
            const [enPart, hiPart] = String(q.correctAnswer).split('|');
            q.correctAnswer = {
                en: (enPart || '').trim(),
                hi: (hiPart || '').trim()
            };
        } else if (q.correctAnswer && typeof q.correctAnswer === 'object') {
            q.correctAnswer = {
                en: (q.correctAnswer.en || '').trim(),
                hi: (q.correctAnswer.hi || '').trim()
            };
        } else if (typeof q.correctIndex === 'number' && q.options[q.correctIndex]) {
            q.correctAnswer = {
                en: q.options[q.correctIndex].en,
                hi: q.options[q.correctIndex].hi
            };
        } else {
            q.correctAnswer = { en: '', hi: '' };
        }

        // EXPLANATION
        if (typeof q.explanation === 'string') {
            q.explanation = { en: q.explanation, hi: q.explanation };
        } else if (typeof q.explanation === 'object' && q.explanation !== null) {
            q.explanation = {
                en: q.explanation.en || '',
                hi: q.explanation.hi || ''
            };
        } else {
            q.explanation = { en: '', hi: '' };
        }

        q._normalized = true;
        return q;
    }

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
    const totalQuestions = questions.length || 25;

    // Normalize every question + add subject/section metadata
    questions = questions.map(q => {
        const nq = normalizeQuestion(q);
        return {
            ...nq,
            subject: singleSubjectName,
            sectionQNum: 1,
            sectionTotal: totalQuestions
        };
    });

    startTestBtn.addEventListener('click', () => {
        instructionsModal.classList.add('hidden');
        quizUI.classList.remove('hidden');
        initializeQuiz(questions, testInfo);
    });

    // --- Global Variables (Preserved) ---
    let reviewQuestionList = [];
    let questionStates = [];
    let currentReviewIndex = 0;
    let currentLanguage = 'en';
    let sectionTimeRemaining = {};
    let totalInitialTime = 0;

    // --- Helper Functions (Preserved) ---
    function normalizeString(str) {
        if (str === null || typeof str === 'undefined') return '';
        return String(str)
            .replace(/[\u20b9₹]/g, '')
            .replace(/m\u00b2/g, 'm^2')
            .replace(/\u00b0/g, 'deg')
            .replace(/\s+/g, '')
            .toLowerCase();
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

            const state = item.state || {};
            if (state.resultCategory === 'correct') btn.classList.add('answered');
            else if (state.resultCategory === 'incorrect') btn.classList.add('not-answered');

            if (state.markedForReview) {
                if (state.userAnswer !== null) {
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

        // Build options HTML; question.options are objects {en, hi}
        const optionsHtml = question.options.map(optObj => {
            const optionEn = optObj.en;
            const optionHi = optObj.hi || '';
            const isCorrect = normalizeString(optionEn) === normalizeString(question.correctAnswer.en);
            const isUserChoice = normalizeString(optionEn) === normalizeString(state.userAnswer);
            let optionClass = 'review-option';
            if (isCorrect) optionClass += ' correct';
            if (isUserChoice && !isCorrect) optionClass += ' incorrect';
            if (isUserChoice && isCorrect) optionClass += ' correct-user-choice';
            let html = '<div class="' + optionClass + '">';
            html += '<div class="review-option-text"><span class="radio-icon"></span><span class="option-label"><strong>' + optionEn + '</strong>';
            if (optionHi) html += ' <small class="hi-text">(' + optionHi + ')</small>';
            html += '</span></div>';
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
            if (reviewQuestionTitle) reviewQuestionTitle.textContent = "Reviewing Question 0 of 0";
            if (reviewPrevBtn) reviewPrevBtn.disabled = true;
            if (reviewNextBtn) reviewNextBtn.disabled = true;
            const rp = document.getElementById('review-palette');
            if (rp) rp.innerHTML = '';
        }
    }

    // ==========================================================
    //  INITIALIZE QUIZ (MAIN LOGIC)
    // ==========================================================
    function initializeQuiz(questions, testInfo) {
        let currentQuestionIndex = 0;
        let timerInterval;
        let isPaused = false;

        const sectionDurations = {
            "Maths": 25,
            "Reasoning": 20,
            "English": 15,
            "Time Left": 20
        };

        // init timer banks
        sectionTimeRemaining = {};
        totalInitialTime = 0;
        const uniqueSubjects = [...new Set(questions.map(q => q.subject))];
        uniqueSubjects.forEach(subj => {
            const minutes = sectionDurations[subj] || 20;
            sectionTimeRemaining[subj] = minutes * 60;
            totalInitialTime += (minutes * 60);
        });

        // language select handler
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
        const titleEl = document.getElementById('test-main-title');
        if (titleEl) titleEl.innerHTML = testInfo.date + ' - ' + testInfo.title + ' ' + badgeHtml;

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

        function startTimer() {
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                if (isPaused) return;
                const currentSubject = getCurrentSubject();
                if (sectionTimeRemaining[currentSubject] > 0) {
                    sectionTimeRemaining[currentSubject]--;
                    const t = sectionTimeRemaining[currentSubject];
                    const minutes = Math.floor(t / 60);
                    const seconds = t % 60;
                    if (timerEl) {
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
            const nextIndex = questions.findIndex(q =>
                q.subject !== finishedSubject && sectionTimeRemaining[q.subject] > 0
            );
            if (nextIndex !== -1) {
                showQuestion(nextIndex);
                startTimer();
            } else {
                calculateAndShowResults(true);
            }
        }

        function pauseTest() { isPaused = true; if (pauseOverlay) pauseOverlay.classList.remove('hidden'); }
        function resumeTest() { isPaused = false; if (pauseOverlay) pauseOverlay.classList.add('hidden'); }

        function showSubmissionSummary() {
            const answered = questionStates.filter(s => s.userAnswer !== null).length;
            const marked = questionStates.filter(s => s.markedForReview).length;
            const answeredAndMarked = questionStates.filter(s => s.userAnswer !== null && s.markedForReview).length;
            if (submissionStatsEl) {
                submissionStatsEl.innerHTML =
                    '<div>Answered: <span>' + answered + ' / ' + questions.length + '</span></div>' +
                    '<div>Not Answered: <span>' + (questions.length - answered) + ' / ' + questions.length + '</span></div>' +
                    '<div>Marked for Review: <span>' + marked + '</span></div>' +
                    '<div>Answered & Marked for Review: <span>' + answeredAndMarked + '</span></div>';
            }
            if (submitSummaryModal) submitSummaryModal.classList.remove('hidden');
        }

        function calculateAndShowResults(autoSubmit = false) {
            clearInterval(timerInterval);
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
                    const correctAnswerNormalized = normalizeString(question.correctAnswer.en);
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
                if (allTab) tabClickHandler({ preventDefault: () => { }, target: allTab });
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
            if (!questionPalette) return;
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
            // Prevent access if subject time over
            const targetSubject = questions[index].subject;
            if (sectionTimeRemaining[targetSubject] <= 0) {
                alert(`Time for ${targetSubject} is over. You cannot access this section.`);
                return;
            }

            currentQuestionIndex = index;
            const question = questions[index];
            const state = questionStates[index];

            if (state.status === 'not-visited') state.status = 'not-answered';

            // Update Header
            if (questionTitle) questionTitle.textContent = `${question.subject} | Q${index + 1} of ${questions.length}`;

            const questionText = (typeof question.question === 'object') ? question.question[currentLanguage] : question.question;

            // Build options using option.en and option.hi
            const optionsHtml = question.options.map(optObj => {
                const optionEn = optObj.en;
                const checked = (state.userAnswer === optionEn) ? 'checked' : '';
                return `
<label class="option">
    <input type="radio" name="option" value="${escapeHtml(optionEn)}" ${checked}>
    <span class="option-text"><strong>${escapeHtml(optObj[currentLanguage])}</strong></span>
</label>
`;
            }).join('');

            if (questionArea) {
                questionArea.innerHTML =
                    '<p class="question-text">' + (index + 1) + '. ' + questionText + '</p>' +
                    '<div class="options-container">' + optionsHtml + '</div>';
            }

            if (window.MathJax) window.MathJax.typeset();
            updateNavigation();
            updatePalette();
            startTimer(); // ensure timer shows correct subject time
        }

        function updateNavigation() {
            if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
            if (nextBtn) nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? 'Submit Test' : 'Save & Next';

            const state = questionStates[currentQuestionIndex];
            const isMarked = state.markedForReview;
            const isAnswered = state.userAnswer !== null;

            if (markReviewBtn) {
                if (isMarked && isAnswered) markReviewBtn.textContent = 'Unmark & Save (Answered)';
                else if (isMarked) markReviewBtn.textContent = 'Unmark Review';
                else if (isAnswered) markReviewBtn.textContent = 'Mark for Review (Answered)';
                else markReviewBtn.textContent = 'Mark for Review';
            }
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

        // Save the selected answer: store English string only
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
            updatePalette();
            updateNavigation();
        }

        function clearCurrentAnswer() {
            const state = questionStates[currentQuestionIndex];
            state.userAnswer = null;
            state.status = 'not-answered';
            document.querySelectorAll('input[name="option"]:checked').forEach(radio => radio.checked = false);
            updatePalette();
            updateNavigation();
        }

        // helpers to escape values inserted into HTML to prevent issues
        function escapeHtml(text) {
            if (text === null || typeof text === 'undefined') return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // bind controls
        if (pauseBtn) pauseBtn.addEventListener('click', pauseTest);
        if (resumeBtn) resumeBtn.addEventListener('click', resumeTest);
        if (submitTestBtn) submitTestBtn.addEventListener('click', showSubmissionSummary);
        if (clearResponseBtn) clearResponseBtn.addEventListener('click', clearCurrentAnswer);

        if (finalSubmitBtn) finalSubmitBtn.addEventListener('click', () => {
            if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
            calculateAndShowResults();
        });
        if (cancelSubmitBtn) cancelSubmitBtn.addEventListener('click', () => {
            if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            saveCurrentAnswer();
            updatePalette();
            if (currentQuestionIndex < questions.length - 1) showQuestion(currentQuestionIndex + 1);
            else if (currentQuestionIndex === questions.length - 1) showSubmissionSummary();
        });

        if (markReviewBtn) markReviewBtn.addEventListener('click', () => {
            const state = questionStates[currentQuestionIndex];
            state.markedForReview = !state.markedForReview;
            saveCurrentAnswer();
            updatePalette();
            updateNavigation();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            saveCurrentAnswer();
            updatePalette();
            if (currentQuestionIndex > 0) showQuestion(currentQuestionIndex - 1);
        });

        if (reviewNextBtn) reviewNextBtn.addEventListener('click', () => {
            if (currentReviewIndex < reviewQuestionList.length - 1) showReviewQuestion(currentReviewIndex + 1);
        });
        if (reviewPrevBtn) reviewPrevBtn.addEventListener('click', () => {
            if (currentReviewIndex > 0) showReviewQuestion(currentReviewIndex - 1);
        });
    } // end initializeQuiz

}); // end DOMContentLoaded