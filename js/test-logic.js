// test-logic.js - FINAL VERSION v10 with SECTIONS SUPPORT - FIXED
// Features: Anti-copy, Anti-console, Anti-inspect, Tab detection, Section-based Full Mock
(function() {
    'use strict';

    // ========== SECURITY FEATURES ==========
    const SECURITY = {
        enabled: false,
        
        init() {
            if (!this.enabled) {
                console.log('⚠️ Security features disabled (dev mode)');
                return;
            }
            this.disableCopyPaste();
            this.disableRightClick();
            this.disableTextSelection();
            this.disableKeyboardShortcuts();
            this.disableConsole();
            this.detectDevTools();
            this.detectTabSwitch();
            this.disableDragDrop();
            this.disablePrint();
            console.log('🔒 Security features enabled');
        },

        disableCopyPaste() {
            document.addEventListener('copy', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                e.preventDefault();
                this.showWarning('Copying is not allowed during exam!');
                return false;
            });
            document.addEventListener('cut', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                e.preventDefault();
                this.showWarning('Cutting is not allowed during exam!');
                return false;
            });
            document.addEventListener('paste', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                e.preventDefault();
                this.showWarning('Pasting is not allowed during exam!');
                return false;
            });
        },

        disableRightClick() {
            document.addEventListener('contextmenu', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                e.preventDefault();
                this.showWarning('Right-click is disabled during exam!');
                return false;
            });
        },

        disableTextSelection() {
            const style = document.createElement('style');
            style.textContent = `
                body.exam-mode, body.exam-mode * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
                body.exam-mode input[type="radio"],
                body.exam-mode input[type="checkbox"],
                body.exam-mode button {
                    -webkit-user-select: auto !important;
                    user-select: auto !important;
                }
            `;
            document.head.appendChild(style);
            document.addEventListener('selectstart', (e) => {
                if (document.body.classList.contains('exam-mode')) {
                    e.preventDefault();
                    return false;
                }
            });
        },

        disableKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                if (e.ctrlKey || e.metaKey) {
                    const blockedKeys = ['c', 'C', 'v', 'V', 'x', 'X', 'a', 'A', 's', 'S', 'p', 'P', 'u', 'U', 'i', 'I', 'j', 'J', 'k', 'K'];
                    if (blockedKeys.includes(e.key)) {
                        e.preventDefault();
                        this.showWarning('This shortcut is disabled during exam!');
                        return false;
                    }
                    if (e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5')) {
                        e.preventDefault();
                        this.showWarning('Screenshots are not allowed during exam!');
                        return false;
                    }
                    if (e.shiftKey) {
                        const blockedShiftKeys = ['i', 'I', 'j', 'J', 'c', 'C'];
                        if (blockedShiftKeys.includes(e.key)) {
                            e.preventDefault();
                            this.showWarning('Developer tools are disabled during exam!');
                            return false;
                        }
                    }
                }
                if (e.shiftKey && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showWarning('Screenshots are not allowed during exam!');
                    navigator.clipboard.writeText('').catch(() => {});
                    return false;
                }
                if (e.key === 'F12') {
                    e.preventDefault();
                    this.showWarning('Developer tools are disabled during exam!');
                    return false;
                }
                if (e.key === 'F7') {
                    e.preventDefault();
                    return false;
                }
                const isScreenshotKey = e.key === 'PrintScreen' || (e.keyCode === 44) || (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key));
                if (isScreenshotKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showWarning('Screenshots are not allowed during exam!');
                    navigator.clipboard.writeText('').catch(() => {});
                    return false;
                }
            });
            document.addEventListener('keyup', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                if (e.key === 'PrintScreen' || e.keyCode === 44) {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText('').catch(() => {});
                    return false;
                }
            });
        },

        disableConsole() {
            const noop = () => {};
            const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 'timeEnd', 'timeStamp'];
            window._originalConsole = { ...console };
            methods.forEach(method => { console[method] = noop; });
            const element = new Image();
            Object.defineProperty(element, 'id', { get: () => { this.handleDevToolsOpen(); } });
            setInterval(() => { console.log(element); console.clear(); }, 1000);
        },

        detectDevTools() {
            const threshold = 160;
            const checkDevTools = () => {
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                if (widthThreshold || heightThreshold) { this.handleDevToolsOpen(); }
            };
            window.addEventListener('resize', checkDevTools);
            setInterval(checkDevTools, 1000);
            setInterval(() => {
                const startTime = performance.now();
                debugger;
                const endTime = performance.now();
                if (endTime - startTime > 100) { this.handleDevToolsOpen(); }
            }, 1000);
        },

        detectTabSwitch() {
            let tabSwitchCount = 0;
            const maxTabSwitches = 3;
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && window.QUIZ_DATA?.isQuizStarted && !window.QUIZ_DATA?.isSubmitted) {
                    tabSwitchCount++;
                    if (tabSwitchCount >= maxTabSwitches) {
                        this.showWarning(`⚠️ WARNING: You have switched tabs ${tabSwitchCount} times! Your test may be auto-submitted.`, 'error');
                    } else {
                        this.showWarning(`⚠️ Tab switch detected! (${tabSwitchCount}/${maxTabSwitches}) Please stay on this page.`, 'warning');
                    }
                    window._originalConsole?.warn?.(`Tab switch detected: ${tabSwitchCount}`);
                }
            });
            window.addEventListener('blur', () => {
                if (window.QUIZ_DATA?.isQuizStarted && !window.QUIZ_DATA?.isSubmitted) {
                    window._originalConsole?.warn?.('Window lost focus');
                }
            });
        },

        disableDragDrop() {
            document.addEventListener('dragstart', (e) => { e.preventDefault(); return false; });
            document.addEventListener('drop', (e) => { e.preventDefault(); return false; });
        },

        disablePrint() {
            const style = document.createElement('style');
            style.textContent = `@media print { body * { display: none !important; } body::after { content: "Printing is not allowed during exam."; display: block !important; font-size: 24px; text-align: center; padding: 50px; } }`;
            document.head.appendChild(style);
            window.addEventListener('beforeprint', (e) => { e.preventDefault(); this.showWarning('Printing is not allowed during exam!'); });
            window.print = () => { this.showWarning('Printing is not allowed during exam!'); };
        },

        handleDevToolsOpen() {
            if (!this._devToolsWarningShown) {
                this._devToolsWarningShown = true;
                this.showWarning('⚠️ Developer tools detected! This activity is being logged.', 'error');
                setTimeout(() => { this._devToolsWarningShown = false; }, 5000);
            }
        },

        showWarning(message, type = 'warning') {
            const existing = document.getElementById('security-warning');
            if (existing) existing.remove();
            const colors = {
                warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
                error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
            };
            const color = colors[type] || colors.warning;
            const warning = document.createElement('div');
            warning.id = 'security-warning';
            warning.innerHTML = `<div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: ${color.bg}; border: 2px solid ${color.border}; color: ${color.text}; padding: 15px 25px; border-radius: 10px; font-weight: 600; font-size: 14px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: slideDown 0.3s ease; max-width: 90%; text-align: center;">${message}</div><style>@keyframes slideDown { from { transform: translateX(-50%) translateY(-100%); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }</style>`;
            document.body.appendChild(warning);
            setTimeout(() => { warning.remove(); }, 3000);
        },

        enableExamMode() {
            document.body.classList.add('exam-mode');
            console.log('🔒 Exam mode enabled');
        },

        disableExamMode() {
            document.body.classList.remove('exam-mode');
            console.log('🔓 Exam mode disabled');
        }
    };

    // ========== PREMIUM ACCESS CHECK ==========
    async function checkPremiumAccess(testId) {
        if (!testId) return true;
        const FREE_TESTS = {
            CGL_MATHS: 'ssc_cgl_12_sep_s1', CGL_REASONING: 'ssc_cgl_12_sep_s1-r', CGL_ENGLISH: 'ssc_cgl_eng_12_sep_s1',
            CGL_GK: 'ssc_cgl_gk_12_sep_s1', CGL_FULLMOCK: 'ssc_cgl_fullmock_12_sep_s1',
            CHSL_MATHS: 'ssc_chsl_maths_12_nov_s1', CHSL_REASONING: 'ssc_chsl_reasoning_12_nov_s1',
            CHSL_ENGLISH: 'ssc_chsl_eng_12_nov_s1', CHSL_GK: 'ssc_chsl_gk_12_nov_s1', CHSL_TOP100: 'CHSL_TOP_100_MATHS',
            DP_REASONING: 'dp_constable_reasoning_s1'
        };
        const freeTestIds = Object.values(FREE_TESTS);
        const isFreeTest = freeTestIds.includes(testId);
        if (isFreeTest) {
            console.log('✅ Free test - access granted');
            return true;
        }
        try {
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000/api' : 'https://exam-axis-backend.vercel.app/api';
            const response = await fetch(`${API_URL}/payment/premium-status`, {
                headers: { 'Authorization': `Bearer ${ExamAxisAPI.getToken()}` }
            });
            const data = await response.json();
            if (data.success && data.data && data.data.isPremium) {
                console.log('✅ Premium user - access granted');
                return true;
            }
        } catch (error) {
            console.error('Premium check error:', error);
        }
        console.warn('🔒 Premium test - access denied');
        const userChoice = confirm('🔒 Premium Content\n\nThis test is available for Premium Members only.\n\nWould you like to upgrade to Premium for just ₹99 (Lifetime Access)?\n\nClick OK to upgrade, or Cancel to go back.');
        if (userChoice) { window.location.href = 'payment.html'; } else { window.location.href = 'index.html'; }
        return false;
    }

    // ========== QUIZ DATA ==========
    window.QUIZ_DATA = {
        questions: [], questionStates: [], testInfo: null, currentLanguage: 'en',
        sectionTimeRemaining: {}, totalInitialTime: 0, reviewQuestionList: [],
        currentReviewIndex: 0, currentQuestionIndex: 0, isQuizStarted: false,
        isSubmitted: false, timerInterval: null, isPaused: false,
        sections: [], currentSection: null, isFullMock: false
    };

    // ========== MAIN INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', async () => {
        SECURITY.init();
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('testId') || urlParams.get('id');
        console.log('🔍 TestId from URL:', testId);
        if (testId) { localStorage.setItem('testId', String(testId)); }
        if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }
        const premiumCheckPassed = await checkPremiumAccess(testId);
        if (!premiumCheckPassed) { return; }

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

        function containsHTML(str) { return str && /<[a-z][\s\S]*>/i.test(str); }
        function escapeHtml(text) { if (!text) return ''; const div = document.createElement('div'); div.textContent = String(text); return div.innerHTML; }
        function safeRender(text) { if (!text) return ''; return containsHTML(String(text)) ? String(text) : escapeHtml(text); }
        function textsMatch(a, b) {
            if (!a || !b) return false;
            const normalize = (str) => String(str).normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
            return normalize(a) === normalize(b);
        }

        function normalizeQuestion(raw, index) {
            if (!raw) return null;
            if (raw._normalized) return raw;
            const q = JSON.parse(JSON.stringify(raw));
            if (typeof q.question === 'string') {
                q.question = { en: q.question, hi: q.question };
            } else if (q.question && typeof q.question === 'object') {
                q.question = { en: q.question.en || '', hi: q.question.hi || q.question.en || '' };
            } else {
                q.question = { en: '', hi: '' };
            }
            q.options = (q.options || []).map((opt, i) => {
                if (typeof opt === 'string') { return { en: opt, hi: opt, index: i }; }
                return { en: opt?.en || '', hi: opt?.hi || opt?.en || '', index: i };
            });
            let correctAnswerEn = '', correctAnswerHi = '';
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
            q.correctAnswer = { en: correctAnswerEn.trim(), hi: (correctAnswerHi || correctAnswerEn).trim() };
            if (typeof q.explanation === 'string') {
                q.explanation = { en: q.explanation, hi: q.explanation };
            } else if (q.explanation && typeof q.explanation === 'object') {
                q.explanation = { en: q.explanation.en || '', hi: q.explanation.hi || q.explanation.en || '' };
            } else {
                q.explanation = { en: '', hi: '' };
            }
            q._normalized = true;
            return q;
        }

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

        let questions = [];
        let questionsSource = '';
        if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
            const raw = QUESTIONS_DATABASE[testId];
            questions = Array.isArray(raw) ? raw : (raw.questions || []);
            questionsSource = 'LOCAL';
            console.log('✅ LOCAL DB:', questions.length, 'questions');
        }
        if (!questions.length) {
            try {
                const response = await ExamAxisAPI.getQuestions(testId);
                if (response?.success && response?.data?.questions?.length) {
                    let apiQuestions = response.data.questions;
                    questionsSource = 'API';
                    console.log('📡 API:', apiQuestions.length, 'questions');
                    if (apiQuestions[0]?.correctAnswer) {
                        console.log('✅ API has correctAnswer');
                        questions = apiQuestions;
                    } else {
                        console.warn('⚠️ API missing correctAnswer');
                        if (typeof QUESTIONS_DATABASE !== 'undefined') {
                            const possibleKeys = [testId, testId.replace(/-/g, '_'), testId.replace(/_/g, '-')];
                            let localData = null;
                            for (const key of possibleKeys) {
                                if (QUESTIONS_DATABASE[key]) {
                                    localData = QUESTIONS_DATABASE[key];
                                    break;
                                }
                            }
                            if (localData) {
                                const localQuestions = Array.isArray(localData) ? localData : (localData.questions || []);
                                questions = apiQuestions.map((apiQ, i) => {
                                    const localQ = localQuestions[i];
                                    if (localQ) {
                                        return { ...apiQ, correctAnswer: localQ.correctAnswer, explanation: localQ.explanation };
                                    }
                                    return apiQ;
                                });
                            } else {
                                questions = apiQuestions;
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
        if (!questions.length) {
            document.body.innerHTML = `<div style="text-align:center;padding:50px;"><h1>No questions for: ${testId}</h1><a href="index.html">Go Back</a></div>`;
            return;
        }

// ========== ✅ IMPROVED FULL MOCK DETECTION ==========
const subjectName = testInfo.subject || 'General';

// Method 1: Check testId for fullmock keyword
const hasFullMockInId = testId && (
    testId.toLowerCase().includes('fullmock') || 
    testId.toLowerCase().includes('full_mock') ||
    testId.toLowerCase().includes('full-mock')
);

// Method 2: Check testInfo for section type
const hasFullMockSection = testInfo.section === 'fullmock' || testInfo.type === 'fullmock';

// Method 3: Check question count (SSC pattern: 100 questions)
const hasFullMockCount = questions.length === 100;

// Method 4: Check if questions already have multiple subjects
const existingSubjects = [...new Set(questions.map(q => q.subject).filter(Boolean))];
const hasMultipleSubjects = existingSubjects.length >= 4;

// Combine all methods
const isFullMockTest = hasFullMockInId || hasFullMockSection || (hasFullMockCount && !hasMultipleSubjects);

console.log('🔍 Full Mock Detection:');
console.log('  - Has "fullmock" in ID:', hasFullMockInId);
console.log('  - Has fullmock section:', hasFullMockSection);
console.log('  - Has 100 questions:', hasFullMockCount);
console.log('  - Has multiple subjects:', hasMultipleSubjects);
console.log('  - Final Decision:', isFullMockTest);

window.QUIZ_DATA.questions = questions.map((q, i) => {
    let assignedSubject;
    
    // If questions already have correct subjects, use them
    if (hasMultipleSubjects && q.subject) {
        assignedSubject = q.subject;
    }
    // Force subject assignment for full mock without subjects
    else if (isFullMockTest && questions.length === 100) {
        if (i < 25) {
            assignedSubject = 'maths';
        } else if (i < 50) {
            assignedSubject = 'english';
        } else if (i < 75) {
            assignedSubject = 'gk';
        } else {
            assignedSubject = 'reasoning';
        }
    } else {
        assignedSubject = q.subject || subjectName;
    }
    
    return {
        ...normalizeQuestion(q, i),
        originalIndex: i,
        subject: assignedSubject
    };
}).filter(q => q !== null);

        console.log(`✅ Loaded ${window.QUIZ_DATA.questions.length} questions from ${questionsSource}`);

        // ========== DETECT SECTIONS ==========
        function detectSections(questions) {
            console.log('🔍 Detecting sections from', questions.length, 'questions');
            const subjects = [...new Set(questions.map(q => q.subject))];
            console.log('📊 Unique subjects:', subjects);
            if (subjects.length <= 1) {
                console.log('⚠️ Only 1 subject - Not a full mock');
                return [];
            }
            console.log('✅ Multiple subjects - Creating sections...');
            const sections = [];
            const subjectLabels = {
                'maths': 'PART-A Mathematics',
                'english': 'PART-B English',
                'gk': 'PART-C General Awareness',
                'reasoning': 'PART-D Reasoning'
            };
            let currentSubject = null;
            let sectionStart = 0;
            questions.forEach((q, idx) => {
                if (q.subject !== currentSubject) {
                    if (currentSubject !== null) {
                        const newSection = {
                            subject: currentSubject,
                            label: subjectLabels[currentSubject] || currentSubject.toUpperCase(),
                            startIndex: sectionStart,
                            endIndex: idx - 1,
                            totalQuestions: idx - sectionStart
                        };
                        sections.push(newSection);
                        console.log('📌 Section created:', newSection);
                    }
                    currentSubject = q.subject;
                    sectionStart = idx;
                }
            });
            if (currentSubject !== null) {
                const lastSection = {
                    subject: currentSubject,
                    label: subjectLabels[currentSubject] || currentSubject.toUpperCase(),
                    startIndex: sectionStart,
                    endIndex: questions.length - 1,
                    totalQuestions: questions.length - sectionStart
                };
                sections.push(lastSection);
                console.log('📌 Last section created:', lastSection);
            }
            console.log('✅ Total sections:', sections.length);
            return sections;
        }

        console.log('🔍 Detecting sections...');
        const sections = detectSections(window.QUIZ_DATA.questions);
        console.log('📚 Sections detected:', sections);
        window.QUIZ_DATA.sections = sections;
        window.QUIZ_DATA.isFullMock = sections.length > 1;
        console.log('✅ isFullMock:', window.QUIZ_DATA.isFullMock);
        if (window.QUIZ_DATA.isFullMock) {
            window.QUIZ_DATA.currentSection = sections[0].subject;
            console.log('📌 Current section:', sections[0].subject);
            console.log('📚 Full Mock Detected:', sections.length, 'sections');
        }

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

        function filterQuestions(category) {
            const cat = category.toLowerCase().trim();
            const QD = window.QUIZ_DATA;
            const all = QD.questions.map((q, i) => ({ ...q, index: i, state: QD.questionStates[i] }));
            if (cat === 'all' || cat === 'overview') return all;
            if (cat === 'correct') return all.filter(x => x.state?.resultCategory === 'correct');
            if (cat === 'incorrect') return all.filter(x => x.state?.resultCategory === 'incorrect');
            if (cat === 'unattempted') return all.filter(x => x.state?.resultCategory === 'unattempted');
            if (cat === 'marked for review') return all.filter(x => x.state?.markedForReview);
            return all;
        }

        function showReviewQuestion(index) {
            const QD = window.QUIZ_DATA;
            QD.currentReviewIndex = index;
            if (!QD.reviewQuestionList.length || index < 0 || index >= QD.reviewQuestionList.length) return;
            const item = QD.reviewQuestionList[index];
            const q = item;
            const state = item.state || QD.questionStates[item.index];
            const lang = QD.currentLanguage;
            if (reviewQuestionTitle) {
                reviewQuestionTitle.textContent = `Question ${index + 1} of ${QD.reviewQuestionList.length} (Q${item.index + 1})`;
            }
            const correctText = getCorrectAnswer(q, lang);
            const correctIdx = findCorrectOptionIndex(q, lang);
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
            let optionsHTML = '';
            q.options.forEach((opt, i) => {
                const optText = opt[lang] || opt.en || '';
                const letter = String.fromCharCode(65 + i);
                const isCorrect = (i === correctIdx);
                const isUser = (i === userIdx);
                let bgColor = '#f9fafb', borderColor = '#e5e7eb', indicatorHTML = '';
                if (isCorrect && isUser) {
                    bgColor = '#dcfce7'; borderColor = '#22c55e';
                    indicatorHTML = `<span style="margin-left:auto;padding-left:12px;color:#16a34a;font-weight:700;">✓ Correct!</span>`;
                } else if (isCorrect) {
                    bgColor = '#dcfce7'; borderColor = '#22c55e';
                    indicatorHTML = `<span style="margin-left:auto;padding-left:12px;color:#16a34a;font-weight:700;">✓ Correct Answer</span>`;
                } else if (isUser) {
                    bgColor = '#fee2e2'; borderColor = '#ef4444';
                    indicatorHTML = `<span style="margin-left:auto;padding-left:12px;color:#dc2626;font-weight:700;">✗ Your Answer</span>`;
                }
                const radioColor = isUser ? (isCorrect ? '#22c55e' : '#ef4444') : '#d1d5db';
                const radioFill = isUser ? radioColor : 'transparent';
                optionsHTML += `<div style="display:flex;align-items:center;background:${bgColor};border:2px solid ${borderColor};border-radius:10px;padding:14px 18px;margin-bottom:12px;"><span style="font-weight:700;min-width:28px;color:#374151;">${letter}.</span><span style="width:20px;height:20px;border:2px solid ${radioColor};border-radius:50%;margin-right:14px;flex-shrink:0;background:${radioFill};display:flex;align-items:center;justify-content:center;">${isUser ? '<span style="width:8px;height:8px;background:white;border-radius:50%;"></span>' : ''}</span><span style="flex:1;color:#1f2937;">${safeRender(optText)}</span>${indicatorHTML}</div>`;
            });
            const qText = q.question?.[lang] || q.question?.en || '';
            let statusNote = '';
            if (state.userAnswer === null) {
                statusNote = `<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:10px;padding:14px 18px;margin-top:16px;color:#92400e;font-weight:500;">⚠️ Not Attempted - Correct answer highlighted above</div>`;
            }
            if (reviewQuestionCard) {
                reviewQuestionCard.innerHTML = `<div style="font-size:17px;line-height:1.7;margin-bottom:24px;color:#1f2937;"><span style="font-weight:700;color:#4f46e5;">Q${item.index + 1}.</span> ${safeRender(qText)}</div><div>${optionsHTML}</div>${statusNote}`;
            }
            const explText = q.explanation?.[lang] || q.explanation?.en || '';
            if (reviewSolutionText) {
                reviewSolutionText.innerHTML = explText?.trim() ? `<div style="color:#374151;line-height:1.7;">${safeRender(explText)}</div>` : `<em style="color:#9ca3af;">No explanation available.</em>`;
            }
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

        const startBtn = $('start-test-btn');
        if (startBtn) {
            const newBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newBtn, startBtn);
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.QUIZ_DATA.isQuizStarted) return;
                window.QUIZ_DATA.isQuizStarted = true;
                SECURITY.enableExamMode();
                if (instructionsModal) instructionsModal.classList.add('hidden');
                if (quizUI) quizUI.classList.remove('hidden');
                initQuiz();
            });
        }

        function setupPauseResume() {
            if (pauseBtn) {
                pauseBtn.onclick = () => {
                    if (window.QUIZ_DATA.isSubmitted) return;
                    window.QUIZ_DATA.isPaused = true;
                    if (pauseOverlay) pauseOverlay.classList.remove('hidden');
                    console.log('⏸️ Quiz paused');
                };
            }
            if (resumeBtn) {
                resumeBtn.onclick = () => {
                    window.QUIZ_DATA.isPaused = false;
                    if (pauseOverlay) pauseOverlay.classList.add('hidden');
                    console.log('▶️ Quiz resumed');
                };
            }
        }
        setupPauseResume();

        // ========== INIT QUIZ ==========
        function initQuiz() {
            const QD = window.QUIZ_DATA;
            const questions = QD.questions;
            const duration = QD.testInfo.duration || (QD.testInfo.section === 'fullmock' ? 60 : 25);
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
            if (submitSummaryModal) submitSummaryModal.classList.add('hidden');

            // ========== RENDER SECTION TABS ==========
            function renderSectionTabs() {
                console.log('🔍 renderSectionTabs called');
                console.log('🔍 QD.isFullMock:', QD.isFullMock);
                console.log('🔍 QD.sections:', QD.sections);
                const tabsContainer = document.getElementById('section-tabs-container');
                console.log('🔍 tabsContainer element:', tabsContainer);
                if (!tabsContainer) {
                    console.error('❌ ERROR: section-tabs-container NOT FOUND in DOM!');
                    return;
                }
                if (!QD.isFullMock) {
                    console.log('⚠️ Not a full mock test, hiding tabs');
                    tabsContainer.style.display = 'none';
                    return;
                }
                console.log('✅ Rendering section tabs...');
                tabsContainer.style.display = 'flex';
                tabsContainer.innerHTML = '';
                QD.sections.forEach((section, idx) => {
                    console.log(`📌 Creating tab for: ${section.label}`);
                    const tab = document.createElement('button');
                    tab.className = 'section-tab';
                    tab.dataset.section = section.subject;
                    const answeredCount = QD.questionStates.slice(section.startIndex, section.endIndex + 1).filter(s => s.status === 'answered').length;
                    tab.innerHTML = `<div>${section.label}</div><div class="section-progress">${answeredCount}/${section.totalQuestions}</div>`;
                    tab.onclick = () => {
                        console.log(`🖱️ Clicked section: ${section.label}`);
                        saveAnswer();
                        QD.currentSection = section.subject;
                        showQuestion(section.startIndex);
                        updateSectionTabs();
                    };
                    tabsContainer.appendChild(tab);
                    console.log(`✅ Tab ${idx + 1} appended to container`);
                });
                console.log('✅ All tabs rendered, calling updateSectionTabs()');
                updateSectionTabs();
            }

            function updateSectionTabs() {
                const tabsContainer = document.getElementById('section-tabs-container');
                if (!tabsContainer || !QD.isFullMock) return;
                tabsContainer.querySelectorAll('.section-tab').forEach(tab => {
                    const section = QD.sections.find(s => s.subject === tab.dataset.section);
                    if (!section) return;
                    const isActive = QD.currentSection === section.subject;
                    tab.classList.toggle('active', isActive);
                    const answeredCount = QD.questionStates.slice(section.startIndex, section.endIndex + 1).filter(s => s.status === 'answered').length;
                    const progressEl = tab.querySelector('.section-progress');
                    if (progressEl) progressEl.textContent = `${answeredCount}/${section.totalQuestions}`;
                });
            }

            function showSubmitModal() {
                if (!submitSummaryModal) return;
                const answered = QD.questionStates.filter(s => s.status === 'answered').length;
                const notAnswered = QD.questionStates.filter(s => s.status === 'not-answered').length;
                const notVisited = QD.questionStates.filter(s => s.status === 'not-visited').length;
                const marked = QD.questionStates.filter(s => s.markedForReview).length;
                if (submissionStatsEl) {
                    submissionStatsEl.innerHTML = `<div style="margin:10px 0;">Answered: <strong>${answered}/${questions.length}</strong></div><div style="margin:10px 0;">Not Answered: <strong>${notAnswered}</strong></div><div style="margin:10px 0;">Not Visited: <strong>${notVisited}</strong></div><div style="margin:10px 0;">Marked For Review: <strong>${marked}</strong></div>`;
                }
                submitSummaryModal.classList.remove('hidden');
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

            function formatTime(totalSeconds) {
                const secs = Math.max(0, Math.floor(totalSeconds));
                const m = Math.floor(secs / 60);
                const s = secs % 60;
                return `${m}:${String(s).padStart(2, '0')}`;
            }

            function startTimer() {
                if (!timerEl) return;
                clearInterval(QD.timerInterval);
                const update = () => {
                    let remainingTotal = 0;
                    for (const s in QD.sectionTimeRemaining) {
                        remainingTotal += (QD.sectionTimeRemaining[s] || 0);
                    }
                    timerEl.textContent = formatTime(remainingTotal);
                    if (remainingTotal <= 60) {
                        timerEl.style.color = '#ef4444';
                        timerEl.style.fontWeight = 'bold';
                    } else if (remainingTotal <= 300) {
                        timerEl.style.color = '#f59e0b';
                    }
                };
                update();
                QD.timerInterval = setInterval(() => {
                    if (!QD.isQuizStarted || QD.isSubmitted) return;
                    if (QD.isPaused) return;
                    const currentSubject = questions[QD.currentQuestionIndex]?.subject;
                    if (currentSubject && typeof QD.sectionTimeRemaining[currentSubject] === 'number') {
                        QD.sectionTimeRemaining[currentSubject] = Math.max(0, QD.sectionTimeRemaining[currentSubject] - 1);
                    }
                    update();
                    let remainingTotal = 0;
                    for (const s in QD.sectionTimeRemaining) remainingTotal += (QD.sectionTimeRemaining[s] || 0);
                    if (remainingTotal <= 0 && !QD.isSubmitted) {
                        QD.isSubmitted = true;
                        SECURITY.showWarning('⏰ Time is up! Submitting your test...', 'warning');
                        setTimeout(() => { submitQuiz(); }, 1500);
                    }
                }, 1000);
            }

            function submitQuiz() {
                clearInterval(QD.timerInterval);
                SECURITY.disableExamMode();
                let remaining = 0;
                for (let s in QD.sectionTimeRemaining) remaining += QD.sectionTimeRemaining[s];
                const timeTaken = QD.totalInitialTime - remaining;
                const mins = Math.floor(timeTaken / 60);
                const secs = timeTaken % 60;
                let correct = 0, incorrect = 0, unattempted = 0, score = 0;
                QD.questionStates.forEach((state, i) => {
                    const q = questions[i];
                    const correctText = getCorrectAnswer(q, 'en');
                    if (state.userAnswer !== null && state.userAnswer !== '') {
                        const isMatch = textsMatch(state.userAnswer, correctText) || state.userAnswer === correctText || state.userAnswer?.trim() === correctText?.trim();
                        if (isMatch) {
                            correct++; score += 2; state.resultCategory = 'correct';
                        } else {
                            incorrect++; score -= 0.5; state.resultCategory = 'incorrect';
                        }
                    } else {
                        unattempted++; state.resultCategory = 'unattempted';
                    }
                });
                console.log('📊 Results:', { correct, incorrect, unattempted, score });
                const accuracy = (correct + incorrect) > 0 ? (correct / (correct + incorrect)) * 100 : 0;
                QD.reviewQuestionList = filterQuestions('all');
                try {
                    const attemptPayload = {
                        testId: String(QD.testInfo.id || testId), testInfo: QD.testInfo, questions, questionStates: QD.questionStates,
                        score: Number(score.toFixed(2)), correct, incorrect, unattempted, accuracy: Number(accuracy.toFixed(1)),
                        timeTaken: { mins, secs }, timestamp: Date.now()
                    };
                    localStorage.setItem('testResult', JSON.stringify(attemptPayload));
                } catch (e) { console.error('Failed to save result to localStorage:', e); }
                const reviewArea = $('review-button-area');
                if (reviewArea) {
                    reviewArea.innerHTML = `<div style="margin-bottom:20px;"><h3>${QD.testInfo.title}</h3><p style="color:#6b7280;">Questions: ${questions.length} | Max: ${questions.length * 2}</p></div><div style="display:flex;gap:12px;flex-wrap:wrap;"><button id="review-test-btn" style="background:#4f46e5;color:white;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;font-weight:600;">📝 Review</button><a href="result.html" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">📊 Results</a><a href="index.html" style="background:#e5e7eb;color:#374151;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">🏠 Tests</a></div>`;
                }
                const statsArea = $('stats-cards-area');
                if (statsArea) {
                    statsArea.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-top:20px;"><div style="background:#f0fdf4;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#166534;">${score.toFixed(1)}</div><div style="color:#6b7280;">Score</div></div><div style="background:#dcfce7;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#16a34a;">${correct}</div><div style="color:#6b7280;">Correct</div></div><div style="background:#fee2e2;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#dc2626;">${incorrect}</div><div style="color:#6b7280;">Incorrect</div></div><div style="background:#fef3c7;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#d97706;">${unattempted}</div><div style="color:#6b7280;">Skipped</div></div><div style="background:#f3f4f6;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#374151;">${mins}:${secs.toString().padStart(2,'0')}</div><div style="color:#6b7280;">Time</div></div><div style="background:#eff6ff;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#2563eb;">${accuracy.toFixed(0)}%</div><div style="color:#6b7280;">Accuracy</div></div></div>`;
                }
                setTimeout(() => {
                    const revBtn = $('review-test-btn');
                    if (revBtn) revBtn.onclick = () => { window.location.href = 'review.html'; };
                }, 100);
                bindTabs();
                quizUI?.classList.add('hidden');
                resultSummaryPage?.classList.remove('hidden');
                document.body.classList.add('results-scroll');
                if (window.ExamAxisAPI?.isLoggedIn()) {
                    const answersObj = {};
                    QD.questionStates.forEach((state, i) => {
                        answersObj[i] = { userAnswer: state.userAnswer, isCorrect: state.resultCategory === 'correct' };
                    });
                    const attemptData = {
                        testId: String(QD.testInfo.id || testId), examType: 'CGL', subject: subjectName || 'Mathematics',
                        score: Number(score.toFixed(2)), totalMarks: questions.length * 2, correctAnswers: correct,
                        wrongAnswers: incorrect, unanswered: unattempted, timeTaken: mins, answers: answersObj
                    };
                    ExamAxisAPI.saveTestAttempt(attemptData).then(result => {
                        console.log(result.success ? '✅ Saved to backend' : '⚠️ Failed to save:', result.message);
                    }).catch(err => { console.warn('⚠️ Backend save error:', err.message); });
                }
            }

            function createPalette() {
                if (!questionPalette) return;
                questionPalette.innerHTML = '';
                if (QD.isFullMock && QD.currentSection) {
                    const section = QD.sections.find(s => s.subject === QD.currentSection);
                    if (!section) return;
                    for (let i = section.startIndex; i <= section.endIndex; i++) {
                        const btn = document.createElement('button');
                        btn.className = 'palette-btn not-visited';
                        btn.textContent = i - section.startIndex + 1;
                        btn.dataset.globalIndex = i;
                        btn.onclick = () => { saveAnswer(); showQuestion(i); };
                        questionPalette.appendChild(btn);
                    }
                } else {
                    questions.forEach((_, i) => {
                        const btn = document.createElement('button');
                        btn.className = 'palette-btn not-visited';
                        btn.textContent = i + 1;
                        btn.onclick = () => { saveAnswer(); showQuestion(i); };
                        questionPalette.appendChild(btn);
                    });
                }
            }

            function updatePalette() {
                if (!questionPalette) return;
                questionPalette.querySelectorAll('.palette-btn').forEach((btn, btnIndex) => {
                    const globalIndex = QD.isFullMock ? parseInt(btn.dataset.globalIndex) : btnIndex;
                    const st = QD.questionStates[globalIndex];
                    btn.className = 'palette-btn';
                    if (st.userAnswer && st.markedForReview) btn.classList.add('answered-marked-review');
                    else if (st.markedForReview) btn.classList.add('marked-review');
                    else if (st.userAnswer) btn.classList.add('answered');
                    else if (st.status === 'not-answered') btn.classList.add('not-answered');
                    else btn.classList.add('not-visited');
                    if (globalIndex === QD.currentQuestionIndex) btn.classList.add('current');
                });
                if (QD.isFullMock) updateSectionTabs();
            }

            function showQuestion(index) {
                if (index < 0 || index >= questions.length) return;
                QD.currentQuestionIndex = index;
                const q = questions[index];
                const state = QD.questionStates[index];
                const lang = QD.currentLanguage;
                if (QD.isFullMock) {
                    const section = QD.sections.find(s => index >= s.startIndex && index <= s.endIndex);
                    if (section && section.subject !== QD.currentSection) {
                        QD.currentSection = section.subject;
                        createPalette();
                    }
                }
                if (state.status === 'not-visited') state.status = 'not-answered';
                if (questionTitle) {
                    if (QD.isFullMock) {
                        const section = QD.sections.find(s => index >= s.startIndex && index <= s.endIndex);
                        if (section) {
                            const sectionQNum = index - section.startIndex + 1;
                            questionTitle.textContent = `${section.label} | Q${sectionQNum} of ${section.totalQuestions}`;
                        }
                    } else {
                        questionTitle.textContent = `${q.subject} | Q${index + 1} of ${questions.length}`;
                    }
                }
                const qText = q.question?.[lang] || q.question?.en || '';
                let optionsHTML = '';
                q.options.forEach((opt, i) => {
                    const text = opt[lang] || opt.en || '';
                    const value = opt.en || text;
                    const isChecked = state.userAnswer === value;
                    const letter = String.fromCharCode(65 + i);
                    optionsHTML += `<label style="display:flex;align-items:center;background:${isChecked ? '#eff6ff' : '#f8fafc'};border:2px solid ${isChecked ? '#3b82f6' : '#e2e8f0'};border-radius:10px;padding:14px 18px;margin-bottom:12px;cursor:pointer;transition:all 0.2s;"><span style="font-weight:700;min-width:28px;">${letter}.</span><input type="radio" name="option" value="${escapeHtml(value)}" ${isChecked ? 'checked' : ''} style="width:20px;height:20px;margin-right:14px;accent-color:#3b82f6;"><span style="flex:1;">${safeRender(text)}</span></label>`;
                });
                if (questionArea) {
                    questionArea.innerHTML = `<div style="font-size:17px;line-height:1.7;margin-bottom:24px;"><span style="font-weight:700;color:#4f46e5;">Q${index + 1}.</span> ${safeRender(qText)}</div>${optionsHTML}`;
                    questionArea.querySelectorAll('label').forEach(label => {
                        label.addEventListener('click', () => { setTimeout(updatePalette, 10); });
                    });
                }
                updateNav();
                updatePalette();
                if (window.MathJax) try { MathJax.typeset(); } catch(e) {}
            }

            function updateNav() {
                if (prevBtn) prevBtn.disabled = QD.currentQuestionIndex === 0;
                if (nextBtn) nextBtn.textContent = QD.currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Save & Next';
            }

            function saveAnswer() {
                const sel = document.querySelector('input[name="option"]:checked');
                const state = QD.questionStates[QD.currentQuestionIndex];
                state.userAnswer = sel ? sel.value : null;
                state.status = sel ? 'answered' : 'not-answered';
                updatePalette();
            }

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
                    QD.questionStates[QD.currentQuestionIndex].markedForReview = !QD.questionStates[QD.currentQuestionIndex].markedForReview;
                    saveAnswer();
                    if (QD.currentQuestionIndex < questions.length - 1) {
                        showQuestion(QD.currentQuestionIndex + 1);
                    } else {
                        updatePalette();
                    }
                };
            }
            if (clearResponseBtn) {
                clearResponseBtn.onclick = () => {
                    QD.questionStates[QD.currentQuestionIndex].userAnswer = null;
                    QD.questionStates[QD.currentQuestionIndex].status = 'not-answered';
                    document.querySelectorAll('input[name="option"]:checked').forEach(r => r.checked = false);
                    updatePalette();
                };
            }

            // ========== INITIALIZE ==========
            console.log('🚀 Initializing Quiz UI...');
            console.log('📊 isFullMock:', QD.isFullMock);
            console.log('📊 Sections:', QD.sections);
            console.log('📊 Questions:', QD.questions.length);

            if (QD.isFullMock) {
                console.log('✅ Full Mock Detected - Rendering Section Tabs');
                renderSectionTabs();
            } else {
                console.log('⚠️ Not a full mock - Skipping section tabs');
            }

            createPalette();
            showQuestion(0);
            updatePalette();
            startTimer();
            console.log('✅ Quiz initialized and ready!');
        }

        document.addEventListener('keydown', (e) => {
            const QD = window.QUIZ_DATA;
            if (!QD.isQuizStarted || QD.isSubmitted || QD.isPaused) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            switch(e.key) {
                case 'ArrowRight': case 'n': case 'N':
                    if (nextBtn && !nextBtn.disabled) nextBtn.click();
                    break;
                case 'ArrowLeft': case 'p': case 'P':
                    if (prevBtn && !prevBtn.disabled) prevBtn.click();
                    break;
                case '1': case '2': case '3': case '4':
                    const optionIndex = parseInt(e.key) - 1;
                    const options = document.querySelectorAll('input[name="option"]');
                    if (options[optionIndex]) {
                        options[optionIndex].checked = true;
                        options[optionIndex].dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    break;
                case 'm': case 'M':
                    if (markReviewBtn) markReviewBtn.click();
                    break;
                case 'c': case 'C':
                    if (!e.ctrlKey && !e.metaKey && clearResponseBtn) clearResponseBtn.click();
                    break;
            }
        });

    });

})();