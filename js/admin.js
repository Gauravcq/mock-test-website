// js/admin.js - Simplified Admin Panel

// ==================== INITIALIZATION ====================

async function initAdmin() {
  const loadingEl = document.getElementById('loading');
  const contentEl = document.getElementById('admin-content');
  
  if (loadingEl) loadingEl.style.display = 'block';
  if (contentEl) contentEl.style.display = 'none';

  // Check if logged in
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  // Verify admin status
  try {
    const result = await ExamAxisAPI.verifyAdmin();
    
    if (!result.isAdmin) {
      alert('⛔ Access Denied! Admins only.');
      window.location.href = 'dashboard.html';
      return;
    }

    // Show admin content
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // Set admin name
    const user = ExamAxisAPI.getCurrentUser();
    const adminNameEl = document.getElementById('admin-name');
    if (adminNameEl) {
      adminNameEl.textContent = user?.fullName || user?.username || 'Admin';
    }

    // Load data
    await loadAllData();

  } catch (error) {
    console.error('Admin init error:', error);
    alert('Error loading admin panel. Please try again.');
    window.location.href = 'dashboard.html';
  }
}

// ==================== LOAD ALL DATA ====================

async function loadAllData() {
  await Promise.all([
    loadDashboardStats(),
    loadUsers(),
    loadTests()
  ]);
}

// ==================== DASHBOARD STATS ====================

async function loadDashboardStats() {
  try {
    const result = await ExamAxisAPI.getAdminDashboard();

    if (result.success && result.data) {
      const stats = result.data.stats || result.data;
      
      // Update stat cards
      updateStatCard('total-users', stats.totalUsers);
      updateStatCard('paid-users', stats.paidUsers);
      updateStatCard('total-tests', stats.totalTests);
      updateStatCard('total-revenue', '₹' + (stats.totalRevenue || 0));
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
  }
}

function updateStatCard(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value !== undefined ? value : 0;
  }
}

// ==================== USERS MANAGEMENT ====================

// Global variable to store all users
let allUsers = [];

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Loading...</td></tr>';

  try {
    const result = await ExamAxisAPI.getAdminUsers();

    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red;">Error: ${result.message}</td></tr>`;
      return;
    }

    allUsers = result.data?.users || result.data || [];

    if (allUsers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
      return;
    }

    // Display all users initially
    displayUsers(allUsers);

  } catch (error) {
    console.error('Load users error:', error);
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Failed to load users</td></tr>';
  }
}

