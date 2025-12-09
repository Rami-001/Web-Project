// =====================================================
// APPLY SAVED THEME BEFORE DOM READY
// =====================================================
function applyGlobalTheme() {
	let savedTheme = localStorage.getItem('gc_theme_mode') || 'dark';
	document.body.classList.toggle('light-mode', savedTheme === 'light');
}
applyGlobalTheme();

// =====================================================
// MAIN NAVBAR SYSTEM
// =====================================================
$(document).ready(function () {

	// ========= MOBILE BREAKPOINT =========
	let MOBILE_WIDTH = 960;
	let isMobile = window.innerWidth <= MOBILE_WIDTH;

	$(window).on('resize', () => {
		isMobile = window.innerWidth <= MOBILE_WIDTH;
		updateServicesBehavior();
	});


	// =====================================================
	// NAVBAR TOGGLE (BURGER MENU)
	// =====================================================
	let $navBar = $('.nav-bar');
	let $navToggle = $('.nav-toggle');

	function openMenu() {
		$navBar.addClass('nav-open');
		$('body').css('overflow', 'hidden');
	}
	function closeMenu() {
		$navBar.removeClass('nav-open');
		$('body').css('overflow', '');
	}

	$navToggle.on('click', () => {
		$navBar.hasClass('nav-open') ? closeMenu() : openMenu();
	});

	// Close when clicking outside
	$(document).on('click', (e) => {
		if ($navBar.hasClass('nav-open') && !$navBar.has(e.target).length && !$navToggle.is(e.target)) {
			closeMenu();
		}
	});

	// Close when switching to desktop
	window.matchMedia('(min-width: 960px)').addEventListener('change', ev => {
		if (ev.matches) closeMenu();
	});


	// =====================================================
	// SERVICES DROPDOWN SYSTEM
	// =====================================================
	let $servicesLink = $('.dropdown > a');
	let $servicesDropdown = $('.dropdown-content');
	let servicesOpenedOnce = false;

	// --- DESKTOP MODE ---
	function enableDesktopServices() {
		$servicesLink.off();
		$servicesDropdown.off();
		$servicesDropdown.removeClass('visible');
		servicesOpenedOnce = false;

		// Hover open - dropdown opens and stays open
		$servicesLink.on('mouseenter', () => {
			$servicesDropdown.addClass('visible');
		});
		$servicesDropdown.on('mouseenter', () => {
			$servicesDropdown.addClass('visible');
		});

		// Click on Services link while dropdown is open - navigate to Services page
		$servicesLink.on('click', function (e) {
			if ($servicesDropdown.hasClass('visible')) {
				e.preventDefault();
				// Check if on GitHub Pages
				if (window.location.hostname.includes('github.io')) {
					window.location.href = '/Web-Project/HTML_codes/Services.html';
				} else {
					window.location.href = './HTML_codes/Services.html';
				}
			}
		});

		// Click outside closes dropdown
		$(document).on('click', (e) => {
			if (!$servicesLink.is(e.target) && !$servicesDropdown.has(e.target).length) {
				$servicesDropdown.removeClass('visible');
			}
		});

		// Service link clicks - close dropdown and navigate
		$('.Service-column a').off('click').on('click', function (e) {
			e.preventDefault();
			$servicesDropdown.removeClass('visible');
			let href = $(this).attr('href');
			window.location.href = href;
		});
	}

	// --- MOBILE MODE ---
	function enableMobileServices() {
		$servicesLink.off();
		$servicesDropdown.removeClass('visible');

		// Direct navigation on first click
		$servicesLink.on('click', function () {
			// Check if on GitHub Pages
			if (window.location.hostname.includes('github.io')) {
				window.location.href = '/Web-Project/HTML_codes/Services.html';
			} else {
				window.location.href = './HTML_codes/Services.html';
			}
		});
	}

	// --- SWITCH BEHAVIOR ---
	function updateServicesBehavior() {
		isMobile ? enableMobileServices() : enableDesktopServices();
	}
	updateServicesBehavior();


	// =====================================================
	// PROFILE DROPDOWN (DESKTOP ONLY)
	// =====================================================
	let $profileDropdown = $('.profile-dropdown');

	if ($profileDropdown.length) {
		let $img = $profileDropdown.find('img');
		$img.on('click', () => $profileDropdown.toggleClass('open'));

		$(document).on('click', (e) => {
			if (!$profileDropdown.has(e.target).length) {
				$profileDropdown.removeClass('open');
			}
		});
	}


	// =====================================================
	// SMOOTH SCROLL
	// =====================================================
	$('a[href^="#"]').on('click', function (e) {
		let href = $(this).attr('href');
		if (href !== '#' && $(href).length) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: $(href).offset().top }, 500);
		}
	});


	// Theme updates across tabs
	window.addEventListener('storage', function (e) {
		if (e.key === 'gc_theme_mode') applyGlobalTheme();
	});

});


