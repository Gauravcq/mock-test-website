/**
 * Test Service for Exam-Axis Frontend
 * Handles saving test attempts with questions snapshot
 * and fetching attempts with questions for review
 */

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://exam-axis-backend.vercel.app/api';

/**
 * Get auth token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };
  
  if (config.body && typeof config.body === 'object') {
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
  console.log('💾 Saving test attempt...', {
    testId: attemptData.testId,
    questionsCount: attemptData.questions?.length || 0,
    answersCount: Object.keys(attemptData.answers || {}).length
  });
  
  const payload = {
    testId: attemptData.testId,
    examType: attemptData.examType || 'CGL',
    subject: attemptData.subject || 'General',
    score: attemptData.score || 0,
    totalMarks: attemptData.totalMarks || 0,
    correctAnswers: attemptData.correctAnswers || 0,
    wrongAnswers: attemptData.wrongAnswers || 0,
    unanswered: attemptData.unanswered || 0,
    timeTaken: attemptData.timeTaken || 0,
    answers: attemptData.answers || {},
    // ✅ CRITICAL: Send questions snapshot
    questionsSnapshot: attemptData.questions || []
  };
  
  const data = await apiRequest('/tests/attempt', {
    method: 'POST',
    body: payload
  });
  
  console.log('✅ Attempt saved:', {
    attemptId: data.attempt?.id,
    questionsStored: data.attempt?.questions?.length || 0
  });
  
  return data;
}

/**
 * Get last attempt for a specific test with questions
 * @param {string} testId - Test ID
 * @returns {Promise} API response with lastAttempt including questions
 */
async function getLastAttempt(testId) {
  console.log('📥 Fetching last attempt for test:', testId);
  
  const data = await apiRequest(`/tests/last-attempt/${encodeURIComponent(testId)}`);
  
  console.log('✅ Last attempt fetched:', {
    hasAttempt: !!data.lastAttempt,
    questionsCount: data.lastAttempt?.questions?.length || 0
  });
  
  return data;
}

/**
 * Get single attempt by ID with questions
 * @param {number} attemptId - Attempt ID
 * @returns {Promise} API response with attempt including questions
 */
async function getAttempt(attemptId) {
  console.log('📥 Fetching attempt:', attemptId);
  
  const data = await apiRequest(`/tests/attempt/${attemptId}`);
  
  console.log('✅ Attempt fetched:', {
    hasAttempt: !!data.attempt,
    questionsCount: data.attempt?.questions?.length || 0
  });
  
  return data;
}

/**
 * Get last attempts for multiple tests
 * @param {string[]} testIds - Array of test IDs
 * @returns {Promise} API response with lastAttempts map
 */
async function getLastAttempts(testIds) {
  const ids = Array.isArray(testIds) ? testIds.join(',') : testIds;
  console.log('📥 Fetching last attempts for tests:', ids);
  
  const data = await apiRequest(`/tests/last-attempts?testIds=${encodeURIComponent(ids)}`);
  
  console.log('✅ Last attempts fetched:', {
    testIds: Object.keys(data.lastAttempts || {})
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
  if (params.examType) query.append('examType', params.examType);
  if (params.subject) query.append('subject', params.subject);
  if (params.limit) query.append('limit', params.limit);
  if (params.offset) query.append('offset', params.offset);
  
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
  const data = await apiRequest(`/tests/leaderboard/${encodeURIComponent(testId)}?limit=${limit}`);
  return data;
}

// Export functions for use in other scripts
window.TestService = {
  saveTestAttempt,
  getLastAttempt,
  getAttempt,
  getLastAttempts,
  getHistory,
  getLeaderboard,
  apiRequest
};

console.log('✅ TestService loaded - Ready to save/fetch attempts with questions');
