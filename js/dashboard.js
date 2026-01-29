// js/dashboard.js - Dashboard Logic

// ==================== Global Variables ====================
let performanceChart = null;
let weeklyChart = null;
let userData = null;
let statsData = null;
let historyData = [];

// ==================== Theme Toggle ====================
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateChartsTheme();
}

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').textContent = '☀️';
}

// ==================== Dropdown Toggle ====================
function toggleDropdown() {
    document.getElementById('userDropdown').classList.toggle('open');
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

// ==================== Toast Notification ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.querySelector('i').className = `fas ${icons[type] || icons.success}`;
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== Handle Logout ====================
async function handleLogout() {
    if (typeof ExamAxisAPI !== 'undefined') {
        await ExamAxisAPI.logout();
    }
    showToast('Logged out successfully!', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// ==================== Initialize Dashboard ====================
async function loadDashboard() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        // Check login status
        if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        // Get cached user data first
        userData = ExamAxisAPI.getCurrentUser();
        if (userData) updateUserUI(userData);

        // Fetch fresh data
        const result = await ExamAxisAPI.getMe();
        if (result.success && result.data?.user) {
            userData = result.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            updateUserUI(userData);
        } else if (!userData) {
            window.location.href = 'login.html';
            return;
        }

        // Load dashboard data
        await Promise.all([
            loadUserStats(),
            loadRecentActivity()
        ]);

        // Initialize charts
        initCharts();
        loadLeaderboard();
        updateSubjectPerformance();

        // Welcome message
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('welcome') === 'true') {
            showToast(`Welcome back, ${userData.fullName || userData.username}! 🎉`, 'success');
            window.history.replaceState({}, document.title, window.location.pathname);
        }

    } catch (error) {
        console.error('Dashboard error:', error);
        showToast('Failed to load some dashboard data', 'warning');
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

// ==================== Update User UI ====================
function updateUserUI(user) {
    const initials = (user.fullName || user.username || 'U').substring(0, 2).toUpperCase();
    
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('avatarLarge').textContent = initials;
    document.getElementById('userName').textContent = user.fullName || user.username;
    document.getElementById('userRole').textContent = 'Student';
    document.getElementById('dropdownName').textContent = user.fullName || user.username;
    document.getElementById('dropdownEmail').textContent = user.email;
    document.getElementById('welcomeName').textContent = (user.fullName || user.username).split(' ')[0];
    
    const examLabels = { 'CGL': 'SSC CGL', 'CHSL': 'SSC CHSL', 'DP': 'DP Constable' };
    document.getElementById('examType').textContent = examLabels[user.preferredExam] || 'SSC CGL';
}

// ==================== Load User Stats ====================
async function loadUserStats() {
    try {
        const result = await ExamAxisAPI.getUserStats();
        
        if (result.success && result.data) {
            statsData = result.data.stats || result.data;
        } else {
            statsData = { totalTests: 0, averageScore: 0, totalTimeSpent: 0, streak: 0, totalCorrect: 0, totalIncorrect: 0, totalSkipped: 0 };
        }
        updateStatsUI(statsData);
    } catch (error) {
        console.error('Stats error:', error);
        statsData = { totalTests: 0, averageScore: 0, totalTimeSpent: 0, streak: 0, totalCorrect: 0, totalIncorrect: 0, totalSkipped: 0 };
        updateStatsUI(statsData);
    }
}

function updateStatsUI(stats) {
    document.getElementById('statTests').textContent = stats.totalTests || 0;
    document.getElementById('statScore').textContent = (stats.averageScore || 0).toFixed(0) + '%';
    document.getElementById('statStreak').textContent = stats.streak || 0;
    document.getElementById('statTime').textContent = formatTime(stats.totalTimeSpent || 0);
    
    document.getElementById('totalTests').textContent = stats.totalTests || 0;
    document.getElementById('avgAccuracy').textContent = (stats.averageScore || 0).toFixed(0) + '%';
    document.getElementById('studyHours').textContent = formatTime(stats.totalTimeSpent || 0);
    
    const accuracy = stats.averageScore || 0;
    updateAccuracyRing(accuracy);
    document.getElementById('accuracyValue').textContent = accuracy.toFixed(0) + '%';
    
    document.getElementById('correctCount').textContent = (stats.totalCorrect || 0) + ' Correct';
    document.getElementById('incorrectCount').textContent = (stats.totalIncorrect || 0) + ' Incorrect';
    document.getElementById('skippedCount').textContent = (stats.totalSkipped || 0) + ' Skipped';
}

function updateAccuracyRing(percentage) {
    const ring = document.getElementById('accuracyRing');
    if (!ring) return;
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (percentage / 100) * circumference;
    setTimeout(() => ring.style.strokeDashoffset = offset, 100);
}

function formatTime(minutes) {
    if (!minutes) return '0h';
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours + 'h' + (mins > 0 ? ' ' + mins + 'm' : '');
}

// ==================== Load Recent Activity ====================
async function loadRecentActivity() {
    try {
        const result = await ExamAxisAPI.getTestHistory({ limit: 5 });
        const activityList = document.getElementById('activityList');
        const activityEmpty = document.getElementById('activityEmpty');
        
        if (result.success && result.data?.attempts?.length > 0) {
            historyData = result.data.attempts;
            activityList.innerHTML = '';
            activityEmpty.style.display = 'none';
            
            historyData.forEach(attempt => {
                const scoreClass = attempt.accuracy >= 70 ? 'good' : (attempt.accuracy >= 40 ? 'average' : 'poor');
                const iconClass = attempt.accuracy >= 70 ? 'success' : (attempt.accuracy >= 40 ? 'warning' : 'error');
                const icon = attempt.accuracy >= 70 ? 'fa-check-circle' : (attempt.accuracy >= 40 ? 'fa-minus-circle' : 'fa-times-circle');
                const timeAgo = getTimeAgo(new Date(attempt.createdAt));
                
                activityList.innerHTML += `
                    <div class="activity-item" onclick="showToast('Detailed review coming soon!', 'info')">
                        <div class="activity-icon ${iconClass}">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div class="activity-details">
                            <div class="activity-title">${attempt.testTitle || attempt.testId}</div>
                            <div class="activity-meta">
                                <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                                <span><i class="fas fa-stopwatch"></i> ${attempt.timeTakenMinutes || 0}m</span>
                                <span><i class="fas fa-check"></i> ${attempt.correct || 0}/${attempt.totalQuestions || 0}</span>
                            </div>
                        </div>
                        <div class="activity-score ${scoreClass}">${(attempt.accuracy || 0).toFixed(0)}%</div>
                    </div>
                `;
            });
        } else {
            activityList.innerHTML = '';
            activityEmpty.style.display = 'block';
        }
    } catch (error) {
        console.error('Activity error:', error);
        document.getElementById('activityList').innerHTML = '';
        document.getElementById('activityEmpty').style.display = 'block';
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    return date.toLocaleDateString();
}

// ==================== Load Leaderboard ====================
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    const demoData = [
        { rank: 1, name: 'Rahul S.', score: 98, initials: 'RS' },
        { rank: 2, name: 'Priya M.', score: 95, initials: 'PM' },
        { rank: 3, name: 'Amit K.', score: 92, initials: 'AK' },
        { rank: 4, name: 'Sneha T.', score: 89, initials: 'ST' },
        { rank: 5, name: 'You', score: Math.round(statsData?.averageScore || 0), initials: userData?.fullName?.substring(0,2).toUpperCase() || 'YO', isCurrentUser: true },
    ];
    
    leaderboardList.innerHTML = demoData.map(item => {
        const rankClass = item.rank === 1 ? 'gold' : (item.rank === 2 ? 'silver' : (item.rank === 3 ? 'bronze' : 'other'));
        return `
            <div class="leaderboard-item ${item.isCurrentUser ? 'current-user' : ''}">
                <div class="rank ${rankClass}">${item.rank}</div>
                <div class="leaderboard-user">
                    <div class="leaderboard-avatar">${item.initials}</div>
                    <span class="leaderboard-name">${item.name}</span>
                </div>
                <span class="leaderboard-score">${item.score}%</span>
            </div>
        `;
    }).join('');
}

// ==================== Update Subject Performance ====================
function updateSubjectPerformance() {
    const subjectList = document.getElementById('subjectList');
    
    const subjects = [
        { name: 'Mathematics', icon: '📐', score: 75, color: 'var(--gradient-primary)' },
        { name: 'English', icon: '📚', score: 82, color: 'var(--gradient-success)' },
        { name: 'Reasoning', icon: '🧠', score: 68, color: 'var(--gradient-warning)' },
        { name: 'General Awareness', icon: '🌍', score: 55, color: 'var(--gradient-info)' }
    ];
    
    subjectList.innerHTML = subjects.map(sub => `
        <div class="subject-item">
            <div class="subject-icon" style="background: ${sub.color.replace('gradient', 'color').replace('linear-', '')}20;">${sub.icon}</div>
            <div class="subject-info">
                <div class="subject-header">
                    <span class="subject-name">${sub.name}</span>
                    <span class="subject-score">${sub.score}%</span>
                </div>
                <div class="subject-progress">
                    <div class="subject-progress-bar" style="width: ${sub.score}%; background: ${sub.color};"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== Initialize Charts ====================
function initCharts() {
    initPerformanceChart();
    initWeeklyChart();
}

function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const isDark = document.body.classList.contains('dark-mode');
    
    // Generate demo data based on history or defaults
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = historyData.length > 0 
        ? labels.map(() => Math.floor(Math.random() * 30) + 60)
        : [65, 72, 68, 80, 75, 85, 78];
    
    if (performanceChart) performanceChart.destroy();
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score %',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
            }
        }
    });
}

function initWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    const isDark = document.body.classList.contains('dark-mode');
    
    if (weeklyChart) weeklyChart.destroy();
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Correct',
                    data: [12, 15, 10, 18, 14, 20, 16],
                    backgroundColor: '#10b981',
                    borderRadius: 6
                },
                {
                    label: 'Incorrect',
                    data: [3, 5, 4, 2, 6, 3, 4],
                    backgroundColor: '#ef4444',
                    borderRadius: 6
                },
                {
                    label: 'Skipped',
                    data: [5, 5, 6, 5, 5, 2, 5],
                    backgroundColor: '#f59e0b',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: isDark ? '#94a3b8' : '#64748b', usePointStyle: true }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true,
                    grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                },
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: { color: isDark ? '#94a3b8' : '#64748b' }
                }
            }
        }
    });
}

function updateChartsTheme() {
    initPerformanceChart();
    initWeeklyChart();
}

function updateChartPeriod(period, btn) {
    // Update active button
    document.querySelectorAll('.card-actions .card-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    // Update chart data based on period
    let labels, data;
    
    switch(period) {
        case 'week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [65, 72, 68, 80, 75, 85, 78];
            break;
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [68, 74, 79, 82];
            break;
        case 'all':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            data = [55, 62, 68, 72, 78, 82];
            break;
        default:
            return;
    }
    
    if (performanceChart) {
        performanceChart.data.labels = labels;
        performanceChart.data.datasets[0].data = data;
        performanceChart.update();
    }
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', loadDashboard);