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
    loadTests(),
    loadCoupons()
  ]);
}

async function loadCoupons() {
  const tbody = document.getElementById('coupons-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Loading coupons...</td></tr>';
  try {
    const result = await ExamAxisAPI.getAdminCoupons();
    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red;">Error: ${result.message}</td></tr>`;
      return;
    }
    const coupons = result.data?.coupons || result.data || [];
    if (!Array.isArray(coupons) || coupons.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No coupons found</td></tr>';
      return;
    }
    tbody.innerHTML = coupons.map(c => `
      <tr>
        <td>${c.code}</td>
        <td>${c.type}</td>
        <td>${c.discount}</td>
        <td>${c.maxUses ?? '—'}</td>
        <td>${c.usedCount ?? 0}</td>
        <td>${c.active === false ? 'No' : 'Yes'}</td>
        <td>${c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
        <td>${c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Failed to load coupons</td></tr>';
  }
}

async function createCoupon() {
  const code = document.getElementById('newCouponCode')?.value?.trim();
  const type = document.getElementById('newCouponType')?.value;
  const discount = Number(document.getElementById('newCouponDiscount')?.value || 0);
  const maxUses = Number(document.getElementById('newCouponMaxUses')?.value || 0);
  const expiresAtInput = document.getElementById('newCouponExpiresAt')?.value || '';
  const active = !!document.getElementById('newCouponActive')?.checked;
  if (!code || !type || !discount) {
    alert('Enter code, type and discount');
    return;
  }
  const payload = { code, type, discount, active };
  if (maxUses > 0) payload.maxUses = maxUses;
  if (expiresAtInput) payload.expiresAt = new Date(expiresAtInput).toISOString();
  const res = await ExamAxisAPI.createAdminCoupon(payload);
  if (!res.success) {
    alert(res.message || 'Failed to create coupon');
    return;
  }
  document.getElementById('newCouponCode').value = '';
  document.getElementById('newCouponDiscount').value = '';
  document.getElementById('newCouponMaxUses').value = '';
  document.getElementById('newCouponExpiresAt').value = '';
  document.getElementById('newCouponActive').checked = true;
  loadCoupons();
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

let allUsers = [];
let usersTotal = 0;
let usersPage = 1;
let usersTotalPages = 1;
let usersLimit = 50;
let usersSearch = '';
let usersIsPremium = null;
let usersCouponCode = '';

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>';

  try {
    const result = await ExamAxisAPI.getAdminUsers({
      page: usersPage,
      limit: usersLimit,
      search: usersSearch,
      isPremium: typeof usersIsPremium === 'boolean' ? usersIsPremium : undefined,
      couponCode: usersCouponCode || undefined
    });

    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: red;">Error: ${result.message}</td></tr>`;
      return;
    }

    const payload = result.data || {};
    allUsers = payload.users || payload;
    usersTotal = payload.total || (Array.isArray(allUsers) ? allUsers.length : 0);
    usersPage = payload.page || usersPage;
    usersTotalPages = payload.totalPages || 1;

    if (allUsers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">No users found</td></tr>';
      return;
    }

    // Display all users initially
    displayUsers(allUsers);
    updateUsersPageInfo();

  } catch (error) {
    console.error('Load users error:', error);
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: red;">Failed to load users</td></tr>';
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

  tbody.innerHTML = users.map(user => {
    const isPrem = user.isPremium === true || user.role === 'premium';
    const premBadge = `<span class="badge ${isPrem ? 'badge-paid' : 'badge-free'}">${isPrem ? '💎 Premium' : 'Free'}</span>`;
    const premSince = user.premiumSince ? new Date(user.premiumSince).toLocaleDateString() : '';
    const coupon = user.couponCode || (user.attribution && user.attribution.couponCode) || '';
    const couponCell = coupon ? `${coupon} <a href="#" onclick="viewAllForCoupon('${coupon}');return false;">View all</a>` : '';
    return `
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
      <td>${premBadge}</td>
      <td>${premSince || '—'}</td>
      <td>${couponCell || '—'}</td>
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
  `;
  }).join('');
}

function searchUsers() {
  const searchInput = document.getElementById('userSearchInput');
  if (!searchInput) return;
  usersSearch = searchInput.value.trim();
  usersPage = 1;
  loadUsers();
}

function clearUserSearch() {
  const searchInput = document.getElementById('userSearchInput');
  if (searchInput) searchInput.value = '';
  usersSearch = '';
  usersPage = 1;
  loadUsers();
}

function applyUserFilters() {
  const premiumSel = document.getElementById('premiumFilter');
  const couponInput = document.getElementById('couponFilterInput');
  usersIsPremium = premiumSel && premiumSel.value !== '' ? premiumSel.value === 'true' : null;
  usersCouponCode = couponInput ? couponInput.value.trim() : '';
  usersPage = 1;
  loadUsers();
}

function clearUserFilters() {
  const premiumSel = document.getElementById('premiumFilter');
  const couponInput = document.getElementById('couponFilterInput');
  if (premiumSel) premiumSel.value = '';
  if (couponInput) couponInput.value = '';
  usersIsPremium = null;
  usersCouponCode = '';
  usersPage = 1;
  loadUsers();
}

function updateUsersPageInfo() {
  const el = document.getElementById('usersPageInfo');
  if (el) {
    el.textContent = `Page ${usersPage} of ${usersTotalPages}`;
  }
}

function prevUsersPage() {
  if (usersPage > 1) {
    usersPage -= 1;
    loadUsers();
  }
}

function nextUsersPage() {
  if (usersPage < usersTotalPages) {
    usersPage += 1;
    loadUsers();
  }
}

async function viewAllForCoupon(code) {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Loading...</td></tr>';
  try {
    const result = await ExamAxisAPI.getUsersByCoupon(code);
    if (!result.success) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: red;">Error: ${result.message}</td></tr>`;
      return;
    }
    const users = result.data?.users || [];
    displayUsers(users);
    const el = document.getElementById('usersPageInfo');
    if (el) el.textContent = `Coupon ${result.data?.coupon || code} • ${result.data?.total || users.length} users`;
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: red;">Failed to load users</td></tr>';
  }
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
