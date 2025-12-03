document.addEventListener("DOMContentLoaded", () => {
  // ========== CHECK IF USER IS LOGGED IN ==========
  let currentUser = localStorage.getItem('gc_current_user');
  if (!currentUser) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return;
  }

  let billingToggle = document.getElementById("billing-toggle");
  let planContainer = document.querySelector(".Plan-cards");
  let cancelPlanBtn = document.getElementById("cancel-plan-btn");
  // ----------------------------
  // Show/hide Cancel Subscription button
  // ----------------------------
  function updateCancelButtonVisibility() {
    if (!cancelPlanBtn) return;
    let hasSubscription = localStorage.getItem("userPlan") !== null;
    cancelPlanBtn.style.display = hasSubscription ? "block" : "none";
  }
  // ----------------------------
  // Update "This plan is Activated" text for each card
  // ----------------------------
  function updateActivatedText() {
    let currentPlan = (localStorage.getItem("userPlan") || "").toLowerCase();
    document.querySelectorAll(".card").forEach((card) => {
      let planName = card.querySelector("h2")?.textContent.trim().toLowerCase();
      let activatedText = card.querySelector(".activated-plan"); // inside this card
      if (!activatedText) return;
      if (currentPlan && planName === currentPlan) {
        activatedText.style.display = "block";
        activatedText.textContent = "This plan is Activated!!";
        card.classList.add("activated-plan");
      } else {
        activatedText.style.display = "none";
        activatedText.textContent = "";
        card.classList.remove("activated-plan");
      }
    });
  }
  // ----------------------------
  // Save plan to localStorage
  // ----------------------------
  function savePlan(planKey) {
    localStorage.setItem("userPlan", planKey);
    updateActivatedText();
  }
  // ----------------------------
  // Show Plan Modal
  // ----------------------------
  function showPlanModal(planName, planKey, isYearly) {
    let modal = document.createElement("div");
    modal.className = "plan-modal-overlay";
    modal.innerHTML = `
      <div class="plan-modal">
          <h3>Great Choice! 🎉</h3>
          <p>You selected the <strong>${planName}</strong> plan.</p>
          <p>Billing: <strong>${isYearly ? "Yearly" : "Monthly"}</strong></p>
          <div class="modal-actions">
              <button class="confirm-btn">Continue to Payment</button>
              <button class="cancel-btn">Cancel</button>
          </div>
      </div>
    `;
    document.body.appendChild(modal);
    // Cancel modal
    modal.querySelector(".cancel-btn").onclick = () => modal.remove();
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
    // Confirm modal
    modal.querySelector(".confirm-btn").onclick = () => {
      savePlan(planKey);               // save plan & update text
      updateActivatedText();           // show activated text immediately
      updateCancelButtonVisibility();  // show cancel button
      modal.remove();
      // Optional: payment processing
      if (typeof processPayment === "function") {
        processPayment(planName, planKey);
      }
    };
  }
  // ----------------------------
  // Billing Toggle
  // ----------------------------
  if (billingToggle) {
    billingToggle.addEventListener("change", () => {
      let isYearly = billingToggle.checked;
      document.querySelectorAll(".amount.monthly")
        .forEach(m => m.style.display = isYearly ? "none" : "inline");
      document.querySelectorAll(".amount.yearly")
        .forEach(y => y.style.display = isYearly ? "inline" : "none");
    });
  }
  // ----------------------------
  // Plan Buttons Click (Event Delegation)
  // ----------------------------
  if (planContainer) {
    planContainer.addEventListener("click", (e) => {
      let btn = e.target.closest(".card-btn");
      if (!btn) return;
      let card = btn.closest(".card");
      if (!card) return;
      let planName = card.querySelector("h2")?.textContent.trim();
      if (!planName) return;
      let planKey = planName.toLowerCase();
      let isYearly = billingToggle?.checked || false;
      showPlanModal(planName, planKey, isYearly);
    });
  }
  // ----------------------------
  // Cancel Plan Button
  // ----------------------------
  if (cancelPlanBtn) {
    cancelPlanBtn.addEventListener("click", () => {
      localStorage.removeItem("userPlan");
      updateActivatedText();           // hide activated text
      updateCancelButtonVisibility();  // hide cancel button
      alert("Your plan has been canceled.");
    });
  }
  // ----------------------------
  // Initialize on Page Load
  // ----------------------------
  updateActivatedText();
  updateCancelButtonVisibility();
});
