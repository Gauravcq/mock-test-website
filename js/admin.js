// js/admin.js

// ==================== GLOBAL VARIABLES ====================
let currentTest = null;
let currentTestId = null;

// ==================== INITIALIZATION ====================

async function initAdmin() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('admin-content').style.display = 'none';

  const isAdmin = await ExamAxisAPI.requireAdmin();
  
  if (!isAdmin) {
    return;
  }

  document.getElementById('loading').style.display = 'none';
  document.getElementById('admin-content').style.display = 'block';

  const user = ExamAxisAPI.getCurrentUser();
  const adminNameEl = document.getElementById('admin-name');
  if (adminNameEl) {
    adminNameEl.textContent = user?.fullName || user?.username || 'Admin';
  }

  await loadDashboard();
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
  const result = await ExamAxisAPI.getAdminDashboard();

  if (result.success && result.data) {
    const stats = result.data.stats || result.data;
    
    const totalUsersEl = document.getElementById('total-users');
    const totalTestsEl = document.getElementById('total-tests');
    const totalQuestionsEl = document.getElementById('total-questions');
    const totalAttemptsEl = document.getElementById('total-attempts');

    if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers || 0;
    if (totalTestsEl) totalTestsEl.textContent = stats.totalTests || 0;
    if (totalQuestionsEl) totalQuestionsEl.textContent = stats.totalQuestions || 0;
    if (totalAttemptsEl) totalAttemptsEl.textContent = stats.totalAttempts || 0;
  } else {
    console.error('Failed to load dashboard:', result.message);
  }
}

// ==================== TAB NAVIGATION ====================

function showTab(tabName) {
  // ... existing code ...

  switch (tabName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'users':
      loadUsers();
      break;
    case 'tests':
      loadTests();
      break;
    case 'questions':
      loadTestsForQuestions();
      initQuickTextEntry(); // ← ADD THIS LINE
      break;
  }
}

  const allBtns = document.querySelectorAll('.tab-btn');
  allBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }

  if (event && event.target) {
    event.target.classList.add('active');
  }

  switch (tabName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'users':
      loadUsers();
      break;
    case 'tests':
      loadTests();
      break;
    case 'questions':
      loadTestsForQuestions();
      break;
  }

