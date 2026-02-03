// Telegram Integration for Premium Users
class TelegramIntegration {
    static TELEGRAM_CHANNEL_URL = 'https://t.me/+wkVQs6V5sEkyODI9';
    static TELEGRAM_STORAGE_KEY = 'telegramJoined';
    
    // Check if user is premium - Enhanced detection
    static isUserPremium() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Log user data for debugging
        console.log('Checking premium status for user:', user);
        
        // Multiple ways to check premium status
        const isPremium = 
            user.plan === 'premium' || 
            user.isPremium === true || 
            user.subscription === 'premium' ||
            user.premium === true ||
            user.role === 'premium' ||
            user.userType === 'premium' ||
            user.membership === 'premium' ||
            user.access === 'premium' ||
            (user.plan && user.plan.toLowerCase().includes('premium')) ||
            (user.subscription && user.subscription.toLowerCase().includes('premium'));
        
        console.log('Premium check result:', { user, isPremium, checks: {
            plan: user.plan,
            isPremium: user.isPremium,
            subscription: user.subscription,
            premium: user.premium,
            role: user.role,
            userType: user.userType,
            membership: user.membership,
            access: user.access
        }});
        
        return isPremium;
    }
    
    // Check if user has already joined telegram
    static hasJoinedTelegram() {
        return localStorage.getItem(this.TELEGRAM_STORAGE_KEY) === 'true';
    }
    
    // Mark telegram as joined
    static markTelegramJoined() {
        localStorage.setItem(this.TELEGRAM_STORAGE_KEY, 'true');
    }
    
    // Create universal Telegram popup
    static createTelegramPopup() {
        // Check if popup already exists
        let popup = document.getElementById('telegram-popup');
        if (popup) return;
        
        // Create popup HTML
        popup = document.createElement('div');
        popup.id = 'telegram-popup';
        popup.className = 'telegram-popup-overlay';
        popup.innerHTML = `
            <div class="telegram-popup">
                <div class="telegram-popup-header">
                    <span class="telegram-icon-large">📱</span>
                    <h2>🎉 Join Premium Telegram Channel!</h2>
                </div>
                <div class="telegram-popup-body">
                    <p>As a premium member, you get exclusive access to our Telegram channel for:</p>
                    <div class="telegram-benefits">
                        <div class="benefit-item">✅ Daily study materials</div>
                        <div class="benefit-item">✅ Exam updates & notifications</div>
                        <div class="benefit-item">✅ Doubt solving support</div>
                        <div class="benefit-item">✅ Premium study group</div>
                    </div>
                    <div class="telegram-channel-info">
                        <p><strong>Channel:</strong> Exam Axis Premium</p>
                        <p><strong>Link:</strong> https://t.me/+wkVQs6V5sEkyODI9</p>
                    </div>
                </div>
                <div class="telegram-popup-footer">
                    <button class="btn-join-telegram" onclick="TelegramIntegration.handleTelegramJoin()">
                        <i class="fab fa-telegram"></i> Join Channel Now
                    </button>
                    <button class="btn-maybe-later" onclick="TelegramIntegration.dismissPopup()">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .telegram-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .telegram-popup {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                animation: slideUp 0.3s ease;
            }
            
            .telegram-popup-header {
                background: linear-gradient(135deg, #0088cc, #006699);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 20px 20px 0 0;
            }
            
            .telegram-icon-large {
                font-size: 3rem;
                display: block;
                margin-bottom: 10px;
            }
            
            .telegram-popup-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 700;
            }
            
            .telegram-popup-body {
                padding: 30px;
                text-align: center;
            }
            
            .telegram-popup-body p {
                color: #475569;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            
            .telegram-benefits {
                text-align: left;
                margin: 20px 0;
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
            }
            
            .benefit-item {
                padding: 8px 0;
                color: #2d3748;
                font-weight: 500;
            }
            
            .telegram-channel-info {
                background: #e6f7ff;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #0088cc;
            }
            
            .telegram-channel-info p {
                margin: 5px 0;
                font-size: 0.9rem;
            }
            
            .telegram-popup-footer {
                padding: 20px 30px 30px;
                display: flex;
                gap: 15px;
            }
            
            .btn-join-telegram {
                flex: 1;
                background: linear-gradient(135deg, #0088cc, #006699);
                color: white;
                border: none;
                padding: 15px 20px;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: transform 0.3s;
            }
            
            .btn-join-telegram:hover {
                transform: translateY(-2px);
            }
            
            .btn-maybe-later {
                flex: 1;
                background: #f1f5f9;
                color: #64748b;
                border: 2px solid #e2e8f0;
                padding: 15px 20px;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .btn-maybe-later:hover {
                background: #e2e8f0;
                color: #475569;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 600px) {
                .telegram-popup {
                    margin: 20px;
                    width: calc(100% - 40px);
                }
                
                .telegram-popup-footer {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(popup);
    }
    
    // Show telegram popup for premium users
    static showTelegramPopup() {
        // Only show for premium users
        if (!this.isUserPremium()) {
            console.log('User is not premium, not showing telegram popup');
            return;
        }
        
        // Don't show if already joined
        if (this.hasJoinedTelegram()) {
            console.log('User already joined telegram, not showing popup');
            return;
        }
        
        console.log('Showing telegram popup for premium user');
        this.createTelegramPopup();
    }
    
    // Handle telegram join
    static handleTelegramJoin() {
        // Open telegram in new tab
        window.open(this.TELEGRAM_CHANNEL_URL, '_blank');
        
        // Mark as joined immediately
        this.markTelegramJoined();
        
        // Remove popup
        this.removePopup();
        
        // Hide any existing telegram sections
        const telegramSection = document.getElementById('telegramSection');
        if (telegramSection) {
            telegramSection.style.display = 'none';
        }
        
        // Show success message
        this.showToast('🎉 Welcome to our Telegram channel! Check your notifications.', 'success');
    }
    
    // Dismiss popup
    static dismissPopup() {
        this.removePopup();
        // Don't mark as joined - user can see it again later
    }
    
    // Remove popup from DOM
    static removePopup() {
        const popup = document.getElementById('telegram-popup');
        if (popup) {
            popup.remove();
        }
    }
    
    // Initialize telegram integration on any page
    static initialize() {
        console.log('Initializing Telegram Integration...');
        
        // Check user premium status
        const isPremium = this.isUserPremium();
        console.log('User premium status:', isPremium);
        console.log('User data:', JSON.parse(localStorage.getItem('user') || '{}'));
        
        // ALWAYS show popup for testing if user has any premium-like data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const hasAnyPremiumData = 
            user.plan === 'premium' || 
            user.isPremium === true || 
            user.subscription === 'premium' ||
            user.premium === true ||
            user.role === 'premium' ||
            user.userType === 'premium' ||
            user.membership === 'premium' ||
            user.access === 'premium' ||
            (user.plan && user.plan.toLowerCase().includes('premium')) ||
            (user.subscription && user.subscription.toLowerCase().includes('premium')) ||
            // Add more aggressive checks
            (user.email && user.email.includes('@')) || // Any logged-in user for testing
            localStorage.getItem('token'); // Any logged-in user
        
        console.log('Has any premium data:', hasAnyPremiumData);
        
        if (hasAnyPremiumData || isPremium) {
            console.log('User qualifies for premium, checking telegram status...');
            
            // Show popup if not joined
            if (!this.hasJoinedTelegram()) {
                console.log('User has not joined telegram, showing popup...');
                // Show popup after a short delay
                setTimeout(() => {
                    this.showTelegramPopup();
                }, 2000);
            } else {
                console.log('User already joined telegram');
            }
        } else {
            console.log('User is not premium, not showing popup');
            
            // For testing - you can manually trigger popup
            // Remove this in production if needed
            if (window.location.search.includes('testtelegram=true')) {
                console.log('Test mode - showing telegram popup');
                setTimeout(() => {
                    this.showTelegramPopup();
                }, 1000);
            }
        }
        
        // Initialize dashboard-specific section if on dashboard
        this.initializeTelegramSection();
    }
    
    // Manual trigger for testing (call from console: TelegramIntegration.forceShowPopup())
    static forceShowPopup() {
        console.log('Force showing telegram popup for testing');
        this.createTelegramPopup();
    }
    
    // Add global function for easy testing
    static showTelegramPopupNow() {
        console.log('Manual telegram popup trigger');
        this.createTelegramPopup();
    }
    
    // Show telegram section for premium users only (dashboard specific)
    static initializeTelegramSection() {
        const telegramSection = document.getElementById('telegramSection');
        const telegramBtn = document.getElementById('telegramBtn');
        
        if (!telegramSection || !telegramBtn) return;
        
        // Only show for premium users
        if (!this.isUserPremium()) {
            telegramSection.style.display = 'none';
            return;
        }
        
        // Hide if already joined
        if (this.hasJoinedTelegram()) {
            telegramSection.style.display = 'none';
            return;
        }
        
        // Show telegram section
        telegramSection.style.display = 'block';
        
        // Handle click event
        telegramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleTelegramJoin();
        });
    }
    
    // Show toast notification
    static showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.getElementById('telegram-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.id = 'telegram-toast';
        toast.className = `telegram-toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .telegram-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : '#3b82f6'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        if (!document.getElementById('telegram-toast-style')) {
            style.id = 'telegram-toast-style';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TelegramIntegration.initialize();
    
    // Add global functions for testing
    window.showTelegramPopup = () => TelegramIntegration.showTelegramPopupNow();
    window.forceTelegramPopup = () => TelegramIntegration.forceShowPopup();
    
    console.log('Telegram Integration loaded. Use showTelegramPopup() or forceTelegramPopup() to test.');
});

window.TelegramIntegration = TelegramIntegration;
