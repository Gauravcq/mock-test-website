// js/dashboard.js

// ========== CONFIGURATION ==========
const DASHBOARD_API = (function() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    return 'https://exam-axis-backend.vercel.app/api';
})();

// ========== STATE ==========
let currentUser = null;
let dashboardData = null;
let performanceChart = null;
let weeklyChart = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    showLoading(true);
    
    // Apply saved theme
    applyTheme();
    
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Load user data
        await loadUserData();
        
        // Load dashboard data
        await loadDashboardData();
        
        // Initialize UI components
        initializeUI();
        
        // Setup event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showToast('Failed to load dashboard. Please refresh.', 'error');
    } finally {
        showLoading(false);
    }
});

// Auto-refresh dashboard data periodically for near real-time progress
setInterval(async () => {
    try {
        if (!isAuthenticated()) return;
        await loadDashboardData();
    } catch (e) {
        // ignore transient errors
    }
}, 30000);
// ========== AUTHENTICATION ==========
function isAuthenticated() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
}

function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// ========== DATA LOADING ==========
async function loadUserData() {
    try {
        const response = await fetch(`${DASHBOARD_API}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                handleLogout();
                return;
            }
            throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        currentUser = data.data.user;
        
        updateUserUI();
        
    } catch (error) {
        console.error('Load user error:', error);
        throw error;
    }
}

async function loadDashboardData() {
    try {
        // Fetch test attempts/statistics
        const [attemptsRes, statsRes] = await Promise.all([
            fetch(`${DASHBOARD_API}/users/test-attempts`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${DASHBOARD_API}/users/stats`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }).catch(() => null) // Stats endpoint might not exist
        ]);
        
        let attempts = [];
        let stats = null;
        
        if (attemptsRes.ok) {
            const attemptsData = await attemptsRes.json();
            attempts = attemptsData.data || attemptsData.attempts || [];
        }
        
        if (statsRes && statsRes.ok) {
            const statsData = await statsRes.json();
            stats = statsData.data || statsData;
        }
        
        // Calculate dashboard data from attempts
        dashboardData = calculateDashboardData(attempts, stats);
        
        // Update all UI components with real data
        updateDashboardUI();
        
    } catch (error) {
        console.error('Load dashboard data error:', error);
        // Use default/empty data if fetch fails
        dashboardData = getDefaultDashboardData();
        updateDashboardUI();
    }
}

function calculateDashboardData(attempts, stats) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter recent attempts
    const recentAttempts = attempts.filter(a => new Date(a.createdAt) >= weekAgo);
    
    // Calculate totals
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalSkipped = 0;
    let totalTime = 0;
    let totalScore = 0;
    
    attempts.forEach(attempt => {
        totalCorrect += attempt.correctAnswers || 0;
        totalIncorrect += attempt.wrongAnswers || 0;
        totalSkipped += attempt.unanswered || 0;
        totalTime += attempt.timeTaken || 0;
        totalScore += attempt.score || 0;
    });
    
    const totalQuestions = totalCorrect + totalIncorrect + totalSkipped;
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const avgScore = attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0;
    
    // Calculate streak
    const streak = calculateStreak(attempts);
    
    // Group by subject
    const subjectPerformance = calculateSubjectPerformance(attempts);
    
    // Daily performance for chart
    const dailyPerformance = calculateDailyPerformance(attempts);
    
    return {
        totalTests: attempts.length,
        recentTests: recentAttempts.length,
        accuracy,
        avgScore,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        totalTime: Math.round(totalTime / 60), // Convert to hours
        streak,
        subjectPerformance,
        dailyPerformance,
        recentAttempts: attempts.slice(0, 5), // Last 5 attempts
        stats
    };
}

