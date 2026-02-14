function normalizeQuestion(q, testId, index) {
    // Handle both old and new question formats
    let questionText = '';
    if (typeof q.question === "string") {
        questionText = q.question;
    } else if (q.question?.en) {
        questionText = q.question.en;
    } else if (q.question?.text) {
        questionText = q.question.text;
    }

    // Normalize options - handle multiple formats
    let options = [];
    if (Array.isArray(q.options)) {
        options = q.options.map((opt, i) => {
            if (typeof opt === "string") {
                // Handle pipe-separated bilingual format
                let parts = opt.split("|").map(s => s.trim());
                return {
                    en: parts[0],
                    hi: parts[1] || parts[0],
                    index: i,
                    text: parts[0] // For compatibility
                };
            } else if (typeof opt === "object" && opt !== null) {
                return {
                    en: opt.en || opt.text || String(opt),
                    hi: opt.hi || opt.en || opt.text || String(opt),
                    index: i,
                    text: opt.en || opt.text || String(opt)
                };
            }
            return { en: String(opt), hi: String(opt), index: i, text: String(opt) };
        });
    }

    // Normalize correctAnswer - handle multiple formats
    let correctAnswer = '';
    if (typeof q.correctAnswer === "string") {
        correctAnswer = q.correctAnswer.trim();
    } else if (q.correctAnswer?.en) {
        correctAnswer = q.correctAnswer.en;
    } else if (q.correctAnswer?.text) {
        correctAnswer = q.correctAnswer.text;
    }

    // Normalize explanation
    let explanation = '';
    if (typeof q.explanation === "string") {
        explanation = q.explanation;
    } else if (q.explanation?.en) {
        explanation = q.explanation.en;
    } else if (q.explanation?.text) {
        explanation = q.explanation.text;
    }

    return {
        id: q.id || `${testId}_${index}`,
        testId: testId,
        originalIndex: q.originalIndex !== undefined ? q.originalIndex : index,
        question: questionText,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation,
        subject: q.subject || 'General',
        _original: q // Keep original for debugging
    };
}

function getValue(obj, key) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    if (obj[key]) return obj[key];
    if (obj.en) return obj.en;
    return JSON.stringify(obj);
}

// Get text value (handles bilingual format)
function getTextValue(field, lang = 'en') {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
        return field[lang] || field.en || field.hi || JSON.stringify(field);
    }
    return String(field);
}

// Get question status - handle multiple ID formats
function getQuestionStatus(question, answers, testId) {
    // Try multiple key formats to find user's answer
    let userAnswer = null;

    // Try test-specific ID format first
    const testSpecificId = `${testId}_${question.originalIndex || question.index || 0}`;
    if (answers[testSpecificId] !== undefined) {
        userAnswer = answers[testSpecificId];
    }
    // Try question ID
    else if (question.id && answers[question.id] !== undefined) {
        userAnswer = answers[question.id];
    }
    // Try original index
    else if (question.originalIndex !== undefined && answers[question.originalIndex] !== undefined) {
        userAnswer = answers[question.originalIndex];
    }
    // Try regular index as fallback
    else if (question.index !== undefined && answers[question.index] !== undefined) {
        userAnswer = answers[question.index];
    }

    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
        return 'unattempted';
    }

    // Normalize comparison - handle different answer formats
    const normalizeAnswer = (ans) => String(ans || '').trim().toLowerCase();
    const userNormalized = normalizeAnswer(userAnswer);
    const correctNormalized = normalizeAnswer(question.correctAnswer);

    return userNormalized === correctNormalized ? 'correct' : 'incorrect';
}

