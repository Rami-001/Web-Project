$(document).ready(function () {
    // =========================
    // NAVBAR TOGGLE
    // =========================
    let $header = $('.nav-bar');
    let $toggle = $('.nav-toggle');
    let $linksPanel = $('#nav-links');
    if ($toggle.length && $header.length && $linksPanel.length) {
        let closeMenu = () => {
            $header.removeClass('nav-open');
            $('body').css('overflow', '');
            $toggle.attr('aria-expanded', 'false');
        };
        let openMenu = () => {
            $header.addClass('nav-open');
            $('body').css('overflow', 'hidden');
            $toggle.attr('aria-expanded', 'true');
        };
        // Toggle on click
        $toggle.on('click', function () {
            $header.hasClass('nav-open') ? closeMenu() : openMenu();
        });
        // ESC closes menu
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $header.hasClass('nav-open')) {
                closeMenu();
            }
        });
        // Click outside closes menu
        $(document).on('click', function (e) {
            if ($header.hasClass('nav-open') && !$header.has(e.target).length && !$toggle.is(e.target)) {
                closeMenu();
            }
        });
        // Auto-close when resizing to desktop
        let mq = window.matchMedia('(min-width: 961px)');
        mq.addEventListener('change', ev => {
            if (ev.matches) closeMenu();
        });
    }
    // =========================
    // DROPDOWN
    // =========================
    let $servicesLink = $('.dropdown a');
    let $dropdownMenu = $('.dropdown-content');

    if ($servicesLink.length && $dropdownMenu.length) {
        let hideTimeout;
        let isMobile = $(window).width() <= 960;
        // Detect screen size changes
        $(window).on('resize', function () {
            isMobile = $(this).width() <= 960;
        });
        // Desktop hover show
        $servicesLink.on('mouseenter', function () {
            if (!isMobile) {
                clearTimeout(hideTimeout);
                $dropdownMenu.addClass('visible');
            }
        });
        // Desktop hover hide
        $servicesLink.on('mouseleave', function () {
            if (!isMobile) {
                hideTimeout = setTimeout(() => {
                    $dropdownMenu.removeClass('visible');
                }, 500);
            }
        });
        // Keep open while hovering dropdown
        $dropdownMenu.on('mouseenter', function () {
            if (!isMobile) {
                clearTimeout(hideTimeout);
                $dropdownMenu.addClass('visible');
            }
        });
        $dropdownMenu.on('mouseleave', function () {
            if (!isMobile) {
                hideTimeout = setTimeout(() => {
                    $dropdownMenu.removeClass('visible');
                }, 500);
            }
        });
        // Mobile click logic
        let dropdownOpenedOnce = false;
        $servicesLink.on('click', function (e) {
            if (!$dropdownMenu.hasClass('visible')) {
                e.preventDefault();
                $dropdownMenu.addClass('visible');
                dropdownOpenedOnce = true;
                return;
            }

            if (dropdownOpenedOnce) {
                window.location.href = 'services.html'; // change if needed
            }
        });
        // Click outside closes dropdown
        $(document).on('click', function (e) {
            if (!$servicesLink.is(e.target) && !$dropdownMenu.has(e.target).length) {
                $dropdownMenu.removeClass('visible');
                dropdownOpenedOnce = false;
            }
        });
        // ESC closes dropdown
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                $dropdownMenu.removeClass('visible');
                dropdownOpenedOnce = false;
            }
        });
    }
});

<<<<<<< HEAD


=======
/* ============================================
   Navigation & Dropdown Toggle
   ============================================ */
const navToggle = document.querySelector(".nav-toggle");
const navBar = document.querySelector(".nav-bar");
const navLinks = document.querySelectorAll("#nav-links > li");
const dropdownTrigger = document.querySelector("#nav-links > li.dropdown > a");
const dropdownContent = document.querySelector(".dropdown-content");
const dropdownLi = document.querySelector("#nav-links > li.dropdown");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navBar.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", navBar.classList.contains("nav-open"));
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    // Don't close nav if clicking dropdown trigger
    if (this.classList.contains("dropdown")) return;
    navBar.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  });
});

// Desktop: Dropdown shows on hover and stays visible when hovering over content
if (dropdownLi && dropdownContent) {
  dropdownLi.addEventListener("mouseenter", () => {
    if (window.innerWidth > 960) {
      dropdownContent.classList.add("visible");
    }
  });

  dropdownLi.addEventListener("mouseleave", () => {
    if (window.innerWidth > 960) {
      dropdownContent.classList.remove("visible");
    }
  });

  // Keep dropdown visible when hovering over it
  dropdownContent.addEventListener("mouseenter", () => {
    if (window.innerWidth > 960) {
      dropdownContent.classList.add("visible");
    }
  });

  dropdownContent.addEventListener("mouseleave", () => {
    if (window.innerWidth > 960) {
      dropdownContent.classList.remove("visible");
    }
  });

  // Mobile: Click to toggle
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        dropdownContent.classList.toggle("visible");
      }
    });
  }
}

// Close dropdown on outside click (mobile only)
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 960) {
    if (!e.target.closest(".dropdown") && !e.target.closest(".dropdown-content")) {
      dropdownContent?.classList.remove("visible");
    }
  }
});

