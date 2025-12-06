$(document).ready(function() {
	let loginForm = $('#login-form');
	let signupForm = $('#signup-form');
	let logoutLink = $('#logout-link');
	let mobileLogoutLink = $('#mobile-logout');
	let mobileLoginLink = $('#mobile-login');
	let mobileRegisterLink = $('#mobile-register');
	let navAvatar = $('#nav-avatar');
	let welcomeUser = $('#welcome-user');
	let loginSignupDiv = $('.Login-Signup');
	let profileDropdown = $('.profile-dropdown');
	let userName = $('#user-name');

	updateAuthUI();
	if (signupForm.length) {
		signupForm.on('submit', function(e) {
			e.preventDefault();
			
			let name = $('#signup-name').val().trim();
			let email = $('#signup-email').val().trim();
			let password = $('#signup-password').val().trim();
			let confirmPassword = $('#signup-confirm').val().trim();
			let msgEl = $('#signup-msg');

			// Validate inputs exist
			if (!name || !email || !password || !confirmPassword) {
				msgEl.text('Please fill in all fields.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			// Email validation
			let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				msgEl.text('Please enter a valid email.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			// Password length validation
			if (password.length < 6) {
				msgEl.text('Password must be at least 6 characters.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			// Password match validation
			if (password !== confirmPassword) {
				msgEl.text('Passwords do not match.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			// Check if user already exists
			let existingUser = localStorage.getItem('gc_user_' + email);
			if (existingUser) {
				msgEl.text('Email already registered. Try logging in.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			// Load avatars and assign random one
			$.getJSON("../JS_codes/data.json", function(data) {
				let avatarList = data.avatars || [];
				let randomAvatarIndex = Math.floor(Math.random() * avatarList.length);

				let newUser = {
					name: name,
					email: email,
					password: password,
					createdAt: new Date().toISOString(),
					avatarIndex: randomAvatarIndex
				};

				localStorage.setItem('gc_user_' + email, JSON.stringify(newUser));

				msgEl.text('Account created successfully! Redirecting to login...');
				msgEl.removeClass('error').addClass('success');

				setTimeout(() => {
					window.location.href = 'login.html';
				}, 1500);
			});
		});
	}

	// ========== LOGIN ==========
	if (loginForm.length) {
		loginForm.on('submit', function(e) {
			e.preventDefault();
			
			let email = $('#login-email').val().trim();
			let password = $('#login-password').val().trim();
			let msgEl = $('#login-msg');

			if (!email || !password) {
				msgEl.text('Please fill in all fields.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			let storedUser = localStorage.getItem('gc_user_' + email);
			
			if (!storedUser) {
				msgEl.text('User not found. Please sign up first.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			let user = JSON.parse(storedUser);

			if (user.password !== password) {
				msgEl.text('Incorrect password.');
				msgEl.removeClass('success').addClass('error');
				return;
			}

			// Store full user data including avatar
			let sessionUser = {
				email: user.email,
				name: user.name,
				avatarIndex: user.avatarIndex || 0,
				loginTime: new Date().toISOString()
			};

			localStorage.setItem('gc_current_user', JSON.stringify(sessionUser));

			msgEl.text('Login successful! Redirecting...');
			msgEl.removeClass('error').addClass('success');

			setTimeout(() => {
				window.location.href = 'index.html';
			}, 1500);
		});
	}

	// ========== LOGOUT ==========
	if (logoutLink.length) {
		logoutLink.on('click', function(e) {
			e.preventDefault();
			localStorage.removeItem('gc_current_user');
			window.location.href = 'index.html';
		});
	}
	
	if (mobileLogoutLink.length) {
		mobileLogoutLink.on('click', function(e) {
			e.preventDefault();
			localStorage.removeItem('gc_current_user');
			window.location.href = 'index.html';
		});
	}

	// ========== UPDATE UI ==========
	function updateAuthUI() {
		let currentUser = localStorage.getItem('gc_current_user');

		if (currentUser) {
			let user = JSON.parse(currentUser);

			// Show logged-in UI
			loginSignupDiv.hide();
			welcomeUser.show();
			profileDropdown.css('display', 'flex');
			mobileLoginLink.hide();
			mobileRegisterLink.hide();
			mobileLogoutLink.show();
			userName.text(user.name);

			// Set avatar using RoboHash
			navAvatar.attr('src', 'https://robohash.org/' + encodeURIComponent(user.email) + '?size=32x32&set=set1');
			navAvatar.attr('alt', 'Avatar for ' + user.name);
		} else {
			// Show logged-out UI
			loginSignupDiv.show();
			welcomeUser.hide();
			profileDropdown.hide();
			mobileLoginLink.show();
			mobileRegisterLink.show();
			mobileLogoutLink.hide();
		}
	}
});
