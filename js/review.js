function normalizeQuestion(q) {
    let questionText = typeof q.question === "string" ? q.question : q.question.en;

    // Normalize options
    let options = q.options.map(opt => {
        if (typeof opt === "string") {
            let parts = opt.split("|").map(s => s.trim());
            return { en: parts[0], hi: parts[1] || parts[0] };
        }
        return opt;
    });

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

document.addEventListener("DOMContentLoaded", renderSolutions);
