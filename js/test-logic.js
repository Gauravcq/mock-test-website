// test-logic.js  (supports OLD + NEW + EN-only question formats)
// NOW LOADS QUESTIONS FROM SECURE BACKEND API

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId') || urlParams.get('id');

    // ====== REQUIRE LOGIN FOR TESTS ======
    if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return;
    }
    // =====================================

    // --- DOM Element Declarations ---
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
    const reviewQuestionCard = document.getElementById('review-question-card');
    const reviewSolutionText = document.getElementById('review-solution-text');
    const reviewPaletteClean = document.getElementById('review-palette-clean');

    // --- Question Normalizer ---
    function normalizeQuestion(raw) {
        if (!raw) return raw;
        if (raw._normalized) return raw;

        const q = { ...raw };

        // QUESTION
        if (typeof q.question === 'string') {
            q.question = { en: q.question, hi: q.question };
        } else {
            const enQ = q.question?.en || '';
            const hiQ = q.question?.hi || enQ;
            q.question = { en: enQ, hi: hiQ };
        }

        // OPTIONS
        if (Array.isArray(q.options)) {
            if (typeof q.options[0] === 'string') {
                q.options = q.options.map(str => {
                    const parts = String(str).split('|');
                    const enPart = (parts[0] || '').trim();
                    const hiRaw = (parts[1] || '').trim();
                    const hiPart = hiRaw !== '' ? hiRaw : enPart;
                    return { en: enPart, hi: hiPart };
                });
            } else if (typeof q.options[0] === 'object') {
                q.options = q.options.map(o => {
                    const en = (o.en || '').trim();
                    const hiRaw = (o.hi || '').trim();
                    const hi = hiRaw !== '' ? hiRaw : en;
                    return { en, hi };
                });
            }
        } else {
            q.options = [];
        }

        // CORRECT ANSWER - Only available after submission from backend
        if (typeof q.correctAnswer === 'string') {
            const parts = String(q.correctAnswer).split('|');
            const enPart = (parts[0] || '').trim();
            const hiRaw = (parts[1] || '').trim();
            const hiPart = hiRaw !== '' ? hiRaw : enPart;
            q.correctAnswer = { en: enPart, hi: hiPart };
        } else if (q.correctAnswer && typeof q.correctAnswer === 'object') {
            const en = (q.correctAnswer.en || '').trim();
            const hiRaw = (q.correctAnswer.hi || '').trim();
            const hi = hiRaw !== '' ? hiRaw : en;
            q.correctAnswer = { en, hi };
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
            const enE = q.explanation.en || '';
            const hiRaw = q.explanation.hi || '';
            const hiE = hiRaw !== '' ? hiRaw : enE;
            q.explanation = { en: enE, hi: hiE };
        } else {
            q.explanation = { en: '', hi: '' };
        }

        q._normalized = true;
        return q;
    }

    // --- Show Loading State ---
   // --- Show Loading State ---
