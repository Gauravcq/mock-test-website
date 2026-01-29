// test-logic.js - FINAL FIXED VERSION v8
// Fixes: Syntax error, examType validation, complete functionality
(function() {
    'use strict';
    
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

        console.log('🔍 TestId from URL:', testId);

        if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        const $ = id => document.getElementById(id);
        const $q = sel => document.querySelector(sel);
        
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

        function textsMatch(a, b) {
            if (!a || !b) return false;
            const normalize = (str) => {
                return String(str)
                    .normalize('NFKC')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toLowerCase();
            };
            return normalize(a) === normalize(b);
        }

        // ========== NORMALIZE - HANDLES ALL FORMATS ==========
        function normalizeQuestion(raw, index) {
            if (!raw) return null;
            if (raw._normalized) return raw;
            
            const q = JSON.parse(JSON.stringify(raw));

            // Question - handle string or object
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

            // Options - handle string array or object array
            q.options = (q.options || []).map((opt, i) => {
                if (typeof opt === 'string') {
                    return { en: opt, hi: opt, index: i };
                }
                return { 
                    en: opt?.en || '', 
                    hi: opt?.hi || opt?.en || '', 
                    index: i 
                };
            });

            // ===== CORRECT ANSWER - HANDLE STRING OR OBJECT =====
            let correctAnswerEn = '';
            let correctAnswerHi = '';

            if (typeof q.correctAnswer === 'string' && q.correctAnswer.trim()) {
                correctAnswerEn = q.correctAnswer.trim();
                correctAnswerHi = q.correctAnswer.trim();
            } else if (q.correctAnswer && typeof q.correctAnswer === 'object') {
                correctAnswerEn = q.correctAnswer.en || '';
                correctAnswerHi = q.correctAnswer.hi || q.correctAnswer.en || '';
            } else if (typeof q.answer === 'string' && q.answer.trim()) {
                const letter = q.answer.trim().toUpperCase();
                if (letter.length === 1 && letter >= 'A' && letter <= 'D') {
                    const idx = letter.charCodeAt(0) - 65;
                    if (q.options[idx]) {
                        correctAnswerEn = q.options[idx].en;
                        correctAnswerHi = q.options[idx].hi;
                    }
                } else {
                    correctAnswerEn = q.answer.trim();
                    correctAnswerHi = q.answer.trim();
                }
            }

            q.correctAnswer = { 
                en: correctAnswerEn.trim(), 
                hi: (correctAnswerHi || correctAnswerEn).trim() 
            };

            // ===== EXPLANATION - HANDLE STRING OR OBJECT =====
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

            // Debug first 3
            if (index < 3) {
                console.log(`✅ Q${index + 1}:`, {
                    correctAnswer: q.correctAnswer.en || '(empty)',
                    hasExplanation: !!q.explanation.en
                });
            }

            return q;
        }

        // ========== VALIDATION ==========
        if (!testId) {
            document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Error: No Test ID</h1><a href="index.html">Go Back</a></div>';
            return;
        }

        if (typeof ALL_TESTS === 'undefined') {
            document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h1>Error: ALL_TESTS missing</h1></div>';
            return;
        }

        const testInfo = ALL_TESTS.find(t => String(t.id) === testId);
        if (!testInfo) {
            document.body.innerHTML = `<div style="text-align:center;padding:50px;"><h1>Test "${testId}" not found</h1><a href="index.html">Go Back</a></div>`;
            return;
        }

        window.QUIZ_DATA.testInfo = testInfo;

        // ========== DEBUG: CHECK QUESTIONS_DATABASE ==========
        console.log('📂 Checking QUESTIONS_DATABASE...');
        if (typeof QUESTIONS_DATABASE !== 'undefined') {
            console.log('✅ QUESTIONS_DATABASE exists');
            console.log('📋 Available keys:', Object.keys(QUESTIONS_DATABASE));
            console.log('🔍 Looking for testId:', testId);
            
            if (QUESTIONS_DATABASE[testId]) {
                console.log('✅ Found matching key!');
                const sample = QUESTIONS_DATABASE[testId][0];
                console.log('📋 Sample Q1 correctAnswer:', sample?.correctAnswer);
            } else {
                console.warn('⚠️ No matching key found for testId:', testId);
                console.log('💡 Try using one of these:', Object.keys(QUESTIONS_DATABASE));
            }
        } else {
            console.warn('⚠️ QUESTIONS_DATABASE is NOT defined!');
        }

        // ========== LOAD QUESTIONS ==========
        let questions = [];
        let questionsSource = '';

        // PRIORITY 1: Local database (has correctAnswer & explanation)
        if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
            const raw = QUESTIONS_DATABASE[testId];
            questions = Array.isArray(raw) ? raw : (raw.questions || []);
            questionsSource = 'LOCAL';
            console.log('✅ LOCAL DB:', questions.length, 'questions');
            
            if (questions.length > 0) {
                console.log('📋 First question correctAnswer:', questions[0].correctAnswer);
            }
        }

        // PRIORITY 2: API (fallback)
        if (!questions.length) {
            try {
                const response = await ExamAxisAPI.getQuestions(testId);
                if (response?.success && response?.data?.questions?.length) {
                    let apiQuestions = response.data.questions;
                    questionsSource = 'API';
                    console.log('📡 API:', apiQuestions.length, 'questions');
                    
                    // Check if API has correctAnswer
                    if (apiQuestions[0]?.correctAnswer) {
                        console.log('✅ API has correctAnswer');
                        questions = apiQuestions;
                    } else {
                        console.warn('⚠️ API missing correctAnswer');
                        
                        // Try to merge with local data
                        if (typeof QUESTIONS_DATABASE !== 'undefined') {
                            const possibleKeys = [
                                testId,
                                testId.replace(/-/g, '_'),
                                testId.replace(/_/g, '-'),
                                testId.toLowerCase(),
                                testId.toUpperCase()
                            ];
                            
                            let localData = null;
                            for (const key of possibleKeys) {
                                if (QUESTIONS_DATABASE[key]) {
                                    localData = QUESTIONS_DATABASE[key];
                                    console.log('✅ Found local data with key:', key);
                                    break;
                                }
                            }
                            
                            if (localData) {
                                const localQuestions = Array.isArray(localData) ? localData : (localData.questions || []);
                                
                                questions = apiQuestions.map((apiQ, i) => {
                                    const localQ = localQuestions[i];
                                    if (localQ) {
                                        return {
                                            ...apiQ,
                                            correctAnswer: localQ.correctAnswer,
                                            explanation: localQ.explanation
                                        };
                                    }
                                    return apiQ;
                                });
                                
                                console.log('✅ Merged API + Local answers');
                                console.log('📋 Merged Q1 correctAnswer:', questions[0]?.correctAnswer);
                            } else {
                                questions = apiQuestions;
                                console.warn('⚠️ No local data found to merge');
                            }
                        } else {
                            questions = apiQuestions;
                        }
                    }
                }
            } catch (e) {
                console.warn('⚠️ API failed:', e.message);
            }
        }

        // PRIORITY 3: If still no questions, try to find similar keys
        if (!questions.length && typeof QUESTIONS_DATABASE !== 'undefined') {
            const allKeys = Object.keys(QUESTIONS_DATABASE);
            console.log('🔍 Trying to find similar key for:', testId);
            
            const similarKey = allKeys.find(key => 
                key.includes(testId) || 
                testId.includes(key) ||
                key.toLowerCase() === testId.toLowerCase()
            );
            
            if (similarKey) {
                console.log('✅ Found similar key:', similarKey);
                const raw = QUESTIONS_DATABASE[similarKey];
                questions = Array.isArray(raw) ? raw : (raw.questions || []);
                questionsSource = 'LOCAL (similar key)';
            }
        }

        if (!questions.length) {
            document.body.innerHTML = `
                <div style="text-align:center;padding:50px;">
                    <h1>No questions for: ${testId}</h1>
                    <p>Available keys: ${typeof QUESTIONS_DATABASE !== 'undefined' ? Object.keys(QUESTIONS_DATABASE).join(', ') : 'QUESTIONS_DATABASE not loaded'}</p>
                    <a href="index.html">Go Back</a>
                </div>`;
            return;
        }

        // DEBUG: Show raw first question
        console.log('📋 Raw Q1:', JSON.stringify(questions[0], null, 2));

        const subjectName = testInfo.subject || 'General';
        
        window.QUIZ_DATA.questions = questions.map((q, i) => ({
            ...normalizeQuestion(q, i),
            originalIndex: i,
            subject: subjectName
        })).filter(q => q !== null);

        console.log(`✅ Loaded ${window.QUIZ_DATA.questions.length} questions from ${questionsSource}`);
        console.log('📋 Final Q1 correctAnswer:', window.QUIZ_DATA.questions[0]?.correctAnswer);

        // ========== HELPER FUNCTIONS ==========
        function getCorrectAnswer(q, lang) {
            if (q.correctAnswer?.[lang]?.trim()) return q.correctAnswer[lang].trim();
            if (q.correctAnswer?.en?.trim()) return q.correctAnswer.en.trim();
            return '';
        }

        function findCorrectOptionIndex(q, lang) {
            const correctText = getCorrectAnswer(q, lang);
            if (!correctText) return -1;
            
            for (let i = 0; i < q.options.length; i++) {
                const opt = q.options[i];
                if (opt.en === correctText || opt[lang] === correctText ||
                    opt.en?.trim() === correctText || opt[lang]?.trim() === correctText ||
                    textsMatch(opt.en, correctText) || textsMatch(opt[lang], correctText)) {
                    return i;
                }
            }
            return -1;
        }

        // ========== FILTER ==========
        function filterQuestions(category) {
            const cat = category.toLowerCase().trim();
            const QD = window.QUIZ_DATA;
            
            const all = QD.questions.map((q, i) => ({
                ...q,
                index: i,
                state: QD.questionStates[i]
            }));

            if (cat === 'all' || cat === 'overview') return all;
            if (cat === 'correct') return all.filter(x => x.state?.resultCategory === 'correct');
            if (cat === 'incorrect') return all.filter(x => x.state?.resultCategory === 'incorrect');
            if (cat === 'unattempted') return all.filter(x => x.state?.resultCategory === 'unattempted');
            if (cat === 'marked for review') return all.filter(x => x.state?.markedForReview);
            return all;
        }

        // ========== SHOW REVIEW QUESTION ==========
        function showReviewQuestion(index) {
            const QD = window.QUIZ_DATA;
            QD.currentReviewIndex = index;

            if (!QD.reviewQuestionList.length || index < 0 || index >= QD.reviewQuestionList.length) return;

            const item = QD.reviewQuestionList[index];
            const q = item;
            const state = item.state || QD.questionStates[item.index];
            const lang = QD.currentLanguage;

            console.log('========== REVIEW Q' + (item.index + 1) + ' ==========');
            console.log('correctAnswer:', q.correctAnswer);
            console.log('userAnswer:', state.userAnswer);

            if (reviewQuestionTitle) {
                reviewQuestionTitle.textContent = `Question ${index + 1} of ${QD.reviewQuestionList.length} (Q${item.index + 1})`;
            }

            const correctText = getCorrectAnswer(q, lang);
            const correctIdx = findCorrectOptionIndex(q, lang);
            
            console.log('Correct text:', `"${correctText}"`);
            console.log('Correct index:', correctIdx);

            let userIdx = -1;
            if (state.userAnswer) {
                for (let i = 0; i < q.options.length; i++) {
                    const opt = q.options[i];
                    if (opt.en === state.userAnswer || opt[lang] === state.userAnswer ||
                        textsMatch(opt.en, state.userAnswer) || textsMatch(opt[lang], state.userAnswer)) {
                        userIdx = i;
                        break;
                    }
                }
            }
            console.log('User index:', userIdx);

            let optionsHTML = '';
            
            q.options.forEach((opt, i) => {
                const optText = opt[lang] || opt.en || '';
                const letter = String.fromCharCode(65 + i);
                const isCorrect = (i === correctIdx);
                const isUser = (i === userIdx);

                let bgColor = '#f9fafb';
                let borderColor = '#e5e7eb';
                let indicatorHTML = '';

                if (isCorrect && isUser) {
                    bgColor = '#dcfce7';
                    borderColor = '#22c55e';
                    indicatorHTML = `<span style="margin-left:auto;padding-left:12px;color:#16a34a;font-weight:700;">✓ Correct!</span>`;
                } else if (isCorrect) {
                    bgColor = '#dcfce7';
                    borderColor = '#22c55e';
                    indicatorHTML = `<span style="margin-left:auto;padding-left:12px;color:#16a34a;font-weight:700;">✓ Correct Answer</span>`;
                } else if (isUser) {
                    bgColor = '#fee2e2';
                    borderColor = '#ef4444';
                    indicatorHTML = `<span style="margin-left:auto;padding-left:12px;color:#dc2626;font-weight:700;">✗ Your Answer</span>`;
                }

                const radioColor = isUser ? (isCorrect ? '#22c55e' : '#ef4444') : '#d1d5db';
                const radioFill = isUser ? radioColor : 'transparent';

                optionsHTML += `
                    <div style="display:flex;align-items:center;background:${bgColor};border:2px solid ${borderColor};border-radius:10px;padding:14px 18px;margin-bottom:12px;">
                        <span style="font-weight:700;min-width:28px;color:#374151;">${letter}.</span>
                        <span style="width:20px;height:20px;border:2px solid ${radioColor};border-radius:50%;margin-right:14px;flex-shrink:0;background:${radioFill};display:flex;align-items:center;justify-content:center;">
                            ${isUser ? '<span style="width:8px;height:8px;background:white;border-radius:50%;"></span>' : ''}
                        </span>
                        <span style="flex:1;color:#1f2937;">${safeRender(optText)}</span>
                        ${indicatorHTML}
                    </div>
                `;
            });

            const qText = q.question?.[lang] || q.question?.en || '';
            
            let statusNote = '';
            if (state.userAnswer === null) {
                statusNote = `<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:10px;padding:14px 18px;margin-top:16px;color:#92400e;font-weight:500;">⚠️ Not Attempted - Correct answer highlighted above</div>`;
            }

            if (reviewQuestionCard) {
                reviewQuestionCard.innerHTML = `
                    <div style="font-size:17px;line-height:1.7;margin-bottom:24px;color:#1f2937;">
                        <span style="font-weight:700;color:#4f46e5;">Q${item.index + 1}.</span> ${safeRender(qText)}
                    </div>
                    <div>${optionsHTML}</div>
                    ${statusNote}
                `;
            }

            // Explanation
            const explText = q.explanation?.[lang] || q.explanation?.en || '';
            console.log('Explanation:', explText ? 'YES' : 'NONE');

            if (reviewSolutionText) {
                reviewSolutionText.innerHTML = explText?.trim() 
                    ? `<div style="color:#374151;line-height:1.7;">${safeRender(explText)}</div>`
                    : `<em style="color:#9ca3af;">No explanation available.</em>`;
            }

            // Palette
            if (reviewPaletteClean) {
                reviewPaletteClean.innerHTML = '';
                QD.reviewQuestionList.forEach((it, idx) => {
                    const st = it.state || QD.questionStates[it.index];
                    const btn = document.createElement('button');
                    btn.textContent = it.index + 1;
                    
                    let bg = '#fbbf24';
                    if (st.resultCategory === 'correct') bg = '#22c55e';
                    else if (st.resultCategory === 'incorrect') bg = '#ef4444';
                    
                    btn.style.cssText = `width:40px;height:40px;margin:4px;border:none;border-radius:8px;background:${bg};color:white;font-weight:700;cursor:pointer;${idx === QD.currentReviewIndex ? 'box-shadow:0 0 0 3px #4f46e5;' : ''}`;
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

            const cat = tab.textContent.toLowerCase().trim();

            [resultTabsContainer, reviewTabsContainer].forEach(nav => {
                if (nav) nav.querySelectorAll('a').forEach(a => {
                    a.classList.toggle('active', a.textContent.toLowerCase().trim() === cat);
                });
            });

            if (cat === 'overview') {
                reviewPage?.classList.add('hidden');
                resultSummaryPage?.classList.remove('hidden');
                return;
            }

            window.QUIZ_DATA.reviewQuestionList = filterQuestions(cat);
            console.log('Filter:', cat, '- Found:', window.QUIZ_DATA.reviewQuestionList.length);

            resultSummaryPage?.classList.add('hidden');
            reviewPage?.classList.remove('hidden');

            if (window.QUIZ_DATA.reviewQuestionList.length > 0) {
                showReviewQuestion(0);
            } else {
                if (reviewQuestionCard) {
                    reviewQuestionCard.innerHTML = `<div style="text-align:center;padding:60px;color:#6b7280;"><div style="font-size:64px;margin-bottom:20px;">📭</div><h3>No "${cat}" questions</h3></div>`;
                }
                if (reviewQuestionTitle) reviewQuestionTitle.textContent = 'No questions';
                if (reviewPaletteClean) reviewPaletteClean.innerHTML = '';
            }
        }

        function bindTabs() {
            [resultTabsContainer, reviewTabsContainer].forEach(nav => {
                if (nav) nav.querySelectorAll('a').forEach(tab => { tab.onclick = handleTabClick; });
            });
        }

        if (reviewPrevBtn) reviewPrevBtn.onclick = () => {
            if (window.QUIZ_DATA.currentReviewIndex > 0) showReviewQuestion(window.QUIZ_DATA.currentReviewIndex - 1);
        };
        if (reviewNextBtn) reviewNextBtn.onclick = () => {
            if (window.QUIZ_DATA.currentReviewIndex < window.QUIZ_DATA.reviewQuestionList.length - 1) showReviewQuestion(window.QUIZ_DATA.currentReviewIndex + 1);
        };

        // ========== INIT UI ==========
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
                if (window.QUIZ_DATA.isQuizStarted) return;
                window.QUIZ_DATA.isQuizStarted = true;
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

            QD.sectionTimeRemaining = {};
            QD.totalInitialTime = 0;
            [...new Set(questions.map(q => q.subject))].forEach(s => {
                QD.sectionTimeRemaining[s] = duration * 60;
                QD.totalInitialTime += duration * 60;
            });

            QD.questionStates = questions.map(() => ({
                status: 'not-visited',
                userAnswer: null,
                markedForReview: false,
                resultCategory: null
            }));

            if (languageSelect) {
                languageSelect.value = QD.currentLanguage;
                languageSelect.onchange = (e) => {
                    QD.currentLanguage = e.target.value;
                    showQuestion(QD.currentQuestionIndex);
                };
            }

            const titleEl = $('test-main-title');
            if (titleEl) titleEl.textContent = `${QD.testInfo.date || ''} - ${QD.testInfo.title || 'Test'}`;

            createPalette();
            showQuestion(0);
            startTimer();

            function startTimer() {
                if (QD.timerInterval) clearInterval(QD.timerInterval);
                QD.timerInterval = setInterval(() => {
                    if (QD.isPaused) return;
                    const subj = questions[QD.currentQuestionIndex].subject;
                    if (QD.sectionTimeRemaining[subj] > 0) {
                        QD.sectionTimeRemaining[subj]--;
                        const t = QD.sectionTimeRemaining[subj];
                        if (timerEl) timerEl.textContent = `${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`;
                    } else {
                        clearInterval(QD.timerInterval);
                        alert('Time up!');
                        submitQuiz();
                    }
                }, 1000);
            }

            if (pauseBtn) pauseBtn.onclick = () => { QD.isPaused = true; pauseOverlay?.classList.remove('hidden'); };
            if (resumeBtn) resumeBtn.onclick = () => { QD.isPaused = false; pauseOverlay?.classList.add('hidden'); };

            function showSubmitModal() {
                const answered = QD.questionStates.filter(s => s.userAnswer !== null).length;
                if (submissionStatsEl) {
                    submissionStatsEl.innerHTML = `
                        <div style="margin:10px 0;">Answered: <strong>${answered}/${questions.length}</strong></div>
                        <div>Unanswered: <strong>${questions.length - answered}</strong></div>
                    `;
                }
                submitSummaryModal?.classList.remove('hidden');
            }

            if (submitTestBtn) submitTestBtn.onclick = showSubmitModal;
            if (submitTestFooterBtn) submitTestFooterBtn.onclick = showSubmitModal;
            if (cancelSubmitBtn) cancelSubmitBtn.onclick = () => submitSummaryModal?.classList.add('hidden');

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

            // ========== SUBMIT QUIZ ==========
            function submitQuiz() {
                clearInterval(QD.timerInterval);

                let remaining = 0;
                for (let s in QD.sectionTimeRemaining) remaining += QD.sectionTimeRemaining[s];
                const timeTaken = QD.totalInitialTime - remaining;
                const mins = Math.floor(timeTaken / 60);
                const secs = timeTaken % 60;

                let correct = 0, incorrect = 0, unattempted = 0, score = 0;

                QD.questionStates.forEach((state, i) => {
                    const q = questions[i];
                    const correctText = getCorrectAnswer(q, 'en');

                    if (state.userAnswer !== null) {
                        const isMatch = textsMatch(state.userAnswer, correctText) || 
                                       state.userAnswer === correctText ||
                                       state.userAnswer?.trim() === correctText?.trim();
                        
                        if (isMatch) {
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

                const reviewArea = $('review-button-area');
                if (reviewArea) {
                    reviewArea.innerHTML = `
                        <div style="margin-bottom:20px;"><h3>${QD.testInfo.title}</h3><p style="color:#6b7280;">Questions: ${questions.length} | Max: ${questions.length * 2}</p></div>
                        <div style="display:flex;gap:12px;flex-wrap:wrap;">
                            <button id="review-test-btn" style="background:#4f46e5;color:white;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;font-weight:600;">📝 Review</button>
                            <a href="index.html" style="background:#e5e7eb;color:#374151;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">🏠 Tests</a>
                        </div>
                    `;
                }

                const statsArea = $('stats-cards-area');
                if (statsArea) {
                    statsArea.innerHTML = `
                        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-top:20px;">
                            <div style="background:#f0fdf4;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#166534;">${score.toFixed(1)}</div><div style="color:#6b7280;">Score</div></div>
                            <div style="background:#dcfce7;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#16a34a;">${correct}</div><div style="color:#6b7280;">Correct</div></div>
                            <div style="background:#fee2e2;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#dc2626;">${incorrect}</div><div style="color:#6b7280;">Incorrect</div></div>
                            <div style="background:#fef3c7;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#d97706;">${unattempted}</div><div style="color:#6b7280;">Skipped</div></div>
                            <div style="background:#f3f4f6;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#374151;">${mins}:${secs.toString().padStart(2,'0')}</div><div style="color:#6b7280;">Time</div></div>
                            <div style="background:#eff6ff;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#2563eb;">${accuracy.toFixed(0)}%</div><div style="color:#6b7280;">Accuracy</div></div>
                        </div>
                    `;
                }

                setTimeout(() => {
                    const revBtn = $('review-test-btn');
                    if (revBtn) revBtn.onclick = () => {
                        const allTab = resultTabsContainer?.querySelectorAll('a')[1];
                        if (allTab) handleTabClick({ preventDefault: () => {}, target: allTab });
                    };
                }, 100);

                bindTabs();
                quizUI?.classList.add('hidden');
                resultSummaryPage?.classList.remove('hidden');
                document.body.classList.add('results-scroll');

                // ========== SAVE ATTEMPT TO BACKEND ==========
                if (window.ExamAxisAPI?.isLoggedIn()) {
                    const answersObj = {};
                    QD.questionStates.forEach((state, i) => {
                        answersObj[i] = {
                            userAnswer: state.userAnswer,
                            isCorrect: state.resultCategory === 'correct'
                        };
                    });

                    const attemptData = {
                        testId: String(QD.testInfo.id || testId),
                        examType: 'CGL',  // ✅ Use 'CGL' to match validator
                        subject: subjectName || 'Mathematics',
                        score: Number(score.toFixed(2)),
                        totalMarks: questions.length * 2,
                        correctAnswers: correct,
                        wrongAnswers: incorrect,
                        unanswered: unattempted,
                        timeTaken: mins,
                        answers: answersObj
                    };

                    console.log('📤 Saving attempt:', attemptData);

                    ExamAxisAPI.saveTestAttempt(attemptData)
                        .then(result => {
                            if (result.success) {
                                console.log('✅ Test attempt saved successfully');
                            } else {
                                console.warn('⚠️ Could not save attempt:', result.message);
                            }
                        })
                        .catch(err => {
                            console.warn('⚠️ Save attempt failed:', err.message);
                        });
                }
            } // ✅ End of submitQuiz

            // ========== CREATE PALETTE ==========
            function createPalette() {
                if (!questionPalette) return;
                questionPalette.innerHTML = '';
                questions.forEach((_, i) => {
                    const btn = document.createElement('button');
                    btn.className = 'palette-btn not-visited';
                    btn.textContent = i + 1;
                    btn.onclick = () => { saveAnswer(); showQuestion(i); };
                    questionPalette.appendChild(btn);
                });
            }

            // ========== UPDATE PALETTE ==========
            function updatePalette() {
                questionPalette?.querySelectorAll('.palette-btn').forEach((btn, i) => {
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

            // ========== SHOW QUESTION ==========
            function showQuestion(index) {
                if (index < 0 || index >= questions.length) return;
                QD.currentQuestionIndex = index;
                const q = questions[index];
                const state = QD.questionStates[index];
                const lang = QD.currentLanguage;

                if (state.status === 'not-visited') state.status = 'not-answered';
                if (questionTitle) questionTitle.textContent = `${q.subject} | Q${index + 1} of ${questions.length}`;

                const qText = q.question?.[lang] || q.question?.en || '';
                let optionsHTML = '';
                
                q.options.forEach((opt, i) => {
                    const text = opt[lang] || opt.en || '';
                    const value = opt.en || text;
                    const isChecked = state.userAnswer === value;
                    const letter = String.fromCharCode(65 + i);

                    optionsHTML += `
                        <label style="display:flex;align-items:center;background:${isChecked ? '#eff6ff' : '#f8fafc'};border:2px solid ${isChecked ? '#3b82f6' : '#e2e8f0'};border-radius:10px;padding:14px 18px;margin-bottom:12px;cursor:pointer;">
                            <span style="font-weight:700;min-width:28px;">${letter}.</span>
                            <input type="radio" name="option" value="${escapeHtml(value)}" ${isChecked ? 'checked' : ''} style="width:20px;height:20px;margin-right:14px;accent-color:#3b82f6;">
                            <span style="flex:1;">${safeRender(text)}</span>
                        </label>
                    `;
                });

                if (questionArea) {
                    questionArea.innerHTML = `
                        <div style="font-size:17px;line-height:1.7;margin-bottom:24px;">
                            <span style="font-weight:700;color:#4f46e5;">Q${index + 1}.</span> ${safeRender(qText)}
                        </div>
                        ${optionsHTML}
                    `;
                }

                updateNav();
                updatePalette();
                if (window.MathJax) try { MathJax.typeset(); } catch(e) {}
            }

            // ========== UPDATE NAV ==========
            function updateNav() {
                if (prevBtn) prevBtn.disabled = QD.currentQuestionIndex === 0;
                if (nextBtn) nextBtn.textContent = QD.currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Save & Next';
            }

            // ========== SAVE ANSWER ==========
            function saveAnswer() {
                const sel = document.querySelector('input[name="option"]:checked');
                const state = QD.questionStates[QD.currentQuestionIndex];
                state.userAnswer = sel ? sel.value : null;
                state.status = sel ? 'answered' : 'not-answered';
                updatePalette();
            }

            // ========== BUTTON HANDLERS ==========
            if (nextBtn) nextBtn.onclick = () => {
                saveAnswer();
                if (QD.currentQuestionIndex < questions.length - 1) showQuestion(QD.currentQuestionIndex + 1);
                else showSubmitModal();
            };
            
            if (prevBtn) prevBtn.onclick = () => {
                saveAnswer();
                if (QD.currentQuestionIndex > 0) showQuestion(QD.currentQuestionIndex - 1);
            };
            
            if (markReviewBtn) markReviewBtn.onclick = () => {
                QD.questionStates[QD.currentQuestionIndex].markedForReview = !QD.questionStates[QD.currentQuestionIndex].markedForReview;
                saveAnswer();
                if (QD.currentQuestionIndex < questions.length - 1) showQuestion(QD.currentQuestionIndex + 1);
            };
            
            if (clearResponseBtn) clearResponseBtn.onclick = () => {
                QD.questionStates[QD.currentQuestionIndex].userAnswer = null;
                QD.questionStates[QD.currentQuestionIndex].status = 'not-answered';
                document.querySelectorAll('input[name="option"]:checked').forEach(r => r.checked = false);
                updatePalette();
            };

            console.log('✅ Quiz ready!');
        } // ✅ End of initQuiz
    }); // ✅ End of DOMContentLoaded
})(); // ✅ End of IIFE