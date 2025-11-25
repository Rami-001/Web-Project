// ===============================
//  SUBSCRIPTION PAGE CONTROLLER (FIXED)
// ===============================
class SubscriptionPage {
    constructor() {
        let billingToggle = document.getElementById('billing-toggle');
        let planButtons = document.querySelectorAll('.plan-btn');

        this.billingToggle = billingToggle;
        this.planButtons = planButtons;

        this.init();
    }

    init() {
        // Restore saved plan and update UI
        this.updateSelectedPlan();

        // Toggle Billing
        if (this.billingToggle) {
            this.billingToggle.addEventListener('change', () => {
                this.handleBillingToggle(this.billingToggle.checked);
            });
        }

        // Plan selection
        this.planButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handlePlanSelection(button);
            });
        });

        // Smooth scroll
        this.initSmoothScrolling();
    }

    // Normalize a plan label to a stable key: "Pro Plan" -> "pro"
    normalizePlanKey(raw) {
        if (!raw) return '';
        let s = raw.toString().trim().toLowerCase();
        // remove non-letter characters and extra words like "plan"
        s = s.replace(/plan/g, '').replace(/[^a-z0-9\- ]/g, '').trim();
        // take first word (e.g., "pro", "basic", "enterprise")
        let first = s.split(/\s+/)[0] || s;
        return first;
    }

    // Try many ways to find a plan key from button or card
    resolvePlanKeyFromButton(button) {
        // 1. data-plan on the button
        let p = button.getAttribute('data-plan') || button.dataset.plan;
        if (p) return this.normalizePlanKey(p);

        // 2. data-plan on enclosing .plan-card
        let card = button.closest('.plan-card');
        if (card) {
            p = card.getAttribute('data-plan') || card.dataset.plan;
            if (p) return this.normalizePlanKey(p);

            // 3. fallback to the card's h3 text
            let h3 = card.querySelector('h3');
            if (h3) return this.normalizePlanKey(h3.textContent);
        }

        // 4. last-resort: button text
        return this.normalizePlanKey(button.textContent);
    }

    // ===============================
    //  BILLING TOGGLE
    // ===============================
    handleBillingToggle(isYearly) {
        let monthly = document.querySelectorAll('.amount.monthly');
        let yearly = document.querySelectorAll('.amount.yearly');

        monthly.forEach(el => el.style.display = isYearly ? "none" : "inline");
        yearly.forEach(el => el.style.display = isYearly ? "inline" : "none");

        // Animation
        document.querySelectorAll('.price').forEach(price => {
            price.classList.add('price-animate');
            setTimeout(() => price.classList.remove('price-animate'), 300);
        });
    }

    // ===============================
    //  PLAN SELECTION
    // ===============================
    handlePlanSelection(button) {
        // Resolve a stable plan key (e.g., "basic", "pro", "enterprise")
        let planKey = this.resolvePlanKeyFromButton(button);
        let isYearly = this.billingToggle?.checked || false;

        // If planKey is still empty, show error
        if (!planKey) {
            alert('Unable to determine selected plan. Please try again.');
            return;
        }

        this.showPlanModal(planKey, isYearly);
    }

    // ===============================
    //  SAVE PLAN TO LOCALSTORAGE
    // ===============================
    savePlan(planType) {
        let selectedPlan = this.normalizePlanKey(planType);
        if (!selectedPlan) return;
        localStorage.setItem('userPlan', selectedPlan);
        this.updateSelectedPlan();
    }

    updateSelectedPlan() {
        let currentPlan = localStorage.getItem('userPlan') || 'free';
        currentPlan = this.normalizePlanKey(currentPlan);

        // Reset all plan cards display
        document.querySelectorAll('.plan-status').forEach(el => el.textContent = '');
        document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('active-plan'));

        // Highlight active plan by comparing normalized keys
        document.querySelectorAll('.plan-card').forEach(card => {
            let cardPlanKey = card.getAttribute('data-plan') || card.dataset.plan || '';
            if (!cardPlanKey) {
                let h3 = card.querySelector('h3');
                cardPlanKey = h3 ? h3.textContent : '';
            }
            cardPlanKey = this.normalizePlanKey(cardPlanKey);

            if (cardPlanKey && cardPlanKey === currentPlan) {
                let status = card.querySelector('.plan-status');
                if (status) status.textContent = "✓ Current Plan";
                card.classList.add('active-plan');
            }
        });
    }

    // ===============================
    //  MODAL
    // ===============================
    showPlanModal(planKey, isYearly) {
        let modal = document.createElement('div');
        modal.className = "plan-modal-overlay";

        let planDisplayName = this.getPlanName(planKey);

        modal.innerHTML = `
            <div class="plan-modal" role="dialog" aria-modal="true" aria-label="Plan confirmation">
                <h3>Great Choice! 🎉</h3>
                <p>You selected the <strong>${planDisplayName}</strong> plan.</p>
                <p>Billing: <strong>${isYearly ? "Yearly" : "Monthly"}</strong></p>

                <div class="modal-actions">
                    <button class="confirm-btn">Continue to Payment</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cancel
        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());

        // Confirm -> process payment and then save planKey
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            this.processPayment(planKey, isYearly);
            modal.remove();
        });

        // Close clicking outside
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.remove();
        });
    }

    // ===============================
    //  PAYMENT
    // ===============================
    processPayment(planKey, isYearly) {
        let loading = document.createElement('div');
        loading.className = "payment-loading";
        loading.textContent = "Processing...";

        document.body.appendChild(loading);

        setTimeout(() => {
            loading.remove();
            // Save the plan only after "successful payment"
            this.savePlan(planKey);
            alert(`Payment successful! You are now on the ${this.getPlanName(planKey)} plan.`);
        }, 1200);
    }

    getPlanName(plan) {
        let names = {
            free: "Free",
            basic: "Explorer",
            pro: "Adventurer",
            enterprise: "Globetrotter"
        };
        let key = this.normalizePlanKey(plan);
        return names[key] || plan || "Plan";
    }

    // ===============================
    //  SMOOTH SCROLLING
    // ===============================
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                e.preventDefault();
                let target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        });
    }
}
// Init
document.addEventListener('DOMContentLoaded', () => {
    new SubscriptionPage();
});
