// js/api.js

// Backend API base URL (no trailing slash)
const API_BASE_URL = 'https://exam-axis-backend.vercel.app';

class ExamAxisAPI {
  // ==================== CORE REQUEST HELPER ====================
  static async request(endpoint, options = {}) {
    // Ensure endpoint starts with a slash
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
    };

    // Add auth token if it exists
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
      // Network-level failure (no HTTP response)
      return { response: null, data: null, error: 'NETWORK_ERROR' };
    }

    try {
      // Try to parse JSON; if body is empty or not JSON, keep data = null
      data = await response.json();
    } catch (err) {
      data = null;
    }

    return { response, data };
  }

  // ==================== AUTH ====================

  // Register new user
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
        // Backend returned 4xx/5xx
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

  // Login user
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

  // Logout user
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

  // Check auth status
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

  // Get current user
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
// ==================== TESTS ====================

// ... your existing test methods ...

// Get questions for a test (secure - no answers)
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

// Submit test and get results
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

// Check if a test exists
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

// Get list of available tests
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

// Update navigation based on auth status
async function updateNavigation() {
  const navButtons = document.querySelector('.nav-buttons');
  if (!navButtons) return;

  const user = ExamAxisAPI.getCurrentUser();
  const isLoggedIn = ExamAxisAPI.isLoggedIn();

  if (isLoggedIn && user) {
    navButtons.innerHTML = `
      <a href="dashboard.html" class="nav-btn login-btn">
        👤 ${user.fullName || user.username}
      </a>
      <button onclick="handleLogout()" class="nav-btn signup-btn">Logout</button>
    `;
  } else {
    navButtons.innerHTML = `
      <a href="login.html" class="nav-btn login-btn">Login</a>
      <a href="register.html" class="nav-btn signup-btn">Create Account</a>
    `;
  }
}

async function handleLogout() {
  await ExamAxisAPI.logout();
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavigation();
});

window.ExamAxisAPI = ExamAxisAPI;