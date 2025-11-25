// ========== APPLY DARK MODE ON PAGE LOAD ==========
function applyGlobalTheme() {
	let savedTheme = localStorage.getItem('gc_dark_mode');
	let isDark = savedTheme !== 'false'; // default to dark
	
	if (isDark) {
		document.body.classList.remove('light-mode');
	} else {
		document.body.classList.add('light-mode');
	}
}

// Apply theme immediately before other scripts load
applyGlobalTheme();

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
    // =========================
    // PROFILE DROPDOWN
    // =========================
    let $profileDropdown = $('.profile-dropdown');
    if ($profileDropdown.length) {
        let $profileImg = $profileDropdown.find('img');
        $profileImg.on('click', function () {
            $profileDropdown.toggleClass('open');
        });
        // Close when clicking outside
        $(document).on('click', function (e) {
            if (!$profileDropdown.has(e.target).length) {
                $profileDropdown.removeClass('open');
            }
        });
    }
    // =========================
    // SMOOTH SCROLL
    // =========================
    $('a[href^="#"]').on('click', function (e) {
        let href = $(this).attr('href');
        if (href !== '#' && $(href).length) {
            e.preventDefault();
            let target = $(href);
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 500);
        }
    });
    // =========================
    // DEMO FORM PREVENTION
    // =========================
    let $demoForms = $('form[data-demo]');
    $demoForms.on('submit', function (e) {
        e.preventDefault();
        alert('Demo form - no backend submission');
    });
});

