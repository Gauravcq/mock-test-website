// js/api.js

// Backend API base URL (no trailing slash)
const API_BASE_URL = "https://exam-axis-backend.vercel.app";

class ExamAxisAPI {
  // ==================== CORE REQUEST HELPER ====================
  static async request(endpoint, options = {}) {
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    const token = localStorage.getItem("token");
    if (token) {
      defaultOptions.headers["Authorization"] = `Bearer ${token}`;
    }

    let response;
    let data = null;

    try {
      response = await fetch(url, { ...defaultOptions, ...options });
    } catch (err) {
      console.error("Fetch error:", err);
      return { response: null, data: null, error: "NETWORK_ERROR" };
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
      const { response, data, error } = await this.request(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error. Please try again." };
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Registration failed (${response.status})`;
        return { success: false, message: msg };
      }

      if (data && data.success && data.token && data.data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        const u = data.data.user;
        const userId = u.id || u._id || u.userId;
        if (userId) localStorage.setItem("userId", String(userId));
        const userName = u.fullName || u.name || u.username || u.email;
        if (userName) localStorage.setItem("userName", String(userName));
      }

      return data || { success: false, message: "Unexpected server response." };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Unexpected error. Please try again." };
    }
  }

  static async login(identifier, password) {
    try {
      const { response, data, error } = await this.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error. Please try again." };
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Login failed (${response.status})`;
        return { success: false, message: msg };
      }

      if (data && data.success && data.token && data.data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        const u = data.data.user;
        const userId = u.id || u._id || u.userId;
        if (userId) localStorage.setItem("userId", String(userId));
        const userName = u.fullName || u.name || u.username || u.email;
        if (userName) localStorage.setItem("userName", String(userName));
      }

      return data || { success: false, message: "Unexpected server response." };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Unexpected error. Please try again." };
    }
  }