// Enhanced fetch and render with better error handling and fallbacks
async function fetchAndRenderAttempt() {
    const container = document.getElementById("solutions-container");
    let testId = getTestId();

    if (!container) {
        console.error('Solutions container not found');
        return;
    }

    if (!testId) {
        container.innerHTML = '<p>No test ID found. Please take a test first.</p>';
        return;
    }

    // Show loading with better UX
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 24px; margin-bottom: 16px;">🔄</div>
            <p>Loading your test review...</p>
            <p style="color: #666; font-size: 14px;">Test ID: ${testId}</p>
        </div>
    `;

    try {
        // Check if TestService is available
        if (typeof TestService === 'undefined') {
            console.error('TestService not loaded');
            throw new Error('TestService not available. Please refresh the page.');
        }

        console.log('🔍 Fetching attempt for testId:', testId);

        // Fetch last attempt from backend
        const data = await TestService.getLastAttempt(testId);

        if (!data || !data.lastAttempt) {
            console.warn('⚠️ No backend attempt found, checking localStorage...');
            return await renderFromLocalStorage(container, testId);
        }

        const attempt = data.lastAttempt;
        let questions = attempt.questions || [];
        const answers = attempt.answers || {};

        console.log('✅ Review loaded from backend:', {
            testId: attempt.testId || testId,
            questionsCount: questions.length,
            answersCount: Object.keys(answers).length,
            score: attempt.score,
            subject: attempt.subject
        });

        // If no questions in attempt, try to get them from localStorage or other sources
        if (questions.length === 0) {
            console.warn('⚠️ No questions in backend attempt, trying alternatives...');
            const localQuestions = getQuestionsFromLocalStorage(testId);
            if (localQuestions.length > 0) {
                questions = localQuestions;
                console.log('✅ Using questions from localStorage:', questions.length);
            } else {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                        <h3>No Questions Available</h3>
                        <p>This attempt was saved but questions are not available for review.</p>
                        <p style="font-size: 14px;">Test ID: ${testId}</p>
                        <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
                    </div>
                `;
                return;
            }
        }

        // Normalize questions for consistent rendering
        const normalizedQuestions = questions.map((q, index) =>
            normalizeQuestion(q, testId, index)
        );

        // Render questions with enhanced attempt data
        renderQuestionsFromAttempt(container, normalizedQuestions, answers, {
            ...attempt,
            testId: testId
        });

    } catch (error) {
        console.error('❌ Error fetching attempt:', error);

        // Try localStorage fallback
        try {
            console.log('🔄 Trying localStorage fallback...');
            await renderFromLocalStorage(container, testId);
        } catch (fallbackError) {
            console.error('❌ Fallback failed:', fallbackError);
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <h3>Error Loading Review</h3>
                    <p>${error.message}</p>
                    <p style="font-size: 14px; margin-top: 16px;">Test ID: ${testId}</p>
                    <div style="margin-top: 20px;">
                        <button onclick="location.reload()" style="margin: 4px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
                        <button onclick="location.href='index.html'" style="margin: 4px; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Go Home</button>
                    </div>
                </div>
            `;
        }
    }
}

// Helper function to get test ID from multiple sources
function getTestId() {
    // Try URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTestId = urlParams.get('testId') || urlParams.get('id');
    if (urlTestId) return urlTestId;

    // Try localStorage
    const localTestId = localStorage.getItem('testId') || localStorage.getItem('test_id');
    if (localTestId) return localTestId;

    return null;
}

// Helper function to get questions from localStorage
function getQuestionsFromLocalStorage(testId) {
    try {
        // Try to get from testResults
        const testResults = JSON.parse(localStorage.getItem('testResults') || '{}');
        if (testResults[testId] && testResults[testId].questions) {
            return testResults[testId].questions;
        }

        // Try to get from testResult
        const testResult = JSON.parse(localStorage.getItem('testResult') || '{}');
        if (testResult.testId === testId && testResult.questions) {
            return testResult.questions;
        }

        // Try window.questions if available
        if (window.questions && Array.isArray(window.questions)) {
            return window.questions;
        }

    } catch (error) {
        console.error('Error reading questions from localStorage:', error);
    }

    return [];
}

// Render from localStorage as fallback
async function renderFromLocalStorage(container, testId) {
    console.log('📁 Attempting localStorage render for testId:', testId);

    try {
        const testResults = JSON.parse(localStorage.getItem('testResults') || '{}');
        const testResult = JSON.parse(localStorage.getItem('testResult') || '{}');

        let attempt = null;

        // Try to get from testResults map first
        if (testResults[testId]) {
            attempt = testResults[testId];
        }
        // Try current testResult if testId matches
        else if (testResult.testId === testId) {
            attempt = testResult;
        }

        if (!attempt) {
            throw new Error('No local data found for this test');
        }

        const questions = attempt.questions || [];
        const questionStates = attempt.questionStates || [];

        if (questions.length === 0) {
            throw new Error('No questions found in local data');
        }

        // Convert questionStates to answers format
        const answers = {};
        questionStates.forEach((state, index) => {
            if (state.userAnswer) {
                answers[index] = state.userAnswer;
                answers[`${testId}_${index}`] = state.userAnswer;
            }
        });

        console.log('✅ Local data found:', {
            questionsCount: questions.length,
            answersCount: Object.keys(answers).length,
            score: attempt.score
        });

        // Normalize questions
        const normalizedQuestions = questions.map((q, index) =>
            normalizeQuestion(q, testId, index)
        );

        // Create attempt object from local data
        const localAttempt = {
            testId: testId,
            score: attempt.score || 0,
            correctAnswers: attempt.correct || 0,
            wrongAnswers: attempt.incorrect || 0,
            unanswered: attempt.unattempted || 0,
            totalMarks: questions.length * 2,
            subject: attempt.subject || questions[0]?.subject || 'General',
            timeTaken: attempt.timeTaken?.mins || 0,
            submittedAt: new Date(attempt.timestamp || Date.now()).toISOString()
        };

        renderQuestionsFromAttempt(container, normalizedQuestions, answers, localAttempt);

    } catch (error) {
        console.error('❌ localStorage render failed:', error);
        throw error;
    }
}

// Enhanced render function with better status calculation
function renderQuestionsFromAttempt(container, questions, answers, attempt) {
    container.innerHTML = '';

    console.log('🎨 Rendering questions:', {
        questionsCount: questions.length,
        answersCount: Object.keys(answers).length,
        testId: attempt.testId
    });

    // Calculate stats with improved status detection
    let correct = 0, incorrect = 0, unattempted = 0;
    const questionStatuses = [];

    questions.forEach((q, index) => {
        const status = getQuestionStatus(q, answers, attempt.testId);
        questionStatuses.push({ question: q, status });

        if (status === 'correct') correct++;
        else if (status === 'incorrect') incorrect++;
        else unattempted++;
    });

    // Use attempt stats if available, otherwise use calculated stats
    const finalStats = {
        correct: attempt.correctAnswers !== undefined ? attempt.correctAnswers : correct,
        incorrect: attempt.wrongAnswers !== undefined ? attempt.wrongAnswers : incorrect,
        unattempted: attempt.unanswered !== undefined ? attempt.unanswered : unattempted
    };

    const totalMarks = attempt.totalMarks || (questions.length * 2);
    const percentage = totalMarks > 0
        ? Math.round((attempt.score / totalMarks) * 100)
        : 0;

    // Enhanced score summary with better formatting
    const subjectDisplay = getTextValue(attempt.subject) || getTextValue(questions[0]?.subject) || 'Test';
    const submissionDate = attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : 'Recent';

    const summaryHTML = `
        <div class="review-summary" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin: 0; flex: 1;">${subjectDisplay} Test Review</h2>
                <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px;">${submissionDate}</span>
            </div>
            <div style="font-size: 48px; font-weight: 700; margin: 10px 0;">
                ${attempt.score}<span style="font-size: 24px; opacity: 0.9;">/${totalMarks}</span>
                <span style="font-size: 20px; margin-left: 10px; opacity: 0.9;">(${percentage}%)</span>
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
                <span style="background: rgba(34, 197, 94, 0.8); padding: 8px 16px; border-radius: 20px;">${finalStats.correct} ✓ Correct</span>
                <span style="background: rgba(239, 68, 68, 0.8); padding: 8px 16px; border-radius: 20px;">${finalStats.incorrect} ✗ Wrong</span>
                <span style="background: rgba(156, 163, 175, 0.8); padding: 8px 16px; border-radius: 20px;">${finalStats.unattempted} ○ Unattempted</span>
            </div>
            <div style="margin-top: 15px; font-size: 14px; opacity: 0.9;">
                Test ID: ${attempt.testId} • Questions: ${questions.length} • Time: ${attempt.timeTaken || 0} min
            </div>
        </div>
    `;

    container.innerHTML += summaryHTML;

    // Render each question with enhanced status tracking
    questionStatuses.forEach(({question: q, status}, index) => {
        // Get user answer using multiple ID formats for compatibility
        let userAnswer = null;
        const testSpecificId = `${attempt.testId}_${q.originalIndex !== undefined ? q.originalIndex : index}`;

        if (answers[testSpecificId] !== undefined) {
            userAnswer = answers[testSpecificId];
        } else if (q.id && answers[q.id] !== undefined) {
            userAnswer = answers[q.id];
        } else if (answers[index] !== undefined) {
            userAnswer = answers[index];
        } else if (q.originalIndex !== undefined && answers[q.originalIndex] !== undefined) {
            userAnswer = answers[q.originalIndex];
        }

        const questionText = getTextValue(q.question);
        const explanation = getTextValue(q.explanation);

        // Build options HTML with improved answer matching
        let optionsHTML = '';
        if (Array.isArray(q.options)) {
            optionsHTML = q.options.map((opt, optIndex) => {
                const optionText = getTextValue(opt);
                const letter = String.fromCharCode(65 + optIndex);

                // Improved answer matching - normalize for comparison
                const normalizeText = (text) => String(text || '').trim().toLowerCase();
                const isCorrect = normalizeText(optionText) === normalizeText(q.correctAnswer);
                const isUserAnswer = normalizeText(optionText) === normalizeText(userAnswer);

                let optionStyle = 'background: #f8f9fa; border-color: #e9ecef;';
                let badge = '';

                if (isCorrect && isUserAnswer) {
                    optionStyle = 'background: #d4edda; border-color: #28a745; box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);';
                    badge = '<span style="margin-left: auto; background: #28a745; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;">✓ Correct Answer (Yours)</span>';
                } else if (isCorrect) {
                    optionStyle = 'background: #d4edda; border-color: #28a745;';
                    badge = '<span style="margin-left: auto; background: #28a745; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">✓ Correct Answer</span>';
                } else if (isUserAnswer) {
                    optionStyle = 'background: #f8d7da; border-color: #dc3545;';
                    badge = '<span style="margin-left: auto; background: #dc3545; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">✗ Your Answer</span>';
                }

                return `
                    <li style="display: flex; align-items: center; padding: 15px; margin: 8px 0; border-radius: 10px; border: 2px solid; transition: all 0.2s; ${optionStyle}">
                        <span style="font-weight: 700; min-width: 30px; color: #495057;">${letter}.</span>
                        <span style="flex: 1; line-height: 1.5;">${optionText}</span>
                        ${badge}
                    </li>
                `;
            }).join('');
        }

        // Enhanced status display with icons and colors
        let statusClass, statusText, statusIcon;

        if (status === 'correct') {
            statusClass = '#28a745';
            statusText = 'Correct';
            statusIcon = '✓';
        } else if (status === 'incorrect') {
            statusClass = '#dc3545';
            statusText = 'Wrong';
            statusIcon = '✗';
        } else {
            statusClass = '#ffc107';
            statusText = 'Unattempted';
            statusIcon = '○';
        }


                        <h4 style="margin: 0 0 10px 0; color: #007bff;">Explanation</h4>
                        <p style="margin: 0; line-height: 1.6;">${explanation}</p>
                    </div>
                ` : ''}
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

function renderSolutions() {
    const container = document.getElementById("solutions-container");

    if (!window.questions || !Array.isArray(window.questions)) {
        container.innerHTML = "<p>No questions found!</p>";
        return;
    }

    container.innerHTML = "";

    window.questions.forEach((q, i) => {
        // Support different structures
        const questionText = getValue(q.question, "en") || q.question || "No question text";
        const explanation = getValue(q.explanation, "en") || "No explanation";
        const correctAnswer = getValue(q.correctAnswer, "en") || q.correct || q.ans || "";

        let optionsHTML = "";

        if (Array.isArray(q.options)) {
            optionsHTML = q.options
                .map(opt => `<li>${getValue(opt, "en")}</li>`)
                .join("");
        }

        container.innerHTML += `
            <div class="solution-card">
                <h3>Q${i + 1}. ${questionText}</h3>

                <ul>${optionsHTML}</ul>

                <p><strong>Correct Answer:</strong> ${correctAnswer}</p>
                <p><strong>Explanation:</strong> ${explanation}</p>
            </div>
            <hr>
        `;
    });
}

// Initialize on page load - try backend first
document.addEventListener("DOMContentLoaded", function() {
    fetchAndRenderAttempt();
});
