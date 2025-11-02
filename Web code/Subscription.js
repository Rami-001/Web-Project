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