// Function to display users in table
function displayUsers(users) {
  const tbody = document.getElementById('users-tbody');
  const noUsersFound = document.getElementById('noUsersFound');
  
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = '';
    if (noUsersFound) {
      noUsersFound.style.display = 'block';
    }
    return;
  }

  if (noUsersFound) {
    noUsersFound.style.display = 'none';
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.fullName || user.username || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${user.phone || user.mobile || 'N/A'}</td>
      <td>
        <span class="badge ${user.role === 'admin' || user.role === 'superadmin' ? 'badge-admin' : 'badge-user'}">
          ${user.role || 'user'}
        </span>
      </td>
      <td>
        <span class="badge ${user.isPaid ? 'badge-paid' : 'badge-free'}">
          ${user.isPaid ? '💎 Paid' : 'Free'}
        </span>
      </td>
      <td>
        <span class="badge ${user.isActive !== false ? 'badge-active' : 'badge-inactive'}">
          ${user.isActive !== false ? '✓ Active' : '✗ Inactive'}
        </span>
      </td>
      <td>
        <button class="btn btn-primary" style="padding: 5px 10px; font-size: 12px;" onclick="viewUserDetails('${user.id}')">
          👁️ View
        </button>
      </td>
    </tr>
  `).join('');
}

// Search users function
function searchUsers() {
  const searchInput = document.getElementById('userSearchInput');
  if (!searchInput || !allUsers.length) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    displayUsers(allUsers);
    return;
  }

  const filteredUsers = allUsers.filter(user => {
    // Search by name
    const name = (user.fullName || user.username || '').toLowerCase();
    // Search by email
    const email = (user.email || '').toLowerCase();
    // Search by mobile
    const mobile = (user.phone || user.mobile || '').toLowerCase();
    
    return name.includes(searchTerm) || 
           email.includes(searchTerm) || 
           mobile.includes(searchTerm);
  });

  displayUsers(filteredUsers);
}

// Clear search function
function clearUserSearch() {
  const searchInput = document.getElementById('userSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  displayUsers(allUsers);
}

// View user details (optional function for future enhancement)
function viewUserDetails(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (user) {
    alert(`User Details:\n\nName: ${user.fullName || user.username || 'N/A'}\nEmail: ${user.email || 'N/A'}\nMobile: ${user.phone || user.mobile || 'N/A'}\nRole: ${user.role || 'user'}\nPlan: ${user.isPaid ? 'Paid' : 'Free'}\nStatus: ${user.isActive !== false ? 'Active' : 'Inactive'}`);
  }
}

// ==================== TESTS MANAGEMENT ====================

async function loadTests() {
  const tbody = document.getElementById('tests-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Loading tests...</td></tr>';

  try {
    // Import ALL_TESTS from tests-list.js
    const allTests = typeof ALL_TESTS !== 'undefined' ? ALL_TESTS : [];
    
    // Get locked tests from localStorage (fallback for database issues)
    const lockedTests = JSON.parse(localStorage.getItem('lockedTests') || '[]');
    
    // Map ALL_TESTS to admin format with lock status
    const testsData = allTests.map(test => ({
      id: test.id,
      title: `${test.title} - ${test.subject}`,
      subject: test.subject,
      exam: test.exam,
      isActive: !lockedTests.includes(test.id),
      questionCount: 25 // Default question count
    }));

    // Try backend API first, fallback to local data
    let result = { success: false };
    try {
      result = await ExamAxisAPI.getAdminTests();
    } catch (e) {
      console.log('Backend API not available, using local data from tests-list.js');
    }

    const finalTests = result.success ? (result.data?.tests || result.data || []) : testsData;

    if (finalTests.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No tests found</td></tr>';
      return;
    }

    tbody.innerHTML = finalTests.map(test => `
      <tr>
        <td><code>${test.id || test.testId}</code></td>
        <td>${test.title || test.name || 'N/A'}</td>
        <td>${test.subject || 'N/A'}</td>
        <td>${test.exam || 'N/A'}</td>
        <td>
          <span class="badge ${test.isActive !== false ? 'badge-active' : 'badge-inactive'}">
            ${test.isActive !== false ? '✓ Active' : '✗ Locked'}
          </span>
        </td>
        <td>${test.questionCount || test.questions?.length || '25'}</td>
        <td>
          <button class="btn btn-primary" onclick="toggleTestStatus('${test.id || test.testId}')" style="padding: 5px 10px; font-size: 12px;">
            ${test.isActive !== false ? '🔒 Lock' : '🔓 Unlock'}
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Load tests error:', error);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Failed to load tests</td></tr>';
  }
}

async function toggleTestStatus(testId) {
  if (!confirm(`Are you sure you want to ${event.target.textContent.includes('Lock') ? 'lock' : 'unlock'} this test?`)) {
    return;
  }

  try {
    // Get current locked tests from localStorage
    const lockedTests = JSON.parse(localStorage.getItem('lockedTests') || '[]');
    
    // Toggle lock status in localStorage
    let isLocked = false;
    if (lockedTests.includes(testId)) {
      // Unlock the test
      const index = lockedTests.indexOf(testId);
      lockedTests.splice(index, 1);
      isLocked = false;
    } else {
      // Lock the test
      lockedTests.push(testId);
      isLocked = true;
    }
    
    // Save to localStorage
    localStorage.setItem('lockedTests', JSON.stringify(lockedTests));
    
    // Try backend API first (but don't fail if it doesn't work)
    try {
      const result = await ExamAxisAPI.toggleTestActive(testId);
      if (result.success) {
        console.log('Backend updated successfully');
      }
    } catch (e) {
      console.log('Backend API not available, using localStorage only');
    }
    
    alert(`✅ Test ${isLocked ? 'locked' : 'unlocked'} successfully!`);
    await loadTests(); // Refresh the tests list
    
  } catch (error) {
    console.error('Toggle test status error:', error);
    alert('❌ Failed to update test status');
  }
}

// ==================== REFRESH DATA ====================

async function refreshData() {
  const btn = document.querySelector('.refresh-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '🔄 Refreshing...';
  }

  await loadAllData();

  if (btn) {
    btn.disabled = false;
    btn.textContent = '🔄 Refresh';
  }
  
  alert('✅ Data refreshed!');
}

// ==================== LOGOUT ====================

async function adminLogout() {
  await ExamAxisAPI.logout();
  window.location.href = 'login.html';
}

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', initAdmin);

// Global functions
window.refreshData = refreshData;
window.adminLogout = adminLogout;
window.loadUsers = loadUsers;
window.loadTests = loadTests;
window.toggleTestStatus = toggleTestStatus;