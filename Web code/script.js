// Improved dropdown for Services with better timing
document.addEventListener('DOMContentLoaded', function() {
  const servicesLink = document.querySelector('.dropdown a');
  const dropdownMenu = document.querySelector('.dropdown-content');

  // Mobile nav
  const header = document.querySelector('.nav-bar');
  const toggle = document.querySelector('.nav-toggle');
  const linksPanel = document.querySelector('#nav-links');

  if (toggle && header && linksPanel) {
    const closeMenu = () => {
      header.classList.remove('nav-open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      header.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    };
    toggle.addEventListener('click', () => {
      if (header.classList.contains('nav-open')) closeMenu();
      else openMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) closeMenu();
    });
    document.addEventListener('click', (e) => {
      if (!header.classList.contains('nav-open')) return;
      const isInside = header.contains(e.target);
      if (!isInside) closeMenu();
    });
    const mq = window.matchMedia('(min-width: 961px)');
    mq.addEventListener('change', (ev) => { if (ev.matches) closeMenu(); });
  }

  if (!servicesLink || !dropdownMenu) return;

  let hideTimeout;
  let isMobile = window.innerWidth <= 960;

  // Update isMobile on resize
  window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 960;
  });

  // Show dropdown when hovering Services (desktop only)
  servicesLink.addEventListener('mouseenter', function() {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add('visible');
    }
  });

  // Hide dropdown when leaving Services (desktop only)
  servicesLink.addEventListener('mouseleave', function() {
    if (!isMobile) {
      hideTimeout = setTimeout(() => {
        dropdownMenu.classList.remove('visible');
      }, 500);
    }
  });

  // Keep dropdown open when hovering over it (desktop only)
  dropdownMenu.addEventListener('mouseenter', function() {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add('visible');
    }
  });

  // Hide dropdown when leaving it (desktop only)
  dropdownMenu.addEventListener('mouseleave', function() {
    if (!isMobile) {
      hideTimeout = setTimeout(() => {
        dropdownMenu.classList.remove('visible');
      }, 500);
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
// Helpers to open/close the services dropdown and lock body scroll
function openServices() {
  dropdownMenu.classList.add('visible');
  document.body.classList.add('dropdown-open');
}
function closeServices() {
  dropdownMenu.classList.remove('visible');
  document.body.classList.remove('dropdown-open');
}

// Toggle on click
servicesLink.addEventListener('click', function(e) {
  e.preventDefault();
  if (dropdownMenu.classList.contains('visible')) {
    closeServices();
  } else {
    openServices();
  }
});

// Close when clicking outside
document.addEventListener('click', function(e) {
  if (!servicesLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
    closeServices();
  }
});

// Close on ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeServices();
});

// Keep existing hover handlers for desktop as you like




