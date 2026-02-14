/**
 * Test Service for Exam-Axis Frontend
 * Handles saving test attempts with questions snapshot
 * and fetching attempts with questions for review
 */

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://exam-axis-backend.vercel.app/api";

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem("token") || localStorage.getItem("authToken");
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Save test attempt with questions snapshot
 * CRITICAL: Must send questions array for accurate review
 * @param {Object} attemptData - The attempt data
 * @returns {Promise} API response
 */
async function saveTestAttempt(attemptData) {
  console.log("💾 Saving test attempt...", {
    testId: attemptData.testId,
    questionsCount: attemptData.questions?.length || 0,
    answersCount: Object.keys(attemptData.answers || {}).length,
  });

  // ✅ Enhanced payload with proper question mapping
  const payload = {
    testId: String(attemptData.testId),
    examType: attemptData.examType || detectExamType(attemptData.testId),
    subject: attemptData.subject || "General",
    score: Number(attemptData.score) || 0,
    totalMarks:
      Number(attemptData.totalMarks) || attemptData.questions?.length * 2 || 0,
    correctAnswers: Number(attemptData.correctAnswers) || 0,
    wrongAnswers: Number(attemptData.wrongAnswers) || 0,
    unanswered: Number(attemptData.unanswered) || 0,
    timeTaken: Number(attemptData.timeTaken) || 0,
    answers: attemptData.answers || {},
    // ✅ CRITICAL: Send questions snapshot with proper structure
    questionsSnapshot: (attemptData.questions || []).map((q) => ({
      id: q.id || `${attemptData.testId}_${q.originalIndex || 0}`,
      testId: String(attemptData.testId),
      originalIndex: q.originalIndex || 0,
      subject: q.subject || attemptData.subject || "General",
      question:
        typeof q.question === "string" ? q.question : q.question?.en || "",
      options: Array.isArray(q.options)
        ? q.options.map((opt) =>
            typeof opt === "string" ? opt : opt?.en || opt?.text || String(opt),
          )
        : [],
      correctAnswer:
        typeof q.correctAnswer === "string"
          ? q.correctAnswer
          : q.correctAnswer?.en || q.correctAnswer?.text || "",
      explanation:
        typeof q.explanation === "string"
          ? q.explanation
          : q.explanation?.en || q.explanation?.text || "",
      metadata: {
        normalized: true,
        timestamp: new Date().toISOString(),
      },
    })),
    // Add submission metadata
    submissionMetadata: {
      userAgent: navigator.userAgent.substring(0, 100),
      timestamp: new Date().toISOString(),
      questionsSource: attemptData.questionsSource || "unknown",
      ...attemptData.metadata,
    },
  };

  const data = await apiRequest("/tests/attempt", {
    method: "POST",
    body: payload,
  });

  console.log("✅ Attempt saved:", {
    attemptId: data.attempt?.id,
    questionsStored: data.attempt?.questions?.length || 0,
  });

  return data;

  // Helper function to detect exam type
  function detectExamType(testId) {
    const id = String(testId).toLowerCase();
    if (id.includes("cgl")) return "CGL";
    if (id.includes("chsl")) return "CHSL";
    if (id.includes("dp") || id.includes("delhi")) return "DP";
    return "CGL"; // default
  }
}

/**
 * Get last attempt for a specific test with questions
 * @param {string} testId - Test ID
 * @returns {Promise} API response with lastAttempt including questions
 */
async function getLastAttempt(testId) {
  console.log("📥 Fetching last attempt for test:", testId);

  try {
    const data = await apiRequest(
      `/tests/last-attempt/${encodeURIComponent(testId)}`,
    );

    // ✅ Enhanced response processing
    if (data.lastAttempt) {
      // Normalize questions data
      if (
        data.lastAttempt.questions &&
        Array.isArray(data.lastAttempt.questions)
      ) {
        data.lastAttempt.questions = data.lastAttempt.questions.map(
          (q, index) => ({
            id: q.id || `${testId}_${index}`,
            testId: String(testId),
            originalIndex:
              q.originalIndex !== undefined ? q.originalIndex : index,
            subject: q.subject || "General",
            question: q.question || "",
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: q.correctAnswer || "",
            explanation: q.explanation || "",
            // Preserve original data
            _original: q,
          }),
        );
      }

      // Normalize answers mapping
      if (
        data.lastAttempt.answers &&
        typeof data.lastAttempt.answers === "object"
      ) {
        const normalizedAnswers = {};
        Object.keys(data.lastAttempt.answers).forEach((key) => {
          // Support both index-based and ID-based keys
          normalizedAnswers[key] = data.lastAttempt.answers[key];
          // Also create test-specific key if not present
          if (!key.includes(testId) && !isNaN(key)) {
            normalizedAnswers[`${testId}_${key}`] =
              data.lastAttempt.answers[key];
          }
        });
        data.lastAttempt.answers = normalizedAnswers;
      }
    }

    console.log("✅ Last attempt fetched and normalized:", {
      hasAttempt: !!data.lastAttempt,
      questionsCount: data.lastAttempt?.questions?.length || 0,
      answersCount: data.lastAttempt?.answers
        ? Object.keys(data.lastAttempt.answers).length
        : 0,
      testId: testId,
    });

    return data;
  } catch (error) {
    console.error("❌ Failed to fetch last attempt:", error);
    throw error;
  }
}

