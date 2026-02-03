// Telegram Integration for Premium Users
class TelegramIntegration {
    static TELEGRAM_CHANNEL_URL = 'https://t.me/+wkVQs6V5sEkyODI9';
    static TELEGRAM_STORAGE_KEY = 'telegramJoined';
    
    // Check if user is premium
    static isUserPremium() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.plan === 'premium' || user.isPremium === true;
    }
    
    // Check if user has already joined telegram
    static hasJoinedTelegram() {
        return localStorage.getItem(this.TELEGRAM_STORAGE_KEY) === 'true';
    }
    
    // Mark telegram as joined
    static markTelegramJoined() {
        localStorage.setItem(this.TELEGRAM_STORAGE_KEY, 'true');
    }
    
    // Show telegram section for premium users only
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
    
    // Handle telegram join
    static handleTelegramJoin() {
        // Open telegram in new tab
        window.open(this.TELEGRAM_CHANNEL_URL, '_blank');
        
        // Mark as joined immediately
        this.markTelegramJoined();
        
        // Hide the section
        const telegramSection = document.getElementById('telegramSection');
        if (telegramSection) {
            telegramSection.style.display = 'none';
        }
        
        // Show success message
        this.showToast('🎉 Welcome to our Telegram channel! Check your notifications.', 'success');
    }
    
    // Show toast notification
    static showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        if (!toast || !toastMessage || !toastIcon) return;
        
        toastMessage.textContent = message;
        
        // Set icon based on type
        if (type === 'success') {
            toastIcon.className = 'fas fa-check-circle';
            toast.style.background = '#10b981';
        } else if (type === 'error') {
            toastIcon.className = 'fas fa-times-circle';
            toast.style.background = '#ef4444';
        } else {
            toastIcon.className = 'fas fa-info-circle';
            toast.style.background = '#3b82f6';
        }
        
        // Show toast
        toast.style.display = 'flex';
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TelegramIntegration.initializeTelegramSection();
});

// Export for global access
window.TelegramIntegration = TelegramIntegration;
