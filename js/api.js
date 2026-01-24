// js/api.js

// ⚠️ UPDATE THIS WITH YOUR RENDER API URL
// No slash at the end, and include '/api'
const API_BASE_URL = 'https://exam-axis-backend-git-main-gouravmeu78-gmailcoms-projects.vercel.app';

class ExamAxisAPI {
  
  // Helper method for API calls
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
    };
    
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    return { response, data };
  }
  
  // ==================== AUTH ====================
  
  // Register new user
  static async register(userData) {
    try {
      const { response, data } = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }
  
  // Login user
  static async login(identifier, password) {
    try {
      const { response, data } = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
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
      const { data } = await this.request('/api/auth/check');
      
      if (data.success && data.data.isAuthenticated) {
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
      const { data } = await this.request('/api/auth/me');
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get user data' };
    }
  }
  
  // ==================== USER ====================
  
  // Update profile
  static async updateProfile(profileData) {
    try {
      const { data } = await this.request('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  }
  
  // Change password
  static async changePassword(currentPassword, newPassword, confirmNewPassword) {
    try {
      const { data } = await this.request('/api/users/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword })
      });
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to change password' };
    }
  }
  
  // Get user stats
  static async getUserStats() {
    try {
      const { data } = await this.request('/api/users/stats');
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get stats' };
    }
  }
  
  // ==================== TESTS ====================
  
  // Save test attempt
  static async saveTestAttempt(attemptData) {
    try {
      const { data } = await this.request('/api/tests/attempt', {
        method: 'POST',
        body: JSON.stringify(attemptData)
      });
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to save test attempt' };
    }
  }
  
  // Get test history
  static async getTestHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await this.request(`/api/tests/history?${params}`);
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get history' };
    }
  }
  
  // Get single attempt
  static async getTestAttempt(attemptId) {
    try {
      const { data } = await this.request(`/api/tests/attempt/${attemptId}`);
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get attempt' };
    }
  }
  
  // Get leaderboard
  static async getLeaderboard(testId, limit = 10) {
    try {
      const { data } = await this.request(`/api/tests/leaderboard/${testId}?limit=${limit}`);
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to get leaderboard' };
    }
  }
  
  // ==================== HELPERS ====================
  
  // Check if logged in (from localStorage)
  static isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  
  // Get current user (from localStorage)
  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  // Get token
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

// Handle logout
async function handleLogout() {
  await ExamAxisAPI.logout();
  window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateNavigation();
});

// Export for use in other files
window.ExamAxisAPI = ExamAxisAPI;