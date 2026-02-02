// js/api.js

// Backend API base URL (no trailing slash)
const API_BASE_URL = 'https://exam-axis-backend.vercel.app';

class ExamAxisAPI {
  // ==================== CORE REQUEST HELPER ====================
  static async request(endpoint, options = {}) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    let data = null;

    try {
      response = await fetch(url, { ...defaultOptions, ...options });
    } catch (err) {
      console.error('Fetch error:', err);
      return { response: null, data: null, error: 'NETWORK_ERROR' };
    }

    try {
      data = await response.json();
    } catch (err) {
      data = null;
    }

    return { response, data };
  }

  // ==================== AUTH ====================

  static async register(userData) {
    try {
      const { response, data, error } = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error. Please try again.' };
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Registration failed (${response.status})`;
        return { success: false, message: msg };
      }

      if (data && data.success && data.token && data.data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data || { success: false, message: 'Unexpected server response.' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Unexpected error. Please try again.' };
    }
  }

  static async login(identifier, password) {
    try {
      const { response, data, error } = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error. Please try again.' };
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Login failed (${response.status})`;
        return { success: false, message: msg };
      }

      if (data && data.success && data.token && data.data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data || { success: false, message: 'Unexpected server response.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Unexpected error. Please try again.' };
    }
  }

  static async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }

  static async checkAuth() {
    try {
      const { response, data } = await this.request('/api/auth/check');

      if (!response || !response.ok || !data || !data.success) {
        return { isAuthenticated: false, user: null };
      }

      if (data.data?.isAuthenticated && data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return { isAuthenticated: true, user: data.data.user };
      }

      return { isAuthenticated: false, user: null };
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  }

  static async getMe() {
    try {
      const { response, data } = await this.request('/api/auth/me');

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get user (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get user data' };
    }
  }

  // ==================== USER ====================

  static async updateProfile(profileData) {
    try {
      const { response, data } = await this.request('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to update profile (${response.status})`;
        return { success: false, message: msg };
      }

      if (data.success && data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  }

  static async changePassword(currentPassword, newPassword, confirmNewPassword) {
    try {
      const { response, data } = await this.request('/api/users/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to change password (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to change password' };
    }
  }

  static async getUserStats() {
    try {
      const { response, data } = await this.request('/api/users/stats');

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get stats (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get stats' };
    }
  }

  // ==================== TESTS ====================

  static async saveTestAttempt(attemptData) {
    try {
      const { response, data } = await this.request('/api/tests/attempt', {
        method: 'POST',
        body: JSON.stringify(attemptData),
      });

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to save test attempt (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to save test attempt' };
    }
  }

  static async getTestHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const { response, data } = await this.request(
        `/api/tests/history?${params}`
      );

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get history (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get history' };
    }
  }

  static async getTestAttempt(attemptId) {
    try {
      const { response, data } = await this.request(
        `/api/tests/attempt/${attemptId}`
      );

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get attempt (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get attempt' };
    }
  }

  static async getLeaderboard(testId, limit = 10) {
    try {
      const { response, data } = await this.request(
        `/api/tests/leaderboard/${testId}?limit=${limit}`
      );

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get leaderboard (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get leaderboard' };
    }
  }

  // ==================== QUESTIONS ====================

  static async getQuestions(testId) {
    try {
      const { response, data, error } = await this.request(`/api/questions/${testId}`);

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error. Please check your connection.' };
      }

      if (!response.ok) {
        const msg = (data && (data.message || data.error)) ||
          `Failed to load questions (${response.status})`;
        return { success: false, message: msg };
      }

      return data || { success: false, message: 'No questions found' };
    } catch (error) {
      console.error('Get questions error:', error);
      return { success: false, message: 'Failed to load questions' };
    }
  }

  static async submitTest(testId, answers) {
    try {
      const { response, data, error } = await this.request(`/api/questions/${testId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error. Please check your connection.' };
      }

      if (!response.ok) {
        const msg = (data && (data.message || data.error)) ||
          `Failed to submit test (${response.status})`;
        return { success: false, message: msg };
      }

      return data || { success: false, message: 'Failed to get results' };
    } catch (error) {
      console.error('Submit test error:', error);
      return { success: false, message: 'Failed to submit test' };
    }
  }

  static async checkTestExists(testId) {
    try {
      const { response, data } = await this.request(`/api/questions/check/${testId}`);

      if (!response.ok) {
        return { success: false, exists: false };
      }

      return data || { success: false, exists: false };
    } catch (error) {
      return { success: false, exists: false };
    }
  }

  static async getAvailableTests() {
    try {
      const { response, data } = await this.request('/api/questions/list');

      if (!response.ok) {
        const msg = (data && (data.message || data.error)) ||
          `Failed to get tests (${response.status})`;
        return { success: false, message: msg };
      }

      return data || { success: false, message: 'No tests available' };
    } catch (error) {
      return { success: false, message: 'Failed to get available tests' };
    }
  }

  // ==================== ADMIN FUNCTIONS ====================

  // Check if current user is admin (quick check from localStorage)
  static isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'superadmin';
  }

  // Verify admin status from server (secure check)
  static async verifyAdmin() {
    try {
      const { response, data, error } = await this.request('/api/admin/verify');

      if (error === 'NETWORK_ERROR') {
        return { isAdmin: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { isAdmin: false, message: data?.message || 'Not authorized' };
      }

      return {
        isAdmin: data?.data?.isAdmin || false,
        user: data?.data?.user
      };
    } catch (error) {
      console.error('Admin verify error:', error);
      return { isAdmin: false, message: 'Verification failed' };
    }
  }

  // Require admin access - redirects if not admin
  static async requireAdmin() {
    const token = this.getToken();

    if (!token) {
      window.location.href = 'login.html';
      return false;
    }

    const result = await this.verifyAdmin();

    if (!result.isAdmin) {
      alert('⛔ Access Denied! Admins only.');
      window.location.href = 'dashboard.html';
      return false;
    }

    return true;
  }

  // Get admin dashboard stats
  static async getAdminDashboard() {
    try {
      const { response, data, error } = await this.request('/api/admin/dashboard');

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to load dashboard' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to load dashboard' };
    }
  }

  // Get all users (admin)
  static async getAdminUsers() {
    try {
      const { response, data, error } = await this.request('/api/admin/users');

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to load users' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to load users' };
    }
  }

  // Toggle user active status
  static async toggleUserActive(userId) {
    try {
      const { response, data, error } = await this.request(`/api/admin/users/${userId}/toggle-active`, {
        method: 'PUT'
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to update user' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update user' };
    }
  }

  // Update user role (superadmin only)
  static async updateUserRole(userId, role) {
    try {
      const { response, data, error } = await this.request(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to update role' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update role' };
    }
  }

  // Delete user (superadmin only)
  static async deleteUser(userId) {
    try {
      const { response, data, error } = await this.request(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to delete user' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to delete user' };
    }
  }

  // Get all tests (admin)
  static async getAdminTests() {
    try {
      const { response, data, error } = await this.request('/api/admin/tests');

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to load tests' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to load tests' };
    }
  }

  // Create new test
  static async createTest(testData) {
    try {
      const { response, data, error } = await this.request('/api/admin/tests', {
        method: 'POST',
        body: JSON.stringify(testData)
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to create test' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to create test' };
    }
  }

  // Update test
  static async updateTest(testId, testData) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}`, {
        method: 'PUT',
        body: JSON.stringify(testData)
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to update test' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update test' };
    }
  }

  // Delete test
  static async deleteTest(testId) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}`, {
        method: 'DELETE'
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to delete test' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to delete test' };
    }
  }

  // Add questions to test
  static async addQuestionsToTest(testId, questions) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/questions`, {
        method: 'POST',
        body: JSON.stringify({ questions })
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to add questions' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to add questions' };
    }
  }

  // ==================== NEW ADMIN TEST FEATURES ====================

  // Duplicate a test
  static async duplicateTest(testId, newTestId, title) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/duplicate`, {
        method: 'POST',
        body: JSON.stringify({ newTestId, title })
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to duplicate test' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to duplicate test' };
    }
  }

  // Bulk upload questions (JSON array)
  static async bulkUploadQuestions(testId, questions, replace = false) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/bulk-questions`, {
        method: 'POST',
        body: JSON.stringify({ questions, replace })
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to upload questions' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to upload questions' };
    }
  }

  // Toggle test active/inactive
  static async toggleTestActive(testId) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/toggle-active`, {
        method: 'PUT'
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to toggle test status' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to toggle test status' };
    }
  }

  // Get single test with full details
  static async getTestById(testId) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}`);

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to get test' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get test' };
    }
  }

  // Delete a question from test
  static async deleteQuestion(testId, questionIndex) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/questions/${questionIndex}`, {
        method: 'DELETE'
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to delete question' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to delete question' };
    }
  }

  // Update a single question
  static async updateQuestion(testId, questionIndex, questionData) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/questions/${questionIndex}`, {
        method: 'PUT',
        body: JSON.stringify(questionData)
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to update question' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update question' };
    }
  }

  // Get test statistics
  static async getTestStats(testId) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/stats`);

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to get test stats' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get test stats' };
    }
  }

  // Add single question to test
  static async addSingleQuestion(testId, questionData) {
    try {
      const { response, data, error } = await this.request(`/api/admin/tests/${testId}/questions`, {
        method: 'POST',
        body: JSON.stringify({ questions: [questionData] })
      });

      if (error === 'NETWORK_ERROR') {
        return { success: false, message: 'Network error' };
      }

      if (!response || !response.ok) {
        return { success: false, message: data?.message || 'Failed to add question' };
      }

      return data;
    } catch (error) {
      return { success: false, message: 'Failed to add question' };
    }
  }

  // ==================== HELPERS ====================

  static isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static getToken() {
    return localStorage.getItem('token');
  }
}

// ==================== NAVIGATION ====================

async function updateNavigation() {
  const navButtons = document.querySelector('.nav-buttons') || document.getElementById('navButtons');
  if (!navButtons) {
    console.log('No navigation buttons element found');
    return;
  }

  const user = ExamAxisAPI.getCurrentUser();
  const isLoggedIn = ExamAxisAPI.isLoggedIn();

  if (isLoggedIn && user) {
    const adminLink = (user.role === 'admin' || user.role === 'superadmin')
      ? '<a href="admin.html" class="nav-btn admin-btn" style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; border: none;">👑 Admin</a>'
      : '';

    const firstName = user.fullName ? user.fullName.split(' ')[0] : user.username;

    navButtons.innerHTML = `
      ${adminLink}
      <a href="dashboard.html" class="nav-btn login-btn">
        👤 ${firstName}
      </a>
      <button onclick="handleLogout()" class="nav-btn signup-btn">Logout</button>
    `;
    
    console.log('Navigation updated for logged-in user:', firstName);
  } else {
    navButtons.innerHTML = `
      <a href="login.html" class="nav-btn login-btn">Login</a>
      <a href="register.html" class="nav-btn signup-btn">Create Account</a>
    `;
    
    console.log('Navigation updated for guest user');
  }
}

async function handleLogout() {
  await ExamAxisAPI.logout();
  window.location.href = 'index.html';
}

// Auto-update navigation on page load
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure DOM is fully loaded
  setTimeout(() => {
    updateNavigation();
  }, 100);
});

// Make functions globally available
window.ExamAxisAPI = ExamAxisAPI;
window.updateNavigation = updateNavigation;
window.handleLogout = handleLogout;