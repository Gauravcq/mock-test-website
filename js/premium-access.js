// js/premium-access.js - Premium Access Control System
// Controls which tests are free vs premium

(function() {
    'use strict';

    // ==================== FREE ACCESS CONFIGURATION ====================
    // Define which tests are free for non-premium users
    
    const FREE_ACCESS_CONFIG = {
        // For each exam type, define free tests
        CGL: {
            // First test of each subject (sectional)
            freeFirstSectional: ['Maths', 'Reasoning', 'English', 'GK'],
            // Number of free full mock tests
            freeFullMocks: 1
        },
        CHSL: {
            freeFirstSectional: ['Maths', 'Reasoning', 'English', 'GK'],
            freeFullMocks: 1
        },
        DP: {
            freeFirstSectional: ['Maths', 'Reasoning', 'GK'], // DP doesn't have English
            freeFullMocks: 1
        },
        CHSL_TOP_100_MATHS: {
            freeFirstSectional: ['Maths Top 50'],
            freeFullMocks: 0
        }
    };

    // Track test indices per category to determine which is "first"
    let testIndexCache = {};

    // ==================== PREMIUM STATUS CHECK ====================
    
    let isPremiumUser = null; // Cache premium status
    let premiumCheckPromise = null;

    async function checkPremiumStatus() {
        // Return cached value if available
        if (isPremiumUser !== null) {
            return isPremiumUser;
        }

        // Return existing promise if check is in progress
        if (premiumCheckPromise) {
            return premiumCheckPromise;
        }

        premiumCheckPromise = (async () => {
            // Check if user is logged in
            if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
                isPremiumUser = false;
                return false;
            }

            try {
                const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:5000/api'
                    : 'https://exam-axis-backend.vercel.app/api';

                const response = await fetch(`${API_URL}/payment/premium-status`, {
                    headers: {
                        'Authorization': `Bearer ${ExamAxisAPI.getToken()}`
                    }
                });

                const data = await response.json();
                isPremiumUser = data.success && data.data && data.data.isPremium;
                return isPremiumUser;
            } catch (error) {
                console.log('Could not check premium status:', error);
                isPremiumUser = false;
                return false;
            }
        })();

        return premiumCheckPromise;
    }

    // Reset cache (useful when user logs in/out)
    function resetPremiumCache() {
        isPremiumUser = null;
        premiumCheckPromise = null;
        testIndexCache = {};
    }

    // ==================== FREE TEST DETERMINATION ====================

    /**
     * Build an index of tests to track which is "first" in each category
     * @param {Array} allTests - All tests from ALL_TESTS
     */
    function buildTestIndex(allTests) {
        testIndexCache = {};

        allTests.forEach(test => {
            const exam = test.exam;
            const subject = test.subject;
            const section = test.section || 'sectional';

            // Create unique key for this category
            const key = `${exam}_${subject}_${section}`;

            if (!testIndexCache[key]) {
                testIndexCache[key] = [];
            }

            testIndexCache[key].push(test.id);
        });
    }

    /**
     * Check if a specific test is free for non-premium users
     * @param {Object} test - Test object
     * @param {Array} allTests - All tests (for context)
     * @returns {boolean} - True if test is free
     */
    function isTestFree(test, allTests) {
        // Build index if not already done
        if (Object.keys(testIndexCache).length === 0 && allTests) {
            buildTestIndex(allTests);
        }

        const exam = test.exam;
        const subject = test.subject;
        const section = test.section || 'sectional';
        const config = FREE_ACCESS_CONFIG[exam];

        if (!config) {
            // Unknown exam type - default to premium
            return false;
        }

        // For full mock tests
        if (section === 'fullmock' || subject === 'All') {
            const key = `${exam}_All_fullmock`;
            const testsInCategory = testIndexCache[key] || [];
            const testIndex = testsInCategory.indexOf(test.id);
            
            // Allow only first N full mocks
            return testIndex >= 0 && testIndex < config.freeFullMocks;
        }

        // For sectional tests
        if (section === 'sectional') {
            // Check if this subject has free first test
            if (!config.freeFirstSectional.includes(subject)) {
                return false;
            }

            const key = `${exam}_${subject}_sectional`;
            const testsInCategory = testIndexCache[key] || [];
            const testIndex = testsInCategory.indexOf(test.id);

            // Only first test is free
            return testIndex === 0;
        }

        // Chapterwise tests are premium
        if (section === 'chapterwise') {
            return false;
        }

        return false;
    }

    /**
     * Get test access status
     * @param {Object} test - Test object
     * @param {Array} allTests - All tests
     * @returns {Object} - { isFree: boolean, isPremium: boolean, canAccess: boolean }
     */
    async function getTestAccessStatus(test, allTests) {
        const isFree = isTestFree(test, allTests);
        const userIsPremium = await checkPremiumStatus();

        return {
            isFree: isFree,
            isPremiumTest: !isFree,
            userIsPremium: userIsPremium,
            canAccess: isFree || userIsPremium
        };
    }

    /**
     * Synchronous version for rendering (uses cached premium status)
     */
    function getTestAccessStatusSync(test, allTests) {
        const isFree = isTestFree(test, allTests);
        const userIsPremium = isPremiumUser === true;

        return {
            isFree: isFree,
            isPremiumTest: !isFree,
            userIsPremium: userIsPremium,
            canAccess: isFree || userIsPremium
        };
    }

    // ==================== UI HELPERS ====================

    /**
     * Show premium upgrade modal
     */
    function showPremiumModal() {
        // Check if modal already exists
        let modal = document.getElementById('premium-modal');
        
        if (!modal) {
            // Create modal
            modal = document.createElement('div');
            modal.id = 'premium-modal';
            modal.className = 'premium-modal-overlay';
            modal.innerHTML = `
                <div class="premium-modal">
                    <div class="premium-modal-header">
                        <span class="premium-crown">👑</span>
                        <h2>Unlock Premium Test</h2>
                    </div>
                    <div class="premium-modal-body">
                        <p>This test is available for <strong>Premium Members</strong> only.</p>
                        <div class="premium-benefits">
                            <div class="benefit-item">✓ All Mock Tests</div>
                            <div class="benefit-item">✓ All Subjects</div>
                            <div class="benefit-item">✓ Full Mock Tests</div>
                            <div class="benefit-item">✓ Detailed Solutions</div>
                            <div class="benefit-item">✓ Performance Analytics</div>
                        </div>
                        <div class="premium-price">
                            <div class="price-tag">
                                <span class="old-price">₹299</span>
                                <span class="new-price">₹99</span>
                                <span class="lifetime-badge">LIFETIME</span>
                            </div>
                            <p class="price-description">One-time payment, lifetime access</p>
                        </div>
                    </div>
                    <div class="premium-modal-footer">
                        <button class="btn-upgrade" onclick="window.location.href='payment.html'">
                            🚀 Upgrade for ₹99
                        </button>
                        <button class="btn-close" onclick="PremiumAccess.closeModal()">
                            Maybe Later
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close premium modal
     */
    function closeModal() {
        const modal = document.getElementById('premium-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle click on premium test
     * @param {Event} e - Click event
     * @param {string} testId - Test ID
     */
    function handlePremiumTestClick(e, testId) {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if user is logged in
        if (typeof ExamAxisAPI === 'undefined' || !ExamAxisAPI.isLoggedIn()) {
            // Redirect to login
            if (confirm('Please login to access tests. Would you like to login now?')) {
                window.location.href = 'login.html';
            }
            return;
        }

        showPremiumModal();
    }

    // ==================== EXPORT ====================
    
    window.PremiumAccess = {
        checkPremiumStatus,
        resetPremiumCache,
        isTestFree,
        getTestAccessStatus,
        getTestAccessStatusSync,
        buildTestIndex,
        showPremiumModal,
        closeModal,
        handlePremiumTestClick,
        
        // Expose config for debugging
        get config() {
            return FREE_ACCESS_CONFIG;
        },
        
        // Expose cached status for debugging
        get isPremium() {
            return isPremiumUser;
        }
    };

})();
