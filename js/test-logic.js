// test-logic.js - COMPLETE FIXED VERSION v2
(function() {
    'use strict';
    
    // Global state
    window.QUIZ_DATA = {
        questions: [],
        questionStates: [],
        testInfo: null,
        currentLanguage: 'en',
        sectionTimeRemaining: {},
        totalInitialTime: 0,
        reviewQuestionList: [],
        currentReviewIndex: 0,
        currentQuestionIndex: 0,
        isQuizStarted: false,
        isSubmitted: false,
        timerInterval: null,
        isPaused: false
    };

    document.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('testId') || urlParams.get('id');

        // Login check
        if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        // DOM helpers
        const $ = id => document.getElementById(id);
        const $q = sel => document.querySelector(sel);
        
        // DOM Elements
        const instructionsModal = $('instructions-modal');
        const quizUI = $('quiz-ui');
        const resultSummaryPage = $('result-summary-page');
        const reviewPage = $('review-page');
        const timerEl = $('timer');
        const pauseBtn = $('pause-btn');
        const pauseOverlay = $('pause-overlay');
        const resumeBtn = $('resume-btn');
        const submitSummaryModal = $('submit-summary-modal');
        const submissionStatsEl = $('submission-stats');
        const finalSubmitBtn = $('final-submit-btn');
        const cancelSubmitBtn = $('cancel-submit-btn');
        const questionArea = $('question-area');
        const questionTitle = $('question-title');
        const questionPalette = $('question-palette');
        const prevBtn = $('prev-btn');
        const nextBtn = $('next-btn');
        const markReviewBtn = $('mark-review-btn');
        const clearResponseBtn = $('clear-response-btn');
        const submitTestBtn = $('submit-test-btn');
        const submitTestFooterBtn = $('submit-test-footer-btn');
        const reviewPrevBtn = $('review-prev-btn');
        const reviewNextBtn = $('review-next-btn');
        const languageSelect = $q('.language-select');
        const reviewQuestionTitle = $('review-question-title');
        const reviewQuestionCard = $('review-question-card');
        const reviewSolutionText = $('review-solution-text');
        const reviewPaletteClean = $('review-palette-clean');
        const resultTabsContainer = $q('#result-summary-page .results-header-nav');
        const reviewTabsContainer = $q('#review-page .results-header-nav');

        // ========== UTILITIES ==========
        function containsHTML(str) {
            return str && /<[a-z][\s\S]*>/i.test(str);
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = String(text);
            return div.innerHTML;
        }

        function safeRender(text) {
            if (!text) return '';
            return containsHTML(String(text)) ? String(text) : escapeHtml(text);
        }

        function normalizeString(str) {
            if (!str) return '';
            return String(str)
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, '')
                .toLowerCase()
                .trim();
        }

        function normalizeQuestion(raw) {
            if (!raw || raw._normalized) return raw;
            const q = { ...raw };

            // Question
            if (typeof q.question === 'string') {
                q.question = { en: q.question, hi: q.question };
            } else {
                q.question = { 
                    en: q.question?.en || '', 
                    hi: q.question?.hi || q.question?.en || '' 
                };
            }

            // Options
            q.options = (q.options || []).map((opt, i) => {
                if (typeof opt === 'string') return { en: opt, hi: opt, index: i };
                return { 
                    en: opt?.en || '', 
                    hi: opt?.hi || opt?.en || '', 
                    index: i 
                };
            });

            // Correct Answer
            if (typeof q.correctAnswer === 'string') {
                q.correctAnswer = { en: q.correctAnswer, hi: q.correctAnswer };
            } else if (q.correctAnswer?.en) {
                q.correctAnswer = { 
                    en: q.correctAnswer.en, 
                    hi: q.correctAnswer.hi || q.correctAnswer.en 
                };
            } else if (typeof q.answer === 'string') {
                const letter = q.answer.trim().toUpperCase();
                if (letter.length === 1 && letter >= 'A' && letter <= 'D') {
                    const idx = letter.charCodeAt(0) - 65;
                    if (q.options[idx]) {
                        q.correctAnswer = { en: q.options[idx].en, hi: q.options[idx].hi };
                    } else {
                        q.correctAnswer = { en: '', hi: '' };
                    }
                } else {
                    q.correctAnswer = { en: q.answer, hi: q.answer };
                }
            } else {
                q.correctAnswer = { en: '', hi: '' };
            }

            // Explanation
            if (typeof q.explanation === 'string') {
                q.explanation = { en: q.explanation, hi: q.explanation };
            } else {
                q.explanation = { 
                    en: q.explanation?.en || '', 
                    hi: q.explanation?.hi || q.explanation?.en || '' 
                };
            }

            q._normalized = true;
            return q;
        }

        // ========== VALIDATION ==========
        if (!testId) {
            document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Error: Test ID not specified.</h1><a href="index.html">Go Back</a></div>';
            return;
        }

        if (typeof ALL_TESTS === 'undefined') {
            document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Error: ALL_TESTS not found.</h1></div>';
            return;
        }

        const testInfo = ALL_TESTS.find(t => String(t.id) === testId);
        if (!testInfo) {
            document.body.innerHTML = `<div style="text-align:center;padding:50px;"><h1>Error: Test "${testId}" not found.</h1><a href="index.html">Go Back</a></div>`;
            return;
        }

        window.QUIZ_DATA.testInfo = testInfo;

        // ========== LOAD QUESTIONS ==========
        let questions = [];
        
        try {
            const response = await ExamAxisAPI.getQuestions(testId);
            if (response?.success && response?.data?.questions?.length) {
                questions = response.data.questions;
                console.log('✅ API:', questions.length, 'questions');
            } else {
                throw new Error('No API questions');
            }
        } catch (e) {
            console.warn('⚠️ API failed:', e.message);
            if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
                const raw = QUESTIONS_DATABASE[testId];
                questions = Array.isArray(raw) ? raw : (raw.questions || []);
                console.log('✅ Local:', questions.length, 'questions');
            }
        }

        if (!questions.length) {
            document.body.innerHTML = `<div style="text-align:center;padding:50px;"><h1>No questions found for: ${testId}</h1><a href="index.html">Go Back</a></div>`;
            return;
        }

        const subjectName = testInfo.subject || 'General';
        
        window.QUIZ_DATA.questions = questions.map((q, i) => ({
            ...normalizeQuestion(q),
            originalIndex: i,
            subject: subjectName
        }));

        console.log('✅ Loaded', window.QUIZ_DATA.questions.length, 'questions');
        console.log('📋 Sample question:', window.QUIZ_DATA.questions[0]);

        // ========== FILTER FUNCTION ==========
        function filterQuestions(category) {
            const cat = category.toLowerCase().trim();
            const QD = window.QUIZ_DATA;
            
            console.log('🔍 Filtering by:', cat);
            
            const all = QD.questions.map((q, i) => ({
                ...q,
                index: i,
                state: QD.questionStates[i]
            }));

            let result;
            switch(cat) {
                case 'all':
                    result = all;
                    break;
                case 'overview':
                    result = all;
                    break;
                case 'correct':
                    result = all.filter(x => x.state && x.state.resultCategory === 'correct');
                    break;
                case 'incorrect':
                    result = all.filter(x => x.state && x.state.resultCategory === 'incorrect');
                    break;
                case 'unattempted':
                    result = all.filter(x => x.state && x.state.resultCategory === 'unattempted');
                    break;
                case 'marked for review':
                    result = all.filter(x => x.state && x.state.markedForReview);
                    break;
                default:
                    result = all;
            }
            
            console.log('📋 Found:', result.length, 'questions for', cat);
            return result;
        }

        // ========== SHOW REVIEW QUESTION ==========
        function showReviewQuestion(index) {
            const QD = window.QUIZ_DATA;
            QD.currentReviewIndex = index;

            if (!QD.reviewQuestionList.length || index < 0 || index >= QD.reviewQuestionList.length) {
                console.warn('Invalid review index:', index);
                return;
            }

            const item = QD.reviewQuestionList[index];
            const q = QD.questions[item.index];
            const state = QD.questionStates[item.index];
            const lang = QD.currentLanguage;

            console.log('📖 Showing review Q' + (item.index + 1), {
                correctAnswer: q.correctAnswer,
                userAnswer: state.userAnswer,
                resultCategory: state.resultCategory
            });

            if (reviewQuestionTitle) {
                reviewQuestionTitle.textContent = `Reviewing Question ${index + 1} of ${QD.reviewQuestionList.length} (Q${item.index + 1})`;
            }

            // Get correct answer
            const correctText = q.correctAnswer[lang] || q.correctAnswer.en || '';
            const correctNorm = normalizeString(correctText);

            console.log('✓ Correct answer:', correctText, '| Normalized:', correctNorm);

            // Build options HTML
            let optionsHTML = '';
            
            q.options.forEach((opt, i) => {
                const optText = opt[lang] || opt.en || '';
                const optValue = opt.en || optText;
                const optNorm = normalizeString(optValue);
                
                const isCorrect = correctNorm !== '' && optNorm === correctNorm;
                const userAnswerNorm = state.userAnswer ? normalizeString(state.userAnswer) : '';
                const isUser = userAnswerNorm !== '' && optNorm === userAnswerNorm;
                
                const letter = String.fromCharCode(65 + i);

                console.log(`   ${letter}. "${optText.substring(0, 30)}..." | isCorrect:${isCorrect} | isUser:${isUser}`);

                // Colors
                let bgColor = '#f9fafb';
                let borderColor = '#e5e7eb';
                
                if (isCorrect) {
                    bgColor = '#dcfce7';
                    borderColor = '#22c55e';
                }
                if (isUser && !isCorrect) {
                    bgColor = '#fee2e2';
                    borderColor = '#ef4444';
                }

                // Indicator
                let indicator = '';
                if (isCorrect && isUser) {
                    indicator = '<span style="margin-left: 12px; color: #16a34a; font-weight: 600;">✓ Your Answer (Correct!)</span>';
                } else if (isCorrect) {
                    indicator = '<span style="margin-left: 12px; color: #16a34a; font-weight: 600;">✓ Correct Answer</span>';
                } else if (isUser) {
                    indicator = '<span style="margin-left: 12px; color: #dc2626; font-weight: 600;">✗ Your Answer (Wrong)</span>';
                }

                optionsHTML += `
                    <div style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; padding: 14px 16px; margin: 0 0 12px 0;">
                        <span style="font-weight: 700; margin-right: 10px;">${letter}.</span><span>${safeRender(optText)}</span>${indicator}
                    </div>
                `;
            });

            // Question text
            const qText = q.question[lang] || q.question.en || '';
            
            // Status note
            let statusNote = '';
            if (state.userAnswer === null) {
                statusNote = `
                    <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin-top: 16px; color: #92400e; font-weight: 500;">
                        ⚠️ This question was NOT ATTEMPTED. The correct answer is highlighted in green above.
                    </div>
                `;
            }

            // Update card
            if (reviewQuestionCard) {
                reviewQuestionCard.innerHTML = `
                    <div style="font-size: 17px; line-height: 1.7; margin-bottom: 20px;">
                        <span style="font-weight: 700; color: #4f46e5;">Q${item.index + 1}.</span> ${safeRender(qText)}
                    </div>
                    <div style="margin-top: 16px;">
                        ${optionsHTML}
                    </div>
                    ${statusNote}
                `;
            }

            // Explanation
            const explText = q.explanation[lang] || q.explanation.en || '';
            if (reviewSolutionText) {
                reviewSolutionText.innerHTML = explText 
                    ? safeRender(explText) 
                    : '<em style="color: #9ca3af;">No explanation available.</em>';
            }

            // Palette
            if (reviewPaletteClean) {
                reviewPaletteClean.innerHTML = '';
                QD.reviewQuestionList.forEach((it, idx) => {
                    const st = QD.questionStates[it.index];
                    const btn = document.createElement('button');
                    btn.textContent = it.index + 1;
                    
                    let bg = '#fbbf24';
                    if (st.resultCategory === 'correct') bg = '#22c55e';
                    else if (st.resultCategory === 'incorrect') bg = '#ef4444';
                    
                    btn.style.cssText = `
                        width: 40px; height: 40px; margin: 4px;
                        border: none; border-radius: 8px;
                        background: ${bg}; color: white;
                        font-weight: 700; cursor: pointer;
                        ${idx === QD.currentReviewIndex ? 'box-shadow: 0 0 0 3px #4f46e5;' : ''}
                    `;
                    
                    btn.onclick = () => showReviewQuestion(idx);
                    reviewPaletteClean.appendChild(btn);
                });
            }

            if (reviewPrevBtn) reviewPrevBtn.disabled = index === 0;
            if (reviewNextBtn) reviewNextBtn.disabled = index >= QD.reviewQuestionList.length - 1;

            if (window.MathJax) try { MathJax.typeset(); } catch(e) {}
        }

        // ========== TAB CLICK ==========
        function handleTabClick(e) {
            e.preventDefault();
            const tab = e.target;
            if (tab.tagName !== 'A') return;

            const category = tab.textContent.toLowerCase().trim();
            console.log('📑 Tab clicked:', category);

            // Update active
            [resultTabsContainer, reviewTabsContainer].forEach(nav => {
                if (nav) {
                    nav.querySelectorAll('a').forEach(a => {
                        a.classList.toggle('active', a.textContent.toLowerCase().trim() === category);
                    });
                }
            });

            if (category === 'overview') {
                reviewPage?.classList.add('hidden');
                resultSummaryPage?.classList.remove('hidden');
                return;
            }

            window.QUIZ_DATA.reviewQuestionList = filterQuestions(category);

            resultSummaryPage?.classList.add('hidden');
            reviewPage?.classList.remove('hidden');

            if (window.QUIZ_DATA.reviewQuestionList.length > 0) {
                showReviewQuestion(0);
            } else {
                if (reviewQuestionCard) {
                    reviewQuestionCard.innerHTML = `
                        <div style="text-align: center; padding: 60px; color: #6b7280;">
                            <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
                            <h3 style="margin-bottom: 10px;">No Questions Found</h3>
                            <p>There are no "${category}" questions to display.</p>
                        </div>
                    `;
                }
                if (reviewQuestionTitle) reviewQuestionTitle.textContent = 'Reviewing Question 0 of 0';
                if (reviewPaletteClean) reviewPaletteClean.innerHTML = '';
            }
        }

        function bindTabs() {
            [resultTabsContainer, reviewTabsContainer].forEach(nav => {
                if (nav) {
                    nav.querySelectorAll('a').forEach(tab => {
                        tab.onclick = handleTabClick;
                    });
                }
            });
            console.log('✅ Tabs bound');
        }

        // Review nav
        if (reviewPrevBtn) {
            reviewPrevBtn.onclick = () => {
                if (window.QUIZ_DATA.currentReviewIndex > 0) {
                    showReviewQuestion(window.QUIZ_DATA.currentReviewIndex - 1);
                }
            };
        }
        if (reviewNextBtn) {
            reviewNextBtn.onclick = () => {
                if (window.QUIZ_DATA.currentReviewIndex < window.QUIZ_DATA.reviewQuestionList.length - 1) {
                    showReviewQuestion(window.QUIZ_DATA.currentReviewIndex + 1);
                }
            };
        }

        // ========== INITIAL UI STATE ==========
        instructionsModal?.classList.remove('hidden');
        quizUI?.classList.add('hidden');
        resultSummaryPage?.classList.add('hidden');
        reviewPage?.classList.add('hidden');

        // ========== START BUTTON ==========
        const startBtn = $('start-test-btn');
        if (startBtn) {
            const newBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newBtn, startBtn);
            
            newBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (window.QUIZ_DATA.isQuizStarted) return;
                window.QUIZ_DATA.isQuizStarted = true;
                
                console.log('🚀 Starting quiz...');
                instructionsModal?.classList.add('hidden');
                quizUI?.classList.remove('hidden');
                initQuiz();
            };
        }

        // ========== INIT QUIZ ==========
        function initQuiz() {
            const QD = window.QUIZ_DATA;
            const questions = QD.questions;
            const duration = QD.testInfo.duration || 25;

            // Timer
            QD.sectionTimeRemaining = {};
            QD.totalInitialTime = 0;
            const subjects = [...new Set(questions.map(q => q.subject))];
            subjects.forEach(s => {
                QD.sectionTimeRemaining[s] = duration * 60;
                QD.totalInitialTime += duration * 60;
            });

            // States
            QD.questionStates = questions.map(() => ({
                status: 'not-visited',
                userAnswer: null,
                markedForReview: false,
                resultCategory: null
            }));

            // Language
            if (languageSelect) {
                languageSelect.value = QD.currentLanguage;
                languageSelect.onchange = (e) => {
                    QD.currentLanguage = e.target.value;
                    showQuestion(QD.currentQuestionIndex);
                };
            }

            // Title
            const titleEl = $('test-main-title');
            if (titleEl) titleEl.textContent = `${QD.testInfo.date || ''} - ${QD.testInfo.title || 'Test'}`;

            createPalette();
            showQuestion(0);
            startTimer();

            // Timer
            function startTimer() {
                if (QD.timerInterval) clearInterval(QD.timerInterval);
                
                QD.timerInterval = setInterval(() => {
                    if (QD.isPaused) return;
                    
                    const subj = questions[QD.currentQuestionIndex].subject;
                    if (QD.sectionTimeRemaining[subj] > 0) {
                        QD.sectionTimeRemaining[subj]--;
                        const t = QD.sectionTimeRemaining[subj];
                        if (timerEl) {
                            timerEl.textContent = `${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`;
                        }
                    } else {
                        clearInterval(QD.timerInterval);
                        alert('Time is up!');
                        submitQuiz();
                    }
                }, 1000);
            }

            // Pause/Resume
            if (pauseBtn) {
                pauseBtn.onclick = () => {
                    QD.isPaused = true;
                    pauseOverlay?.classList.remove('hidden');
                };
            }
            if (resumeBtn) {
                resumeBtn.onclick = () => {
                    QD.isPaused = false;
                    pauseOverlay?.classList.add('hidden');
                };
            }

            // Submit modal
            function showSubmitModal() {
                const answered = QD.questionStates.filter(s => s.userAnswer !== null).length;
                if (submissionStatsEl) {
                    submissionStatsEl.innerHTML = `
                        <div style="margin: 10px 0;">Answered: <strong>${answered} / ${questions.length}</strong></div>
                        <div style="margin: 10px 0;">Unanswered: <strong>${questions.length - answered} / ${questions.length}</strong></div>
                    `;
                }
                submitSummaryModal?.classList.remove('hidden');
            }

            if (submitTestBtn) submitTestBtn.onclick = showSubmitModal;
            if (submitTestFooterBtn) submitTestFooterBtn.onclick = showSubmitModal;
            if (cancelSubmitBtn) cancelSubmitBtn.onclick = () => submitSummaryModal?.classList.add('hidden');

            // Final submit
            if (finalSubmitBtn) {
                const newFinal = finalSubmitBtn.cloneNode(true);
                finalSubmitBtn.parentNode.replaceChild(newFinal, finalSubmitBtn);
                newFinal.onclick = (e) => {
                    e.preventDefault();
                    if (QD.isSubmitted) return;
                    QD.isSubmitted = true;
                    submitSummaryModal?.classList.add('hidden');
                    submitQuiz();
                };
            }

            // ===== SUBMIT =====
            function submitQuiz() {
                clearInterval(QD.timerInterval);
                console.log('📊 Submitting quiz...');

                // Time
                let remaining = 0;
                for (let s in QD.sectionTimeRemaining) remaining += QD.sectionTimeRemaining[s];
                const timeTaken = QD.totalInitialTime - remaining;
                const mins = Math.floor(timeTaken / 60);
                const secs = timeTaken % 60;

                // Score
                let correct = 0, incorrect = 0, unattempted = 0, score = 0;

                QD.questionStates.forEach((state, i) => {
                    const q = questions[i];
                    const correctNorm = normalizeString(q.correctAnswer.en);

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

                console.log('✅ Results:', { correct, incorrect, unattempted, score });

                const accuracy = (correct + incorrect) > 0 ? (correct / (correct + incorrect)) * 100 : 0;

                QD.reviewQuestionList = filterQuestions('all');

                // UI
                const reviewArea = $('review-button-area');
                if (reviewArea) {
                    reviewArea.innerHTML = `
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin: 0 0 8px 0;">${QD.testInfo.title || 'Test'}</h3>
                            <p style="color: #6b7280; margin: 0;">Questions: ${questions.length} | Max: ${questions.length * 2} marks</p>
                        </div>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button id="review-test-btn" style="background: #4f46e5; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">📝 Review Test</button>
                            <a href="index.html" style="background: #e5e7eb; color: #374151; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">🏠 Go to Tests</a>
                        </div>
                    `;
                }

                const statsArea = $('stats-cards-area');
                if (statsArea) {
                    statsArea.innerHTML = `
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-top: 20px;">
                            <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 28px; font-weight: 700; color: #166534;">${score.toFixed(1)}</div>
                                <div style="color: #6b7280; font-size: 13px;">Score</div>
                            </div>
                            <div style="background: #dcfce7; padding: 20px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 28px; font-weight: 700; color: #16a34a;">${correct}</div>
                                <div style="color: #6b7280; font-size: 13px;">Correct</div>
                            </div>
                            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 28px; font-weight: 700; color: #dc2626;">${incorrect}</div>
                                <div style="color: #6b7280; font-size: 13px;">Incorrect</div>
                            </div>
                            <div style="background: #fef3c7; padding: 20px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 28px; font-weight: 700; color: #d97706;">${unattempted}</div>
                                <div style="color: #6b7280; font-size: 13px;">Skipped</div>
                            </div>
                            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 28px; font-weight: 700; color: #374151;">${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}</div>
                                <div style="color: #6b7280; font-size: 13px;">Time</div>
                            </div>
                            <div style="background: #eff6ff; padding: 20px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 28px; font-weight: 700; color: #2563eb;">${accuracy.toFixed(0)}%</div>
                                <div style="color: #6b7280; font-size: 13px;">Accuracy</div>
                            </div>
                        </div>
                    `;
                }

                // Bind review button
                setTimeout(() => {
                    const revBtn = $('review-test-btn');
                    if (revBtn) {
                        revBtn.onclick = () => {
                            const allTab = resultTabsContainer?.querySelectorAll('a')[1];
                            if (allTab) handleTabClick({ preventDefault: () => {}, target: allTab });
                        };
                    }
                }, 100);

                bindTabs();

                quizUI?.classList.add('hidden');
                resultSummaryPage?.classList.remove('hidden');
                document.body.classList.add('results-scroll');

                // Save
                if (window.ExamAxisAPI?.isLoggedIn()) {
                    ExamAxisAPI.saveTestAttempt({
                        testId: QD.testInfo.id || testId,
                        testTitle: QD.testInfo.title,
                        subject: subjectName,
                        totalQuestions: questions.length,
                        correct, incorrect, unattempted,
                        score: Number(score.toFixed(2)),
                        maxScore: questions.length * 2,
                        accuracy: Number(accuracy.toFixed(1)),
                        timeTakenMinutes: mins
                    }).catch(console.error);
                }
            }

            // Palette
            function createPalette() {
                if (!questionPalette) return;
                questionPalette.innerHTML = '';
                
                questions.forEach((_, i) => {
                    const btn = document.createElement('button');
                    btn.className = 'palette-btn not-visited';
                    btn.textContent = i + 1;
                    btn.onclick = () => {
                        saveAnswer();
                        showQuestion(i);
                    };
                    questionPalette.appendChild(btn);
                });
            }

            function updatePalette() {
                const btns = questionPalette?.querySelectorAll('.palette-btn');
                if (!btns) return;
                
                btns.forEach((btn, i) => {
                    const st = QD.questionStates[i];
                    btn.className = 'palette-btn';
                    
                    if (st.userAnswer && st.markedForReview) btn.classList.add('answered-marked-review');
                    else if (st.markedForReview) btn.classList.add('marked-review');
                    else if (st.userAnswer) btn.classList.add('answered');
                    else if (st.status === 'not-answered') btn.classList.add('not-answered');
                    else btn.classList.add('not-visited');
                    
                    if (i === QD.currentQuestionIndex) btn.classList.add('current');
                });
            }

            // Show question
            function showQuestion(index) {
                if (index < 0 || index >= questions.length) return;

                QD.currentQuestionIndex = index;
                const q = questions[index];
                const state = QD.questionStates[index];
                const lang = QD.currentLanguage;

                if (state.status === 'not-visited') state.status = 'not-answered';

                if (questionTitle) {
                    questionTitle.textContent = `${q.subject} | Q${index + 1} of ${questions.length}`;
                }

                const qText = q.question[lang] || q.question.en || '';

                let optionsHTML = '';
                q.options.forEach((opt, i) => {
                    const text = opt[lang] || opt.en || '';
                    const value = opt.en || text;
                    const checked = state.userAnswer === value ? 'checked' : '';
                    const letter = String.fromCharCode(65 + i);

                    optionsHTML += `
                        <label style="display: block; background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 0 0 10px 0; cursor: pointer;">
                            <input type="radio" name="option" value="${escapeHtml(value)}" ${checked} style="margin-right: 12px; vertical-align: middle;">
                            <span style="font-weight: 700; margin-right: 8px;">${letter}.</span><span>${safeRender(text)}</span>
                        </label>
                    `;
                });

                if (questionArea) {
                    questionArea.innerHTML = `
                        <div style="font-size: 17px; line-height: 1.7; margin-bottom: 24px;">
                            <span style="font-weight: 700; color: #4f46e5;">Q${index + 1}.</span> ${safeRender(qText)}
                        </div>
                        <div style="margin-top: 16px;">${optionsHTML}</div>
                    `;
                }

                updateNav();
                updatePalette();
                if (window.MathJax) try { MathJax.typeset(); } catch(e) {}
            }

            function updateNav() {
                if (prevBtn) prevBtn.disabled = QD.currentQuestionIndex === 0;
                if (nextBtn) {
                    nextBtn.textContent = QD.currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Save & Next';
                }
            }

            function saveAnswer() {
                const selected = document.querySelector('input[name="option"]:checked');
                const state = QD.questionStates[QD.currentQuestionIndex];
                
                state.userAnswer = selected ? selected.value : null;
                state.status = selected ? 'answered' : 'not-answered';
                
                updatePalette();
            }

            // Nav buttons
            if (nextBtn) {
                nextBtn.onclick = () => {
                    saveAnswer();
                    if (QD.currentQuestionIndex < questions.length - 1) {
                        showQuestion(QD.currentQuestionIndex + 1);
                    } else {
                        showSubmitModal();
                    }
                };
            }

            if (prevBtn) {
                prevBtn.onclick = () => {
                    saveAnswer();
                    if (QD.currentQuestionIndex > 0) {
                        showQuestion(QD.currentQuestionIndex - 1);
                    }
                };
            }

            if (markReviewBtn) {
                markReviewBtn.onclick = () => {
                    const state = QD.questionStates[QD.currentQuestionIndex];
                    state.markedForReview = !state.markedForReview;
                    saveAnswer();
                    if (QD.currentQuestionIndex < questions.length - 1) {
                        showQuestion(QD.currentQuestionIndex + 1);
                    }
                };
            }

            if (clearResponseBtn) {
                clearResponseBtn.onclick = () => {
                    const state = QD.questionStates[QD.currentQuestionIndex];
                    state.userAnswer = null;
                    state.status = 'not-answered';
                    document.querySelectorAll('input[name="option"]:checked').forEach(r => r.checked = false);
                    updatePalette();
                };
            }

            console.log('✅ Quiz initialized!');
        }
    });
})();