// test-logic.js - COMPLETE FIXED VERSION
// Handles: Images, bilingual format, all answer formats, proper tab filtering

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('testId') || urlParams.get('id');

    // ====== REQUIRE LOGIN ======
    if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    // --- DOM Elements ---
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
    const submitTestFooterBtn = document.getElementById('submit-test-footer-btn');
    const reviewPrevBtn = document.getElementById('review-prev-btn');
    const reviewNextBtn = document.getElementById('review-next-btn');
    const languageSelect = document.querySelector('.language-select');
    
    // Review page elements
    const reviewArea = document.getElementById('review-question-area');
    const reviewQuestionTitle = document.getElementById('review-question-title');
    const reviewQuestionCard = document.getElementById('review-question-card');
    const reviewSolutionText = document.getElementById('review-solution-text');
    const reviewPaletteClean = document.getElementById('review-palette-clean');

    // Tab containers - get from BOTH pages
    const resultTabsContainer = document.querySelector('#result-summary-page .results-header-nav');
    const reviewTabsContainer = document.querySelector('#review-page .results-header-nav');

    // --- GLOBAL STATE ---
    const QUIZ_DATA = {
        questions: [],
        questionStates: [],
        testInfo: null,
        currentLanguage: 'en',
        sectionTimeRemaining: {},
        totalInitialTime: 0,
        reviewQuestionList: [],
        currentReviewIndex: 0,
        isQuizStarted: false,
        isSubmitted: false
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
        if (containsHTML(text)) return text;
        return escapeHtml(text);
    }

    function normalizeString(str) {
        if (str === null || typeof str === 'undefined') return '';
        return String(str)
            .replace(/<[^>]*>/g, '')
            .replace(/[\u20b9₹]/g, '')
            .replace(/m\u00b2/g, 'm^2')
            .replace(/\u00b0/g, 'deg')
            .replace(/√/g, 'sqrt')
            .replace(/\s+/g, '')
            .toLowerCase()
            .trim();
    }

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
                    q.correctAnswer = { en: q.options[idx].en, hi: q.options[idx].hi };
                } else {
                    q.correctAnswer = { en: q.answer, hi: q.answer };
                }
            } else {
                q.correctAnswer = { en: q.answer, hi: q.answer };
            }
        } else if (typeof q.correctIndex === 'number' && q.options[q.correctIndex]) {
            q.correctAnswer = { en: q.options[q.correctIndex].en, hi: q.options[q.correctIndex].hi };
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
        document.body.innerHTML = "<h1>Fatal Error: ALL_TESTS not found.</h1>";
        return;
    }

    const testInfo = ALL_TESTS.find(t => String(t.id) === testId);
    if (!testInfo) {
        document.body.innerHTML = `<h1>Error: Test ID ${testId} not found.</h1>`;
        return;
    }

    QUIZ_DATA.testInfo = testInfo;

    // ====================================================================
    // LOAD QUESTIONS
    // ====================================================================
    let questions = [];

    try {
        console.log(`🔒 Loading questions for: ${testId}`);
        const response = await ExamAxisAPI.getQuestions(testId);
        
        if (response.success && response.data?.questions?.length > 0) {
            questions = response.data.questions;
            console.log(`✅ API: ${questions.length} questions`);
        } else {
            throw new Error('API returned no questions');
        }
    } catch (apiError) {
        console.warn('⚠️ API failed, using local...', apiError.message);
        
        if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
            let rawData = QUESTIONS_DATABASE[testId];
            questions = Array.isArray(rawData) ? rawData : (rawData.questions || []);
            console.log(`✅ Local: ${questions.length} questions`);
        }
    }

    if (!questions.length) {
        document.body.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h1>❌ No questions found for: ${testId}</h1>
                <a href="index.html">Go Back</a>
            </div>`;
        return;
    }

    const singleSubjectName = testInfo.subject || 'General';

    QUIZ_DATA.questions = questions.map((q, index) => ({
        ...normalizeQuestion(q),
        originalIndex: index,
        subject: singleSubjectName,
        sectionQNum: index + 1,
        sectionTotal: questions.length
    }));

    console.log('✅ Normalized:', QUIZ_DATA.questions.length, 'questions');

    // ====================================================================
    // FILTER & REVIEW FUNCTIONS (Defined at top level so they're accessible)
    // ====================================================================
    
    function filterQuestions(category) {
        const cat = category.toLowerCase().trim();
        
        const questionsWithState = QUIZ_DATA.questions.map((q, index) => ({
            ...q,
            index,
            state: QUIZ_DATA.questionStates[index] || {}
        }));

        console.log(`🔍 Filtering by: "${cat}"`);
        console.log(`   Total questions: ${questionsWithState.length}`);
        
        // Debug: show categories
        const categories = {};
        questionsWithState.forEach(item => {
            const rc = item.state.resultCategory || 'undefined';
            categories[rc] = (categories[rc] || 0) + 1;
        });
        console.log('   Categories:', categories);

        switch (cat) {
            case 'all':
                return questionsWithState;
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
                console.warn('Unknown filter:', cat);
                return questionsWithState;
        }
    }

    function showReviewPalette() {
        const reviewPaletteOld = document.getElementById('review-palette');
        
        function fillContainer(container, isCleanStyle) {
            if (!container) return;
            container.innerHTML = '';

            if (QUIZ_DATA.reviewQuestionList.length === 0) {
                container.innerHTML = '<p style="color:#888;text-align:center;">No questions</p>';
                return;
            }

            QUIZ_DATA.reviewQuestionList.forEach((item, index) => {
                const state = item.state || {};
                const btn = document.createElement('button');
                btn.className = isCleanStyle ? 'qp-btn' : 'palette-btn';
                btn.textContent = item.index + 1;
                btn.dataset.index = index;

                if (!isCleanStyle) {
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

        if (!QUIZ_DATA.reviewQuestionList.length || index < 0 || index >= QUIZ_DATA.reviewQuestionList.length) {
            console.warn('Invalid review index:', index);
            return;
        }

        const reviewItem = QUIZ_DATA.reviewQuestionList[index];
        const question = QUIZ_DATA.questions[reviewItem.index];
        const state = QUIZ_DATA.questionStates[reviewItem.index];

        if (!question || !state) {
            console.error('Missing question/state at index:', reviewItem.index);
            return;
        }

        const lang = QUIZ_DATA.currentLanguage;

        // Update title
        if (reviewQuestionTitle) {
            reviewQuestionTitle.textContent = 
                `Reviewing Question ${index + 1} of ${QUIZ_DATA.reviewQuestionList.length} (Q${reviewItem.index + 1})`;
        }

        // Get correct answer
        const correctAnswerText = question.correctAnswer[lang] || question.correctAnswer.en || '';
        const correctAnswerNormalized = normalizeString(correctAnswerText);

        // Build options HTML
        const optionsHtml = question.options.map((optObj, optIdx) => {
            const optionText = optObj[lang] || optObj.en || '';
            const optionValue = optObj.en || optionText;
            const optionNormalized = normalizeString(optionValue);
            
            const isCorrect = optionNormalized === correctAnswerNormalized;
            const userAnswerNormalized = normalizeString(state.userAnswer);
            const isUserChoice = state.userAnswer !== null && optionNormalized === userAnswerNormalized;

            let optionClass = 'review-option';
            let indicators = '';

            if (isCorrect && isUserChoice) {
                optionClass += ' correct correct-user-choice';
                indicators = '<span class="correct-indicator" style="color:#22c55e;margin-left:10px;">✅ Your Answer (Correct!)</span>';
            } else if (isCorrect) {
                optionClass += ' correct';
                indicators = '<span class="correct-indicator" style="color:#22c55e;margin-left:10px;">✅ Correct Answer</span>';
            } else if (isUserChoice) {
                optionClass += ' incorrect';
                indicators = '<span class="user-pick-indicator" style="color:#ef4444;margin-left:10px;">❌ Your Answer (Wrong)</span>';
            }

            const letter = String.fromCharCode(65 + optIdx);

            return `
                <div class="${optionClass}" style="padding:12px;margin:8px 0;border-radius:8px;background:${isCorrect ? 'rgba(34,197,94,0.15)' : isUserChoice ? 'rgba(239,68,68,0.15)' : '#f8f9fa'};border:2px solid ${isCorrect ? '#22c55e' : isUserChoice ? '#ef4444' : '#e5e7eb'};">
                    <div style="display:flex;align-items:center;flex-wrap:wrap;">
                        <span style="font-weight:bold;margin-right:8px;">${letter}.</span>
                        <span>${safeRender(optionText)}</span>
                        ${indicators}
                    </div>
                </div>
            `;
        }).join('');

        // Question text
        const questionText = question.question[lang] || question.question.en || '';
        
        // Explanation
        const explanationText = question.explanation[lang] || question.explanation.en || '';

        // Status note
        let statusNote = '';
        if (state.userAnswer === null) {
            statusNote = '<p style="color:#f59e0b;margin-top:15px;font-weight:bold;padding:10px;background:rgba(245,158,11,0.1);border-radius:8px;">⚠️ This question was NOT ATTEMPTED. The correct answer is highlighted in green above.</p>';
        }

        // Update review card
        if (reviewQuestionCard) {
            reviewQuestionCard.innerHTML = `
                <div style="font-size:16px;line-height:1.6;margin-bottom:20px;">
                    <strong>Q${reviewItem.index + 1}.</strong> ${safeRender(questionText)}
                </div>
                <div class="options-container">${optionsHtml}</div>
                ${statusNote}
            `;
        }

        // Update solution
        if (reviewSolutionText) {
            reviewSolutionText.innerHTML = explanationText 
                ? safeRender(explanationText) 
                : '<em style="color:#888;">No explanation available.</em>';
        }

        // Fallback for older HTML structure
        if (reviewArea && !reviewQuestionCard) {
            reviewArea.innerHTML = `
                <div style="font-size:16px;line-height:1.6;margin-bottom:20px;">
                    <strong>Q${reviewItem.index + 1}.</strong> ${safeRender(questionText)}
                </div>
                <div class="options-container">${optionsHtml}</div>
                ${statusNote}
                <div style="margin-top:20px;padding:15px;background:#f0fdf4;border-radius:8px;">
                    <strong>Solution:</strong>
                    <p>${safeRender(explanationText) || 'No explanation available.'}</p>
                </div>
            `;
        }

        // MathJax
        if (window.MathJax) {
            try { window.MathJax.typeset(); } catch (e) {}
        }

        // Update nav buttons
        if (reviewPrevBtn) reviewPrevBtn.disabled = index === 0;
        if (reviewNextBtn) reviewNextBtn.disabled = index === QUIZ_DATA.reviewQuestionList.length - 1;

        showReviewPalette();
    }

    function handleTabClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedTab = e.target;
        if (clickedTab.tagName !== 'A') return;
        
        const category = clickedTab.textContent.toLowerCase().trim();
        console.log(`📑 Tab clicked: "${category}"`);

        // Update active state on BOTH nav containers
        [resultTabsContainer, reviewTabsContainer].forEach(container => {
            if (container) {
                container.querySelectorAll('a').forEach(a => {
                    a.classList.remove('active');
                    if (a.textContent.toLowerCase().trim() === category) {
                        a.classList.add('active');
                    }
                });
            }
        });

        // Handle Overview tab
        if (category === 'overview') {
            if (reviewPage) reviewPage.classList.add('hidden');
            if (resultSummaryPage) resultSummaryPage.classList.remove('hidden');
            return;
        }

        // Filter questions for the selected category
        QUIZ_DATA.reviewQuestionList = filterQuestions(category);
        console.log(`📋 Found ${QUIZ_DATA.reviewQuestionList.length} questions for "${category}"`);

        // Switch to review page
        if (resultSummaryPage) resultSummaryPage.classList.add('hidden');
        if (reviewPage) reviewPage.classList.remove('hidden');

        // Show questions or empty message
        if (QUIZ_DATA.reviewQuestionList.length > 0) {
            showReviewQuestion(0);
        } else {
            const emptyMsg = `
                <div style="text-align:center;padding:60px 20px;color:#666;">
                    <div style="font-size:48px;margin-bottom:20px;">📭</div>
                    <h3 style="margin-bottom:10px;">No questions found</h3>
                    <p>There are no "${category}" questions to display.</p>
                </div>
            `;
            
            if (reviewQuestionCard) reviewQuestionCard.innerHTML = emptyMsg;
            if (reviewArea) reviewArea.innerHTML = emptyMsg;
            if (reviewQuestionTitle) reviewQuestionTitle.textContent = 'Reviewing Question 0 of 0';
            if (reviewPrevBtn) reviewPrevBtn.disabled = true;
            if (reviewNextBtn) reviewNextBtn.disabled = true;
            
            const rpOld = document.getElementById('review-palette');
            if (rpOld) rpOld.innerHTML = '';
            if (reviewPaletteClean) reviewPaletteClean.innerHTML = '';
        }
    }

    // Bind tabs immediately (they exist in HTML already)
    function bindTabHandlers() {
        [resultTabsContainer, reviewTabsContainer].forEach(container => {
            if (container) {
                container.querySelectorAll('a').forEach(tab => {
                    // Remove existing to prevent duplicates
                    tab.removeEventListener('click', handleTabClick);
                    tab.addEventListener('click', handleTabClick);
                });
            }
        });
        console.log('✅ Tab handlers bound');
    }

    // Bind review navigation
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

    // ====================================================================
    // SHOW INSTRUCTIONS & START BUTTON
    // ====================================================================
    if (instructionsModal) instructionsModal.classList.remove('hidden');
    if (quizUI) quizUI.classList.add('hidden');
    if (resultSummaryPage) resultSummaryPage.classList.add('hidden');
    if (reviewPage) reviewPage.classList.add('hidden');

    // Remove ALL existing click handlers from start button
    if (startTestBtn) {
        const newBtn = startTestBtn.cloneNode(true);
        startTestBtn.parentNode.replaceChild(newBtn, startTestBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (QUIZ_DATA.isQuizStarted) {
                console.log('Quiz already started');
                return;
            }
            
            QUIZ_DATA.isQuizStarted = true;
            console.log('🚀 Starting quiz...');
            
            if (instructionsModal) instructionsModal.classList.add('hidden');
            if (quizUI) quizUI.classList.remove('hidden');
            
            initializeQuiz();
        });
        
        console.log('✅ Start button ready');
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

        const subjects = [...new Set(questions.map(q => q.subject))];
        subjects.forEach(subj => {
            QUIZ_DATA.sectionTimeRemaining[subj] = testDuration * 60;
            QUIZ_DATA.totalInitialTime += testDuration * 60;
        });

        console.log(`⏱️ Duration: ${testDuration} min`);

        // Language
        if (languageSelect) {
            languageSelect.value = QUIZ_DATA.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                QUIZ_DATA.currentLanguage = e.target.value;
                showQuestion(currentQuestionIndex);
            });
        }

        // Title
        const titleEl = document.getElementById('test-main-title');
        if (titleEl) {
            titleEl.innerHTML = `${QUIZ_DATA.testInfo.date || ''} - ${QUIZ_DATA.testInfo.title || 'Test'}`;
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

        // ========== TIMER ==========
        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            
            timerInterval = setInterval(() => {
                if (isPaused) return;
                
                const subj = questions[currentQuestionIndex].subject;
                if (QUIZ_DATA.sectionTimeRemaining[subj] > 0) {
                    QUIZ_DATA.sectionTimeRemaining[subj]--;
                    const t = QUIZ_DATA.sectionTimeRemaining[subj];
                    const m = Math.floor(t / 60);
                    const s = t % 60;
                    if (timerEl) {
                        timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                    }
                } else {
                    clearInterval(timerInterval);
                    alert(`Time's up for ${subj}!`);
                    calculateAndShowResults();
                }
            }, 1000);
        }

        // ========== PAUSE/RESUME ==========
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                isPaused = true;
                if (pauseOverlay) pauseOverlay.classList.remove('hidden');
            });
        }
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                isPaused = false;
                if (pauseOverlay) pauseOverlay.classList.add('hidden');
            });
        }

        // ========== SUBMIT MODAL ==========
        function showSubmitModal() {
            const answered = QUIZ_DATA.questionStates.filter(s => s.userAnswer !== null).length;
            const marked = QUIZ_DATA.questionStates.filter(s => s.markedForReview).length;
            
            if (submissionStatsEl) {
                submissionStatsEl.innerHTML = `
                    <div>Answered: <strong>${answered} / ${questions.length}</strong></div>
                    <div>Not Answered: <strong>${questions.length - answered} / ${questions.length}</strong></div>
                    <div>Marked for Review: <strong>${marked}</strong></div>
                `;
            }
            if (submitSummaryModal) submitSummaryModal.classList.remove('hidden');
        }

        if (submitTestBtn) submitTestBtn.addEventListener('click', showSubmitModal);
        if (submitTestFooterBtn) submitTestFooterBtn.addEventListener('click', showSubmitModal);
        
        if (cancelSubmitBtn) {
            cancelSubmitBtn.addEventListener('click', () => {
                if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
            });
        }

        // IMPORTANT: Final submit - calculate results FIRST
        if (finalSubmitBtn) {
            // Remove all existing handlers
            const newFinalBtn = finalSubmitBtn.cloneNode(true);
            finalSubmitBtn.parentNode.replaceChild(newFinalBtn, finalSubmitBtn);
            
            newFinalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (QUIZ_DATA.isSubmitted) return;
                QUIZ_DATA.isSubmitted = true;
                
                if (submitSummaryModal) submitSummaryModal.classList.add('hidden');
                calculateAndShowResults();
            });
        }

        // ========== CALCULATE RESULTS ==========
        function calculateAndShowResults() {
            clearInterval(timerInterval);
            console.log('📊 Calculating results...');

            let totalRemaining = 0;
            for (let subj in QUIZ_DATA.sectionTimeRemaining) {
                totalRemaining += QUIZ_DATA.sectionTimeRemaining[subj];
            }
            const timeTakenSeconds = QUIZ_DATA.totalInitialTime - totalRemaining;
            const timeTakenMin = Math.floor(timeTakenSeconds / 60);
            const timeTakenSec = timeTakenSeconds % 60;

            let correct = 0, incorrect = 0, unattempted = 0, score = 0;

            QUIZ_DATA.questionStates.forEach((state, idx) => {
                const q = questions[idx];
                const correctText = q.correctAnswer.en || '';
                const correctNorm = normalizeString(correctText);

                if (state.userAnswer !== null) {
                    const userNorm = normalizeString(state.userAnswer);
                    
                    if (userNorm === correctNorm) {
                        correct++;
                        score += 2;
                        state.resultCategory = 'correct';
                    } else {
                        incorrect++;
                        score -= 0.5;
                        state.resultCategory = 'incorrect';
                    }
                } else {
                    unattempted++;
                    state.resultCategory = 'unattempted';
                }
            });

            console.log(`✅ Results: Correct=${correct}, Incorrect=${incorrect}, Unattempted=${unattempted}`);

            const attempted = correct + incorrect;
            const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

            // Initialize review list
            QUIZ_DATA.reviewQuestionList = filterQuestions('all');

            // Build results UI
            const reviewButtonArea = document.getElementById('review-button-area');
            if (reviewButtonArea) {
                reviewButtonArea.innerHTML = `
                    <div class="test-details" style="margin-bottom:20px;">
                        <h3>${QUIZ_DATA.testInfo.title || 'Test'}</h3>
                        <p>Total Questions: ${questions.length} | Max Marks: ${questions.length * 2}</p>
                    </div>
                    <div class="action-buttons" style="display:flex;gap:10px;flex-wrap:wrap;">
                        <button id="review-test-btn" class="btn primary" style="background:#6366f1;color:white;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;">📝 Review Test</button>
                        <a href="index.html" class="btn secondary" style="background:#e5e7eb;color:#374151;padding:12px 24px;border-radius:8px;text-decoration:none;">🏠 Go to Tests</a>
                    </div>
                `;
            }

            const statsArea = document.getElementById('stats-cards-area');
            if (statsArea) {
                statsArea.innerHTML = `
                    <div class="stats-grid-container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:15px;margin-top:20px;">
                        <div class="stat-card" style="background:#f0fdf4;padding:20px;border-radius:12px;text-align:center;">
                            <div class="stat-value" style="font-size:28px;font-weight:bold;color:#166534;">${score.toFixed(1)}</div>
                            <div class="stat-name" style="color:#666;margin-top:5px;">Score</div>
                        </div>
                        <div class="stat-card" style="background:#f0fdf4;padding:20px;border-radius:12px;text-align:center;">
                            <div class="stat-value" style="font-size:28px;font-weight:bold;color:#22c55e;">${correct}</div>
                            <div class="stat-name" style="color:#666;margin-top:5px;">Correct</div>
                        </div>
                        <div class="stat-card" style="background:#fef2f2;padding:20px;border-radius:12px;text-align:center;">
                            <div class="stat-value" style="font-size:28px;font-weight:bold;color:#ef4444;">${incorrect}</div>
                            <div class="stat-name" style="color:#666;margin-top:5px;">Incorrect</div>
                        </div>
                        <div class="stat-card" style="background:#fefce8;padding:20px;border-radius:12px;text-align:center;">
                            <div class="stat-value" style="font-size:28px;font-weight:bold;color:#ca8a04;">${unattempted}</div>
                            <div class="stat-name" style="color:#666;margin-top:5px;">Unattempted</div>
                        </div>
                        <div class="stat-card" style="background:#f8fafc;padding:20px;border-radius:12px;text-align:center;">
                            <div class="stat-value" style="font-size:28px;font-weight:bold;color:#475569;">${String(timeTakenMin).padStart(2,'0')}:${String(timeTakenSec).padStart(2,'0')}</div>
                            <div class="stat-name" style="color:#666;margin-top:5px;">Time</div>
                        </div>
                        <div class="stat-card" style="background:#eff6ff;padding:20px;border-radius:12px;text-align:center;">
                            <div class="stat-value" style="font-size:28px;font-weight:bold;color:#3b82f6;">${accuracy.toFixed(1)}%</div>
                            <div class="stat-name" style="color:#666;margin-top:5px;">Accuracy</div>
                        </div>
                    </div>
                `;
            }

            // Bind review button
            setTimeout(() => {
                const reviewBtn = document.getElementById('review-test-btn');
                if (reviewBtn) {
                    reviewBtn.addEventListener('click', () => {
                        // Click "All" tab
                        const allTab = resultTabsContainer?.querySelector('a:nth-child(2)');
                        if (allTab) {
                            handleTabClick({ preventDefault: () => {}, stopPropagation: () => {}, target: allTab });
                        }
                    });
                }
            }, 100);

            // Bind tabs
            bindTabHandlers();

            // Send to server
            sendAttemptToServer({
                testId: QUIZ_DATA.testInfo.id || testId,
                testTitle: QUIZ_DATA.testInfo.title,
                subject: singleSubjectName,
                totalQuestions: questions.length,
                correct, incorrect, unattempted,
                score: Number(score.toFixed(2)),
                maxScore: questions.length * 2,
                accuracy: Number(accuracy.toFixed(1)),
                timeTakenMinutes: timeTakenMin
            });

            // Show results page
            if (quizUI) quizUI.classList.add('hidden');
            if (resultSummaryPage) resultSummaryPage.classList.remove('hidden');
            
            document.body.classList.add('results-scroll');
        }

        // ========== PALETTE ==========
        function createPalette() {
            if (!questionPalette) return;
            questionPalette.innerHTML = '';
            
            questions.forEach((_, idx) => {
                const btn = document.createElement('button');
                btn.className = 'palette-btn not-visited';
                btn.textContent = idx + 1;
                btn.addEventListener('click', () => {
                    saveCurrentAnswer();
                    showQuestion(idx);
                });
                questionPalette.appendChild(btn);
            });
        }

        function updatePalette() {
            const btns = questionPalette?.querySelectorAll('.palette-btn');
            if (!btns) return;
            
            btns.forEach((btn, idx) => {
                const state = QUIZ_DATA.questionStates[idx];
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

                if (idx === currentQuestionIndex) btn.classList.add('current');
            });
        }

        // ========== SHOW QUESTION ==========
        function showQuestion(index) {
            if (index < 0 || index >= questions.length) return;

            currentQuestionIndex = index;
            const q = questions[index];
            const state = QUIZ_DATA.questionStates[index];
            const lang = QUIZ_DATA.currentLanguage;

            if (state.status === 'not-visited') state.status = 'not-answered';

            if (questionTitle) {
                questionTitle.textContent = `${q.subject} | Q${index + 1} of ${questions.length}`;
            }

            const qText = q.question[lang] || q.question.en || '';

            const optionsHtml = q.options.map((opt, i) => {
                const optText = opt[lang] || opt.en || '';
                const optValue = opt.en || optText;
                const checked = state.userAnswer === optValue ? 'checked' : '';
                const letter = String.fromCharCode(65 + i);
                
                return `
                    <label class="option" style="display:flex;align-items:center;padding:12px;margin:8px 0;background:#f8f9fa;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all 0.2s;">
                        <input type="radio" name="option" value="${escapeHtml(optValue)}" ${checked} style="margin-right:12px;">
                        <span style="font-weight:bold;margin-right:8px;">${letter}.</span>
                        <span>${safeRender(optText)}</span>
                    </label>
                `;
            }).join('');

            if (questionArea) {
                questionArea.innerHTML = `
                    <div style="font-size:17px;line-height:1.6;margin-bottom:20px;">
                        <strong>Q${index + 1}.</strong> ${safeRender(qText)}
                    </div>
                    <div class="options-container">${optionsHtml}</div>
                `;
            }

            if (window.MathJax) {
                try { window.MathJax.typeset(); } catch(e) {}
            }

            updateNavigation();
            updatePalette();
        }

        function updateNavigation() {
            if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
            if (nextBtn) {
                nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Save & Next';
            }
        }

        function saveCurrentAnswer() {
            const selected = document.querySelector('input[name="option"]:checked');
            const state = QUIZ_DATA.questionStates[currentQuestionIndex];
            
            if (selected) {
                state.userAnswer = selected.value;
                if (!state.markedForReview) state.status = 'answered';
            } else {
                state.userAnswer = null;
                if (!state.markedForReview) state.status = 'not-answered';
            }
            updatePalette();
        }

        // ========== NAVIGATION BUTTONS ==========
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                saveCurrentAnswer();
                if (currentQuestionIndex < questions.length - 1) {
                    showQuestion(currentQuestionIndex + 1);
                } else {
                    showSubmitModal();
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
                
                // Auto-advance
                if (currentQuestionIndex < questions.length - 1) {
                    showQuestion(currentQuestionIndex + 1);
                }
            });
        }

        if (clearResponseBtn) {
            clearResponseBtn.addEventListener('click', () => {
                const state = QUIZ_DATA.questionStates[currentQuestionIndex];
                state.userAnswer = null;
                state.status = 'not-answered';
                document.querySelectorAll('input[name="option"]:checked').forEach(r => r.checked = false);
                updatePalette();
            });
        }

        console.log('✅ Quiz initialized!');
    }

    function sendAttemptToServer(summary) {
        if (!window.ExamAxisAPI || !ExamAxisAPI.isLoggedIn()) return;
        ExamAxisAPI.saveTestAttempt(summary).catch(err => console.error('Save error:', err));
    }

});