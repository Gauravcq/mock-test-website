// ⚠️ SECURITY UPDATE
// Questions are now loaded from secure backend API
// Correct answers are only revealed after test submission

const QUESTIONS_DATABASE = {};
const QUESTIONS_DB = {};

console.info('🔒 Questions are now securely stored on server');
console.info('📡 Questions loaded via authenticated API at /api/questions/:testId');
console.info('✅ Answers are only revealed after submission');

// Prevent modification
Object.freeze(QUESTIONS_DATABASE);
Object.freeze(QUESTIONS_DB);