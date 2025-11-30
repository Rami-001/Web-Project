document.addEventListener("DOMContentLoaded", () => {
  let billingToggle = document.getElementById("billing-toggle");
  let planContainer = document.querySelector(".Plan-cards");

  // Highlight current plan
  function updateSelectedPlan() {
    let currentPlan = (
      localStorage.getItem("userPlan") || "basic"
    ).toLowerCase();

    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("activated-plan");

      // Clear previous chosen-text
      let chosenDiv = card.querySelector(".activated-plan");
      if (chosenDiv) chosenDiv.textContent = "";

      let planName = card.querySelector("h2")?.textContent.trim();
      if (planName?.toLowerCase() === currentPlan) {
        card.classList.add("activated-plan");

        // Show "This plan is chosen" under button
        if (chosenDiv) chosenDiv.textContent = "This plan is Activated";
      }
    });
  }
  updateSelectedPlan();

  // Billing toggle
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

  // Event delegation for plan buttons
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

  function savePlan(planKey) {
    localStorage.setItem("userPlan", planKey);
    updateSelectedPlan();
  }

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

    // Cancel button closes modal
    modal.querySelector(".cancel-btn").onclick = () => modal.remove();
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    // Confirm button: save plan AND update UI immediately
    modal.querySelector(".confirm-btn").onclick = () => {
      savePlan(planKey); // <--- updates localStorage AND shows activated text
      modal.remove();

      // Optional: proceed to payment if you have a payment function
      if (typeof processPayment === "function") {
        processPayment(planName, planKey);
      }
    };
  }

  let cancelPlanBtn = document.getElementById("cancel-plan-btn");

  if (cancelPlanBtn) {
    cancelPlanBtn.addEventListener("click", () => {
      // Remove saved plan from localStorage
      localStorage.removeItem("userPlan");

      // Reset UI: remove active-plan class and chosen-text
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("active-plan");
        let chosenDiv = card.querySelector(".activated-plan");
        if (chosenDiv) chosenDiv.textContent = "";
      });

      alert("Your plan has been canceled.");
    });
  }

  // Update any image references to use correct path:
  // Change: src="imgs/..."
  // To: src="../imgs/..."
});