function calculateStreak(attempts) {
    if (attempts.length === 0) return 0;
    
    const sortedAttempts = [...attempts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const attempt of sortedAttempts) {
        const attemptDate = new Date(attempt.createdAt);
        attemptDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((currentDate - attemptDate) / (24 * 60 * 60 * 1000));
        
        if (diffDays <= 1) {
            streak++;
            currentDate = attemptDate;
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateSubjectPerformance(attempts) {
    const subjects = {};
    
    attempts.forEach(attempt => {
        const subject = attempt.subject || 'General';
        
        if (!subjects[subject]) {
            subjects[subject] = {
                name: subject,
                correct: 0,
                total: 0,
                attempts: 0
            };
        }
        
        subjects[subject].correct += attempt.correctAnswers || 0;
        subjects[subject].total += (attempt.correctAnswers || 0) + (attempt.wrongAnswers || 0) + (attempt.unanswered || 0);
        subjects[subject].attempts++;
    });
    
    return Object.values(subjects).map(s => ({
        ...s,
        accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
    }));
}

function calculateDailyPerformance(attempts) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        dailyData[dayName] = { tests: 0, score: 0, accuracy: 0 };
    }
    
    // Fill with actual data
    attempts.forEach(attempt => {
        const date = new Date(attempt.createdAt);
        const dayName = days[date.getDay()];
        
        if (dailyData[dayName]) {
            dailyData[dayName].tests++;
            dailyData[dayName].score += attempt.score || 0;
            
            const correct = attempt.correctAnswers || 0;
            const total = correct + (attempt.wrongAnswers || 0);
            if (total > 0) {
                dailyData[dayName].accuracy = Math.round((correct / total) * 100);
            }
        }
    });
    
    return Object.entries(dailyData).map(([day, data]) => ({
        day,
        ...data
    }));
}

function getDefaultDashboardData() {
    return {
        totalTests: 0,
        recentTests: 0,
        accuracy: 0,
        avgScore: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        totalSkipped: 0,
        totalTime: 0,
        streak: 0,
        subjectPerformance: [],
        dailyPerformance: [
            { day: 'Mon', tests: 0, score: 0, accuracy: 0 },
            { day: 'Tue', tests: 0, score: 0, accuracy: 0 },
            { day: 'Wed', tests: 0, score: 0, accuracy: 0 },
            { day: 'Thu', tests: 0, score: 0, accuracy: 0 },
            { day: 'Fri', tests: 0, score: 0, accuracy: 0 },
            { day: 'Sat', tests: 0, score: 0, accuracy: 0 },
            { day: 'Sun', tests: 0, score: 0, accuracy: 0 }
        ],
        recentAttempts: []
    };
}

// ========== UI UPDATES ==========
function updateUserUI() {
    if (!currentUser) return;
    
    const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : currentUser.username;
    const initials = getInitials(currentUser.fullName || currentUser.username);
    
    // Update header
    document.getElementById('userName').textContent = firstName;
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('avatarLarge').textContent = initials;
    document.getElementById('dropdownName').textContent = currentUser.fullName || currentUser.username;
    document.getElementById('dropdownEmail').textContent = currentUser.email;
    
    // Update welcome section
    document.getElementById('welcomeName').textContent = firstName;
    document.getElementById('examType').textContent = getExamName(currentUser.preferredExam);
}

function updateDashboardUI() {
    if (!dashboardData) return;
    
    // Update stats
    document.getElementById('totalTests').textContent = dashboardData.totalTests;
    document.getElementById('avgAccuracy').textContent = dashboardData.accuracy + '%';
    document.getElementById('studyHours').textContent = dashboardData.totalTime + 'h';
    
    document.getElementById('statTests').textContent = dashboardData.totalTests;
    document.getElementById('statScore').textContent = dashboardData.avgScore + '%';
    document.getElementById('statStreak').textContent = dashboardData.streak;
    document.getElementById('statTime').textContent = dashboardData.totalTime + 'h';
    
    // Update accuracy ring
    updateAccuracyRing(dashboardData.accuracy);
    document.getElementById('accuracyValue').textContent = dashboardData.accuracy + '%';
    document.getElementById('correctCount').textContent = dashboardData.totalCorrect + ' Correct';
    document.getElementById('incorrectCount').textContent = dashboardData.totalIncorrect + ' Incorrect';
    document.getElementById('skippedCount').textContent = dashboardData.totalSkipped + ' Skipped';
    
    // Update subject performance
    updateSubjectList(dashboardData.subjectPerformance);
    
    // Update charts
    updatePerformanceChart(dashboardData.dailyPerformance);
    updateWeeklyChart(dashboardData.dailyPerformance);
    
    // Update recent activity
    updateRecentActivity(dashboardData.recentAttempts);
    
    // Update goals
    updateGoals();
    
    // Update continue learning
    updateContinueLearning();
    
    // Update upcoming tests
    updateUpcomingTests();
    
    // Update achievements
    updateAchievements();
    
    // Update leaderboard
    updateLeaderboard();
}

function updateAccuracyRing(accuracy) {
    const ring = document.getElementById('accuracyRing');
    const circumference = 534; // 2 * PI * 85
    const offset = circumference - (accuracy / 100) * circumference;
    
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 300);
}

