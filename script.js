document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.nav-bar');
  const toggle = document.querySelector('.nav-toggle');
  const linksPanel = document.querySelector('#nav-links');

  if (!toggle || !header || !linksPanel) return;

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

  // Toggle menu on click
  toggle.addEventListener('click', () => {
    if (header.classList.contains('nav-open')) closeMenu();
    else openMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      closeMenu();
    }
  });

  // Close when clicking outside the menu
  document.addEventListener('click', (e) => {
    if (!header.classList.contains('nav-open')) return;
    const isInside = header.contains(e.target);
    if (!isInside) closeMenu();
  });

  // Close automatically when resizing to desktop
  const mq = window.matchMedia('(min-width: 961px)');
  mq.addEventListener('change', (ev) => {
    if (ev.matches) closeMenu();
  });
});

//=========================
//       HEADER / NAVBAR
//==========================
document.addEventListener('DOMContentLoaded', function() {
  const servicesLink = document.querySelector('.dropdown a');
  const dropdownMenu = document.querySelector('.dropdown-content');
  if (!servicesLink || !dropdownMenu) return;
  let hideTimeout;
  let isMobile = window.innerWidth <= 960;
  // Detect screen size changes
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 960;
  });
  // Hover to show (desktop)
  servicesLink.addEventListener('mouseenter', () => {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add('visible');
    }
  });
  // Hover out to hide (desktop)
  servicesLink.addEventListener('mouseleave', () => {
    if (!isMobile) {
      hideTimeout = setTimeout(() => dropdownMenu.classList.remove('visible'), 500);
    }
  });

  // Keep open while hovering dropdown (desktop)
  dropdownMenu.addEventListener('mouseenter', () => {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add('visible');
    }
  });
  // Hide when leaving dropdown (desktop)
  dropdownMenu.addEventListener('mouseleave', () => {
    if (!isMobile) {
      hideTimeout = setTimeout(() => dropdownMenu.classList.remove('visible'), 500);
    }
  });
  // Toggle dropdown on click (mobile) and go to page on second click
  let dropdownOpenedOnce = false;
  servicesLink.addEventListener('click', (e) => {
    // If dropdown not visible → show it
    if (!dropdownMenu.classList.contains('visible')) {
      e.preventDefault();
      dropdownMenu.classList.add('visible');
      dropdownOpenedOnce = true;
      return;
    }
    // If dropdown already visible → navigate
    if (dropdownOpenedOnce) {
      window.location.href = 'services.html'; // <-- Change this to your real Services page
    }
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!servicesLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('visible');
      dropdownOpenedOnce = false;
    }
  });
  // Close dropdown with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownMenu.classList.remove('visible');
      dropdownOpenedOnce = false;
    }
  });
});