function showLoadingState() {
    // Create a loading overlay instead of replacing instructions
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        ">
            <div class="spinner" style="
                width: 50px; height: 50px; margin-bottom: 20px;
                border: 4px solid rgba(99, 102, 241, 0.2);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <h3 style="margin: 0; color: #1f2937;">Loading Test Questions...</h3>
            <p style="color: #6b7280; margin-top: 10px;">Please wait while we securely fetch your test</p>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

// --- Hide Loading State ---
function hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// --- Show Error State ---
function showErrorState(message) {
    hideLoadingState();
    
    const errorOverlay = document.createElement('div');
    errorOverlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.98);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            text-align: center;
            padding: 20px;
        ">
            <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
            <h2 style="margin: 0; color: #1f2937;">Unable to Load Test</h2>
            <p style="color: #ef4444; margin: 15px 0; max-width: 400px;">${message}</p>
            <div style="margin-top: 20px;">
                <button onclick="location.reload()" style="
                    padding: 12px 30px; 
                    background: #6366f1; 
                    color: white;
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 16px; 
                    margin-right: 10px;
                ">Try Again</button>
                <a href="index.html" style="
                    padding: 12px 30px; 
                    background: #64748b; 
                    color: white;
                    border: none; 
                    border-radius: 8px; 
                    text-decoration: none;
                    font-size: 16px;
                    display: inline-block;
                ">Go Back</a>
            </div>
        </div>
    `;
    document.body.appendChild(errorOverlay);
}

    // --- Initial Validation ---
    if (!testId) {
        document.body.innerHTML = "<h1>Error: Test ID not specified.</h1>";
        return;
    }

    if (typeof ALL_TESTS === 'undefined') {
        document.body.innerHTML = "<h1>Fatal Error: ALL_TESTS list not found.</h1>";
        return;
    }

    const testInfo = ALL_TESTS.find(t => String(t.id) === testId);
    if (!testInfo) {
        document.body.innerHTML = "<h1>Error: Test with ID " + testId + " not found in tests list.</h1>";
        return;
    }

    // ====================================================================
    // 🔒 LOAD QUESTIONS FROM SECURE BACKEND API (instead of QUESTIONS_DATABASE)
    // ====================================================================
    // ====================================================================
// 🔒 LOAD QUESTIONS FROM SECURE BACKEND API
// ====================================================================
showLoadingState();

let questions = [];
let testResults = null;

try {
    console.log(`🔒 Loading questions for test: ${testId} from secure API...`);
    
    const response = await ExamAxisAPI.getQuestions(testId);
    
    if (!response.success) {
        throw new Error(response.message || 'Failed to load questions');
    }

    if (!response.data || !response.data.questions || response.data.questions.length === 0) {
        throw new Error('No questions found for this test');
    }

    // Questions from API (without correct answers!)
    questions = response.data.questions;
    console.log(`✅ Loaded ${questions.length} questions securely (answers hidden)`);
    
    // Hide loading - YOUR original instructions modal will show!
    hideLoadingState();

} catch (error) {
    console.error('❌ Failed to load questions:', error);
    showErrorState(error.message);
    return;
}

// ====================================================================

    // ====================================================================

    const singleSubjectName = testInfo.subject;
    const totalQuestions = questions.length;

    // Normalize every question + add subject/section metadata
    questions = questions.map((q, index) => {
        const nq = normalizeQuestion(q);
        return {
            ...nq,
            originalIndex: index, // Keep track of original index for submission
            subject: singleSubjectName,
            sectionQNum: 1,
            sectionTotal: totalQuestions
        };
    });

    // --- Global Variables ---
    let reviewQuestionList = [];
    let questionStates = [];
    let currentReviewIndex = 0;
    let currentLanguage = 'en';
    let sectionTimeRemaining = {};
    let totalInitialTime = 0;

    // --- Helper Functions ---
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
        const questionsWithState = questions.map((q, index) => ({ ...q, index, state: questionStates[index] }));
        switch (category) {
            case 'all':
            case 'overview':
                return questionsWithState;
            case 'correct':
                return questionsWithState.filter(item => item.state.resultCategory === 'correct');
            case 'incorrect':
                return questionsWithState.filter(item => item.state.resultCategory === 'incorrect');
            case 'unattempted':
                return questionsWithState.filter(item => item.state.resultCategory === 'unattempted');
            case 'marked for review':
                return questionsWithState.filter(item => item.state.markedForReview);
            default:
                return [];
        }
    }

    function showReviewPalette() {
        const reviewPaletteOld = document.getElementById('review-palette');
        const reviewPaletteNew = reviewPaletteClean;

        function fillContainer(container, cleanStyle) {
            if (!container) return;
            container.innerHTML = '';

            reviewQuestionList.forEach((item, index) => {
                const state = item.state || {};
                const btn = document.createElement('button');

                btn.className = cleanStyle ? 'qp-btn' : 'palette-btn';
                btn.textContent = item.index + 1;
                btn.dataset.index = index;

                if (!cleanStyle) {
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
                }

                btn.addEventListener('click', () => { showReviewQuestion(index); });
                container.appendChild(btn);
            });
        }

        fillContainer(reviewPaletteOld, false);
        fillContainer(reviewPaletteNew, true);
    }

    function showReviewQuestion(index) {
        currentReviewIndex = index;

        if (reviewQuestionList.length === 0 || index < 0 || index >= reviewQuestionList.length) return;

        const reviewItem = reviewQuestionList[index];
        const question = questions[reviewItem.index];
        const state = questionStates[reviewItem.index];

        if (reviewQuestionTitle) {
            reviewQuestionTitle.textContent =
                "Reviewing Question " + (index + 1) + " of " + reviewQuestionList.length +
                " (Original Q" + (reviewItem.index + 1) + ")";
        }

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

        const baseQuestionHtml =
            '<p class="question-text">' + (reviewItem.index + 1) + '. ' + questionText + '</p>' +
            '<div class="options-container">' + optionsHtml + '</div>' +
            (state.userAnswer === null ? '<p class="unattempted-note">**This question was unattempted.**</p>' : '');

        if (reviewQuestionCard) {
            reviewQuestionCard.innerHTML = baseQuestionHtml;
        }

        if (reviewSolutionText) {
            reviewSolutionText.textContent = explanationText || '—';
        }

        if (reviewArea && !reviewQuestionCard) {
            reviewArea.innerHTML =
                baseQuestionHtml +
                '<div class="solution-box"><h4>Solution:</h4><p>' + explanationText + '</p></div>';
        }

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
                const activeTab = Array.from(container.querySelectorAll('a'))
                    .find(a => a.textContent.toLowerCase().trim() === category);
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
            if (reviewArea) reviewArea.innerHTML =
                '<p style="text-align:center; padding: 50px;">No questions found in this category.</p>';
            if (reviewQuestionTitle) reviewQuestionTitle.textContent = "Reviewing Question 0 of 0";
            if (reviewPrevBtn) reviewPrevBtn.disabled = true;
            if (reviewNextBtn) reviewNextBtn.disabled = true;
            const rpOld = document.getElementById('review-palette');
            if (rpOld) rpOld.innerHTML = '';
            if (reviewPaletteClean) reviewPaletteClean.innerHTML = '';
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
            "Maths Top 50": 60,
            "Reasoning": 20,
            "English": 15,
            "GK": 10,
            "Time Left": 20
        };

        sectionTimeRemaining = {};
        totalInitialTime = 0;

        // Use testInfo duration or default
        const testDuration = testInfo.duration || sectionDurations[singleSubjectName] || 25;

        const uniqueSubjects = [...new Set(questions.map(q => q.subject))];
        uniqueSubjects.forEach(subj => {
            const minutes = testDuration;
            sectionTimeRemaining[subj] = minutes * 60;
            totalInitialTime += (minutes * 60);
        });

        console.log(`⏱️ Quiz Duration: ${testDuration} minutes`);

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
            status: 'not-visited',
            userAnswer: null,
            markedForReview: false,
            resultCategory: null
        }));

        createPalette();
        startTimer();
        showQuestion(0);

        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = '';
        });

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
                        timerEl.textContent =
                            `${currentSubject}: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    }
                } else {
                    handleSectionTimeout(currentSubject);
                }
            }, 1000);
        }

        function handleSectionTimeout(finishedSubject) {
            clearInterval(timerInterval);
            alert(`Time is up for ${finishedSubject}!`);
            submitTestToBackend(true);
        }

        function pauseTest() {
            isPaused = true;
            if (pauseOverlay) pauseOverlay.classList.remove('hidden');
        }

        function resumeTest() {
            isPaused = false;
            if (pauseOverlay) pauseOverlay.classList.add('hidden');
        }

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

        // ================================================================
        // 🔒 SUBMIT TEST TO BACKEND (Get results with correct answers)
        // ================================================================
        async function submitTestToBackend(autoSubmit = false) {
            clearInterval(timerInterval);

            // Calculate time taken
            let totalRemainingSeconds = 0;
            for (let subj in sectionTimeRemaining) {
                totalRemainingSeconds += sectionTimeRemaining[subj];
            }
            const timeTakenSecondsTotal = totalInitialTime - totalRemainingSeconds;
            const timeTakenMinutes = Math.floor(timeTakenSecondsTotal / 60);
            const timeTakenSeconds = timeTakenSecondsTotal % 60;

            // Prepare answers array for backend
            // Backend expects array of selected option indices or -1 for unanswered
            const answers = questionStates.map((state, index) => {
                if (state.userAnswer === null) return -1;
                
                // Find index of selected option
                const selectedOptionIndex = questions[index].options.findIndex(
                    opt => opt.en === state.userAnswer
                );
                return selectedOptionIndex;
            });

            try {
                // Show submitting state
                if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
                if (quizUI) {
                    quizUI.innerHTML = `
                        <div style="text-align: center; padding: 100px 20px;">
                            <div class="spinner" style="
                                width: 60px; height: 60px; margin: 0 auto 30px;
                                border: 4px solid rgba(99, 102, 241, 0.2);
                                border-top-color: #6366f1;
                                border-radius: 50%;
                                animation: spin 1s linear infinite;
                            "></div>
                            <h2>Submitting Test...</h2>
                            <p>Please wait while we calculate your results</p>
                            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
                        </div>
                    `;
                }

                console.log('📤 Submitting test to backend...');
                const response = await ExamAxisAPI.submitTest(testId, answers);

                if (!response.success) {
                    throw new Error(response.message || 'Submission failed');
                }

                console.log('✅ Test submitted successfully!');
                testResults = response.data;

                // Update questions with correct answers from backend
                if (testResults.results) {
                    testResults.results.forEach((result, index) => {
                        if (questions[index]) {
                            // Add correct answer from backend
                            questions[index].correctAnswer = {
                                en: questions[index].options[result.correctAnswer]?.en || '',
                                hi: questions[index].options[result.correctAnswer]?.hi || ''
                            };
                            questions[index].explanation = {
                                en: result.explanation || '',
                                hi: result.explanation || ''
                            };

                            // Update state with result category
                            questionStates[index].resultCategory = result.isCorrect ? 'correct' : 
                                (questionStates[index].userAnswer === null ? 'unattempted' : 'incorrect');
                        }
                    });
                }

                // Show results
                showResults(testResults, timeTakenMinutes, timeTakenSeconds);

            } catch (error) {
                console.error('❌ Failed to submit test:', error);
                alert('Failed to submit test: ' + error.message + '\n\nPlease try again.');
                
                // Restore quiz UI
                if (quizUI) {
                    quizUI.classList.remove('hidden');
                    location.reload();
                }
            }
        }

        function showResults(results, timeTakenMinutes, timeTakenSeconds) {
            const correctCount = results.correctAnswers;
            const incorrectCount = results.incorrectAnswers || (results.totalQuestions - correctCount);
            const unattemptedCount = questionStates.filter(s => s.userAnswer === null).length;
            const score = results.score;
            const accuracy = results.percentage;

            // Save attempt to backend
            const attemptSummary = {
                testId: testInfo.id || testId,
                testTitle: testInfo.title,
                subject: testInfo.subject || singleSubjectName,
                totalQuestions: questions.length,
                correct: correctCount,
                incorrect: incorrectCount,
                unattempted: unattemptedCount,
                score: Number(score),
                maxScore: results.maxScore,
                accuracy: Number(accuracy),
                timeTakenMinutes
            };
            sendAttemptToServer(attemptSummary);

            reviewQuestionList = filterQuestions('all');

            // Render results UI
            const testInfoAndActionsWrapper = document.getElementById('review-button-area');
            const testDetailsHtml = `
                <div class="test-details">
                    <h3>${testInfo.title || 'Test Completed'}</h3>
                    <p>Total Questions: ${questions.length}</p>
                    <p>Max Marks: ${results.maxScore}</p>
                </div>
            `;
            const reviewButtonHtml = `
                <div class="action-buttons">
                    <button id="review-test-btn" class="btn primary review">Review Test</button>
                    <a href="index.html" class="btn secondary go-to-tests">Go to Tests</a>
                </div>
            `;

            if (testInfoAndActionsWrapper) {
                testInfoAndActionsWrapper.innerHTML = testDetailsHtml + reviewButtonHtml;
            }

            const statsCardsArea = document.getElementById('stats-cards-area');
            const statsCardsHtml = `
                <div class="stats-grid-container">
                    <div class="stat-card total-score"><div class="stat-value">${score}</div><div class="stat-name">YOUR SCORE</div></div>
                    <div class="stat-card correct"><div class="stat-value">${correctCount}</div><div class="stat-name">CORRECT</div></div>
                    <div class="stat-card incorrect"><div class="stat-value">${incorrectCount}</div><div class="stat-name">INCORRECT</div></div>
                    <div class="stat-card unattempted"><div class="stat-value">${unattemptedCount}</div><div class="stat-name">UNATTEMPTED</div></div>
                    <div class="stat-card time-taken"><div class="stat-value">${String(timeTakenMinutes).padStart(2, '0')}:${String(timeTakenSeconds).padStart(2, '0')}</div><div class="stat-name">TIME TAKEN</div></div>
                    <div class="stat-card accuracy"><div class="stat-value">${accuracy}%</div><div class="stat-name">ACCURACY</div></div>
                </div>
            `;

            if (statsCardsArea) statsCardsArea.innerHTML = statsCardsHtml;

            const reviewTestBtn = document.querySelector('#review-test-btn');
            if (reviewTestBtn) {
                reviewTestBtn.addEventListener('click', () => {
                    const allTab = document.querySelector('#result-summary-page .results-header-nav a:nth-child(2)');
                    if (allTab) tabClickHandler({ preventDefault: () => {}, target: allTab });
                });
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
            const targetSubject = questions[index].subject;
            if (sectionTimeRemaining[targetSubject] <= 0) {
                alert(`Time for ${targetSubject} is over.`);
                return;
            }

            currentQuestionIndex = index;
            const question = questions[index];
            const state = questionStates[index];

            if (state.status === 'not-visited') state.status = 'not-answered';

            if (questionTitle) questionTitle.textContent =
                `${question.subject} | Q${index + 1} of ${questions.length}`;

            const questionText = (typeof question.question === 'object')
                ? question.question[currentLanguage]
                : question.question;

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
            startTimer();
        }

        function updateNavigation() {
            if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
            if (nextBtn) {
                nextBtn.textContent =
                    (currentQuestionIndex === questions.length - 1) ? 'Submit Test' : 'Save & Next';
            }

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
            document.querySelectorAll('input[name="option"]:checked')
                .forEach(radio => radio.checked = false);
            updatePalette();
            updateNavigation();
        }

        function escapeHtml(text) {
            if (text === null || typeof text === 'undefined') return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Bind controls
        if (pauseBtn) pauseBtn.addEventListener('click', pauseTest);
        if (resumeBtn) resumeBtn.addEventListener('click', resumeTest);
        if (submitTestBtn) submitTestBtn.addEventListener('click', showSubmissionSummary);
        if (clearResponseBtn) clearResponseBtn.addEventListener('click', clearCurrentAnswer);

        if (finalSubmitBtn) finalSubmitBtn.addEventListener('click', () => {
            if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
            submitTestToBackend(); // Submit to backend!
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
            if (currentReviewIndex < reviewQuestionList.length - 1) {
                showReviewQuestion(currentReviewIndex + 1);
            }
        });

        if (reviewPrevBtn) reviewPrevBtn.addEventListener('click', () => {
            if (currentReviewIndex > 0) {
                showReviewQuestion(currentReviewIndex - 1);
            }
        });
    }

    function sendAttemptToServer(summary) {
        if (!window.ExamAxisAPI || !ExamAxisAPI.isLoggedIn()) return;

        ExamAxisAPI.saveTestAttempt(summary)
            .then(res => {
                if (!res || !res.success) {
                    console.warn('Failed to save attempt:', res);
                }
            })
            .catch(err => {
                console.error('Error saving attempt:', err);
            });
    }
});