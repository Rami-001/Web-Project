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