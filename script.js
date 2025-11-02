// Improved dropdown for Services with better timing
document.addEventListener('DOMContentLoaded', function() {
    const servicesLink = document.querySelector('.dropdown a');
    const dropdownMenu = document.querySelector('.dropdown-content');
    
    if (!servicesLink || !dropdownMenu) return;
    
    let hideTimeout;
    let isMobile = window.innerWidth <= 768;
    
    // Update isMobile on resize
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth <= 768;
    });
    
    // Show dropdown when hovering Services (desktop only)
    servicesLink.addEventListener('mouseenter', function() {
        if (!isMobile) {
            clearTimeout(hideTimeout);
            dropdownMenu.classList.add('visible');
        }
    });
    
    // Hide dropdown when leaving Services (desktop only) - SLOWER
    servicesLink.addEventListener('mouseleave', function() {
        if (!isMobile) {
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('visible');
            }, 500); // Increased from 300ms to 500ms
        }
    });
    
    // Keep dropdown open when hovering over it (desktop only)
    dropdownMenu.addEventListener('mouseenter', function() {
        if (!isMobile) {
            clearTimeout(hideTimeout);
            dropdownMenu.classList.add('visible');
        }
    });
    
    // Hide dropdown when leaving it (desktop only) - SLOWER
    dropdownMenu.addEventListener('mouseleave', function() {
        if (!isMobile) {
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('visible');
            }, 500); // Increased from 300ms to 500ms
        }
    });
    
    // Toggle dropdown on click (mobile and desktop)
    servicesLink.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('visible');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!servicesLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('visible');
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdownMenu.classList.remove('visible');
        }
    });
});

// Theme Management System with Separate Buttons - FIXED VERSION
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Create and add theme buttons
        this.createThemeButtons();
        
        // Listen for system preference changes
        this.watchSystemPreference();
        
        console.log('ThemeManager initialized with theme:', this.currentTheme);
    }

    createThemeButtons() {
        // Remove any existing theme buttons first
        const existingButtons = document.querySelector('.theme-buttons');
        if (existingButtons) {
            existingButtons.remove();
        }

        // Create new buttons container
        const container = document.createElement('div');
        container.className = 'theme-buttons';
        container.innerHTML = `
            <button class="theme-btn light-btn" data-theme="light" title="Light Mode">
                <span class="theme-icon">☀️</span>
                <span class="theme-label">Light</span>
            </button>
            <button class="theme-btn dark-btn" data-theme="dark" title="Dark Mode">
                <span class="theme-icon">🌙</span>
                <span class="theme-label">Dark</span>
            </button>
        `;

        // Add click listeners
        container.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theme = e.currentTarget.getAttribute('data-theme');
                console.log('Theme button clicked:', theme);
                this.setTheme(theme);
                this.updateActiveButton();
            });
        });

        // Add to page - try different locations
        const rightRail = document.querySelector('.right-rail');
        const navBar = document.querySelector('.nav-bar');
        
        if (rightRail) {
            rightRail.appendChild(container);
        } else if (navBar) {
            navBar.appendChild(container);
        } else {
            // Fallback: add to body
            document.body.appendChild(container);
            // Style it to be visible
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '1000';
        }

        // Update initial active state
        this.updateActiveButton();
        
        console.log('Theme buttons created and added to page');
    }

    setTheme(theme) {
        console.log('Setting theme to:', theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Add animation class for smooth transition
        document.documentElement.classList.add('theme-changing');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-changing');
        }, 300);
    }

    updateActiveButton() {
        const buttons = document.querySelectorAll('.theme-btn');
        console.log('Updating active buttons. Current theme:', this.currentTheme, 'Buttons found:', buttons.length);
        
        buttons.forEach(btn => {
            const theme = btn.getAttribute('data-theme');
            if (theme === this.currentTheme) {
                btn.classList.add('active');
                console.log('Activated button for theme:', theme);
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const color = theme === 'dark' ? '#0a1324' : '#1a8ae0';
        metaThemeColor.setAttribute('content', color);
    }

    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set theme based on system preference if no user preference
        if (!localStorage.getItem('theme')) {
            this.setTheme(mediaQuery.matches ? 'dark' : 'light');
            this.updateActiveButton();
        }

        // Listen for system theme changes
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
                this.updateActiveButton();
            }
        });
    }
}

// Debug function to manually test
function debugTheme() {
    console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Saved theme:', localStorage.getItem('theme'));
    console.log('Theme buttons found:', document.querySelectorAll('.theme-btn').length);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing theme manager...');
    
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize navigation
    const navigationManager = new NavigationManager();
    
    // Initialize profile manager
    const profileManager = new ProfileManager();

    // Make managers globally available for debugging
    window.themeManager = themeManager;
    window.navigationManager = navigationManager;
    window.profileManager = profileManager;
    window.debugTheme = debugTheme;

    console.log('All managers initialized successfully!');
    
    // Test: try to manually set theme after 2 seconds if buttons still don't work
    setTimeout(() => {
        if (document.querySelectorAll('.theme-btn.active').length === 0) {
            console.log('No active theme buttons found - forcing theme update');
            themeManager.updateActiveButton();
        }
    }, 2000);
});

