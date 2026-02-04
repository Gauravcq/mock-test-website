// test-logic.js - FINAL VERSION v9 with SECURITY
// Features: Anti-copy, Anti-console, Anti-inspect, Tab detection
(function() {
    'use strict';

    // ========== SECURITY FEATURES ==========
    const SECURITY = {
        enabled: true,  // Set to false during development
        
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

        // 1. Disable Copy/Paste (only when exam is running)
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

        // 2. Disable Right Click (only when exam is running)
        disableRightClick() {
            document.addEventListener('contextmenu', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;
                e.preventDefault();
                this.showWarning('Right-click is disabled during exam!');
                return false;
            });
        },

        // 3. Disable Text Selection
        disableTextSelection() {
            // CSS approach
            const style = document.createElement('style');
            style.textContent = `
                body.exam-mode,
                body.exam-mode * {
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

            // JS approach
            document.addEventListener('selectstart', (e) => {
                if (document.body.classList.contains('exam-mode')) {
                    e.preventDefault();
                    return false;
                }
            });
        },

        // 4. Disable Keyboard Shortcuts (only when exam is running)
        disableKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (!document.body.classList.contains('exam-mode')) return;

                // Ctrl/Cmd combinations
                if (e.ctrlKey || e.metaKey) {
                    const blockedKeys = [
                        'c', 'C',  // Copy
                        'v', 'V',  // Paste
                        'x', 'X',  // Cut
                        'a', 'A',  // Select All
                        's', 'S',  // Save
                        'p', 'P',  // Print
                        'u', 'U',  // View Source
                        'i', 'I',  // Dev Tools (Inspect)
                        'j', 'J',  // Dev Tools (Console)
                        'k', 'K',  // Dev Tools
                    ];
                    
                    if (blockedKeys.includes(e.key)) {
                        e.preventDefault();
                        this.showWarning('This shortcut is disabled during exam!');
                        return false;
                    }

                    // Ctrl+Shift+S / Cmd+Shift+3/4/5 - Screenshot (Mac/Windows)
                    if (e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5')) {
                        e.preventDefault();
                        this.showWarning('Screenshots are not allowed during exam!');
                        return false;
                    }

                    // Ctrl+Shift combinations
                    if (e.shiftKey) {
                        const blockedShiftKeys = [
                            'i', 'I',  // Dev Tools
                            'j', 'J',  // Console
                            'c', 'C',  // Inspect
                        ];
                        if (blockedShiftKeys.includes(e.key)) {
                            e.preventDefault();
                            this.showWarning('Developer tools are disabled during exam!');
                            return false;
                        }
                    }
                }

                // Win+Shift+S (Windows Snipping Tool / screenshot) - block Shift+S in exam
                if (e.shiftKey && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showWarning('Screenshots are not allowed during exam!');
                    navigator.clipboard.writeText('').catch(() => {});
                    return false;
                }

                // F12 - Dev Tools
                if (e.key === 'F12') {
                    e.preventDefault();
                    this.showWarning('Developer tools are disabled during exam!');
                    return false;
                }

                // F7 - Caret browsing
                if (e.key === 'F7') {
                    e.preventDefault();
                    return false;
                }

                // PrintScreen / Screenshot keys (only during running test - not on review/result page)
                const isScreenshotKey = e.key === 'PrintScreen' ||
                    (e.keyCode === 44) ||
                    (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key));
                if (isScreenshotKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showWarning('Screenshots are not allowed during exam!');
                    navigator.clipboard.writeText('').catch(() => {});
                    return false;
                }
            });

            // keyup: some systems fire PrintScreen on keyup
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

        // 5. Disable/Detect Console
        disableConsole() {
            // Override console methods
            const noop = () => {};
            const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 'timeEnd', 'timeStamp'];
            
            // Store original console for internal use
            window._originalConsole = { ...console };
            
            methods.forEach(method => {
                console[method] = noop;
            });

            // Detect if console is opened
            const element = new Image();
            Object.defineProperty(element, 'id', {
                get: () => {
                    this.handleDevToolsOpen();
                }
            });
            
            // Periodically check
            setInterval(() => {
                console.log(element);
                console.clear();
            }, 1000);
        },

        // 6. Detect DevTools
        detectDevTools() {
            const threshold = 160;
            
            const checkDevTools = () => {
                const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                
                if (widthThreshold || heightThreshold) {
                    this.handleDevToolsOpen();
                }
            };

            // Check on resize
            window.addEventListener('resize', checkDevTools);
            
            // Periodic check
            setInterval(checkDevTools, 1000);

            // Debugger detection
            setInterval(() => {
                const startTime = performance.now();
                debugger;
                const endTime = performance.now();
                if (endTime - startTime > 100) {
                    this.handleDevToolsOpen();
                }
            }, 1000);
        },

        // 7. Detect Tab Switch / Visibility
        detectTabSwitch() {
            let tabSwitchCount = 0;
            const maxTabSwitches = 3;

            document.addEventListener('visibilitychange', () => {
                if (document.hidden && window.QUIZ_DATA?.isQuizStarted && !window.QUIZ_DATA?.isSubmitted) {
                    tabSwitchCount++;
                    
                    if (tabSwitchCount >= maxTabSwitches) {
                        this.showWarning(`⚠️ WARNING: You have switched tabs ${tabSwitchCount} times! Your test may be auto-submitted.`, 'error');
                        // Optional: Auto-submit
                        // document.getElementById('final-submit-btn')?.click();
                    } else {
                        this.showWarning(`⚠️ Tab switch detected! (${tabSwitchCount}/${maxTabSwitches}) Please stay on this page.`, 'warning');
                    }

                    // Log the event
                    window._originalConsole?.warn?.(`Tab switch detected: ${tabSwitchCount}`);
                }
            });

            // Detect window blur
            window.addEventListener('blur', () => {
                if (window.QUIZ_DATA?.isQuizStarted && !window.QUIZ_DATA?.isSubmitted) {
                    window._originalConsole?.warn?.('Window lost focus');
                }
            });
        },

        // 8. Disable Drag and Drop
        disableDragDrop() {
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });

            document.addEventListener('drop', (e) => {
                e.preventDefault();
                return false;
            });
        },

        // 9. Disable Print
        disablePrint() {
            // CSS to hide content when printing
            const style = document.createElement('style');
            style.textContent = `
                @media print {
                    body * {
                        display: none !important;
                    }
                    body::after {
                        content: "Printing is not allowed during exam.";
                        display: block !important;
                        font-size: 24px;
                        text-align: center;
                        padding: 50px;
                    }
                }
            `;
            document.head.appendChild(style);

            // Detect print attempt
            window.addEventListener('beforeprint', (e) => {
                e.preventDefault();
                this.showWarning('Printing is not allowed during exam!');
            });

            // Override print function
            window.print = () => {
                this.showWarning('Printing is not allowed during exam!');
            };
        },

        // Handle DevTools Open
        handleDevToolsOpen() {
            // You can customize this action
            // Options: Show warning, blur content, submit test, etc.
            if (!this._devToolsWarningShown) {
                this._devToolsWarningShown = true;
                this.showWarning('⚠️ Developer tools detected! This activity is being logged.', 'error');
                
                // Optional: Blur the exam content
                // document.getElementById('quiz-ui')?.style.filter = 'blur(10px)';
                
                // Reset after 5 seconds
                setTimeout(() => {
                    this._devToolsWarningShown = false;
                }, 5000);
            }
        },

        // Show Warning Popup
        showWarning(message, type = 'warning') {
            // Remove existing warning
            const existing = document.getElementById('security-warning');
            if (existing) existing.remove();

            const colors = {
                warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
                error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
            };

            const color = colors[type] || colors.warning;

            const warning = document.createElement('div');
            warning.id = 'security-warning';
            warning.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: ${color.bg};
                    border: 2px solid ${color.border};
                    color: ${color.text};
                    padding: 15px 25px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 14px;
                    z-index: 999999;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    animation: slideDown 0.3s ease;
                    max-width: 90%;
                    text-align: center;
                ">
                    ${message}
                </div>
                <style>
                    @keyframes slideDown {
                        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                        to { transform: translateX(-50%) translateY(0); opacity: 1; }
                    }
                </style>
            `;
            document.body.appendChild(warning);

            // Auto remove after 3 seconds
            setTimeout(() => {
                warning.remove();
            }, 3000);
        },

        // Enable exam mode (call when quiz starts)
        enableExamMode() {
            document.body.classList.add('exam-mode');
            window._originalConsole?.log?.('🔒 Exam mode enabled');
        },

        // Disable exam mode (call when quiz ends)
        disableExamMode() {
            document.body.classList.remove('exam-mode');
            window._originalConsole?.log?.('🔓 Exam mode disabled');
        }
    };

    // ========== PREMIUM ACCESS CHECK ==========
    async function checkPremiumAccess(testId) {
        // If no testId, allow (will fail later with different error)
        if (!testId) return true;
        
        // Define free test IDs for each category
        // These are the FIRST tests in each category that are free
        const FREE_TESTS = {
            // CGL - First sectional of each subject + first full mock
            CGL_MATHS: 'ssc_cgl_12_sep_s1',
            CGL_REASONING: 'ssc_cgl_12_sep_s1-r',
            CGL_ENGLISH: 'ssc_cgl_eng_12_sep_s1',
            CGL_GK: 'ssc_cgl_gk_12_sep_s1',
            CGL_FULLMOCK: 'ssc_cgl_fullmock_12_sep_s1',
            
            // CHSL - First sectional of each subject + first full mock
            CHSL_MATHS: 'ssc_chsl_maths_12_nov_s1',
            CHSL_REASONING: 'ssc_chsl_reasoning_12_nov_s1',
            CHSL_ENGLISH: 'ssc_chsl_eng_12_nov_s1',
            CHSL_GK: 'ssc_chsl_gk_12_nov_s1',
            CHSL_TOP100: 'CHSL_TOP_100_MATHS',
            
            // DP - First sectional of each subject
            DP_REASONING: 'dp_constable_reasoning_s1'
        };
        
        // Check if this test is in the free list
        const freeTestIds = Object.values(FREE_TESTS);
        const isFreeTest = freeTestIds.includes(testId);
        
        // If it's a free test, allow access
        if (isFreeTest) {
            window._originalConsole?.log?.('✅ Free test - access granted');
            return true;
        }
        
        // Check premium status from API
        try {
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000/api'
                : 'https://exam-axis-backend.vercel.app/api';
            
            const response = await fetch(`${API_URL}/payment/premium-status`, {
                headers: {
                    'Authorization': `Bearer ${ExamAxisAPI.getToken()}`
                }
            });
            
            const data = await response.json();
            
            if (data.success && data.data && data.data.isPremium) {
                window._originalConsole?.log?.('✅ Premium user - access granted');
                return true;
            }
        } catch (error) {
            window._originalConsole?.error?.('Premium check error:', error);
        }
        
        // User is not premium and test is not free - show upgrade message
        window._originalConsole?.warn?.('🔒 Premium test - access denied');
        
        // Show alert and redirect
        const userChoice = confirm(
            '🔒 Premium Content\n\n' +
            'This test is available for Premium Members only.\n\n' +
            'Would you like to upgrade to Premium for just ₹99 (Lifetime Access)?\n\n' +
            'Click OK to upgrade, or Cancel to go back.'
        );
        
        if (userChoice) {
            window.location.href = 'payment.html';
        } else {
            window.location.href = 'index.html';
        }
        
        return false;
    }

    // ========== QUIZ DATA ==========
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
        // Initialize security (but don't enable exam mode yet)
        SECURITY.init();

        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('testId') || urlParams.get('id');

        window._originalConsole?.log?.('🔍 TestId from URL:', testId);

        if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }
        
        // ========== PREMIUM ACCESS CHECK ==========
        // Check if user has access to this test
        const premiumCheckPassed = await checkPremiumAccess(testId);
        if (!premiumCheckPassed) {
            return; // User redirected to payment or index page
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

        // ========== NORMALIZE QUESTION ==========
        function normalizeQuestion(raw, index) {
            if (!raw) return null;
            if (raw._normalized) return raw;
            
            const q = JSON.parse(JSON.stringify(raw));

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

            if (index < 3) {
                window._originalConsole?.log?.(`✅ Q${index + 1}:`, {
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

        // ========== LOAD QUESTIONS ==========
        let questions = [];
        let questionsSource = '';

        if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
            const raw = QUESTIONS_DATABASE[testId];
            questions = Array.isArray(raw) ? raw : (raw.questions || []);
            questionsSource = 'LOCAL';
            window._originalConsole?.log?.('✅ LOCAL DB:', questions.length, 'questions');
        }

        if (!questions.length) {
            try {
                const response = await ExamAxisAPI.getQuestions(testId);
                if (response?.success && response?.data?.questions?.length) {
                    let apiQuestions = response.data.questions;
                    questionsSource = 'API';
                    window._originalConsole?.log?.('📡 API:', apiQuestions.length, 'questions');
                    
                    if (apiQuestions[0]?.correctAnswer) {
                        window._originalConsole?.log?.('✅ API has correctAnswer');
                        questions = apiQuestions;
                    } else {
                        window._originalConsole?.warn?.('⚠️ API missing correctAnswer');
                        
                        if (typeof QUESTIONS_DATABASE !== 'undefined') {
                            const possibleKeys = [
                                testId,
                                testId.replace(/-/g, '_'),
                                testId.replace(/_/g, '-')
                            ];
                            
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
                                        return {
                                            ...apiQ,
                                            correctAnswer: localQ.correctAnswer,
                                            explanation: localQ.explanation
                                        };
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
                window._originalConsole?.warn?.('⚠️ API failed:', e.message);
            }
        }

        if (!questions.length) {
            document.body.innerHTML = `
                <div style="text-align:center;padding:50px;">
                    <h1>No questions for: ${testId}</h1>
                    <a href="index.html">Go Back</a>
                </div>`;
            return;
        }

        const subjectName = testInfo.subject || 'General';
        
        window.QUIZ_DATA.questions = questions.map((q, i) => ({
            ...normalizeQuestion(q, i),
            originalIndex: i,
            subject: subjectName
        })).filter(q => q !== null);

        window._originalConsole?.log?.(`✅ Loaded ${window.QUIZ_DATA.questions.length} questions from ${questionsSource}`);

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

            const explText = q.explanation?.[lang] || q.explanation?.en || '';

            if (reviewSolutionText) {
                reviewSolutionText.innerHTML = explText?.trim() 
                    ? `<div style="color:#374151;line-height:1.7;">${safeRender(explText)}</div>`
                    : `<em style="color:#9ca3af;">No explanation available.</em>`;
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
        quizUI?.classList.add('hidden');
        resultSummaryPage?.classList.remove('hidden');
        document.body.classList.add('results-scroll');

        // Save to backend
        if (window.ExamAxisAPI?.isLoggedIn()) {
            const answersObj = {};
            QD.questionStates.forEach((state, i) => {
                answersObj[i] = {
                    userAnswer: state.userAnswer,
                    isCorrect: state.resultCategory === 'correct'
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
                
                // 🔓 Disable exam mode after submission
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

                window._originalConsole?.log?.('✅ Results:', { correct, incorrect, unattempted, score });

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

                // Save to backend
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
                        examType: 'CGL',
                        subject: subjectName || 'Mathematics',
                        score: Number(score.toFixed(2)),
                        totalMarks: questions.length * 2,
                        correctAnswers: correct,
                        wrongAnswers: incorrect,
                        unanswered: unattempted,
                        timeTaken: mins,
                        answers: answersObj
                    };

                    ExamAxisAPI.saveTestAttempt(attemptData)
                        .then(result => {
                            window._originalConsole?.log?.(result.success ? '✅ Saved' : '⚠️ Failed:', result.message);
                        })
                        .catch(err => {
                            window._originalConsole?.warn?.('⚠️ Error:', err.message);
                        });
                }
            }

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

            window._originalConsole?.log?.('✅ Quiz ready!');
        }
    });
})();