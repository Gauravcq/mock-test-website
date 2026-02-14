function normalizeQuestion(q) {
    let questionText = typeof q.question === "string" ? q.question : q.question?.en || '';

    // Normalize options
    let options = q.options?.map(opt => {
        if (typeof opt === "string") {
            let parts = opt.split("|").map(s => s.trim());
            return { en: parts[0], hi: parts[1] || parts[0] };
        }
        return opt;
    }) || [];

    // Normalize correctAnswer
    let correct;
    if (typeof q.correctAnswer === "string") {
        let parts = q.correctAnswer.split("|").map(s => s.trim());
        correct = { en: parts[0], hi: parts[1] || parts[0] };
    } else {
        correct = q.correctAnswer;
    }

    return {
        question: questionText,
        options,
        correctAnswer: correct,
        explanation: {
            en: q.explanation?.en || "",
            hi: q.explanation?.hi || ""
        }
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

// Get question status
function getQuestionStatus(question, answers) {
    const userAnswer = answers[question.id];
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
        return 'unattempted';
    }
    return userAnswer === question.correctAnswer ? 'correct' : 'incorrect';
}

// Fetch and render attempt from backend
async function fetchAndRenderAttempt() {
    const container = document.getElementById("solutions-container");
    const testId = localStorage.getItem('testId') || localStorage.getItem('test_id');
    
    if (!container) {
        console.error('Solutions container not found');
        return;
    }
    
    if (!testId) {
        container.innerHTML = '<p>No test ID found. Please take a test first.</p>';
        return;
    }
    
    // Show loading
    container.innerHTML = '<p>Loading review from server...</p>';
    
    try {
        // Check if TestService is available
        if (typeof TestService === 'undefined') {
            console.error('TestService not loaded');
            container.innerHTML = '<p>Error: TestService not loaded. Please refresh.</p>';
            return;
        }
        
        // Fetch last attempt from backend
        const data = await TestService.getLastAttempt(testId);
        
        if (!data || !data.lastAttempt) {
            container.innerHTML = '<p>No attempt found for this test. Please take the test first.</p>';
            return;
        }
        
        const attempt = data.lastAttempt;
        const questions = attempt.questions || [];
        const answers = attempt.answers || {};
        
        console.log('Review loaded from backend:', {
            testId: attempt.testId,
            questionsCount: questions.length,
            answersCount: Object.keys(answers).length,
            score: attempt.score,
            subject: attempt.subject
        });
        
        if (questions.length === 0) {
            container.innerHTML = '<p>No questions available for review. The attempt was saved without questions.</p>';
            return;
        }
        
        // Render questions
        renderQuestionsFromAttempt(container, questions, answers, attempt);
        
    } catch (error) {
        console.error('Error fetching attempt:', error);
        container.innerHTML = `<p>Error loading review: ${error.message}</p>`;
        
        // Fallback to local questions if available
        if (window.questions && Array.isArray(window.questions)) {
            console.log('Falling back to local questions');
            renderSolutions();
        }
    }
}

// Render questions from attempt
function renderQuestionsFromAttempt(container, questions, answers, attempt) {
    container.innerHTML = '';
    
    // Calculate stats
    let correct = 0, incorrect = 0, unattempted = 0;
    questions.forEach(q => {
        const status = getQuestionStatus(q, answers);
        if (status === 'correct') correct++;
        else if (status === 'incorrect') incorrect++;
        else unattempted++;
    });
    
    const percentage = attempt.totalMarks > 0 
        ? Math.round((attempt.score / attempt.totalMarks) * 100) 
        : 0;
    
    // Add score summary
    const summaryHTML = `
        <div class="review-summary" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">${getTextValue(attempt.subject)} Test Review</h2>
            <div style="font-size: 48px; font-weight: 700; margin: 10px 0;">
                ${attempt.score}<span style="font-size: 24px; opacity: 0.9;">/${attempt.totalMarks}</span>
                <span style="font-size: 20px; margin-left: 10px; opacity: 0.9;">(${percentage}%)</span>
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
                <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;">${correct} ✓ Correct</span>
                <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;">${incorrect} ✗ Wrong</span>
                <span style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px;">${unattempted} ○ Unattempted</span>
            </div>
        </div>
    `;
    
    container.innerHTML += summaryHTML;
    
    // Render each question
    questions.forEach((q, index) => {
        const userAnswer = answers[q.id];
        const status = getQuestionStatus(q, answers);
        
        const questionText = getTextValue(q.question);
        const explanation = getTextValue(q.explanation);
        
        // Build options HTML
        let optionsHTML = '';
        if (Array.isArray(q.options)) {
            optionsHTML = q.options.map((opt, optIndex) => {
                const optionText = getTextValue(opt);
                const isCorrect = optionText === q.correctAnswer;
                const isUserAnswer = optionText === userAnswer;
                const letter = String.fromCharCode(65 + optIndex);
                
                let optionStyle = 'background: #f8f9fa; border-color: #e9ecef;';
                let badge = '';
                
                if (isCorrect) {
                    optionStyle = 'background: #d4edda; border-color: #28a745;';
                    badge = '<span style="margin-left: auto; background: #28a745; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">✓ Correct</span>';
                }
                if (isUserAnswer && !isCorrect) {
                    optionStyle = 'background: #f8d7da; border-color: #dc3545;';
                    badge = '<span style="margin-left: auto; background: #dc3545; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">✗ Your Answer</span>';
                }
                
                return `
                    <li style="display: flex; align-items: center; padding: 15px; margin: 8px 0; border-radius: 10px; border: 2px solid; ${optionStyle}">
                        <span style="font-weight: 700; min-width: 30px; color: #495057;">${letter}.</span>
                        <span style="flex: 1;">${optionText}</span>
                        ${badge}
                    </li>
                `;
            }).join('');
        }
        
        const statusClass = status === 'correct' ? '#28a745' : status === 'incorrect' ? '#dc3545' : '#ffc107';
        const statusText = status === 'correct' ? '✓ Correct' : status === 'incorrect' ? '✗ Wrong' : '○ Unattempted';
        
        const cardHTML = `
            <div style="background: white; border-radius: 16px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-left: 5px solid ${statusClass};">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
                    <h3 style="margin: 0; color: #333; font-size: 18px;">Q${index + 1}</h3>
                    <span style="background: #e9ecef; color: #495057; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">${q.subject || attempt.subject}</span>
                    <span style="background: ${statusClass}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-left: auto;">${statusText}</span>
                </div>
                
                <div style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #212529;">
                    ${questionText}
                </div>
                
                <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">${optionsHTML}</ul>
                
                ${explanation ? `
                    <div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; border-radius: 8px;">
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