/**
 * Get single attempt by ID with questions
 * @param {number} attemptId - Attempt ID
 * @returns {Promise} API response with attempt including questions
 */
async function getAttempt(attemptId) {
  console.log("📥 Fetching attempt:", attemptId);

  const data = await apiRequest(`/tests/attempt/${attemptId}`);

  console.log("✅ Attempt fetched:", {
    hasAttempt: !!data.attempt,
    questionsCount: data.attempt?.questions?.length || 0,
  });

  return data;
}

/**
 * Get last attempts for multiple tests
 * @param {string[]} testIds - Array of test IDs
 * @returns {Promise} API response with lastAttempts map
 */
async function getLastAttempts(testIds) {
  const ids = Array.isArray(testIds) ? testIds.join(",") : testIds;
  console.log("📥 Fetching last attempts for tests:", ids);

  const data = await apiRequest(
    `/tests/last-attempts?testIds=${encodeURIComponent(ids)}`,
  );

  console.log("✅ Last attempts fetched:", {
    testIds: Object.keys(data.lastAttempts || {}),
  });

  return data;
}

/**
 * Get user's test history
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with attempts
 */
async function getHistory(params = {}) {
  const query = new URLSearchParams();
  if (params.examType) query.append("examType", params.examType);
  if (params.subject) query.append("subject", params.subject);
  if (params.limit) query.append("limit", params.limit);
  if (params.offset) query.append("offset", params.offset);

  const data = await apiRequest(`/tests/history?${query.toString()}`);
  return data;
}

/**
 * Get test leaderboard
 * @param {string} testId - Test ID
 * @param {number} limit - Number of top scorers
 * @returns {Promise} API response with leaderboard
 */
async function getLeaderboard(testId, limit = 10) {
  const data = await apiRequest(
    `/tests/leaderboard/${encodeURIComponent(testId)}?limit=${limit}`,
  );
  return data;
}

// ✅ Enhanced utility functions
function normalizeQuestionForReview(question, testId, index) {
  return {
    id: question.id || `${testId}_${index}`,
    testId: String(testId),
    originalIndex:
      question.originalIndex !== undefined ? question.originalIndex : index,
    subject: question.subject || "General",
    question:
      typeof question.question === "string"
        ? question.question
        : question.question?.en || question.question?.text || "",
    options: Array.isArray(question.options)
      ? question.options.map((opt) =>
          typeof opt === "string" ? opt : opt?.en || opt?.text || String(opt),
        )
      : [],
    correctAnswer:
      typeof question.correctAnswer === "string"
        ? question.correctAnswer
        : question.correctAnswer?.en || question.correctAnswer?.text || "",
    explanation:
      typeof question.explanation === "string"
        ? question.explanation
        : question.explanation?.en || question.explanation?.text || "",
    _original: question,
  };
}

function validateAttemptData(attemptData) {
  const errors = [];

  if (!attemptData.testId) errors.push("testId is required");
  if (typeof attemptData.score !== "number")
    errors.push("score must be a number");
  if (!Array.isArray(attemptData.questions))
    errors.push("questions must be an array");
  if (!attemptData.answers || typeof attemptData.answers !== "object") {
    errors.push("answers must be an object");
  }

  if (errors.length > 0) {
    console.warn("⚠️ Attempt data validation errors:", errors);
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// Export functions for use in other scripts
window.TestService = {
  saveTestAttempt,
  getLastAttempt,
  getAttempt,
  getLastAttempts,
  getHistory,
  getLeaderboard,
  apiRequest,
  // ✅ Export utility functions
  normalizeQuestionForReview,
  validateAttemptData,
};

console.log(
  "✅ TestService loaded - Ready to save/fetch attempts with questions",
);