// =====================================================
// AUTH SYSTEM (LOGIN/LOGOUT + SYNC + PROFILE)
// =====================================================
document.addEventListener('DOMContentLoaded', function () {

	let currentUser = localStorage.getItem('gc_current_user');

	if (currentUser) {
		let sessionUser = JSON.parse(currentUser);
		let storedUser = JSON.parse(localStorage.getItem('gc_user_' + sessionUser.email));

		if (storedUser) {
			showLoggedInUI(storedUser);
			setupLogout();
			updateProfileAvatar(storedUser);
			syncProfileName(storedUser);
		}
	} else {
		showLoggedOutUI();
	}


	// =====================================================
	// UI UPDATES
	// =====================================================
	function showLoggedInUI(user) {
		document.querySelector('.Login-Signup')?.style.setProperty('display', 'none');
		document.querySelector('.profile-dropdown')?.style.setProperty('display', 'flex');
		document.getElementById('user-name').textContent = user.name;

		// Show all mobile menu items
		let mobileItems = document.querySelectorAll('.mobile-auth');
		mobileItems.forEach(item => item.style.display = 'list-item');
	}

	function showLoggedOutUI() {
		document.querySelector('.Login-Signup')?.style.setProperty('display', 'flex');
		document.querySelector('.profile-dropdown')?.style.setProperty('display', 'none');

		let mobileItems = document.querySelectorAll('.mobile-auth');
		mobileItems.forEach(item => {
			let isLogout = item.querySelector('#logout-link-mobile');
			item.style.display = isLogout ? 'none' : 'list-item';
		});
	}


	// =====================================================
	// LOGOUT SYSTEM
	// =====================================================
	function setupLogout() {
		document.getElementById('logout-link')?.addEventListener('click', logout);
		document.getElementById('logout-link-mobile')?.addEventListener('click', logout);
	}

	function logout() {
		localStorage.removeItem('gc_current_user');
		document.querySelector('.nav-bar')?.classList.remove('nav-open');
		window.location.href = 'index.html';
	}


	// =====================================================
	// PROFILE AVATAR SYNC
	// =====================================================
	function updateProfileAvatar(user) {
		$.getJSON("../JS_codes/data.json", function (data) {
			let avatarSeed = data.avatars[user.avatarIndex]?.seed || 'Avatar_001';
			let url = `https://robohash.org/${encodeURIComponent(avatarSeed)}?size=32x32&set=set1`;
			document.getElementById('nav-avatar').src = url;
		});
	}

	// =====================================================
	// AUTO-SYNC PROFILE NAME
	// =====================================================
	function syncProfileName(user) {
		setInterval(() => {
			let stored = JSON.parse(localStorage.getItem('gc_user_' + user.email));
			if (stored && stored.name !== user.name) {
				document.getElementById('user-name').textContent = stored.name;
				user.name = stored.name;
			}
		}, 120);
	}

});

$.getJSON("../JS_codes/data.json", function(data) {
    console.log(data);
});
