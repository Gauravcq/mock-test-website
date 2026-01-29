// test-logic.js  (supports OLD + NEW + EN-only question formats)
// Tries API first, falls back to local QUESTIONS_DATABASE

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

        // CORRECT ANSWER
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
    // 🔒 LOAD QUESTIONS - Try API first, fallback to local QUESTIONS_DATABASE
    // ====================================================================
    let questions = [];
    let testResults = null;
    let loadedFromAPI = false;

    // Try to load from API first
    try {
        console.log(`🔒 Trying to load questions from API for test: ${testId}...`);
        
        const response = await ExamAxisAPI.getQuestions(testId);
        
        if (response.success && response.data?.questions?.length > 0) {
            questions = response.data.questions;
            loadedFromAPI = true;
            console.log(`✅ Loaded ${questions.length} questions from API (secure)`);
        } else {
            throw new Error('API returned no questions');
        }
    } catch (apiError) {
        console.warn('⚠️ API failed, falling back to local QUESTIONS_DATABASE...', apiError.message);
        
        // Fallback to local questions
        if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
            let rawData = QUESTIONS_DATABASE[testId];
            
            // Support both old array format and new object format
            if (Array.isArray(rawData)) {
                questions = rawData;
            } else if (rawData.questions && Array.isArray(rawData.questions)) {
                questions = rawData.questions;
            }
            
            if (questions.length > 0) {
                console.log(`✅ Loaded ${questions.length} questions from local database`);
            }
        }
    }

    // Final check - if still no questions, show error
    if (!questions || questions.length === 0) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>❌ Error</h1>
                <p>No questions found for test ID: ${testId}</p>
                <a href="index.html" style="color: #6366f1;">Go Back to Tests</a>
            </div>
        `;
        return;
    }
console.log(`📋 Total questions loaded: ${questions.length}, From API: ${loadedFromAPI}`);

const singleSubjectName = testInfo.subject;
const totalQuestions = questions.length;

// Normalize every question + add subject/section metadata
questions = questions.map((q, index) => {
    const nq = normalizeQuestion(q);
    return {
        ...nq,
        originalIndex: index,
        subject: singleSubjectName,
        sectionQNum: 1,
        sectionTotal: totalQuestions
    };
});

// ====================================================================
// 🎯 SHOW INSTRUCTIONS AND BIND START BUTTON
// ====================================================================
// Make sure instructions modal is visible
if (instructionsModal) {
    instructionsModal.classList.remove('hidden');
    console.log('✅ Instructions modal is now visible');
}

// Make sure quiz UI is hidden initially
if (quizUI) {
    quizUI.classList.add('hidden');
}

// Bind start button
if (startTestBtn) {
    // Remove any existing listeners
    const newStartBtn = startTestBtn.cloneNode(true);
    startTestBtn.parentNode.replaceChild(newStartBtn, startTestBtn);
    
    newStartBtn.addEventListener('click', () => {
        console.log('🚀 Starting test with', questions.length, 'questions');
        if (instructionsModal) instructionsModal.classList.add('hidden');
        if (quizUI) quizUI.classList.remove('hidden');
        initializeQuiz(questions, testInfo);
    });
    console.log('✅ Start button is ready - click it to begin!');
} else {
    console.error('❌ Start Test button (#start-test-btn) not found in HTML!');
    // Fallback: Auto-start the quiz
    console.log('🚀 Auto-starting quiz since no start button...');
    if (quizUI) quizUI.classList.remove('hidden');
    initializeQuiz(questions, testInfo);
}
// ====================================================================
    // ====================================================================

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

    // Update title
    if (reviewQuestionTitle) {
        reviewQuestionTitle.textContent =
            "Reviewing Question " + (index + 1) + " of " + reviewQuestionList.length +
            " (Original Q" + (reviewItem.index + 1) + ")";
    }

    // Check if correct answer exists in options (data validation)
    const correctAnswerNormalized = normalizeString(question.correctAnswer.en);
    let correctAnswerFound = false;

    const optionsHtml = question.options.map((optObj, optIndex) => {
        const optionEn = optObj.en || '';
        const optionHi = optObj.hi || optionEn;
        const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D

        const optionNormalized = normalizeString(optionEn);
        const isCorrect = optionNormalized === correctAnswerNormalized;
        
        // Check if user selected this option
        const userAnswerNormalized = state.userAnswer !== null ? normalizeString(state.userAnswer) : null;
        const isUserChoice = userAnswerNormalized !== null && optionNormalized === userAnswerNormalized;

        if (isCorrect) correctAnswerFound = true;

        // Determine option styling class
        let optionClass = 'review-option';
        if (isCorrect) {
            optionClass += ' correct'; // Green background
        }
        if (isUserChoice && !isCorrect) {
            optionClass += ' incorrect'; // Red background for wrong pick
        }
        if (isUserChoice && isCorrect) {
            optionClass += ' correct-user-choice'; // Green with extra highlight
        }

        // Build option HTML
        let html = '<div class="' + optionClass + '">';
        
        // Option letter and text
        html += '<div class="review-option-content">';
        html += '<span class="option-letter">' + optionLetter + '.</span>';
        html += '<span class="option-text-content">';
        html += '<strong>' + escapeHtmlReview(optionEn) + '</strong>';
        if (optionHi && optionHi !== optionEn) {
            html += ' <small class="hi-text">(' + escapeHtmlReview(optionHi) + ')</small>';
        }
        html += '</span>';
        html += '</div>';

        // Indicators container
        html += '<div class="review-indicators">';
        
        // ✅ ALWAYS show correct answer indicator on correct option
        if (isCorrect) {
            html += '<span class="correct-indicator">✅ Correct Answer</span>';
        }
        
        // Show user's pick indicator
        if (isUserChoice) {
            if (isCorrect) {
                html += '<span class="user-pick-correct">✔️ Your Pick (Correct!)</span>';
            } else {
                html += '<span class="user-pick-wrong">❌ Your Pick (Wrong)</span>';
            }
        }
        
        html += '</div>'; // end indicators
        html += '</div>'; // end review-option
        
        return html;
    }).join('');

    // Get question text in current language
    const questionText = (typeof question.question === 'object') 
        ? (question.question[currentLanguage] || question.question.en)
        : question.question;

    // Get explanation in current language
    const explanationText = (typeof question.explanation === 'object')
        ? (question.explanation[currentLanguage] || question.explanation.en || 'No explanation available.')
        : (question.explanation || 'No explanation available.');

    // Build the complete question HTML
    let questionHtml = '<div class="review-question-text">';
    questionHtml += '<span class="q-number">Q' + (reviewItem.index + 1) + '.</span> ';
    questionHtml += questionText;
    questionHtml += '</div>';
    questionHtml += '<div class="options-container">' + optionsHtml + '</div>';

    // Show attempt status
    if (state.userAnswer === null) {
        questionHtml += '<div class="unattempted-note">⚠️ This question was <strong>NOT ATTEMPTED</strong>. The correct answer is highlighted in green above.</div>';
    } else {
        const wasCorrect = state.resultCategory === 'correct';
        if (wasCorrect) {
            questionHtml += '<div class="result-note correct-note">✅ You answered this question correctly! (+2 marks)</div>';
        } else {
            questionHtml += '<div class="result-note incorrect-note">❌ You answered this question incorrectly. (-0.5 marks)</div>';
        }
    }

    // Warning if correct answer not found in options (data issue)
    if (!correctAnswerFound) {
        questionHtml += '<div class="data-error-note">⚠️ <strong>Data Issue:</strong> Correct answer "' + 
            escapeHtmlReview(question.correctAnswer.en) + '" not found in options. Please report this question.</div>';
        console.error('Q' + (reviewItem.index + 1) + ': Correct answer not in options!', {
            correctAnswer: question.correctAnswer.en,
            options: question.options.map(o => o.en)
        });
    }

    // Update the review card
    if (reviewQuestionCard) {
        reviewQuestionCard.innerHTML = questionHtml;
    }

    // Update solution/explanation
    if (reviewSolutionText) {
        reviewSolutionText.innerHTML = '<strong>Explanation:</strong><br>' + explanationText;
    }

    // Fallback for old HTML structure
    if (reviewArea && !reviewQuestionCard) {
        reviewArea.innerHTML = questionHtml +
            '<div class="solution-box"><h4>Solution:</h4><p>' + explanationText + '</p></div>';
    }

    // Re-render MathJax if present
    if (window.MathJax) {
        MathJax.typesetPromise && MathJax.typesetPromise();
    }

    // Update navigation buttons
    if (reviewPrevBtn) reviewPrevBtn.disabled = index === 0;
    if (reviewNextBtn) reviewNextBtn.disabled = index === reviewQuestionList.length - 1;

    // Update palette
    showReviewPalette();
}

// Helper function for escaping HTML in review
function escapeHtmlReview(text) {
    if (text === null || typeof text === 'undefined') return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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
            calculateAndShowResults(true);
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
        // CALCULATE AND SHOW RESULTS (Local scoring - works without API)
        // ================================================================
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
                        correctCount++; 
                        score += 2; 
                        state.resultCategory = 'correct';
                    } else {
                        incorrectCount++; 
                        score -= 0.5; 
                        state.resultCategory = 'incorrect';
                    }
                } else {
                    unattemptedCount++; 
                    state.resultCategory = 'unattempted';
                }
            });

            const attemptedCount = correctCount + incorrectCount;
            const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;

            // Send summary to backend (non-blocking)
            const attemptSummary = {
                testId: testInfo.id || testId,
                testTitle: testInfo.title,
                subject: testInfo.subject || singleSubjectName,
                totalQuestions: questions.length,
                correct: correctCount,
                incorrect: incorrectCount,
                unattempted: unattemptedCount,
                score: Number(score.toFixed(2)),
                maxScore: questions.length * 2,
                accuracy: Number(accuracy.toFixed(1)),
                timeTakenMinutes
            };
            sendAttemptToServer(attemptSummary);

            reviewQuestionList = filterQuestions('all');

            const testInfoAndActionsWrapper = document.getElementById('review-button-area');
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

            if (testInfoAndActionsWrapper) {
                testInfoAndActionsWrapper.innerHTML = testDetailsHtml + reviewButtonHtml;
            }

            const statsCardsArea = document.getElementById('stats-cards-area');
            const statsCardsHtml =
                '<div class="stats-grid-container">' +
                '<div class="stat-card total-score"><div class="stat-value">' + score.toFixed(2) + '</div><div class="stat-name">YOUR SCORE</div></div>' +
                '<div class="stat-card correct"><div class="stat-value">' + correctCount + '</div><div class="stat-name">CORRECT</div></div>' +
                '<div class="stat-card incorrect"><div class="stat-value">' + incorrectCount + '</div><div class="stat-name">INCORRECT</div></div>' +
                '<div class="stat-card unattempted"><div class="stat-value">' + unattemptedCount + '</div><div class="stat-name">UNATTEMPTED</div></div>' +
                '<div class="stat-card time-taken"><div class="stat-value">' +
                    String(timeTakenMinutes).padStart(2, '0') + ':' +
                    String(timeTakenSeconds).padStart(2, '0') +
                    '</div><div class="stat-name">TIME TAKEN</div></div>' +
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
            const targetSubject = questions[index].subject;
            if (sectionTimeRemaining[targetSubject] <= 0) {
                alert(`Time for ${targetSubject} is over. You cannot access this section.`);
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
            if (currentReviewIndex < reviewQuestionList.length - 1) {
                showReviewQuestion(currentReviewIndex + 1);
            }
        });

        if (reviewPrevBtn) reviewPrevBtn.addEventListener('click', () => {
            if (currentReviewIndex > 0) {
                showReviewQuestion(currentReviewIndex - 1);
            }
        });
    } // end initializeQuiz

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
}); // end DOMContentLoaded
