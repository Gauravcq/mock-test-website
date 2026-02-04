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
    function initializeQuiz() {
        console.log('🚀 Initializing robust quiz system...');
        
        // Set up global quiz data
        if (!window.QUIZ_DATA) {
            window.QUIZ_DATA = {
                isQuizStarted: false,
                currentQuestionIndex: 0,
                currentLanguage: 'en',
                questions: [],
                questionStates: [],
                timerInterval: null,
                isPaused: false,
                sectionTimeRemaining: {},
                totalInitialTime: 0
            };
        }

        // Load questions from tests-list.js
        loadQuestions();
        
        // Set up start button
        setupStartButton();
        
        // Set up navigation buttons
        setupNavigationButtons();
        
        console.log('✅ Quiz system initialized successfully');
    }

    // Load questions from tests-list.js
    function loadQuestions() {
        try {
            if (typeof testsList !== 'undefined' && testsList.length > 0) {
                const urlParams = new URLSearchParams(window.location.search);
                const testId = urlParams.get('testId') || 'math_test_1';
                
                const test = testsList.find(t => t.id === testId) || testsList[0];
                window.QUIZ_DATA.questions = test.questions || [];
                window.QUIZ_DATA.testInfo = {
                    id: test.id,
                    title: test.title || 'Test',
                    duration: test.duration || 25,
                    subject: test.subject || 'Mathematics'
                };
                
                console.log(`📚 Loaded ${window.QUIZ_DATA.questions.length} questions from ${test.title}`);
            } else {
                // Fallback questions
                window.QUIZ_DATA.questions = createFallbackQuestions();
                window.QUIZ_DATA.testInfo = {
                    id: 'fallback',
                    title: 'Sample Test',
                    duration: 25,
                    subject: 'Mathematics'
                };
                console.log('📚 Using fallback questions');
            }
        } catch (error) {
            console.error('❌ Error loading questions:', error);
            window.QUIZ_DATA.questions = createFallbackQuestions();
        }
    }

    // Create fallback questions
    function createFallbackQuestions() {
        return [
            {
                question: { en: "What is 2 + 2?" },
                options: [
                    { en: "3" }, { en: "4" }, { en: "5" }, { en: "6" }
                ],
                correctAnswer: { en: "4" },
                subject: "Mathematics"
            },
            {
                question: { en: "What is the capital of India?" },
                options: [
                    { en: "Mumbai" }, { en: "Delhi" }, { en: "Kolkata" }, { en: "Chennai" }
                ],
                correctAnswer: { en: "Delhi" },
                subject: "General Knowledge"
            }
        ];
    }

    // Setup start button with robust event handling
    function setupStartButton() {
        const startBtn = document.getElementById('start-test-btn');
        if (!startBtn) {
            console.error('❌ Start test button not found!');
            return;
        }

        console.log('🔧 Setting up start test button...');
        
        // Remove all existing event listeners
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        // Add robust event listeners
        newBtn.addEventListener('click', handleStartTest);
        newBtn.onclick = handleStartTest;
        
        console.log('✅ Start test button setup complete');
    }

    // Handle start test click
    function handleStartTest(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🚀 Start test button clicked!');
        
        if (window.QUIZ_DATA.isQuizStarted) {
            console.log('⚠️ Quiz already started');
            return;
        }
        
        // Mark quiz as started
        window.QUIZ_DATA.isQuizStarted = true;
        
        // Hide instructions modal
        const instructionsModal = document.getElementById('instructions-modal');
        if (instructionsModal) {
            instructionsModal.classList.add('hidden');
            console.log('✅ Hidden instructions modal');
        }
        
        // Show quiz UI
        const quizUI = document.getElementById('quiz-ui');
        if (quizUI) {
            quizUI.classList.remove('hidden');
            console.log('✅ Shown quiz UI');
        }
        
        // Initialize quiz
        initializeQuizInterface();
        
        console.log('🎯 Quiz started successfully!');
    }

    // Initialize quiz interface
    function initializeQuizInterface() {
        console.log('🔧 Initializing quiz interface...');
        
        // Initialize question states
        const questions = window.QUIZ_DATA.questions;
        window.QUIZ_DATA.questionStates = questions.map(() => ({
            status: 'not-visited',
            userAnswer: null,
            markedForReview: false,
            resultCategory: null
        }));
        
        // Set up timer
        setupTimer();
        
        // Create question palette
        createQuestionPalette();
        
        // Show first question
        showQuestion(0);
        
        // Set up question navigation
        setupQuestionNavigation();
        
        console.log('✅ Quiz interface initialized');
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
        
        console.log('⏱️ Timer started');
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
        
        console.log('🎨 Question palette created');
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
        
        console.log(`📖 Showing question ${index + 1}`);
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
                console.log('✅ Answer saved:', this.value);
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
        
        console.log('🧭 Question navigation setup complete');
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
        
        console.log('🔘 Navigation buttons setup complete');
    }

    // Submit quiz
    function submitQuiz() {
        console.log('📤 Submitting quiz...');
        
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
        
        console.log('📊 Results:', { correct, incorrect, unattempted, score, accuracy });
        
        // Save to localStorage
        localStorage.setItem('testScore', score.toString());
        localStorage.setItem('testCorrect', correct.toString());
        localStorage.setItem('testIncorrect', incorrect.toString());
        localStorage.setItem('testUnattempted', unattempted.toString());
        localStorage.setItem('testTotal', window.QUIZ_DATA.questions.length.toString());
        
        // Show results
        showResults(correct, incorrect, unattempted, score, accuracy);
    }

    // Show results
    function showResults(correct, incorrect, unattempted, score, accuracy) {
        const quizUI = document.getElementById('quiz-ui');
        const resultPage = document.getElementById('result-summary-page');
        
        if (quizUI) {
            quizUI.classList.add('hidden');
        }
        
        if (resultPage) {
            resultPage.classList.remove('hidden');
            
            // Update result display
            const reviewArea = document.getElementById('review-button-area');
            if (reviewArea) {
                reviewArea.innerHTML = `
                    <div style="margin-bottom:20px;">
                        <h3>${window.QUIZ_DATA.testInfo.title}</h3>
                        <p style="color:#6b7280;">Questions: ${window.QUIZ_DATA.questions.length} | Max: ${window.QUIZ_DATA.questions.length * 2}</p>
                    </div>
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <a href="review.html" style="background:#4f46e5;color:white;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;font-weight:600;text-decoration:none;">📝 Review</a>
                        <a href="result.html" style="background:#16a34a;color:white;padding:12px 24px;border:none;border-radius:8px;cursor:pointer;font-weight:600;text-decoration:none;">📊 Results</a>
                        <a href="index.html" style="background:#e5e7eb;color:#374151;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">🏠 Tests</a>
                    </div>
                `;
            }
            
            const statsArea = document.getElementById('stats-cards-area');
            if (statsArea) {
                statsArea.innerHTML = `
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-top:20px;">
                        <div style="background:#f0fdf4;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#166534;">${score.toFixed(1)}</div><div style="color:#6b7280;">Score</div></div>
                        <div style="background:#dcfce7;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#16a34a;">${correct}</div><div style="color:#6b7280;">Correct</div></div>
                        <div style="background:#fee2e2;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#dc2626;">${incorrect}</div><div style="color:#6b7280;">Incorrect</div></div>
                        <div style="background:#fef3c7;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#d97706;">${unattempted}</div><div style="color:#6b7280;">Skipped</div></div>
                        <div style="background:#eff6ff;padding:20px;border-radius:12px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#2563eb;">${accuracy.toFixed(0)}%</div><div style="color:#6b7280;">Accuracy</div></div>
                    </div>
                `;
            }
        }
        
        console.log('🎉 Results displayed');
    }

    // Initialize when DOM is ready
    waitForDOM();
    
})();
