(function () {
    const trigger = document.querySelector('.dropdown');
    const menu = document.querySelector('.dropdown-content');
    if (!trigger || !menu) return;
    let hideTimer = null;
    let isMobile = window.innerWidth <= 768;
    // Update isMobile on resize
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 768;
    });
    // Show on mouse enter (desktop only)
    trigger.addEventListener('mouseenter', () => {
        if (!isMobile) {
            clearTimeout(hideTimer);
            menu.classList.add('visible');
        }
    });
    // Hide shortly after leaving the trigger (desktop only)
    trigger.addEventListener('mouseleave', () => {
        if (!isMobile) {
            hideTimer = setTimeout(() => menu.classList.remove('visible'), 150);
        }
    });
    // Keep shown when hovering menu (desktop only)
    menu.addEventListener('mouseenter', () => {
        if (!isMobile) {
            clearTimeout(hideTimer);
            menu.classList.add('visible');
        }
    });
    // Hide when leaving menu (desktop only)
    menu.addEventListener('mouseleave', () => {
        if (!isMobile) {
            menu.classList.remove('visible');
        }
    });
    // Toggle on click (mobile and desktop)
    const triggerLink = trigger.querySelector('a');
    if (triggerLink) {
        triggerLink.addEventListener('click', function (e) {
            e.preventDefault();
            menu.classList.toggle('visible');
        });
    }
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') menu.classList.remove('visible');
    });
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('visible');
        }
    });
})();