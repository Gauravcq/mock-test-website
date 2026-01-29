// test-logic.js (COMPLETE FIXED VERSION)
// Supports: Images in questions, bilingual en/hi format, various answer formats

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId') || urlParams.get('id');

    // ====== REQUIRE LOGIN FOR TESTS ======
    if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return;
    }

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

    // --- GLOBAL STATE ---
    let QUIZ_DATA = {
        questions: [],
        questionStates: [],
        testInfo: null,
        currentLanguage: 'en',
        sectionTimeRemaining: {},
        totalInitialTime: 0,
        reviewQuestionList: [],
        currentReviewIndex: 0
    };

    // --- UTILITY FUNCTIONS ---
    function containsHTML(str) {
        if (!str) return false;
        return /<[a-z][\s\S]*>/i.test(str);
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

    function safeRender(text) {
        if (!text) return '';
        // If contains HTML (like img tags), don't escape
        if (containsHTML(text)) {
            return text;
        }
        return escapeHtml(text);
    }

    function normalizeString(str) {
        if (str === null || typeof str === 'undefined') return '';
        return String(str)
            .replace(/<[^>]*>/g, '') // Remove HTML tags for comparison
            .replace(/[\u20b9₹]/g, '')
            .replace(/m\u00b2/g, 'm^2')
            .replace(/\u00b0/g, 'deg')
            .replace(/√/g, 'sqrt')
            .replace(/\s+/g, '')
            .toLowerCase()
            .trim();
    }

    // --- QUESTION NORMALIZER ---
    function normalizeQuestion(raw) {
        if (!raw) return null;
        if (raw._normalized) return raw;

        const q = { ...raw };

        // QUESTION TEXT
        if (typeof q.question === 'string') {
            q.question = { en: q.question, hi: q.question };
        } else if (q.question && typeof q.question === 'object') {
            q.question = {
                en: q.question.en || '',
                hi: q.question.hi || q.question.en || ''
            };
        } else {
            q.question = { en: '', hi: '' };
        }

        // OPTIONS
        if (Array.isArray(q.options)) {
            q.options = q.options.map((opt, idx) => {
                if (typeof opt === 'string') {
                    return { en: opt, hi: opt, index: idx };
                } else if (opt && typeof opt === 'object') {
                    return {
                        en: opt.en || '',
                        hi: opt.hi || opt.en || '',
                        index: idx
                    };
                }
                return { en: '', hi: '', index: idx };
            });
        } else {
            q.options = [];
        }

        // CORRECT ANSWER
        if (typeof q.correctAnswer === 'string') {
            q.correctAnswer = { en: q.correctAnswer, hi: q.correctAnswer };
        } else if (q.correctAnswer && typeof q.correctAnswer === 'object') {
            q.correctAnswer = {
                en: q.correctAnswer.en || '',
                hi: q.correctAnswer.hi || q.correctAnswer.en || ''
            };
        } else if (typeof q.answer === 'string') {
            const letter = q.answer.trim().toUpperCase();
            if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
                const idx = letter.charCodeAt(0) - 65;
                if (q.options[idx]) {
                    q.correctAnswer = {
                        en: q.options[idx].en,
                        hi: q.options[idx].hi
                    };
                } else {
                    q.correctAnswer = { en: q.answer, hi: q.answer };
                }
            } else {
                q.correctAnswer = { en: q.answer, hi: q.answer };
            }
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
        } else if (q.explanation && typeof q.explanation === 'object') {
            q.explanation = {
                en: q.explanation.en || '',
                hi: q.explanation.hi || q.explanation.en || ''
            };
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
        document.body.innerHTML = `<h1>Error: Test with ID ${testId} not found.</h1>`;
        return;
    }

    QUIZ_DATA.testInfo = testInfo;

    // ====================================================================
    // LOAD QUESTIONS
    // ====================================================================
    let questions = [];
    let loadedFromAPI = false;

    try {
        console.log(`🔒 Trying to load questions from API for test: ${testId}...`);
        const response = await ExamAxisAPI.getQuestions(testId);
        
        if (response.success && response.data?.questions?.length > 0) {
            questions = response.data.questions;
            loadedFromAPI = true;
            console.log(`✅ Loaded ${questions.length} questions from API`);
        } else {
            throw new Error('API returned no questions');
        }
    } catch (apiError) {
        console.warn('⚠️ API failed, falling back to local...', apiError.message);
        
        if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
            let rawData = QUESTIONS_DATABASE[testId];
            
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

    console.log(`📋 Total questions loaded: ${questions.length}`);

    const singleSubjectName = testInfo.subject || 'General';

    // Normalize all questions
    QUIZ_DATA.questions = questions.map((q, index) => {
        const nq = normalizeQuestion(q);
        return {
            ...nq,
            originalIndex: index,
            subject: singleSubjectName,
            sectionQNum: index + 1,
            sectionTotal: questions.length
        };
    });

    console.log('✅ Questions normalized. Sample:', QUIZ_DATA.questions[0]);

    // ====================================================================
    // SHOW INSTRUCTIONS
    // ====================================================================
    if (instructionsModal) instructionsModal.classList.remove('hidden');
    if (quizUI) quizUI.classList.add('hidden');

    if (startTestBtn) {
        const newStartBtn = startTestBtn.cloneNode(true);
        startTestBtn.parentNode.replaceChild(newStartBtn, startTestBtn);
        
        newStartBtn.addEventListener('click', () => {
            console.log('🚀 Starting test...');
            if (instructionsModal) instructionsModal.classList.add('hidden');
            if (quizUI) quizUI.classList.remove('hidden');
            initializeQuiz();
        });
    } else {
        if (quizUI) quizUI.classList.remove('hidden');
        setTimeout(() => initializeQuiz(), 100);
    }

    // ====================================================================
    // FILTER & REVIEW FUNCTIONS
    // ====================================================================
    function filterQuestions(category) {
        const questionsWithState = QUIZ_DATA.questions.map((q, index) => ({
            ...q,
            index,
            state: QUIZ_DATA.questionStates[index] || {}
        }));

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
                return questionsWithState;
        }
    }

    function showReviewPalette() {
        const reviewPaletteOld = document.getElementById('review-palette');
        
        function fillContainer(container, cleanStyle) {
            if (!container) return;
            container.innerHTML = '';

            QUIZ_DATA.reviewQuestionList.forEach((item, index) => {
                const state = item.state || {};
                const btn = document.createElement('button');
                btn.className = cleanStyle ? 'qp-btn' : 'palette-btn';
                btn.textContent = item.index + 1;
                btn.dataset.index = index;

                if (!cleanStyle) {
                    if (state.resultCategory === 'correct') btn.classList.add('answered');
                    else if (state.resultCategory === 'incorrect') btn.classList.add('not-answered');
                    else if (state.resultCategory === 'unattempted') btn.classList.add('not-visited');

                    if (state.markedForReview) {
                        btn.classList.add(state.userAnswer !== null ? 'answered-marked-review' : 'marked-review');
                    }
                    if (index === QUIZ_DATA.currentReviewIndex) btn.classList.add('current');
                }

                btn.addEventListener('click', () => showReviewQuestion(index));
                container.appendChild(btn);
            });
        }

        fillContainer(reviewPaletteOld, false);
        fillContainer(reviewPaletteClean, true);
    }

    function showReviewQuestion(index) {
        QUIZ_DATA.currentReviewIndex = index;

        if (QUIZ_DATA.reviewQuestionList.length === 0 || index < 0 || index >= QUIZ_DATA.reviewQuestionList.length) {
            return;
        }

        const reviewItem = QUIZ_DATA.reviewQuestionList[index];
        const question = QUIZ_DATA.questions[reviewItem.index];
        const state = QUIZ_DATA.questionStates[reviewItem.index];

        if (!question || !state) return;

        const lang = QUIZ_DATA.currentLanguage;

        if (reviewQuestionTitle) {
            reviewQuestionTitle.textContent = 
                `Reviewing Question ${index + 1} of ${QUIZ_DATA.reviewQuestionList.length} (Original Q${reviewItem.index + 1})`;
        }

        // Get correct answer
        let correctAnswerText = '';
        if (typeof question.correctAnswer === 'object') {
            correctAnswerText = question.correctAnswer[lang] || question.correctAnswer.en || '';
        } else {
            correctAnswerText = question.correctAnswer || '';
        }
        const correctAnswerNormalized = normalizeString(correctAnswerText);

        // Build options HTML
        const optionsHtml = question.options.map((optObj, optIdx) => {
            let optionText, optionValue;
            
            if (typeof optObj === 'object') {
                optionText = optObj[lang] || optObj.en || '';
                optionValue = optObj.en || optionText;
            } else {
                optionText = optObj;
                optionValue = optObj;
            }
            
            const optionNormalized = normalizeString(optionValue);
            const isCorrect = optionNormalized === correctAnswerNormalized;
            const userAnswerNormalized = normalizeString(state.userAnswer);
            const isUserChoice = state.userAnswer !== null && optionNormalized === userAnswerNormalized;

            let optionClass = 'review-option';
            let indicators = '';

            if (isCorrect && isUserChoice) {
                optionClass += ' correct correct-user-choice';
                indicators = '<span class="correct-indicator">✅ Your Answer (Correct!)</span>';
            } else if (isCorrect) {
                optionClass += ' correct';
                indicators = '<span class="correct-indicator">✅ Correct Answer</span>';
            } else if (isUserChoice) {
                optionClass += ' incorrect';
                indicators = '<span class="user-pick-indicator">❌ Your Answer (Wrong)</span>';
            }

            const optionLabel = String.fromCharCode(65 + optIdx);

            return `
                <div class="${optionClass}">
                    <div class="review-option-text">
                        <span class="option-letter">${optionLabel}.</span>
                        <span class="option-label">${safeRender(optionText)}</span>
                    </div>
                    ${indicators}
                </div>
            `;
        }).join('');

        // Get question text
        let questionText = '';
        if (typeof question.question === 'object') {
            questionText = question.question[lang] || question.question.en || '';
        } else {
            questionText = question.question || '';
        }
        
        // Get explanation
        let explanationText = '';
        if (typeof question.explanation === 'object') {
            explanationText = question.explanation[lang] || question.explanation.en || '';
        } else {
            explanationText = question.explanation || '';
        }

        let statusNote = '';
        if (state.userAnswer === null) {
            statusNote = '<p class="unattempted-note" style="color: #f59e0b; margin-top: 15px; font-weight: bold;">⚠️ This question was NOT ATTEMPTED. The correct answer is highlighted above.</p>';
        }

        if (reviewQuestionCard) {
            reviewQuestionCard.innerHTML = `
                <p class="question-text"><strong>Q${reviewItem.index + 1}.</strong> ${safeRender(questionText)}</p>
                <div class="options-container">${optionsHtml}</div>
                ${statusNote}
            `;
        }

        if (reviewSolutionText) {
            reviewSolutionText.innerHTML = explanationText ? safeRender(explanationText) : '<em>No explanation available.</em>';
        }

        if (reviewArea && !reviewQuestionCard) {
            reviewArea.innerHTML = `
                <p class="question-text"><strong>Q${reviewItem.index + 1}.</strong> ${safeRender(questionText)}</p>
                <div class="options-container">${optionsHtml}</div>
                ${statusNote}
                <div class="solution-box"><h4>Solution:</h4><p>${safeRender(explanationText) || 'No explanation available.'}</p></div>
            `;
        }

        if (window.MathJax) {
            try { window.MathJax.typeset(); } catch (e) {}
        }

        if (reviewPrevBtn) reviewPrevBtn.disabled = index === 0;
        if (reviewNextBtn) reviewNextBtn.disabled = index === QUIZ_DATA.reviewQuestionList.length - 1;

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

        QUIZ_DATA.reviewQuestionList = filterQuestions(category);
        console.log(`📋 Filtered "${category}": ${QUIZ_DATA.reviewQuestionList.length} questions`);

        if (resultSummaryPage) resultSummaryPage.classList.add('hidden');
        if (reviewPage) reviewPage.classList.remove('hidden');

        if (QUIZ_DATA.reviewQuestionList.length > 0) {
            showReviewQuestion(0);
        } else {
            const noQuestionsMsg = `<p style="text-align:center; padding: 50px; color: #666;">No questions found in "${category}" category.</p>`;
            if (reviewArea) reviewArea.innerHTML = noQuestionsMsg;
            if (reviewQuestionCard) reviewQuestionCard.innerHTML = noQuestionsMsg;
            if (reviewQuestionTitle) reviewQuestionTitle.textContent = "Reviewing Question 0 of 0";
            if (reviewPrevBtn) reviewPrevBtn.disabled = true;
            if (reviewNextBtn) reviewNextBtn.disabled = true;
            
            const rpOld = document.getElementById('review-palette');
            if (rpOld) rpOld.innerHTML = '';
            if (reviewPaletteClean) reviewPaletteClean.innerHTML = '';
        }
    }

    // ====================================================================
    // INITIALIZE QUIZ
    // ====================================================================
    function initializeQuiz() {
        let currentQuestionIndex = 0;
        let timerInterval = null;
        let isPaused = false;

        const testDuration = QUIZ_DATA.testInfo.duration || 25;
        const questions = QUIZ_DATA.questions;

        QUIZ_DATA.sectionTimeRemaining = {};
        QUIZ_DATA.totalInitialTime = 0;

        const uniqueSubjects = [...new Set(questions.map(q => q.subject))];
        uniqueSubjects.forEach(subj => {
            QUIZ_DATA.sectionTimeRemaining[subj] = testDuration * 60;
            QUIZ_DATA.totalInitialTime += (testDuration * 60);
        });

        console.log(`⏱️ Quiz Duration: ${testDuration} minutes`);

        // Language selector
        if (languageSelect) {
            languageSelect.value = QUIZ_DATA.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                QUIZ_DATA.currentLanguage = e.target.value;
                const isQuizActive = quizUI && !quizUI.classList.contains('hidden');
                const isReviewActive = reviewPage && !reviewPage.classList.contains('hidden');
                if (isQuizActive) showQuestion(currentQuestionIndex);
                else if (isReviewActive) showReviewQuestion(QUIZ_DATA.currentReviewIndex);
            });
        }

        // Title
        const badgeHtml = QUIZ_DATA.testInfo.isNew ? '<span class="new-badge">NEW</span>' : '';
        const titleEl = document.getElementById('test-main-title');
        if (titleEl) {
            titleEl.innerHTML = `${QUIZ_DATA.testInfo.date || ''} - ${QUIZ_DATA.testInfo.title || 'Test'} ${badgeHtml}`;
        }

        // Initialize states
        QUIZ_DATA.questionStates = questions.map(() => ({
            status: 'not-visited',
            userAnswer: null,
            markedForReview: false,
            resultCategory: null
        }));

        createPalette();
        showQuestion(0);
        startTimer();

        window.addEventListener('beforeunload', (e) => {
            if (!resultSummaryPage || resultSummaryPage.classList.contains('hidden')) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        function getCurrentSubject() {
            return questions[currentQuestionIndex].subject;
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            
            timerInterval = setInterval(() => {
                if (isPaused) return;
                
                const currentSubject = getCurrentSubject();
                if (QUIZ_DATA.sectionTimeRemaining[currentSubject] > 0) {
                    QUIZ_DATA.sectionTimeRemaining[currentSubject]--;
                    const t = QUIZ_DATA.sectionTimeRemaining[currentSubject];
                    const minutes = Math.floor(t / 60);
                    const seconds = t % 60;
                    if (timerEl) {
                        timerEl.textContent = `${currentSubject}: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    }
                } else {
                    clearInterval(timerInterval);
                    alert(`Time is up for ${currentSubject}!`);
                    calculateAndShowResults(true);
                }
            }, 1000);
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
            const answered = QUIZ_DATA.questionStates.filter(s => s.userAnswer !== null).length;
            const marked = QUIZ_DATA.questionStates.filter(s => s.markedForReview).length;
            const answeredAndMarked = QUIZ_DATA.questionStates.filter(s => s.userAnswer !== null && s.markedForReview).length;
            
            if (submissionStatsEl) {
                submissionStatsEl.innerHTML = `
                    <div>Answered: <span>${answered} / ${questions.length}</span></div>
                    <div>Not Answered: <span>${questions.length - answered} / ${questions.length}</span></div>
                    <div>Marked for Review: <span>${marked}</span></div>
                    <div>Answered & Marked: <span>${answeredAndMarked}</span></div>
                `;
            }
            if (submitSummaryModal) submitSummaryModal.classList.remove('hidden');
        }

        // ================================================================
        // CALCULATE RESULTS
        // ================================================================
        function calculateAndShowResults(autoSubmit = false) {
            clearInterval(timerInterval);

            let totalRemainingSeconds = 0;
            for (let subj in QUIZ_DATA.sectionTimeRemaining) {
                totalRemainingSeconds += QUIZ_DATA.sectionTimeRemaining[subj];
            }
            const timeTakenSecondsTotal = QUIZ_DATA.totalInitialTime - totalRemainingSeconds;
            const timeTakenMinutes = Math.floor(timeTakenSecondsTotal / 60);
            const timeTakenSeconds = timeTakenSecondsTotal % 60;

            let correctCount = 0, incorrectCount = 0, unattemptedCount = 0, score = 0;

            QUIZ_DATA.questionStates.forEach((state, index) => {
                const question = questions[index];
                
                // Get correct answer text
                let correctAnswerText = '';
                if (typeof question.correctAnswer === 'object') {
                    correctAnswerText = question.correctAnswer.en || '';
                } else {
                    correctAnswerText = question.correctAnswer || '';
                }
                const correctAnswerNormalized = normalizeString(correctAnswerText);

                if (state.userAnswer !== null) {
                    const userAnswerNormalized = normalizeString(state.userAnswer);
                    
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

            console.log(`📊 Results: Correct=${correctCount}, Incorrect=${incorrectCount}, Unattempted=${unattemptedCount}`);

            const attemptedCount = correctCount + incorrectCount;
            const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;

            // Send to backend
            sendAttemptToServer({
                testId: QUIZ_DATA.testInfo.id || testId,
                testTitle: QUIZ_DATA.testInfo.title,
                subject: QUIZ_DATA.testInfo.subject || singleSubjectName,
                totalQuestions: questions.length,
                correct: correctCount,
                incorrect: incorrectCount,
                unattempted: unattemptedCount,
                score: Number(score.toFixed(2)),
                maxScore: questions.length * 2,
                accuracy: Number(accuracy.toFixed(1)),
                timeTakenMinutes
            });

            QUIZ_DATA.reviewQuestionList = filterQuestions('all');

            // Build results UI
            const testInfoAndActionsWrapper = document.getElementById('review-button-area');
            if (testInfoAndActionsWrapper) {
                testInfoAndActionsWrapper.innerHTML = `
                    <div class="test-details">
                        <h3>${QUIZ_DATA.testInfo.title || 'Test'}</h3>
                        <p>Total Questions: ${questions.length}</p>
                        <p>Max Marks: ${questions.length * 2}</p>
                    </div>
                    <div class="action-buttons">
                        <button id="review-test-btn" class="btn primary review">Review Test</button>
                        <a href="index.html" class="btn secondary go-to-tests">Go to Tests</a>
                    </div>
                `;
            }

            const statsCardsArea = document.getElementById('stats-cards-area');
            if (statsCardsArea) {
                statsCardsArea.innerHTML = `
                    <div class="stats-grid-container">
                        <div class="stat-card total-score"><div class="stat-value">${score.toFixed(2)}</div><div class="stat-name">YOUR SCORE</div></div>
                        <div class="stat-card correct"><div class="stat-value">${correctCount}</div><div class="stat-name">CORRECT</div></div>
                        <div class="stat-card incorrect"><div class="stat-value">${incorrectCount}</div><div class="stat-name">INCORRECT</div></div>
                        <div class="stat-card unattempted"><div class="stat-value">${unattemptedCount}</div><div class="stat-name">UNATTEMPTED</div></div>
                        <div class="stat-card time-taken"><div class="stat-value">${String(timeTakenMinutes).padStart(2, '0')}:${String(timeTakenSeconds).padStart(2, '0')}</div><div class="stat-name">TIME TAKEN</div></div>
                        <div class="stat-card accuracy"><div class="stat-value">${accuracy.toFixed(1)}%</div><div class="stat-name">ACCURACY</div></div>
                    </div>
                `;
            }

            // Bind review button
            setTimeout(() => {
                const reviewTestBtn = document.querySelector('#review-test-btn');
                if (reviewTestBtn) {
                    reviewTestBtn.addEventListener('click', () => {
                        const allTab = document.querySelector('#result-summary-page .results-header-nav a:nth-child(2)');
                        if (allTab) tabClickHandler({ preventDefault: () => {}, target: allTab });
                    });
                }
            }, 100);

            // Bind tab handlers
            [resultTabsContainer, reviewTabsContainer].forEach(container => {
                if (container) {
                    container.querySelectorAll('a').forEach(tab => {
                        tab.removeEventListener('click', tabClickHandler);
                        tab.addEventListener('click', tabClickHandler);
                    });
                }
            });

            if (quizUI) quizUI.classList.add('hidden');
            if (resultSummaryPage) resultSummaryPage.classList.remove('hidden');
        }

        function createPalette() {
            if (!questionPalette) return;
            questionPalette.innerHTML = '';
            
            questions.forEach((_, index) => {
                const btn = document.createElement('button');
                btn.className = 'palette-btn not-visited';
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
            if (index < 0 || index >= questions.length) return;

            const targetSubject = questions[index].subject;
            if (QUIZ_DATA.sectionTimeRemaining[targetSubject] <= 0) {
                alert(`Time for ${targetSubject} is over.`);
                return;
            }

            currentQuestionIndex = index;
            const question = questions[index];
            const state = QUIZ_DATA.questionStates[index];
            const lang = QUIZ_DATA.currentLanguage;

            if (state.status === 'not-visited') state.status = 'not-answered';

            if (questionTitle) {
                questionTitle.textContent = `${question.subject} | Q${index + 1} of ${questions.length}`;
            }

            // Get question text (supports images)
            let questionText = '';
            if (typeof question.question === 'object') {
                questionText = question.question[lang] || question.question.en || '';
            } else {
                questionText = question.question || '';
            }

            // Build options
            const optionsHtml = question.options.map((optObj, optIdx) => {
                let optionText, optionValue;
                
                if (typeof optObj === 'object') {
                    optionText = optObj[lang] || optObj.en || '';
                    optionValue = optObj.en || optionText;
                } else {
                    optionText = optObj;
                    optionValue = optObj;
                }
                
                const checked = (state.userAnswer === optionValue) ? 'checked' : '';
                const optionLabel = String.fromCharCode(65 + optIdx);
                
                return `
                    <label class="option">
                        <input type="radio" name="option" value="${escapeHtml(optionValue)}" ${checked}>
                        <span class="option-letter">${optionLabel}.</span>
                        <span class="option-text">${safeRender(optionText)}</span>
                    </label>
                `;
            }).join('');

            if (questionArea) {
                questionArea.innerHTML = `
                    <p class="question-text"><strong>Q${index + 1}.</strong> ${safeRender(questionText)}</p>
                    <div class="options-container">${optionsHtml}</div>
                `;
            }

            if (window.MathJax) {
                try { window.MathJax.typeset(); } catch (e) {}
            }
            
            updateNavigation();
            updatePalette();
        }

        function updateNavigation() {
            if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
            if (nextBtn) {
                nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? 'Submit Test' : 'Save & Next';
            }

            const state = QUIZ_DATA.questionStates[currentQuestionIndex];
            if (markReviewBtn) {
                if (state.markedForReview && state.userAnswer !== null) {
                    markReviewBtn.textContent = 'Unmark & Save';
                } else if (state.markedForReview) {
                    markReviewBtn.textContent = 'Unmark Review';
                } else if (state.userAnswer !== null) {
                    markReviewBtn.textContent = 'Mark for Review';
                } else {
                    markReviewBtn.textContent = 'Mark for Review';
                }
            }
        }

        function updatePalette() {
            const paletteBtns = document.querySelectorAll('#question-palette .palette-btn');
            paletteBtns.forEach((btn, index) => {
                const state = QUIZ_DATA.questionStates[index];
                btn.className = 'palette-btn';

                if (state.userAnswer !== null && state.markedForReview) {
                    btn.classList.add('answered-marked-review');
                } else if (state.markedForReview) {
                    btn.classList.add('marked-review');
                } else if (state.userAnswer !== null) {
                    btn.classList.add('answered');
                } else if (state.status === 'not-answered') {
                    btn.classList.add('not-answered');
                } else {
                    btn.classList.add('not-visited');
                }

                if (index === currentQuestionIndex) btn.classList.add('current');
            });
        }

        function saveCurrentAnswer() {
            const selectedOption = document.querySelector('input[name="option"]:checked');
            const state = QUIZ_DATA.questionStates[currentQuestionIndex];
            
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
            const state = QUIZ_DATA.questionStates[currentQuestionIndex];
            state.userAnswer = null;
            state.status = 'not-answered';
            document.querySelectorAll('input[name="option"]:checked').forEach(r => r.checked = false);
            updatePalette();
            updateNavigation();
        }

        // BIND EVENT HANDLERS
        if (pauseBtn) pauseBtn.addEventListener('click', pauseTest);
        if (resumeBtn) resumeBtn.addEventListener('click', resumeTest);
        if (submitTestBtn) submitTestBtn.addEventListener('click', showSubmissionSummary);
        if (clearResponseBtn) clearResponseBtn.addEventListener('click', clearCurrentAnswer);

        if (finalSubmitBtn) {
            finalSubmitBtn.addEventListener('click', () => {
                if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
                calculateAndShowResults();
            });
        }

        if (cancelSubmitBtn) {
            cancelSubmitBtn.addEventListener('click', () => {
                if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                saveCurrentAnswer();
                if (currentQuestionIndex < questions.length - 1) {
                    showQuestion(currentQuestionIndex + 1);
                } else {
                    showSubmissionSummary();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                saveCurrentAnswer();
                if (currentQuestionIndex > 0) {
                    showQuestion(currentQuestionIndex - 1);
                }
            });
        }

        if (markReviewBtn) {
            markReviewBtn.addEventListener('click', () => {
                const state = QUIZ_DATA.questionStates[currentQuestionIndex];
                state.markedForReview = !state.markedForReview;
                saveCurrentAnswer();
            });
        }

        if (reviewNextBtn) {
            reviewNextBtn.addEventListener('click', () => {
                if (QUIZ_DATA.currentReviewIndex < QUIZ_DATA.reviewQuestionList.length - 1) {
                    showReviewQuestion(QUIZ_DATA.currentReviewIndex + 1);
                }
            });
        }

        if (reviewPrevBtn) {
            reviewPrevBtn.addEventListener('click', () => {
                if (QUIZ_DATA.currentReviewIndex > 0) {
                    showReviewQuestion(QUIZ_DATA.currentReviewIndex - 1);
                }
            });
        }

        console.log('✅ Quiz initialized!');
    }

    function sendAttemptToServer(summary) {
        if (!window.ExamAxisAPI || !ExamAxisAPI.isLoggedIn()) return;
        ExamAxisAPI.saveTestAttempt(summary).catch(err => console.error('Save error:', err));
    }

});