function updateSubjectList(subjects) {
    const container = document.getElementById('subjectList');
    
    if (subjects.length === 0) {
        container.innerHTML = `
            <div class="empty-subject">
                <p>No subject data yet. Start taking tests!</p>
            </div>
        `;
        return;
    }
    
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    container.innerHTML = subjects.slice(0, 5).map((subject, index) => `
        <div class="subject-item">
            <div class="subject-info">
                <span class="subject-name">${subject.name}</span>
                <span class="subject-score">${subject.accuracy}%</span>
            </div>
            <div class="subject-bar">
                <div class="subject-progress" style="width: ${subject.accuracy}%; background: ${colors[index % colors.length]};"></div>
            </div>
        </div>
    `).join('');
}

function updatePerformanceChart(dailyData) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    const labels = dailyData.map(d => d.day);
    const scores = dailyData.map(d => d.score);
    const accuracy = dailyData.map(d => d.accuracy);
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Score',
                    data: scores,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Accuracy %',
                    data: accuracy,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateWeeklyChart(dailyData) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const labels = dailyData.map(d => d.day);
    const tests = dailyData.map(d => d.tests);
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Tests Taken',
                data: tests,
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateRecentActivity(attempts) {
    const container = document.getElementById('activityList');
    const emptyState = document.getElementById('activityEmpty');
    
    if (attempts.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = attempts.map(attempt => {
        const date = new Date(attempt.createdAt);
        const timeAgo = getTimeAgo(date);
        const scorePercent = attempt.totalMarks > 0 
            ? Math.round((attempt.score / attempt.totalMarks) * 100) 
            : 0;
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${scorePercent >= 70 ? 'success' : scorePercent >= 40 ? 'warning' : 'danger'}">
                    ${scorePercent >= 70 ? '🏆' : scorePercent >= 40 ? '📝' : '📚'}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${attempt.testName || attempt.subject || 'Practice Test'}</div>
                    <div class="activity-meta">
                        Score: ${attempt.score}/${attempt.totalMarks} (${scorePercent}%) • ${timeAgo}
                    </div>
                </div>
                <div class="activity-score ${scorePercent >= 70 ? 'high' : scorePercent >= 40 ? 'medium' : 'low'}">
                    ${scorePercent}%
                </div>
            </div>
        `;
    }).join('');
}

function updateGoals() {
    const container = document.getElementById('goalsGrid');
    const progressText = document.getElementById('goalsProgressText');
    
    const goals = [
        { 
            id: 'daily-test', 
            title: 'Complete 1 Test', 
            description: 'Take at least one practice test',
            completed: dashboardData.recentAttempts.some(a => isToday(new Date(a.createdAt)))
        },
        { 
            id: 'accuracy-70', 
            title: '70% Accuracy', 
            description: 'Score 70%+ on a test',
            completed: dashboardData.accuracy >= 70
        },
        { 
            id: 'study-30', 
            title: '30 Min Study', 
            description: 'Spend 30 minutes studying',
            completed: dashboardData.totalTime >= 0.5
        },
        { 
            id: 'streak', 
            title: 'Keep Streak', 
            description: 'Maintain your daily streak',
            completed: dashboardData.streak > 0
        }
    ];
    
    const completedCount = goals.filter(g => g.completed).length;
    progressText.textContent = `${completedCount}/${goals.length} completed`;
    
    container.innerHTML = goals.map(goal => `
        <div class="goal-item ${goal.completed ? 'completed' : ''}" onclick="toggleGoal('${goal.id}')">
            <div class="goal-checkbox">
                ${goal.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="goal-text">
                <h4>${goal.title}</h4>
                <p>${goal.description}</p>
            </div>
        </div>
    `).join('');
}

function updateContinueLearning() {
    const container = document.getElementById('continueGrid');
    
    const subjects = [
        { 
            name: 'Mathematics', 
            icon: 'math', 
            progress: dashboardData.subjectPerformance.find(s => s.name.toLowerCase().includes('math'))?.accuracy || 0,
            questions: '500+ Questions',
            color: 'purple'
        },
        { 
            name: 'English', 
            icon: 'english', 
            progress: dashboardData.subjectPerformance.find(s => s.name.toLowerCase().includes('english'))?.accuracy || 0,
            questions: '400+ Questions',
            color: 'pink'
        },
        { 
            name: 'Reasoning', 
            icon: 'reasoning', 
            progress: dashboardData.subjectPerformance.find(s => s.name.toLowerCase().includes('reason'))?.accuracy || 0,
            questions: '450+ Questions',
            color: 'blue'
        },
        { 
            name: 'General Knowledge', 
            icon: 'gk', 
            progress: dashboardData.subjectPerformance.find(s => s.name.toLowerCase().includes('gk') || s.name.toLowerCase().includes('general'))?.accuracy || 0,
            questions: '600+ Questions',
            color: 'green'
        }
    ];
    
    container.innerHTML = subjects.map(subject => `
        <a href="index.html?subject=${encodeURIComponent(subject.name)}" class="continue-card">
            <div class="continue-icon ${subject.icon}">${getSubjectEmoji(subject.name)}</div>
            <div class="continue-content">
                <h4>${subject.name}</h4>
                <p>${subject.questions}</p>
                <div class="continue-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill ${subject.color}" style="width: ${subject.progress}%;"></div>
                    </div>
                    <span class="progress-text">${subject.progress}%</span>
                </div>
            </div>
        </a>
    `).join('');
}

function updateUpcomingTests() {
    const container = document.getElementById('upcomingList');
    
    // Generate some upcoming test dates
    const upcomingTests = [
        { 
            name: 'SSC CGL Full Mock Test', 
            date: getNextDate(2),
            time: '10:00 AM',
            duration: '60 min'
        },
        { 
            name: 'Mathematics Practice', 
            date: getNextDate(4),
            time: '2:00 PM',
            duration: '30 min'
        },
        { 
            name: 'English Comprehension', 
            date: getNextDate(6),
            time: '11:00 AM',
            duration: '45 min'
        }
    ];
    
    container.innerHTML = upcomingTests.map(test => {
        const date = new Date(test.date);
        return `
            <div class="upcoming-item">
                <div class="upcoming-info">
                    <div class="upcoming-date">
                        <div class="day">${date.getDate()}</div>
                        <div class="month">${date.toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div class="upcoming-details">
                        <h4>${test.name}</h4>
                        <p>${test.duration} • ${test.time}</p>
                    </div>
                </div>
                <div class="upcoming-time">
                    <i class="fas fa-clock"></i> ${test.time}
                </div>
            </div>
        `;
    }).join('');
}

function updateAchievements() {
    const container = document.getElementById('achievementsGrid');
    
    const achievements = [
        { icon: '🏆', name: 'First Test', unlocked: dashboardData.totalTests >= 1 },
        { icon: '🎯', name: '5 Tests Done', unlocked: dashboardData.totalTests >= 5 },
        { icon: '🔥', name: '7 Day Streak', unlocked: dashboardData.streak >= 7 },
        { icon: '💯', name: '100% Score', unlocked: dashboardData.avgScore === 100 },
        { icon: '📚', name: 'Study Master', unlocked: dashboardData.totalTime >= 10 },
        { icon: '⭐', name: 'Top Performer', unlocked: dashboardData.accuracy >= 90 }
    ];
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-item ${achievement.unlocked ? '' : 'locked'}" title="${achievement.name}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        </div>
    `).join('');
}

function updateLeaderboard() {
    const container = document.getElementById('leaderboardList');
    
    // Mock leaderboard data - replace with real API call
    const leaders = [
        { rank: 1, name: 'Rahul Kumar', score: 98, avatar: 'RK' },
        { rank: 2, name: 'Priya Singh', score: 95, avatar: 'PS' },
        { rank: 3, name: 'Amit Sharma', score: 92, avatar: 'AS' },
        { rank: 4, name: currentUser?.fullName || 'You', score: dashboardData.avgScore, avatar: getInitials(currentUser?.fullName || 'You'), isCurrentUser: true },
        { rank: 5, name: 'Neha Gupta', score: 88, avatar: 'NG' }
    ];
    
    container.innerHTML = leaders.map(leader => `
        <div class="leaderboard-item ${leader.isCurrentUser ? 'current-user' : ''}">
            <div class="rank ${leader.rank <= 3 ? 'top-' + leader.rank : ''}">${leader.rank}</div>
            <div class="leader-avatar">${leader.avatar}</div>
            <div class="leader-info">
                <div class="leader-name">${leader.name} ${leader.isCurrentUser ? '(You)' : ''}</div>
            </div>
            <div class="leader-score">${leader.score}%</div>
        </div>
    `).join('');
}

// ========== HELPER FUNCTIONS ==========
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

function getExamName(code) {
    const exams = {
        'CGL': 'SSC CGL',
        'CHSL': 'SSC CHSL',
        'MTS': 'SSC MTS',
        'CPO': 'SSC CPO',
        'DP': 'Delhi Police'
    };
    return exams[code] || code || 'SSC CGL';
}

function getSubjectEmoji(subject) {
    const emojis = {
        'Mathematics': '🔢',
        'English': '📖',
        'Reasoning': '🧩',
        'General Knowledge': '🌍'
    };
    return emojis[subject] || '📚';
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function getNextDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
}

// ========== UI INITIALIZATION ==========
function initializeUI() {
    // Setup test category badges
    document.querySelectorAll('.test-category-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            document.querySelectorAll('.test-category-badge').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showToast(`${this.dataset.exam} selected!`, 'success');
        });
    });
}

function setupEventListeners() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

// ========== THEME ==========
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Recreate charts with new theme
    if (dashboardData) {
        updatePerformanceChart(dashboardData.dailyPerformance);
        updateWeeklyChart(dashboardData.dailyPerformance);
    }
}

// ========== USER ACTIONS ==========
function toggleDropdown() {
    document.getElementById('userDropdown').classList.toggle('open');
}

function handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset premium cache after logout
    if (window.PremiumAccess && PremiumAccess.resetPremiumCache) {
        PremiumAccess.resetPremiumCache();
    }
    
    showToast('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function toggleGoal(goalId) {
    showToast('Goal tracking coming soon!', 'info');
}

// ========== CHART PERIOD ==========
function updateChartPeriod(period, button) {
    document.querySelectorAll('.card-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    showToast(`Showing ${period} data`, 'info');
    // Would fetch new data based on period
}

// ========== UTILITIES ==========
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastMessage.textContent = message;
    
    // Update icon based on type
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-circle'
    };
    
    toastIcon.className = `fas ${icons[type] || icons.success}`;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
