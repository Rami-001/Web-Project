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



