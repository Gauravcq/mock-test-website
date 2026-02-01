// js/admin.js

// ==================== INITIALIZATION ====================

async function initAdmin() {
  // Show loading
  document.getElementById('loading').style.display = 'block';
  document.getElementById('admin-content').style.display = 'none';

  // Check if user is admin
  const isAdmin = await ExamAxisAPI.requireAdmin();
  
  if (!isAdmin) {
    return; // Will redirect automatically
  }

  // Hide loading, show admin content
  document.getElementById('loading').style.display = 'none';
  document.getElementById('admin-content').style.display = 'block';

  // Show admin name
  const user = ExamAxisAPI.getCurrentUser();
  const adminNameEl = document.getElementById('admin-name');
  if (adminNameEl) {
    adminNameEl.textContent = user?.fullName || user?.username || 'Admin';
  }

  // Load dashboard data
  await loadDashboard();
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
  const result = await ExamAxisAPI.getAdminDashboard();

  if (result.success && result.data) {
    const stats = result.data;
    
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
  // Hide all tabs
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => {
    tab.style.display = 'none';
  });

  // Remove active class from all buttons
  const allBtns = document.querySelectorAll('.tab-btn');
  allBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }

  // Add active class to clicked button
  if (event && event.target) {
    event.target.classList.add('active');
  }

  // Load data for the tab
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
  }
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

  tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

  const result = await ExamAxisAPI.getAdminTests();

  if (!result.success) {
    tbody.innerHTML = `<tr><td colspan="4">Error: ${result.message}</td></tr>`;
    return;
  }

  const tests = result.data?.tests || result.data || [];

  if (tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No tests found</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${test.name || test.testId || 'Unnamed Test'}</td>
      <td>${test.category || 'General'}</td>
      <td>${test.questionCount || test.totalQuestions || 0}</td>
      <td>
        <button onclick="deleteTest('${test.id}')" class="btn-sm btn-danger">
          Delete
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
    name: form.name.value.trim(),
    category: form.category.value.trim(),
    duration: parseInt(form.duration.value) || 60,
    description: form.description?.value?.trim() || ''
  };

  if (!testData.testId || !testData.name) {
    alert('❌ Please fill in Test ID and Name');
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

// ==================== LOGOUT ====================

async function adminLogout() {
  await ExamAxisAPI.logout();
  window.location.href = 'login.html';
}

// ==================== INITIALIZE ON PAGE LOAD ====================

document.addEventListener('DOMContentLoaded', initAdmin);

// ==================== MAKE FUNCTIONS GLOBAL ====================

window.showTab = showTab;
window.loadUsers = loadUsers;
window.toggleUserActive = toggleUserActive;
window.loadTests = loadTests;
window.handleCreateTest = handleCreateTest;
window.deleteTest = deleteTest;
window.adminLogout = adminLogout;