  static async logout() {
    try {
      await this.request("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    return { success: true };
  }

  static async checkAuth() {
    try {
      const { response, data } = await this.request("/api/auth/check");

      if (!response || !response.ok || !data || !data.success) {
        return { isAuthenticated: false, user: null };
      }

      if (data.data?.isAuthenticated && data.data.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));

        const u = data.data.user;
        const userId = u.id || u._id || u.userId;
        if (userId) localStorage.setItem("userId", String(userId));
        const userName = u.fullName || u.name || u.username || u.email;
        if (userName) localStorage.setItem("userName", String(userName));
        return { isAuthenticated: true, user: data.data.user };
      }

      return { isAuthenticated: false, user: null };
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  }

  static async getMe() {
    try {
      const { response, data } = await this.request("/api/auth/me");

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get user (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get user data" };
    }
  }

  // ==================== USER ====================

  static async updateProfile(profileData) {
    try {
      const { response, data } = await this.request("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to update profile (${response.status})`;
        return { success: false, message: msg };
      }

      if (data.success && data.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to update profile" };
    }
  }

  static async changePassword(
    currentPassword,
    newPassword,
    confirmNewPassword,
  ) {
    try {
      const { response, data } = await this.request("/api/users/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to change password (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to change password" };
    }
  }

  static async getUserStats() {
    try {
      const { response, data } = await this.request("/api/users/stats");

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get stats (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get stats" };
    }
  }

  // ==================== TESTS ====================

  // Debug flag to log all API calls
  static debugAPI = true;

  static async saveTestAttempt(attemptData) {
    try {
      console.log("📤 Saving test attempt:", {
        testId: attemptData.testId,
        questionsCount: attemptData.questions?.length || 0,
        answersCount: Object.keys(attemptData.answers || {}).length,
        score: attemptData.score,
      });

      // Log first 3 questions to verify data
      if (attemptData.questions) {
        console.log(
          "📋 Sample questions being sent:",
          attemptData.questions.slice(0, 3).map((q) => ({
            id: q.id,
            subject: q.subject,
            firstChars: q.question?.substring(0, 30),
          })),
        );
      }

      // ✅ Use 'questions' field (backend stores as questionsSnapshot)
      const payload = {
        testId: attemptData.testId,
        examType: attemptData.examType,
        subject: attemptData.subject,
        score: attemptData.score,
        totalMarks: attemptData.totalMarks,
        correctAnswers: attemptData.correctAnswers,
        wrongAnswers: attemptData.wrongAnswers,
        unanswered: attemptData.unanswered,
        timeTaken: attemptData.timeTaken,
        answers: attemptData.answers,
        questions: attemptData.questions, // ✅ Backend expects 'questions' field
      };

      const { response, data } = await this.request("/api/tests/attempt", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to save test attempt (${response.status})`;
        console.error(
          "❌ Failed to save attempt:",
          msg,
          "Status:",
          response.status,
        );
        return { success: false, message: msg, status: response.status };
      }

      console.log("✅ Attempt saved successfully. Response:", data);
      return data;
    } catch (error) {
      console.error("❌ Save attempt error:", error);
      return {
        success: false,
        message: "Failed to save test attempt",
        error: error.message,
      };
    }
  }

  static async getTestHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const { response, data } = await this.request(
        `/api/tests/history?${params}`,
      );

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get history (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get history" };
    }
  }

  static async getTestAttempt(attemptId) {
    try {
      const { response, data } = await this.request(
        `/api/tests/attempt/${attemptId}`,
      );

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get attempt (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get attempt" };
    }
  }

  static async getLeaderboard(testId, limit = 10) {
    try {
      const { response, data } = await this.request(
        `/api/tests/leaderboard/${testId}?limit=${limit}`,
      );

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get leaderboard (${response.status})`;
        return { success: false, message: msg };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get leaderboard" };
    }
  }

  // ==================== QUESTIONS ====================

  static async getQuestions(testId) {
    try {
      console.log("� GET QUESTIONS - Request for testId:", testId);
      const { response, data, error } = await this.request(
        `/api/questions/${testId}`,
      );

      if (error === "NETWORK_ERROR") {
        console.error("❌ Network error for testId:", testId);
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to load questions (${response.status})`;
        console.error(
          "❌ API error for testId:",
          testId,
          "-",
          response.status,
          msg,
        );
        return { success: false, message: msg };
      }

      // CRITICAL: Log the actual response to debug
      const questions = data?.data?.questions || data?.questions || [];
      console.log("✅ API Response for", testId, ":", {
        success: data?.success,
        questionsCount: questions.length,
        firstQuestion: questions[0] && questions[0].question ? questions[0].question.substring(0, 50) + '...' : 'No question text',
        firstQuestionId: questions[0]?.id,
        allQuestionIds: questions.slice(0, 5).map(q => q.id || 'no-id')
      });

      // Compare with previous test to check for duplicates
      const lastQuestions = localStorage.getItem("lastQuestionsDebug");
      if (lastQuestions) {
        const last = JSON.parse(lastQuestions);
        const isSame =
          last.testId !== testId &&
          questions.length > 0 &&
          last.questions.length > 0 &&
          questions[0].id === last.questions[0].id;
        if (isSame) {
          console.warn(
            "⚠️ WARNING: Same questions returned for different testIds!",
            {
              currentTestId: testId,
              previousTestId: last.testId,
              sameQuestionId: questions[0].id,
            },
          );
        }
      }

      // Store for next comparison
      localStorage.setItem('lastQuestionsDebug', JSON.stringify({
        testId: testId,
        questions: questions.slice(0, 3).map(q => ({
          id: q.id,
          question: q.question ? q.question.substring(0, 50) : 'No question'
        })),
        timestamp: Date.now()
      }));

      return data || { success: false, message: "No questions found" };
    } catch (error) {
      console.error("❌ Get questions error for testId:", testId, "-", error);
      return { success: false, message: "Failed to load questions" };
    }
  }

  static async submitTest(testId, answers) {
    try {
      const { response, data, error } = await this.request(
        `/api/questions/${testId}/submit`,
        {
          method: "POST",
          body: JSON.stringify({ answers }),
        },
      );

      if (error === "NETWORK_ERROR") {
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to submit test (${response.status})`;
        return { success: false, message: msg };
      }

      return data || { success: false, message: "Failed to get results" };
    } catch (error) {
      console.error("Submit test error:", error);
      return { success: false, message: "Failed to submit test" };
    }
  }

  static async checkTestExists(testId) {
    try {
      const { response, data } = await this.request(
        `/api/questions/check/${testId}`,
      );

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
      const { response, data } = await this.request("/api/questions/list");

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to get tests (${response.status})`;
        return { success: false, message: msg };
      }

      return data || { success: false, message: "No tests available" };
    } catch (error) {
      return { success: false, message: "Failed to get available tests" };
    }
  }

  // ==================== ADMIN FUNCTIONS ====================

  // Check if current user is admin (quick check from localStorage)
  static isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === "admin" || user?.role === "superadmin";
  }

  // Verify admin status from server (secure check)
  static async verifyAdmin() {
    try {
      const { response, data, error } = await this.request("/api/admin/verify");

      if (error === "NETWORK_ERROR") {
        return { isAdmin: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return { isAdmin: false, message: data?.message || "Not authorized" };
      }

      return {
        isAdmin: data?.data?.isAdmin || false,
        user: data?.data?.user,
      };
    } catch (error) {
      console.error("Admin verify error:", error);
      return { isAdmin: false, message: "Verification failed" };
    }
  }

  // Require admin access - redirects if not admin
  static async requireAdmin() {
    const token = this.getToken();

    if (!token) {
      window.location.href = "login.html";
      return false;
    }

    const result = await this.verifyAdmin();

    if (!result.isAdmin) {
      alert("⛔ Access Denied! Admins only.");
      window.location.href = "dashboard.html";
      return false;
    }

    return true;
  }

  // Get admin dashboard stats
  static async getAdminDashboard() {
    try {
      const { response, data, error } = await this.request(
        "/api/admin/dashboard",
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to load dashboard",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to load dashboard" };
    }
  }

  // Get all users (admin)
  static async getAdminUsers(opts = {}) {
    try {
      const params = new URLSearchParams();
      if (opts.page != null) params.set("page", String(opts.page));
      if (opts.limit != null) params.set("limit", String(opts.limit));
      if (opts.search) params.set("search", opts.search);
      if (typeof opts.isPremium === "boolean")
        params.set("isPremium", String(opts.isPremium));
      if (opts.couponCode) params.set("couponCode", opts.couponCode);
      const qs = params.toString();
      const path = qs ? `/api/admin/users?${qs}` : "/api/admin/users";
      const { response, data, error } = await this.request(path);

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to load users",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to load users" };
    }
  }

  static async getUsersByCoupon(code) {
    try {
      const c = encodeURIComponent(code || "");
      const { response, data, error } = await this.request(
        `/api/admin/users/by-coupon?code=${c}`,
      );
      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }
      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to load users",
        };
      }
      return data;
    } catch (error) {
      return { success: false, message: "Failed to load users" };
    }
  }

  static async getAdminCoupons() {
    try {
      const { response, data, error } =
        await this.request("/api/admin/coupons");
      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }
      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to load coupons",
        };
      }
      return data;
    } catch (error) {
      return { success: false, message: "Failed to load coupons" };
    }
  }

  static async createAdminCoupon(payload) {
    try {
      const { response, data, error } = await this.request(
        "/api/admin/coupons",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }
      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to create coupon",
        };
      }
      return data;
    } catch (error) {
      return { success: false, message: "Failed to create coupon" };
    }
  }

  // Toggle user active status
  static async toggleUserActive(userId) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/users/${userId}/toggle-active`,
        {
          method: "PUT",
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to update user",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to update user" };
    }
  }

  // Update user role (superadmin only)
  static async updateUserRole(userId, role) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          body: JSON.stringify({ role }),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to update role",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to update role" };
    }
  }

  // Delete user (superadmin only)
  static async deleteUser(userId) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/users/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to delete user",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to delete user" };
    }
  }

  // Get all tests (admin)
  static async getAdminTests() {
    try {
      const { response, data, error } = await this.request("/api/admin/tests");

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to load tests",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to load tests" };
    }
  }

  // Create new test
  static async createTest(testData) {
    try {
      const { response, data, error } = await this.request("/api/admin/tests", {
        method: "POST",
        body: JSON.stringify(testData),
      });

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to create test",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to create test" };
    }
  }

  // Update test
  static async updateTest(testId, testData) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}`,
        {
          method: "PUT",
          body: JSON.stringify(testData),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to update test",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to update test" };
    }
  }

  // Delete test
  static async deleteTest(testId) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}`,
        {
          method: "DELETE",
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to delete test",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to delete test" };
    }
  }

  // Add questions to test
  static async addQuestionsToTest(testId, questions) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/questions`,
        {
          method: "POST",
          body: JSON.stringify({ questions }),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to add questions",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to add questions" };
    }
  }

  // ==================== NEW ADMIN TEST FEATURES ====================

  // Duplicate a test
  static async duplicateTest(testId, newTestId, title) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/duplicate`,
        {
          method: "POST",
          body: JSON.stringify({ newTestId, title }),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to duplicate test",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to duplicate test" };
    }
  }

  // Bulk upload questions (JSON array)
  static async bulkUploadQuestions(testId, questions, replace = false) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/bulk-questions`,
        {
          method: "POST",
          body: JSON.stringify({ questions, replace }),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to upload questions",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to upload questions" };
    }
  }

  // Toggle test active/inactive
  static async toggleTestActive(testId) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/toggle-active`,
        {
          method: "PUT",
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to toggle test status",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to toggle test status" };
    }
  }

  // Get single test with full details
  static async getTestById(testId) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}`,
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to get test",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get test" };
    }
  }

  // Delete a question from test
  static async deleteQuestion(testId, questionIndex) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/questions/${questionIndex}`,
        {
          method: "DELETE",
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to delete question",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to delete question" };
    }
  }

  // Update a single question
  static async updateQuestion(testId, questionIndex, questionData) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/questions/${questionIndex}`,
        {
          method: "PUT",
          body: JSON.stringify(questionData),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to update question",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to update question" };
    }
  }

  // Get test statistics
  static async getTestStats(testId) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/stats`,
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to get test stats",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to get test stats" };
    }
  }

  // Add single question to test
  static async addSingleQuestion(testId, questionData) {
    try {
      const { response, data, error } = await this.request(
        `/api/admin/tests/${testId}/questions`,
        {
          method: "POST",
          body: JSON.stringify({ questions: [questionData] }),
        },
      );

      if (error === "NETWORK_ERROR") {
        return { success: false, message: "Network error" };
      }

      if (!response || !response.ok) {
        return {
          success: false,
          message: data?.message || "Failed to add question",
        };
      }

      return data;
    } catch (error) {
      return { success: false, message: "Failed to add question" };
    }
  }

  // ==================== HELPERS ====================

  static isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  static getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static getToken() {
    return localStorage.getItem("token");
  }
}