// ========== GLOBAL AVATAR SYNC ==========
document.addEventListener('DOMContentLoaded', function() {
	let currentUser = localStorage.getItem('gc_current_user');
	
	if (currentUser) {
		let user = JSON.parse(currentUser);
		let storedUser = JSON.parse(localStorage.getItem('gc_user_' + user.email));

		if (storedUser) {
			// Update UI to show logged-in state
			showLoggedInUI(user, storedUser);
			setupLogout();
			syncProfileData(user, storedUser);
			startContinuousSync(user);
		}
	} else {
		showLoggedOutUI();
	}

	// ========== SHOW LOGGED-IN UI ==========
	function showLoggedInUI(userSession, userStored) {
		let welcomeEl = document.getElementById('welcome-user');
		let userNameEl = document.getElementById('user-name');
		let loginSignupDiv = document.querySelector('.Login-Signup');
		let profileDropdown = document.querySelector('.profile-dropdown');

		if (loginSignupDiv) loginSignupDiv.style.display = 'none';
		if (profileDropdown) profileDropdown.style.display = 'flex';
		if (userNameEl) userNameEl.textContent = userStored.name;
		if (welcomeEl) welcomeEl.style.display = 'inline';
	}

	// ========== SHOW LOGGED-OUT UI ==========
	function showLoggedOutUI() {
		let welcomeEl = document.getElementById('welcome-user');
		let loginSignupDiv = document.querySelector('.Login-Signup');
		let profileDropdown = document.querySelector('.profile-dropdown');

		if (loginSignupDiv) loginSignupDiv.style.display = 'flex';
		if (profileDropdown) profileDropdown.style.display = 'none';
		if (welcomeEl) welcomeEl.style.display = 'none';
	}

	// ========== SYNC PROFILE DATA & AVATAR ==========
	function syncProfileData(userSession, userStored) {
		// Generate avatar list
		let avatarList = [];
		for (let i = 1; i <= 100; i++) {
			avatarList.push('avatar_' + i);
		}

		// Get current avatar index
		let avatarIndex = userStored.avatarIndex || 0;
		let currentAvatarId = avatarList[avatarIndex];
		let avatarUrl = 'https://robohash.org/' + encodeURIComponent(currentAvatarId) + '?size=32x32&set=set1';

		// Update nav avatar
		let navAvatar = document.getElementById('nav-avatar');
		if (navAvatar) {
			navAvatar.src = avatarUrl;
			navAvatar.setAttribute('data-avatar-sync', 'true');
			navAvatar.setAttribute('data-user-email', userStored.email);
		}

		// Update user name
		let userNameEl = document.getElementById('user-name');
		if (userNameEl) {
			userNameEl.textContent = userStored.name;
		}
	}

	// ========== SETUP LOGOUT ==========
	function setupLogout() {
		let logoutLink = document.getElementById('logout-link');
		if (logoutLink) {
			logoutLink.addEventListener('click', function(e) {
				e.preventDefault();
				localStorage.removeItem('gc_current_user');
				window.location.href = 'index.html';
			});
		}
	}

	// ========== CONTINUOUS SYNC - CHECK EVERY 100ms ==========
	function startContinuousSync(userSession) {
		let lastAvatarIndex = userSession.avatarIndex || 0;
		let lastName = userSession.name || '';

		setInterval(function() {
			let currentUser = localStorage.getItem('gc_current_user');
			if (!currentUser) return;

			let user = JSON.parse(currentUser);
			let storedUser = JSON.parse(localStorage.getItem('gc_user_' + user.email));

			if (!storedUser) return;

			// Generate avatar list
			let avatarList = [];
			for (let i = 1; i <= 100; i++) {
				avatarList.push('avatar_' + i);
			}

			let currentAvatarIndex = storedUser.avatarIndex || 0;
			let currentName = storedUser.name || '';

			// Avatar changed
			if (currentAvatarIndex !== lastAvatarIndex) {
				lastAvatarIndex = currentAvatarIndex;
				let currentAvatarId = avatarList[currentAvatarIndex];
				let avatarUrl = 'https://robohash.org/' + encodeURIComponent(currentAvatarId) + '?size=32x32&set=set1';

				let navAvatar = document.getElementById('nav-avatar');
				if (navAvatar) {
					navAvatar.src = avatarUrl;
				}
			}

			// Name changed
			if (currentName !== lastName) {
				lastName = currentName;
				let userNameEl = document.getElementById('user-name');
				if (userNameEl) {
					userNameEl.textContent = currentName;
				}
			}
		}, 100); // Check every 100 milliseconds
	}

	// ========== LISTEN FOR STORAGE CHANGES FROM OTHER TABS ==========
	window.addEventListener('storage', function(e) {
		if (e.key && e.key.startsWith('gc_user_')) {
			let currentUser = localStorage.getItem('gc_current_user');
			if (currentUser) {
				let user = JSON.parse(currentUser);
				let storedUser = JSON.parse(e.newValue);

				if (storedUser && storedUser.email === user.email) {
					// Generate avatar list
					let avatarList = [];
					for (let i = 1; i <= 100; i++) {
						avatarList.push('avatar_' + i);
					}

					let avatarIndex = storedUser.avatarIndex || 0;
					let currentAvatarId = avatarList[avatarIndex];
					let avatarUrl = 'https://robohash.org/' + encodeURIComponent(currentAvatarId) + '?size=32x32&set=set1';

					// Update nav avatar instantly
					let navAvatar = document.getElementById('nav-avatar');
					if (navAvatar) {
						navAvatar.src = avatarUrl;
					}

					// Update name instantly
					let userNameEl = document.getElementById('user-name');
					if (userNameEl) {
						userNameEl.textContent = storedUser.name;
					}
				}
			}
		}

		// ========== APPLY THEME ON ALL PAGES ==========
		function applyGlobalTheme() {
			let savedTheme = localStorage.getItem('gc_dark_mode');
			let isDark = savedTheme !== 'false';
			
			if (isDark) {
				document.body.classList.remove('light-mode');
			} else {
				document.body.classList.add('light-mode');
			}
		}

		// Apply theme immediately
		applyGlobalTheme();

		// Listen for theme changes from other tabs
		window.addEventListener('storage', function(e) {
			if (e.key === 'gc_dark_mode') {
				applyGlobalTheme();
			}
		});
	});

	// ========== LISTEN FOR CUSTOM AVATAR EVENTS ==========
	window.addEventListener('avatarChanged', function(e) {
		let currentUser = localStorage.getItem('gc_current_user');
		if (currentUser) {
			let user = JSON.parse(currentUser);
			if (e.detail.email === user.email) {
				let avatarUrl = 'https://robohash.org/' + encodeURIComponent(e.detail.avatar) + '?size=32x32&set=set1';
				let navAvatar = document.getElementById('nav-avatar');
				if (navAvatar) {
					navAvatar.src = avatarUrl;
				}
			}
		}
	});

	// ========== SERVICES DROPDOWN ==========
	let dropdown = document.querySelector('.dropdown');
	let dropdownContent = document.querySelector('.dropdown-content');

	if (dropdown && dropdownContent) {
		dropdown.addEventListener('mouseenter', function() {
			dropdownContent.classList.add('visible');
		});

		dropdown.addEventListener('mouseleave', function() {
			dropdownContent.classList.remove('visible');
		});
	}

	// ========== PROFILE DROPDOWN ==========
	let profileDropdown = document.querySelector('.profile-dropdown');
	if (profileDropdown) {
		profileDropdown.addEventListener('click', function(e) {
			if (e.target === this || e.target.tagName === 'IMG') {
				this.classList.toggle('open');
			}
		});
	}

	// Close dropdowns when clicking elsewhere
	document.addEventListener('click', function(e) {
		if (profileDropdown && !profileDropdown.contains(e.target)) {
			profileDropdown.classList.remove('open');
		}
	});
});



