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

    // Load dashboard data
    await loadDashboard();
    await loadUsers();

  } catch (error) {
    console.error('Admin init error:', error);
    alert('Error loading admin panel. Please try again.');
    window.location.href = 'dashboard.html';
  }
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
  try {
    const result = await ExamAxisAPI.getAdminDashboard();

    if (result.success && result.data) {
      const stats = result.data.stats || result.data;
      
      document.getElementById('total-users').textContent = stats.totalUsers || 0;
      document.getElementById('total-tests').textContent = stats.totalTests || 0;
      document.getElementById('paid-users').textContent = stats.paidUsers || 0;
      document.getElementById('total-revenue').textContent = '₹' + (stats.totalRevenue || 0);
    }
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

// ==================== USERS MANAGEMENT ====================

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading...</td></tr>';

  try {
    const result = await ExamAxisAPI.getAdminUsers();

    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Error: ${result.message}</td></tr>`;
      return;
    }

    const users = result.data?.users || result.data || [];

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.fullName || user.username || 'N/A'}</td>
        <td>${user.email}</td>
        <td>
          <span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">
            ${user.role || 'user'}
          </span>
        </td>
        <td>
          <span class="badge ${user.isPaid ? 'badge-paid' : 'badge-free'}">
            ${user.isPaid ? '💎 Paid' : 'Free'}
          </span>
        </td>
        <td>
          <span class="badge ${user.isActive ? 'badge-active' : 'badge-inactive'}">
            ${user.isActive ? '✓ Active' : '✗ Inactive'}
          </span>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Load users error:', error);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Failed to load users</td></tr>';
  }
}

// ==================== REFRESH DATA ====================

async function refreshData() {
  const btn = document.querySelector('.refresh-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '🔄 Refreshing...';
  }

  await loadDashboard();
  await loadUsers();

  if (btn) {
    btn.disabled = false;
    btn.textContent = '🔄 Refresh';
  }
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