// ==================== NAVIGATION ====================

async function updateNavigation() {
  // Look for the correct navigation button IDs from your HTML
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const navButtons = prevBtn && nextBtn ? { prevBtn, nextBtn } : null;

  if (!navButtons) {
    // Try fallback selectors
    const fallbackNav =
      document.querySelector(".nav-buttons") ||
      document.getElementById("navButtons");
    if (!fallbackNav) {
      return; // Silently return if no navigation found
    }
  }

  // Update navigation states
  if (prevBtn && window.QUIZ_DATA) {
    prevBtn.disabled = window.QUIZ_DATA.currentQuestionIndex === 0;
  }

  if (nextBtn && window.QUIZ_DATA) {
    const questions = window.QUIZ_DATA.questions || [];
    nextBtn.textContent =
      window.QUIZ_DATA.currentQuestionIndex === questions.length - 1
        ? "Submit"
        : "Save & Next";
  }
}

function updateHeaderAuthUI() {
  const navButtons = document.getElementById("navButtons");
  if (!navButtons) return;

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const user = ExamAxisAPI.getCurrentUser() || {};

  const loginBtn = navButtons.querySelector(
    'a[href="login.html"], a.login-btn',
  );
  const signupBtn = navButtons.querySelector(
    'a[href="register.html"], a.signup-btn',
  );

  const existingUserBtn = navButtons.querySelector("#headerUserBtn");
  const existingLogoutBtn = navButtons.querySelector("#headerLogoutBtn");
  const existingAdminBtn = navButtons.querySelector("#headerAdminBtn");

  if (!isLoggedIn) {
    if (loginBtn) loginBtn.style.display = "";
    if (signupBtn) signupBtn.style.display = "";
    if (existingUserBtn) existingUserBtn.remove();
    if (existingLogoutBtn) existingLogoutBtn.remove();
    if (existingAdminBtn) existingAdminBtn.remove();
    return;
  }

  if (loginBtn) loginBtn.style.display = "none";
  if (signupBtn) signupBtn.style.display = "none";

  const fullName =
    user.fullName || user.name || user.username || user.email || "User";
  const firstName = String(fullName).split(" ")[0];
  const initials =
    String(fullName)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join("") || "U";

  if (!existingUserBtn) {
    const a = document.createElement("a");
    a.id = "headerUserBtn";
    a.href = "dashboard.html";
    a.className = "nav-btn login-btn";
    a.style.display = "inline-flex";
    a.style.alignItems = "center";
    a.style.gap = "10px";
    a.innerHTML = `
      <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:999px;background:#eef2ff;color:#4f46e5;font-weight:800;">
        ${initials}
      </span>
      <span>${firstName}</span>
    `;
    navButtons.appendChild(a);
  }

  if (!existingLogoutBtn) {
    const a = document.createElement("a");
    a.id = "headerLogoutBtn";
    a.href = "#";
    a.className = "nav-btn signup-btn";
    a.textContent = "Logout";
    a.onclick = async (e) => {
      e.preventDefault();
      await handleLogout();
    };
    navButtons.appendChild(a);
  }

  const isAdmin = ExamAxisAPI.isAdmin();
  if (isAdmin && !existingAdminBtn) {
    const a = document.createElement("a");
    a.id = "headerAdminBtn";
    a.href = "admin.html";
    a.className = "nav-btn login-btn";
    a.textContent = "Admin";
    navButtons.appendChild(a);
  }
  if (!isAdmin && existingAdminBtn) {
    existingAdminBtn.remove();
  }
}

async function handleLogout() {
  await ExamAxisAPI.logout();
  window.location.href = "index.html";
}

// Auto-update navigation on page load
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure DOM is fully loaded
  setTimeout(() => {
    updateNavigation();
    updateHeaderAuthUI();
  }, 100);
});

// Make functions globally available
window.ExamAxisAPI = ExamAxisAPI;
window.updateNavigation = updateNavigation;
window.handleLogout = handleLogout;
window.updateHeaderAuthUI = updateHeaderAuthUI;