/* ============================================
   Profile Dropdown
   ============================================ */
const profileDropdown = document.querySelector(".profile-dropdown");
const profileImg = document.querySelector(".profile-dropdown > img");

if (profileImg) {
  profileImg.addEventListener("click", () => {
    profileDropdown?.classList.toggle("open");
  });
}

/* ============================================
   Smooth scroll for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ============================================
   Contact form handler
   ============================================ */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("contact-name")?.value.trim();
    const email = document.getElementById("contact-email")?.value.trim();
    const subject = document.getElementById("contact-subject")?.value.trim();
    const message = document.getElementById("contact-message")?.value.trim();
    const msgEl = document.querySelector(".contact-msg");
    
    if (!name || !email || !subject || !message) {
      if (msgEl) {
        msgEl.className = "contact-msg err";
        msgEl.textContent = "Please fill in all fields.";
      }
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (msgEl) {
        msgEl.className = "contact-msg err";
        msgEl.textContent = "Please enter a valid email.";
      }
      return;
    }
    
    if (msgEl) {
      msgEl.className = "contact-msg";
      msgEl.textContent = "Sending…";
    }
    
    setTimeout(() => {
      if (msgEl) {
        msgEl.className = "contact-msg ok";
        msgEl.textContent = "✓ Message sent! We'll get back to you soon.";
      }
      contactForm.reset();
      setTimeout(() => {
        if (msgEl) msgEl.textContent = "";
      }, 3000);
    }, 800);
  });
}

/* ============================================
   Service search & filter
   ============================================ */
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const serviceCards = document.querySelectorAll(".service-card");

function filterServices() {
  const searchTerm = searchInput?.value.toLowerCase() || "";
  
  serviceCards.forEach(card => {
    const title = card.querySelector(".card-content h2")?.textContent.toLowerCase() || "";
    const description = card.querySelector(".card-content p")?.textContent.toLowerCase() || "";
    
    const matches = title.includes(searchTerm) || description.includes(searchTerm);
    card.style.display = matches ? "flex" : "none";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", filterServices);
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const container = document.querySelector(".servicecontainer");
    const cards = Array.from(serviceCards);
    
    if (sortSelect.value === "name-asc") {
      cards.sort((a, b) => {
        const nameA = a.querySelector("h2")?.textContent || "";
        const nameB = b.querySelector("h2")?.textContent || "";
        return nameA.localeCompare(nameB);
      });
    } else if (sortSelect.value === "name-desc") {
      cards.sort((a, b) => {
        const nameA = a.querySelector("h2")?.textContent || "";
        const nameB = b.querySelector("h2")?.textContent || "";
        return nameB.localeCompare(nameA);
      });
    }
    
    cards.forEach(card => container?.appendChild(card));
  });
}

/* ============================================
   Favorites (localStorage)
   ============================================ */
const favButtons = document.querySelectorAll(".favbtn");

function updateFavButton(btn, isFav) {
  if (isFav) {
    btn.textContent = "★ Saved";
    btn.style.backgroundColor = "#10b981";
  } else {
    btn.textContent = "☆ Save";
    btn.style.backgroundColor = "#dc2626";
  }
}

favButtons.forEach(btn => {
  const serviceId = btn.closest(".service-card")?.getAttribute("data-id") || btn.textContent;
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const isSaved = favorites.includes(serviceId);
  
  updateFavButton(btn, isSaved);
  
  btn.addEventListener("click", () => {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const index = favs.indexOf(serviceId);
    
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(serviceId);
    }
    
    localStorage.setItem("favorites", JSON.stringify(favs));
    updateFavButton(btn, favs.includes(serviceId));
  });
});

/* ============================================
   Settings page handlers
   ============================================ */
const settingsButtons = document.querySelectorAll(".settings-btn");

settingsButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    const msgEl = this.closest(".settings-card")?.querySelector(".settings-msg");
    
    if (this.classList.contains("danger")) {
      if (confirm("Are you sure? This action cannot be undone.")) {
        if (msgEl) {
          msgEl.className = "settings-msg success";
          msgEl.textContent = "Action completed.";
        }
      }
    } else {
      if (msgEl) {
        msgEl.className = "settings-msg success";
        msgEl.textContent = "Changes saved.";
      }
      setTimeout(() => {
        if (msgEl) msgEl.textContent = "";
      }, 3000);
    }
  });
});

/* ============================================
   Subscription pricing toggle
   ============================================ */
const pricingToggle = document.querySelector(".toggle-switch input");

if (pricingToggle) {
  pricingToggle.addEventListener("change", () => {
    const amounts = document.querySelectorAll(".amount");
    amounts.forEach(amount => {
      const isMonthly = amount.classList.contains("monthly");
      const checked = pricingToggle.checked;
      
      if (isMonthly && !checked) {
        amount.style.display = "inline";
      } else if (!isMonthly && checked) {
        amount.style.display = "inline";
      } else {
        amount.style.display = "none";
      }
    });
  });
}

/* ============================================
   Theme Toggle - Apply saved theme on page load
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
});

console.log("Script loaded successfully");
>>>>>>> e8c9d72933279c70afcf6b50e423e956ad6ddc2e
