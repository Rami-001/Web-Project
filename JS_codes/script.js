// ========== APPLY SAVED THEME ON PAGE LOAD ==========
function applyGlobalTheme() {
	let savedTheme = localStorage.getItem('gc_theme_mode') || 'dark';
	if (savedTheme === 'light') {
		document.body.classList.add('light-mode');
	} else {
		document.body.classList.remove('light-mode');
	}
}

// Apply theme immediately before DOM ready
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

        $toggle.on('click', function () {
            $header.hasClass('nav-open') ? closeMenu() : openMenu();
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $header.hasClass('nav-open')) {
                closeMenu();
            }
        });

        $(document).on('click', function (e) {
            if ($header.hasClass('nav-open') && !$header.has(e.target).length && !$toggle.is(e.target)) {
                closeMenu();
            }
        });

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
        
        $(window).on('resize', function () {
            isMobile = $(this).width() <= 960;
        });

        $servicesLink.on('mouseenter', function () {
            if (!isMobile) {
                clearTimeout(hideTimeout);
                $dropdownMenu.addClass('visible');
            }
        });

        $servicesLink.on('mouseleave', function () {
            if (!isMobile) {
                hideTimeout = setTimeout(() => {
                    $dropdownMenu.removeClass('visible');
                }, 500);
            }
        });

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

        let dropdownOpenedOnce = false;
        $servicesLink.on('click', function (e) {
            if (!$dropdownMenu.hasClass('visible')) {
                e.preventDefault();
                $dropdownMenu.addClass('visible');
                dropdownOpenedOnce = true;
                return;
            }
            if (dropdownOpenedOnce) {
                window.location.href = 'Services.html';
            }
        });

        $(document).on('click', function (e) {
            if (!$servicesLink.is(e.target) && !$dropdownMenu.has(e.target).length) {
                $dropdownMenu.removeClass('visible');
                dropdownOpenedOnce = false;
            }
        });

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

	// Listen for theme changes
	window.addEventListener('themeChanged', function(e) {
		applyGlobalTheme();
	});

	// Listen for storage changes from other tabs
	window.addEventListener('storage', function(e) {
		if (e.key === 'gc_theme_mode') {
			applyGlobalTheme();
		}
	});
});

// ========== GLOBAL AUTH & PROFILE SYNC ==========
document.addEventListener('DOMContentLoaded', function() {
	let currentUser = localStorage.getItem('gc_current_user');
	
	if (currentUser) {
		let user = JSON.parse(currentUser);
		let storedUser = JSON.parse(localStorage.getItem('gc_user_' + user.email));

		if (storedUser) {
			showLoggedInUI(user, storedUser);
			setupLogout();
			syncProfileData(user, storedUser);
			startContinuousSync(user, storedUser);
		}
	} else {
		showLoggedOutUI();
	}

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

	function showLoggedOutUI() {
		let welcomeEl = document.getElementById('welcome-user');
		let loginSignupDiv = document.querySelector('.Login-Signup');
		let profileDropdown = document.querySelector('.profile-dropdown');

		if (loginSignupDiv) loginSignupDiv.style.display = 'flex';
		if (profileDropdown) profileDropdown.style.display = 'none';
		if (welcomeEl) welcomeEl.style.display = 'none';
	}

	function syncProfileData(userSession, userStored) {
		$.getJSON('../JS_codes/data.json', function(data) {
			let avatarList = data.avatars || [];
			let avatarIndex = userStored.avatarIndex || 0;
			let avatarSeed = avatarList[avatarIndex]?.seed || 'Avatar_001';
			let avatarUrl = 'https://robohash.org/' + encodeURIComponent(avatarSeed) + '?size=32x32&set=set1';

			let navAvatar = document.getElementById('nav-avatar');
			if (navAvatar) {
				navAvatar.src = avatarUrl;
			}

			let userNameEl = document.getElementById('user-name');
			if (userNameEl) {
				userNameEl.textContent = userStored.name;
			}
		});
	}

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

	function startContinuousSync(userSession, userStored) {
		setInterval(function() {
			let currentUser = localStorage.getItem('gc_current_user');
			if (!currentUser) return;

			let user = JSON.parse(currentUser);
			let storedUser = JSON.parse(localStorage.getItem('gc_user_' + user.email));

			if (!storedUser) return;

			let userNameEl = document.getElementById('user-name');
			if (userNameEl && userNameEl.textContent !== storedUser.name) {
				userNameEl.textContent = storedUser.name;
			}
		}, 100);
	}

	// ========== LISTEN FOR PROFILE UPDATES ==========
	window.addEventListener('profileUpdated', function(e) {
		console.log('Profile updated:', e.detail.name);
		let currentUser = localStorage.getItem('gc_current_user');
		if (!currentUser) return;

		let user = JSON.parse(currentUser);
		if (e.detail.email === user.email) {
			let navAvatar = document.getElementById('nav-avatar');
			let userNameEl = document.getElementById('user-name');

			if (navAvatar && e.detail.avatarSeed) {
				let avatarUrl = 'https://robohash.org/' + encodeURIComponent(e.detail.avatarSeed) + '?size=32x32&set=set1';
				navAvatar.src = avatarUrl;
			}

			if (userNameEl && e.detail.name) {
				userNameEl.textContent = e.detail.name;
			}

			// Update session storage
			user.name = e.detail.name;
			user.avatarIndex = e.detail.avatarIndex;
			localStorage.setItem('gc_current_user', JSON.stringify(user));
		}
	});

	window.addEventListener('storage', function(e) {
		if (e.key && e.key.startsWith('gc_user_')) {
			let currentUser = localStorage.getItem('gc_current_user');
			if (currentUser) {
				let user = JSON.parse(currentUser);
				let storedUser = JSON.parse(e.newValue);

				if (storedUser && storedUser.email === user.email) {
					$.getJSON('../JS_codes/data.json', function(data) {
						let avatarList = data.avatars || [];
						let avatarIndex = storedUser.avatarIndex || 0;
						let avatarSeed = avatarList[avatarIndex]?.seed || 'Avatar_001';
						let avatarUrl = 'https://robohash.org/' + encodeURIComponent(avatarSeed) + '?size=32x32&set=set1';

						let navAvatar = document.getElementById('nav-avatar');
						if (navAvatar) {
							navAvatar.src = avatarUrl;
						}

						let userNameEl = document.getElementById('user-name');
						if (userNameEl) {
							userNameEl.textContent = storedUser.name;
						}
					});
				}
			}
		}

		if (e.key === 'gc_dark_mode') {
			applyGlobalTheme();
		}
	});
});

// ========== THEME LISTENER ==========
window.addEventListener('storage', function(e) {
	if (e.key === 'gc_dark_mode') {
		applyGlobalTheme();
	}
});



