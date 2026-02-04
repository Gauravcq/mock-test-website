// Robust Quiz Initialization - Complete Fix
(function() {
    'use strict';

    // Wait for DOM to be ready
    function waitForDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeQuiz);
        } else {
            initializeQuiz();
        }
    }

    // Initialize quiz functionality
    async function initializeQuiz() {
        
        // Set up global quiz data
        if (!window.QUIZ_DATA) {
            window.QUIZ_DATA = {
                isQuizStarted: false,
                currentQuestionIndex: 0,
                currentLanguage: 'en',
                questions: [],
                questionStates: [],
                timerInterval: null,
                sectionTimeRemaining: {},
                totalInitialTime: 0,
                startTime: null,
                testInfo: null
            };
        }

        // Load questions from tests-list.js
        await loadQuestions();
        
        // Set up start button
        setupStartButton();
        
        // Set up navigation buttons
        setupNavigationButtons();
        
    }

    // Load questions using your EXACT original logic
    async function loadQuestions() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const testId = urlParams.get('testId') || 'math_test_1';
            
            // Use EXACT same logic as your original test-logic.js
            let questions = [];
            let questionsSource = '';

            // First try QUESTIONS_DATABASE (LOCAL)
            if (typeof QUESTIONS_DATABASE !== 'undefined' && QUESTIONS_DATABASE[testId]) {
                const raw = QUESTIONS_DATABASE[testId];
                questions = Array.isArray(raw) ? raw : (raw.questions || []);
                questionsSource = 'LOCAL';
            }

            // If no questions, try API
            if (!questions.length) {
                try {
                    const response = await ExamAxisAPI.getQuestions(testId);
                    if (response?.success && response?.data?.questions?.length) {
                        let apiQuestions = response.data.questions;
                        questionsSource = 'API';
                        
                        if (apiQuestions[0]?.correctAnswer) {
                            questions = apiQuestions;
                        } else {
                            // Handle API missing correctAnswer
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
                                                correctAnswer: localQ.correctAnswer
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
                } catch (error) {
                    // API failed, continue to fallback
                }
            }

            // If still no questions, use fallback
            if (!questions.length) {
                loadFallbackQuestions(testId);
                return;
            }

            // Set the questions and test info
            window.QUIZ_DATA.questions = questions;
            window.QUIZ_DATA.testInfo = {
                id: testId,
                title: `${testId.replace(/_/g, ' ').toUpperCase()}`,
                duration: 25,
                subject: 'Mathematics'
            };
            
            // Initialize immediately if quiz already started
            if (window.QUIZ_DATA.isQuizStarted) {
                initializeQuizInterface();
            }
            
        } catch (error) {
            loadFallbackQuestions(testId);
        }
    }

    // Load fallback questions from tests-list.js (if available)
    function loadFallbackQuestions(testId) {
        try {
            if (typeof ALL_TESTS !== 'undefined' && ALL_TESTS.length > 0) {
                const test = ALL_TESTS.find(t => t.id === testId) || ALL_TESTS[0];
                
                // Create placeholder questions that will be loaded by the original system
                window.QUIZ_DATA.questions = createPlaceholderQuestions(test);
                window.QUIZ_DATA.testInfo = {
                    id: test.id,
                    title: `${test.subject} - ${test.title}`,
                    duration: 25,
                    subject: test.subject || 'Mathematics'
                };
                
            } else {
                // Last resort - minimal questions
                window.QUIZ_DATA.questions = createMinimalQuestions();
                window.QUIZ_DATA.testInfo = {
                    id: testId,
                    title: 'Test',
                    duration: 25,
                    subject: 'Mathematics'
                };
            }
        } catch (error) {
            window.QUIZ_DATA.questions = createMinimalQuestions();
        }
    }

    // Create placeholder questions (will be replaced by actual loading)
    function createPlaceholderQuestions(test) {
        const questions = [];
        const numQuestions = 25; // Standard test size
        
        for (let i = 0; i < numQuestions; i++) {
            questions.push({
                question: { en: `Question ${i + 1} - Loading from backend...` },
                options: [
                    { en: "Option A" }, { en: "Option B" }, 
                    { en: "Option C" }, { en: "Option D" }
                ],
                correctAnswer: { en: "Option A" },
                subject: test.subject || 'Mathematics'
            });
        }
        
        return questions;
    }

    // Create minimal questions (last resort)
    function createMinimalQuestions() {
        return [
            {
                question: { en: "Loading questions from backend..." },
                options: [
                    { en: "Please wait" }, { en: "Questions loading" },
                    { en: "From server" }, { en: "API call" }
                ],
                correctAnswer: { en: "Please wait" },
                subject: "Mathematics"
            }
        ];
    }

    // Setup start button with robust event handling
    function setupStartButton() {
        const startBtn = document.getElementById('start-test-btn');
        if (!startBtn) {
            return;
        }
        
        // Remove all existing event listeners
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        // Add robust event listeners
        newBtn.addEventListener('click', handleStartTest);
        newBtn.onclick = handleStartTest;
        
    }

    // Handle start test click
    async function handleStartTest(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.QUIZ_DATA.isQuizStarted) {
            return;
        }
        
        // Mark quiz as started
        window.QUIZ_DATA.isQuizStarted = true;
        
        // Hide instructions modal
        const instructionsModal = document.getElementById('instructions-modal');
        if (instructionsModal) {
            instructionsModal.classList.add('hidden');
        }
        
        // Show quiz UI
        const quizUI = document.getElementById('quiz-ui');
        if (quizUI) {
            quizUI.classList.remove('hidden');
        }
        
        // Load questions and wait for them to load
        await loadQuestions();
        
        // Initialize after questions are loaded
        if (window.QUIZ_DATA.questions && window.QUIZ_DATA.questions.length > 0) {
            initializeQuizInterface();
        } else {
            showLoadingMessage();
        }
    }

    // Show loading message while questions load
    function showLoadingMessage() {
        const questionArea = document.getElementById('question-area');
        if (questionArea) {
            questionArea.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <div style="font-size: 24px; margin-bottom: 20px;">📚 Loading Questions...</div>
                    <div style="color: #6b7280;">Please wait while we load your test questions.</div>
                </div>
            `;
        }
    }

    // Initialize quiz interface
    function initializeQuizInterface() {
        // Initialize question states
        const questions = window.QUIZ_DATA.questions;
        window.QUIZ_DATA.questionStates = questions.map(() => ({
            status: 'not-visited',
            userAnswer: null,
            markedForReview: false,
            timeSpent: 0
        }));

        window.QUIZ_DATA.currentQuestionIndex = 0;
        window.QUIZ_DATA.startTime = Date.now();
        window.QUIZ_DATA.timeRemaining = (window.QUIZ_DATA.testInfo.duration || 25) * 60;

        // Display first question
        showQuestion(0);
        
        // Setup navigation
        setupNavigation();
        
        // Start timer
        startTimer();
    }

    // Setup timer
    function setupTimer() {
        const duration = window.QUIZ_DATA.testInfo.duration || 25;
        window.QUIZ_DATA.sectionTimeRemaining = { 'default': duration * 60 };
        window.QUIZ_DATA.totalInitialTime = duration * 60;
        
        const timerEl = document.getElementById('timer');
        if (!timerEl) return;
        
        if (window.QUIZ_DATA.timerInterval) {
            clearInterval(window.QUIZ_DATA.timerInterval);
        }
        
        window.QUIZ_DATA.timerInterval = setInterval(() => {
            if (window.QUIZ_DATA.isPaused) return;
            
            window.QUIZ_DATA.sectionTimeRemaining.default--;
            const timeLeft = window.QUIZ_DATA.sectionTimeRemaining.default;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(window.QUIZ_DATA.timerInterval);
                alert('Time up!');
                submitQuiz();
            }
        }, 1000);
        
    }

    // Create question palette
    function createQuestionPalette() {
        const palette = document.getElementById('question-palette');
        if (!palette) return;
        
        palette.innerHTML = '';
        
        window.QUIZ_DATA.questions.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'palette-btn not-visited';
            btn.textContent = index + 1;
            btn.onclick = () => showQuestion(index);
            palette.appendChild(btn);
        });
        
    }

    // Show question
    function showQuestion(index) {
        if (index < 0 || index >= window.QUIZ_DATA.questions.length) return;
        
        window.QUIZ_DATA.currentQuestionIndex = index;
        const question = window.QUIZ_DATA.questions[index];
        const state = window.QUIZ_DATA.questionStates[index];
        
        // Update question state
        if (state.status === 'not-visited') {
            state.status = 'not-answered';
        }
        
        // Update question title
        const questionTitle = document.getElementById('question-title');
        if (questionTitle) {
            questionTitle.textContent = `${question.subject || 'Test'} | Q${index + 1} of ${window.QUIZ_DATA.questions.length}`;
        }
        
        // Display question and options
        displayQuestion(question, state);
        
        // Update palette
        updatePalette();
        
        // Update navigation
        updateNavigation();
        
    }

    // Display question and options
    function displayQuestion(question, state) {
        const questionArea = document.getElementById('question-area');
        if (!questionArea) return;
        
        const questionText = question.question?.en || question.question || '';
        const options = question.options || [];
        
        let optionsHTML = '';
        options.forEach((option, i) => {
            const optionText = option.en || option || '';
            const isChecked = state.userAnswer === optionText;
            const letter = String.fromCharCode(65 + i);
            
            optionsHTML += `
                <label style="display:flex;align-items:center;background:${isChecked ? '#eff6ff' : '#f8fafc'};border:2px solid ${isChecked ? '#3b82f6' : '#e2e8f0'};border-radius:10px;padding:14px 18px;margin-bottom:12px;cursor:pointer;">
                    <span style="font-weight:700;min-width:28px;">${letter}.</span>
                    <input type="radio" name="option" value="${optionText}" ${isChecked ? 'checked' : ''} style="width:20px;height:20px;margin-right:14px;accent-color:#3b82f6;">
                    <span style="flex:1;">${optionText}</span>
                </label>
            `;
        });
        
        questionArea.innerHTML = `
            <div style="font-size:17px;line-height:1.7;margin-bottom:24px;">
                <span style="font-weight:700;color:#4f46e5;">Q${window.QUIZ_DATA.currentQuestionIndex + 1}.</span> ${questionText}
            </div>
            ${optionsHTML}
        `;
        
        // Add option click handlers
        const optionInputs = questionArea.querySelectorAll('input[type="radio"]');
        optionInputs.forEach(input => {
            input.addEventListener('change', function() {
                state.userAnswer = this.value;
                state.status = 'answered';
                updatePalette();
            });
        });
    }

    // Update palette
    function updatePalette() {
        const palette = document.getElementById('question-palette');
        if (!palette) return;
        
        const buttons = palette.querySelectorAll('.palette-btn');
        buttons.forEach((btn, index) => {
            const state = window.QUIZ_DATA.questionStates[index];
            btn.className = 'palette-btn';
            
            if (state.userAnswer && state.markedForReview) {
                btn.classList.add('answered-marked-review');
            } else if (state.markedForReview) {
                btn.classList.add('marked-review');
            } else if (state.userAnswer) {
                btn.classList.add('answered');
            } else if (state.status === 'not-answered') {
                btn.classList.add('not-answered');
            } else {
                btn.classList.add('not-visited');
            }
            
            if (index === window.QUIZ_DATA.currentQuestionIndex) {
                btn.classList.add('current');
            }
        });
    }

    // Update navigation
    function updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = window.QUIZ_DATA.currentQuestionIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = window.QUIZ_DATA.currentQuestionIndex === window.QUIZ_DATA.questions.length - 1;
        }
    }

    // Setup question navigation
    function setupQuestionNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const clearBtn = document.getElementById('clear-response-btn');
        const markBtn = document.getElementById('mark-review-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (window.QUIZ_DATA.currentQuestionIndex > 0) {
                    showQuestion(window.QUIZ_DATA.currentQuestionIndex - 1);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (window.QUIZ_DATA.currentQuestionIndex < window.QUIZ_DATA.questions.length - 1) {
                    showQuestion(window.QUIZ_DATA.currentQuestionIndex + 1);
                }
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const currentIndex = window.QUIZ_DATA.currentQuestionIndex;
                const state = window.QUIZ_DATA.questionStates[currentIndex];
                state.userAnswer = null;
                state.status = 'not-answered';
                showQuestion(currentIndex);
            });
        }
        
        if (markBtn) {
            markBtn.addEventListener('click', () => {
                const currentIndex = window.QUIZ_DATA.currentQuestionIndex;
                const state = window.QUIZ_DATA.questionStates[currentIndex];
                state.markedForReview = !state.markedForReview;
                updatePalette();
            });
        }
        
    }

    // Setup navigation buttons
    function setupNavigationButtons() {
        const submitBtn = document.getElementById('submit-test-btn');
        const submitFooterBtn = document.getElementById('submit-test-footer-btn');
        
        const handleSubmit = () => {
            if (confirm('Are you sure you want to submit the test?')) {
                submitQuiz();
            }
        };
        
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmit);
        }
        
        if (submitFooterBtn) {
            submitFooterBtn.addEventListener('click', handleSubmit);
        }
        
    }

    // Submit quiz
    function submitQuiz() {
        
        if (window.QUIZ_DATA.timerInterval) {
            clearInterval(window.QUIZ_DATA.timerInterval);
        }
        
        // Calculate results
        let correct = 0, incorrect = 0, unattempted = 0, score = 0;
        
        window.QUIZ_DATA.questionStates.forEach((state, index) => {
            const question = window.QUIZ_DATA.questions[index];
            const correctAnswer = question.correctAnswer?.en || question.correctAnswer;
            
            if (state.userAnswer !== null) {
                if (state.userAnswer === correctAnswer) {
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
        
        const accuracy = (correct + incorrect) > 0 ? (correct / (correct + incorrect)) * 100 : 0;
        
        
        // Save to localStorage for result page
        const resultData = {
            testId: window.QUIZ_DATA.testInfo.id,
            title: window.QUIZ_DATA.testInfo.title,
            subject: window.QUIZ_DATA.testInfo.subject,
            totalQuestions: window.QUIZ_DATA.questions.length,
            correct: correct,
            incorrect: incorrect,
            unattempted: unattempted,
            score: score,
            accuracy: accuracy,
            timeTaken: window.QUIZ_DATA.totalInitialTime - (window.QUIZ_DATA.sectionTimeRemaining.default || 0),
            timestamp: new Date().toISOString(),
            questionStates: window.QUIZ_DATA.questionStates,
            questions: window.QUIZ_DATA.questions
        };
        
        localStorage.setItem('testResult', JSON.stringify(resultData));
        
        // Redirect to separate result page
        window.location.href = 'result.html';
    }

    // Initialize when DOM is ready
    waitForDOM();
    
})();