// ==================== USERS MANAGEMENT ====================

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

  const result = await ExamAxisAPI.getAdminUsers();

  if (!result.success) {
    tbody.innerHTML = `<tr><td colspan="5">Error: ${result.message}</td></tr>`;
    return;
  }

  const users = result.data?.users || result.data || [];

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.fullName || user.username || 'N/A'}</td>
      <td>${user.email}</td>
      <td>
        <span class="badge ${user.role === 'admin' || user.role === 'superadmin' ? 'badge-admin' : 'badge-user'}">
          ${user.role || 'user'}
        </span>
      </td>
      <td>
        <span class="badge ${user.isActive ? 'badge-active' : 'badge-inactive'}">
          ${user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <button onclick="toggleUserActive('${user.id}')" class="btn-sm btn-primary">
          ${user.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

async function toggleUserActive(userId) {
  if (!confirm('Are you sure you want to change this user\'s status?')) {
    return;
  }

  const result = await ExamAxisAPI.toggleUserActive(userId);

  if (result.success) {
    alert('✅ User status updated!');
    loadUsers();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

// ==================== TESTS MANAGEMENT ====================

async function loadTests() {
  const tbody = document.getElementById('tests-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

  const result = await ExamAxisAPI.getAdminTests();

  if (!result.success) {
    tbody.innerHTML = `<tr><td colspan="6">Error: ${result.message}</td></tr>`;
    return;
  }

  const tests = result.data?.tests || result.data || [];

  if (tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No tests found</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${test.title || test.testId || 'Unnamed Test'}</td>
      <td>${test.subject || test.category || 'General'}</td>
      <td>${test.totalQuestions || 0}</td>
      <td>
        <span class="badge ${test.isActive ? 'badge-active' : 'badge-inactive'}">
          ${test.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <button onclick="editTest('${test.id}')" class="btn-sm btn-primary" title="Edit">
          ✏️ Edit
        </button>
        <button onclick="duplicateTestPrompt('${test.id}')" class="btn-sm" style="background: #3498db; color: white;" title="Duplicate">
          📋 Copy
        </button>
        <button onclick="toggleTestActive('${test.id}')" class="btn-sm" style="background: #f39c12; color: white;" title="Toggle Active">
          ${test.isActive ? '🔒' : '🔓'}
        </button>
        <button onclick="deleteTest('${test.id}')" class="btn-sm btn-danger" title="Delete">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');
}

async function handleCreateTest(event) {
  event.preventDefault();

  const form = event.target;

  const testData = {
    testId: form.testId.value.trim(),
    title: form.title.value.trim(),
    description: form.description?.value?.trim() || '',
    examType: form.examType?.value || 'CGL',
    subject: form.subject?.value || 'General',
    duration: parseInt(form.duration.value) || 25,
    totalMarks: parseInt(form.totalMarks?.value) || 50,
    difficulty: form.difficulty?.value || 'medium'
  };

  if (!testData.testId || !testData.title) {
    alert('❌ Please fill in Test ID and Title');
    return;
  }

  const result = await ExamAxisAPI.createTest(testData);

  if (result.success) {
    alert('✅ Test created successfully!');
    form.reset();
    loadTests();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

async function editTest(testId) {
  // Get test details
  const result = await ExamAxisAPI.getTestById(testId);
  
  if (!result.success) {
    alert('❌ Error loading test: ' + result.message);
    return;
  }

  const test = result.data?.test || result.data;
  
  // Pre-fill edit form
  const form = document.getElementById('edit-test-form');
  if (form) {
    document.getElementById('edit-testId').value = test.id;
    document.getElementById('edit-title').value = test.title;
    document.getElementById('edit-description').value = test.description || '';
    document.getElementById('edit-examType').value = test.examType || 'CGL';
    document.getElementById('edit-subject').value = test.subject || 'General';
    document.getElementById('edit-duration').value = test.duration;
    document.getElementById('edit-totalMarks').value = test.totalMarks;
    document.getElementById('edit-difficulty').value = test.difficulty || 'medium';
    
    // Show edit section
    document.getElementById('edit-test-section').style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

async function handleUpdateTest(event) {
  event.preventDefault();

  const form = event.target;
  const testId = document.getElementById('edit-testId').value;

  const testData = {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    examType: form.examType.value,
    subject: form.subject.value,
    duration: parseInt(form.duration.value),
    totalMarks: parseInt(form.totalMarks.value),
    difficulty: form.difficulty.value
  };

  const result = await ExamAxisAPI.updateTest(testId, testData);

  if (result.success) {
    alert('✅ Test updated successfully!');
    document.getElementById('edit-test-section').style.display = 'none';
    loadTests();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

function cancelEdit() {
  document.getElementById('edit-test-section').style.display = 'none';
  document.getElementById('edit-test-form').reset();
}

async function duplicateTestPrompt(testId) {
  const newTestId = prompt('Enter new Test ID:');
  if (!newTestId) return;

  const title = prompt('Enter new Test Title:');
  if (!title) return;

  const result = await ExamAxisAPI.duplicateTest(testId, newTestId, title);

  if (result.success) {
    alert('✅ Test duplicated successfully!');
    loadTests();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

async function toggleTestActive(testId) {
  const result = await ExamAxisAPI.toggleTestActive(testId);

  if (result.success) {
    alert('✅ Test status updated!');
    loadTests();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

async function deleteTest(testId) {
  if (!confirm('⚠️ Are you sure you want to delete this test? This cannot be undone!')) {
    return;
  }

  const result = await ExamAxisAPI.deleteTest(testId);

  if (result.success) {
    alert('✅ Test deleted!');
    loadTests();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

// ==================== QUESTIONS MANAGEMENT ====================

async function loadTestsForQuestions() {
  const select = document.getElementById('question-test-select');
  if (!select) return;

  const result = await ExamAxisAPI.getAdminTests();

  if (!result.success) {
    select.innerHTML = '<option value="">Error loading tests</option>';
    return;
  }

  const tests = result.data?.tests || result.data || [];

  select.innerHTML = '<option value="">Select a test</option>' + 
    tests.map(test => `<option value="${test.id}">${test.title} (${test.testId})</option>`).join('');
}

async function loadQuestionsForTest() {
  const select = document.getElementById('question-test-select');
  const testId = select.value;

  if (!testId) {
    document.getElementById('questions-list').innerHTML = '<p>Please select a test</p>';
    return;
  }

  currentTestId = testId;

  const result = await ExamAxisAPI.getTestById(testId);

  if (!result.success) {
    document.getElementById('questions-list').innerHTML = '<p>Error loading questions</p>';
    return;
  }

  const test = result.data?.test || result.data;
  const questions = test.questions || [];

  if (questions.length === 0) {
    document.getElementById('questions-list').innerHTML = '<p>No questions in this test yet</p>';
    return;
  }

  let html = '<div class="questions-grid">';
  questions.forEach((q, index) => {
    html += `
      <div class="question-card">
        <div class="question-header">
          <strong>Q${index + 1}:</strong> ${q.question || q.questionText || 'No question text'}
        </div>
        <div class="question-options">
          ${(q.options || []).map((opt, i) => `
            <div class="${q.correctAnswer === i || q.correctAnswer === String.fromCharCode(65 + i) ? 'correct-option' : ''}">
              ${String.fromCharCode(65 + i)}) ${opt}
            </div>
          `).join('')}
        </div>
        <div class="question-actions">
          <button onclick="deleteQuestionConfirm('${testId}', ${index})" class="btn-sm btn-danger">Delete</button>
        </div>
      </div>
    `;
  });
  html += '</div>';

  document.getElementById('questions-list').innerHTML = html;
}

async function handleAddQuestion(event) {
  event.preventDefault();

  const testId = currentTestId;
  if (!testId) {
    alert('❌ Please select a test first');
    return;
  }

  const form = event.target;

  const questionData = {
    question: form.question.value.trim(),
    options: [
      form.optionA.value.trim(),
      form.optionB.value.trim(),
      form.optionC.value.trim(),
      form.optionD.value.trim()
    ],
    correctAnswer: form.correctAnswer.value
  };

  const result = await ExamAxisAPI.addSingleQuestion(testId, questionData);

  if (result.success) {
    alert('✅ Question added!');
    form.reset();
    loadQuestionsForTest();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

async function deleteQuestionConfirm(testId, questionIndex) {
  if (!confirm('Delete this question?')) return;

  const result = await ExamAxisAPI.deleteQuestion(testId, questionIndex);

  if (result.success) {
    alert('✅ Question deleted!');
    loadQuestionsForTest();
  } else {
    alert('❌ Error: ' + result.message);
  }
}

// ==================== BULK UPLOAD ====================

async function handleBulkUpload(event) {
  event.preventDefault();

  const testId = currentTestId;
  if (!testId) {
    alert('❌ Please select a test first');
    return;
  }

  const fileInput = document.getElementById('bulk-file');
  const file = fileInput.files[0];

  if (!file) {
    alert('❌ Please select a file');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const questions = JSON.parse(e.target.result);

      if (!Array.isArray(questions)) {
        alert('❌ File must contain an array of questions');
        return;
      }

      const replace = document.getElementById('replace-questions').checked;

      const result = await ExamAxisAPI.bulkUploadQuestions(testId, questions, replace);

      if (result.success) {
        alert(`✅ ${questions.length} questions uploaded!`);
        fileInput.value = '';
        loadQuestionsForTest();
      } else {
        alert('❌ Error: ' + result.message);
      }
    } catch (error) {
      alert('❌ Invalid JSON file');
    }
  };

  reader.readAsText(file);
}

function downloadSampleJSON() {
  const sample = [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "B"
    },
    {
      question: "Capital of France?",
      options: ["London", "Berlin", "Paris", "Rome"],
      correctAnswer: "C"
    }
  ];

  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-questions.json';
  a.click();
}

// ==================== LOGOUT ====================

async function adminLogout() {
  await ExamAxisAPI.logout();
  window.location.href = 'login.html';
}
// ==================== QUICK TEXT ENTRY ====================

async function loadTestsForQuickEntry() {
  const select = document.getElementById('quick-text-test-select');
  if (!select) return;

  const result = await ExamAxisAPI.getAdminTests();

  if (!result.success) {
    select.innerHTML = '<option value="">Error loading tests</option>';
    return;
  }

  const tests = result.data?.tests || result.data || [];

  select.innerHTML = '<option value="">Select a test</option>' + 
    tests.map(test => `<option value="${test.id}">${test.title} (${test.testId})</option>`).join('');
}

function parseQuickTextQuestions(text) {
  const questions = [];
  const lines = text.trim().split('\n');
  
  let currentQuestion = null;
  let currentOptions = [];
  let questionNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue; // Skip empty lines
    
    // Check if line starts with a number (e.g., "1.", "2.", etc.)
    const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
    
    if (questionMatch) {
      // Save previous question if exists
      if (currentQuestion) {
        questions.push({
          question: currentQuestion,
          options: currentOptions,
          correctAnswer: currentAnswer
        });
      }
      
      // Start new question
      questionNumber = parseInt(questionMatch[1]);
      currentQuestion = questionMatch[2];
      currentOptions = [];
      currentAnswer = null;
    }
    // Check if line is an option (A), B), C), D))
    else if (line.match(/^[A-D]\)/)) {
      const optionText = line.substring(2).trim(); // Remove "A) " part
      currentOptions.push(optionText);
    }
    // Check if line is answer (Answer: A, Answer: B, etc.)
    else if (line.match(/^Answer:\s*[A-D]/i)) {
      const answerMatch = line.match(/Answer:\s*([A-D])/i);
      if (answerMatch) {
        currentAnswer = answerMatch[1].toUpperCase();
      }
    }
  }
  
  // Don't forget the last question
  if (currentQuestion && currentOptions.length >= 2) {
    questions.push({
      question: currentQuestion,
      options: currentOptions,
      correctAnswer: currentAnswer
    });
  }
  
  return questions;
}

function previewParsedQuestions() {
  const text = document.getElementById('quick-text-input').value;
  
  if (!text.trim()) {
    alert('❌ Please paste some questions first!');
    return;
  }
  
  const questions = parseQuickTextQuestions(text);
  
  if (questions.length === 0) {
    alert('❌ No valid questions found. Please check the format.');
    return;
  }
  
  // Show preview
  const previewArea = document.getElementById('preview-area');
  const previewContent = document.getElementById('preview-content');
  
  let html = `<p><strong>Found ${questions.length} questions</strong></p>`;
  
  questions.forEach((q, index) => {
    const hasError = !q.correctAnswer || q.options.length < 2;
    
    html += `
      <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid ${hasError ? '#e74c3c' : '#27ae60'};">
        <strong>Q${index + 1}:</strong> ${q.question || '<span style="color: red;">Missing question</span>'}
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${q.options.map((opt, i) => `
            <li style="${q.correctAnswer === String.fromCharCode(65 + i) ? 'font-weight: bold; color: #27ae60;' : ''}">
              ${String.fromCharCode(65 + i)}) ${opt}
            </li>
          `).join('')}
        </ul>
        <div style="color: ${q.correctAnswer ? '#27ae60' : '#e74c3c'};">
          ✓ Correct Answer: ${q.correctAnswer || '<strong>MISSING!</strong>'}
        </div>
        ${hasError ? '<div style="color: #e74c3c; margin-top: 5px;">⚠️ This question has errors!</div>' : ''}
      </div>
    `;
  });
  
  previewContent.innerHTML = html;
  previewArea.style.display = 'block';
  previewArea.scrollIntoView({ behavior: 'smooth' });
}

async function handleQuickTextEntry(event) {
  event.preventDefault();
  
  const testId = document.getElementById('quick-text-test-select').value;
  const text = document.getElementById('quick-text-input').value;
  const replace = document.getElementById('quick-replace-questions').checked;
  
  if (!testId) {
    alert('❌ Please select a test');
    return;
  }
  
  if (!text.trim()) {
    alert('❌ Please paste questions');
    return;
  }
  
  // Parse questions
  const questions = parseQuickTextQuestions(text);
  
  if (questions.length === 0) {
    alert('❌ No valid questions found. Please check the format.');
    return;
  }
  
  // Check for errors
  const invalidQuestions = questions.filter(q => !q.correctAnswer || q.options.length < 2);
  
  if (invalidQuestions.length > 0) {
    const proceed = confirm(
      `⚠️ Warning: ${invalidQuestions.length} questions have errors (missing answer or options).\n\n` +
      `Do you want to continue anyway?`
    );
    if (!proceed) return;
  }
  
  // Confirm upload
  const confirmMsg = replace 
    ? `⚠️ This will REPLACE all existing questions with ${questions.length} new questions. Continue?`
    : `Upload ${questions.length} questions to the test?`;
  
  if (!confirm(confirmMsg)) return;
  
  // Upload
  const result = await ExamAxisAPI.bulkUploadQuestions(testId, questions, replace);
  
  if (result.success) {
    alert(`✅ Successfully uploaded ${questions.length} questions!`);
    document.getElementById('quick-text-input').value = '';
    document.getElementById('preview-area').style.display = 'none';
    
    // Refresh questions list if test is selected
    if (currentTestId === testId) {
      loadQuestionsForTest();
    }
  } else {
    alert('❌ Error: ' + result.message);
  }
}

// Call this when Questions tab is opened
function initQuickTextEntry() {
  loadTestsForQuickEntry();
}

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', initAdmin);

// ==================== GLOBAL FUNCTIONS ====================

window.showTab = showTab;
window.loadUsers = loadUsers;
window.toggleUserActive = toggleUserActive;
window.loadTests = loadTests;
window.handleCreateTest = handleCreateTest;
window.editTest = editTest;
window.handleUpdateTest = handleUpdateTest;
window.cancelEdit = cancelEdit;
window.duplicateTestPrompt = duplicateTestPrompt;
window.toggleTestActive = toggleTestActive;
window.deleteTest = deleteTest;
window.loadQuestionsForTest = loadQuestionsForTest;
window.handleAddQuestion = handleAddQuestion;
window.deleteQuestionConfirm = deleteQuestionConfirm;
window.handleBulkUpload = handleBulkUpload;
window.downloadSampleJSON = downloadSampleJSON;
window.adminLogout = adminLogout;
// Add these to the existing window assignments
window.previewParsedQuestions = previewParsedQuestions;
window.handleQuickTextEntry = handleQuickTextEntry;