// Fallback: If still not working, add this simple version
function createSimpleThemeButtons() {
    const container = document.createElement('div');
    container.className = 'theme-buttons';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        gap: 8px;
        padding: 8px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    container.innerHTML = `
        <button onclick="setSimpleTheme('light')" style="padding: 8px 12px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer;">☀️ Light</button>
        <button onclick="setSimpleTheme('dark')" style="padding: 8px 12px; border: none; border-radius: 8px; background: transparent; color: #666; cursor: pointer;">🌙 Dark</button>
    `;
    
    document.body.appendChild(container);
}

function setSimpleTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button styles
    const buttons = document.querySelectorAll('.theme-buttons button');
    buttons.forEach(btn => {
        if (btn.textContent.includes(theme === 'light' ? 'Light' : 'Dark')) {
            btn.style.background = '#2563eb';
            btn.style.color = 'white';
        } else {
            btn.style.background = 'transparent';
            btn.style.color = '#666';
        }
    });
}
// Subscription Page Functionality
class SubscriptionPage {
    constructor() {
        this.billingToggle = document.getElementById('billing-toggle');
        this.planButtons = document.querySelectorAll('.plan-btn');
        this.init();
    }

    init() {
        // Billing toggle functionality
        if (this.billingToggle) {
            this.billingToggle.addEventListener('change', (e) => {
                this.handleBillingToggle(e.target.checked);
            });
        }

        // Plan button click handlers
        this.planButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handlePlanSelection(e.target);
            });
        });

        // Smooth scrolling for anchor links
        this.initSmoothScrolling();

        console.log('Subscription page initialized');
    }

    handleBillingToggle(isYearly) {
        const monthlyPrices = document.querySelectorAll('.amount.monthly');
        const yearlyPrices = document.querySelectorAll('.amount.yearly');
        
        if (isYearly) {
            monthlyPrices.forEach(price => price.style.display = 'none');
            yearlyPrices.forEach(price => price.style.display = 'inline');
        } else {
            monthlyPrices.forEach(price => price.style.display = 'inline');
            yearlyPrices.forEach(price => price.style.display = 'none');
        }

        // Add animation effect
        document.querySelectorAll('.price').forEach(price => {
            price.style.transform = 'scale(1.1)';
            setTimeout(() => {
                price.style.transform = 'scale(1)';
            }, 300);
        });
    }

    handlePlanSelection(button) {
        const plan = button.getAttribute('data-plan');
        const isYearly = this.billingToggle?.checked || false;
        
        console.log(`Selected plan: ${plan}, Yearly: ${isYearly}`);
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Here you would typically:
        // 1. Show a loading state
        // 2. Make API call to start subscription
        // 3. Redirect to payment page
        this.showPlanModal(plan, isYearly);
    }

    showPlanModal(plan, isYearly) {
        // Create a simple modal for plan selection
        const modal = document.createElement('div');
        modal.className = 'plan-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: var(--surface);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: var(--shadow-2);
        `;

        modalContent.innerHTML = `
            <h3>Great Choice! 🎉</h3>
            <p>You've selected the <strong>${this.getPlanName(plan)}</strong> plan</p>
            <p>Billing: <strong>${isYearly ? 'Yearly' : 'Monthly'}</strong></p>
            <div style="margin: 30px 0;">
                <button class="confirm-btn" style="padding: 12px 30px; background: var(--primary-blue); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; margin: 5px;">
                    Continue to Payment
                </button>
                <button class="cancel-btn" style="padding: 12px 30px; background: transparent; color: var(--medium-text); border: 1px solid var(--hover-bg); border-radius: 8px; font-weight: 700; cursor: pointer; margin: 5px;">
                    Cancel
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add event listeners
        modalContent.querySelector('.confirm-btn').addEventListener('click', () => {
            this.processPayment(plan, isYearly);
            modal.remove();
        });

        modalContent.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    getPlanName(plan) {
        const planNames = {
            'basic': 'Explorer',
            'pro': 'Adventurer',
            'enterprise': 'Globetrotter'
        };
        return planNames[plan] || plan;
    }

    processPayment(plan, isYearly) {
        // Simulate payment processing
        console.log('Processing payment for:', plan, isYearly);
        
        // Show loading state
        const loading = document.createElement('div');
        loading.textContent = 'Processing...';
        loading.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--surface);
            padding: 20px;
            border-radius: 10px;
            box-shadow: var(--shadow-2);
            z-index: 10001;
        `;
        document.body.appendChild(loading);

        // Simulate API call
        setTimeout(() => {
            loading.remove();
            alert('Payment processed successfully! Welcome to Global Compass!');
            // In real app, you would redirect to dashboard or success page
        }, 2000);
    }

    initSmoothScrolling() {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SubscriptionPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubscriptionPage;
}