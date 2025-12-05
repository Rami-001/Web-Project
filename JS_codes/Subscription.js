document.addEventListener("DOMContentLoaded", () => {
  // ========== CHECK IF USER IS LOGGED IN ==========
  let currentUser = localStorage.getItem("gc_current_user");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  let billingToggle = document.getElementById("billing-toggle");
  let planContainer = document.querySelector(".Plan-cards");

  // ========== UPDATE ACTIVATED TEXT & BUTTONS ==========
  function updateActivatedText() {
    let currentPlan = (localStorage.getItem("userPlan") || "").toLowerCase();
    document.querySelectorAll(".card").forEach((card) => {
      let planName = card.querySelector("h2").textContent.trim().toLowerCase();
      let chooseBtn = card.querySelector(".choose-plan-btn");
      let cancelBtn = card.querySelector(".cancel-plan-btn");
      let activatedText = card.querySelector(".activated-plan");
      if (!chooseBtn || !cancelBtn || !activatedText) return;
      if (currentPlan && planName === currentPlan) {
        activatedText.style.display = "block";
        activatedText.textContent = "This plan is Activated!!";
        chooseBtn.style.display = "none";
        cancelBtn.style.display = "block";
      } else {
        activatedText.style.display = "none";
        activatedText.textContent = "";
        chooseBtn.style.display = "block";
        cancelBtn.style.display = "none";
      }
    });
  }

  // ========== SAVE PLAN TO STORAGE ==========
  function savePlan(planKey) {
    localStorage.setItem("userPlan", planKey);
    updateActivatedText();
  }

  // ========== SHOW PLAN MODAL ==========
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
    // Prevent clicks inside modal from closing it
    modal.querySelector(".plan-modal").addEventListener("click", (e) => {
      e.stopPropagation();
    });
    // Close when clicking outside modal
    modal.addEventListener("click", () => modal.remove());
    // Close when pressing Cancel in modal
    modal.querySelector(".cancel-btn").onclick = () => modal.remove();
    // Confirm purchase → save plan AND CLOSE POPUP
    modal.querySelector(".confirm-btn").onclick = () => {
      savePlan(planKey);
      modal.remove(); // closes popup
    };
  }

  // ========== BILLING TOGGLE ==========
  if (billingToggle) {
    billingToggle.addEventListener("change", () => {
      let isYearly = billingToggle.checked;
      document
        .querySelectorAll(".amount.monthly")
        .forEach((m) => (m.style.display = isYearly ? "none" : "inline"));
      document
        .querySelectorAll(".amount.yearly")
        .forEach((y) => (y.style.display = isYearly ? "inline" : "none"));
    });
  }

  // ========== PLAN BUTTONS CLICK HANDLER ==========
  if (planContainer) {
    planContainer.addEventListener("click", (e) => {
      // If user clicks a cancel-plan button → cancel immediately
      if (e.target.closest(".cancel-plan-btn")) {
        localStorage.removeItem("userPlan");
        updateActivatedText();
        alert("Your plan has been canceled.");
        return; // STOP → important!!
      }
      // Handle only "Choose Plan" button
      let btn = e.target.closest(".choose-plan-btn");
      if (!btn) return;
      let card = btn.closest(".card");
      if (!card) return;
      let planName = card.querySelector("h2").textContent.trim();
      let planKey = planName.toLowerCase();
      let isYearly = billingToggle?.checked || false;
      showPlanModal(planName, planKey, isYearly);
    });
  }

  // ========== INITIALIZE ON PAGE LOAD ==========
  updateActivatedText();
});
