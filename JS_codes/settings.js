// Settings page handler - client-side only, fully functional

document.addEventListener('DOMContentLoaded', function() {
	console.log('Settings.js loaded');
	
	let currentUser = localStorage.getItem('gc_current_user');
	
	// Redirect if not logged in
	if (!currentUser) {
		console.log('No current user, redirecting to login');
		window.location.href = 'login.html';
		return;
	}

	let user = JSON.parse(currentUser);
	let storedUser = JSON.parse(localStorage.getItem('gc_user_' + user.email));

	if (!storedUser) {
		console.log('No stored user found, redirecting to login');
		window.location.href = 'login.html';
		return;
	}

	console.log('User loaded:', storedUser.name);

	let avatarList = [];

	// Load avatars from JSON
	fetch('../JS_codes/data.json')
		.then(response => response.json())
		.then(data => {
			avatarList = data.avatars || [];
			console.log('Avatars loaded:', avatarList.length);
			
			// Initialize avatar index if needed
			if (storedUser.avatarIndex === undefined) {
				storedUser.avatarIndex = Math.floor(Math.random() * avatarList.length);
				localStorage.setItem('gc_user_' + storedUser.email, JSON.stringify(storedUser));
			}

			// Load all UI elements
			loadProfileData(user, storedUser, avatarList);
			setupUpdateNameBtn(user, storedUser, avatarList);
			setupUpdatePasswordBtn(user, storedUser);
			setupDeleteAccountBtn(user, storedUser);
			setupThemeToggle();
			setupAvatarCycler(storedUser, avatarList);
		})
		.catch(error => console.error('Error loading data.json:', error));

	// ========== LOAD PROFILE DATA ==========
	function loadProfileData(userSession, userStored, avatars) {
		console.log('Loading profile data...');
		
		let profileName = document.getElementById('profile-name');
		let profileEmail = document.getElementById('profile-email');
		let profileAvatar = document.getElementById('profile-avatar');
		let settingsEmail = document.getElementById('settings-email');
		let settingsName = document.getElementById('settings-name');
		let navAvatar = document.getElementById('nav-avatar');

		// Set profile display name
		if (profileName) {
			profileName.textContent = userStored.name;
			console.log('Profile name set to:', userStored.name);
		}
		
		if (profileEmail) {
			profileEmail.textContent = userStored.email;
		}
		
		// Get avatar
		let avatarIndex = userStored.avatarIndex || 0;
		let avatarSeed = avatars[avatarIndex]?.seed || 'Avatar_001';
		let avatarUrl = 'https://robohash.org/' + encodeURIComponent(avatarSeed) + '?size=80x80&set=set1';
		
		if (profileAvatar) {
			profileAvatar.src = avatarUrl;
			profileAvatar.alt = 'Avatar for ' + userStored.name;
			console.log('Profile avatar set to:', avatarUrl);
		}
		
		// Update nav avatar too
		if (navAvatar) {
			navAvatar.src = 'https://robohash.org/' + encodeURIComponent(avatarSeed) + '?size=32x32&set=set1';
			navAvatar.alt = 'Avatar for ' + userStored.name;
		}
		
		// Set form inputs
		if (settingsEmail) settingsEmail.value = userStored.email;
		if (settingsName) settingsName.value = userStored.name;
	}

	// ========== AVATAR CYCLER ==========
	function setupAvatarCycler(userStored, avatars) {
		let editAvatarBtn = document.querySelector('.avatar-edit-btn');
		let profileAvatar = document.getElementById('profile-avatar');
		let navAvatar = document.getElementById('nav-avatar');

		if (editAvatarBtn && profileAvatar && avatars.length > 0) {
			editAvatarBtn.addEventListener('click', function(e) {
				e.preventDefault();
				console.log('Avatar edit button clicked');
				
				// Move to next avatar
				userStored.avatarIndex = (userStored.avatarIndex + 1) % avatars.length;
				
				// Fade out
				profileAvatar.style.transition = 'opacity 0.3s ease';
				profileAvatar.style.opacity = '0.3';
				
				// Update after fade
				setTimeout(function() {
					let avatarSeed = avatars[userStored.avatarIndex].seed;
					let newAvatarUrl = 'https://robohash.org/' + encodeURIComponent(avatarSeed) + '?size=80x80&set=set1';
					
					profileAvatar.src = newAvatarUrl;
					console.log('Avatar updated to:', avatarSeed);
					
					if (navAvatar) {
						navAvatar.src = 'https://robohash.org/' + encodeURIComponent(avatarSeed) + '?size=32x32&set=set1';
					}
					
					profileAvatar.style.opacity = '1';
				}, 150);
				
				// Save to localStorage
				localStorage.setItem('gc_user_' + userStored.email, JSON.stringify(userStored));
				
				// Broadcast change to other pages
				window.dispatchEvent(new CustomEvent('profileUpdated', {
					detail: { 
						email: userStored.email,
						name: userStored.name,
						avatarIndex: userStored.avatarIndex,
						avatarSeed: avatars[userStored.avatarIndex].seed
					}
				}));
			});
		}
	}

	// ========== UPDATE NAME ==========
	function setupUpdateNameBtn(userSession, userStored, avatars) {
		let btn = document.getElementById('update-name-btn');
		let msgEl = document.getElementById('profile-msg');
		let nameInput = document.getElementById('settings-name');
		let profileName = document.getElementById('profile-name');

		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				console.log('Update name button clicked');
				
				let newName = nameInput.value.trim();

				if (!newName) {
					msgEl.textContent = 'Name cannot be empty.';
					msgEl.className = 'settings-msg error';
					return;
				}

				if (newName === userStored.name) {
					msgEl.textContent = 'Please enter a different name.';
					msgEl.className = 'settings-msg error';
					return;
				}

				// Update stored user
				userStored.name = newName;
				localStorage.setItem('gc_user_' + userStored.email, JSON.stringify(userStored));

				// Update current session
				userSession.name = newName;
				localStorage.setItem('gc_current_user', JSON.stringify(userSession));

				// Update display name immediately
				if (profileName) {
					profileName.textContent = newName;
				}

				msgEl.textContent = 'Name updated successfully!';
				msgEl.className = 'settings-msg success';

				console.log('Name updated to:', newName);

				// Broadcast update to all pages
				let avatarSeed = avatars[userStored.avatarIndex]?.seed || 'Avatar_001';
				window.dispatchEvent(new CustomEvent('profileUpdated', {
					detail: {
						email: userStored.email,
						name: newName,
						avatarIndex: userStored.avatarIndex,
						avatarSeed: avatarSeed
					}
				}));

				setTimeout(() => {
					msgEl.textContent = '';
				}, 1500);
			});
		}
	}

	// ========== UPDATE PASSWORD ==========
	function setupUpdatePasswordBtn(userSession, userStored) {
		let btn = document.getElementById('update-password-btn');
		let msgEl = document.getElementById('password-msg');
		let oldPwd = document.getElementById('current-password');
		let newPwd = document.getElementById('new-password');
		let confirmPwd = document.getElementById('confirm-password');

		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				console.log('Update password button clicked');
				
				let oldPassword = oldPwd.value.trim();
				let newPassword = newPwd.value.trim();
				let confirmPassword = confirmPwd.value.trim();

				msgEl.textContent = '';
				msgEl.className = 'settings-msg';

				if (!oldPassword || !newPassword || !confirmPassword) {
					msgEl.textContent = 'All password fields are required.';
					msgEl.className = 'settings-msg error';
					return;
				}

				let freshStoredUser = JSON.parse(localStorage.getItem('gc_user_' + userStored.email));
				
				if (freshStoredUser.password !== oldPassword) {
					msgEl.textContent = 'Current password is incorrect.';
					msgEl.className = 'settings-msg error';
					return;
				}

				if (newPassword.length < 6) {
					msgEl.textContent = 'New password must be at least 6 characters.';
					msgEl.className = 'settings-msg error';
					return;
				}

				if (newPassword !== confirmPassword) {
					msgEl.textContent = 'New passwords do not match.';
					msgEl.className = 'settings-msg error';
					return;
				}

				if (newPassword === oldPassword) {
					msgEl.textContent = 'New password must be different from current password.';
					msgEl.className = 'settings-msg error';
					return;
				}

				freshStoredUser.password = newPassword;
				localStorage.setItem('gc_user_' + freshStoredUser.email, JSON.stringify(freshStoredUser));

				msgEl.textContent = 'Password changed successfully!';
				msgEl.className = 'settings-msg success';

				oldPwd.value = '';
				newPwd.value = '';
				confirmPwd.value = '';

				console.log('Password updated');

				setTimeout(() => {
					msgEl.textContent = '';
				}, 2000);
			});
		}
	}

	// ========== DELETE ACCOUNT ==========
	function setupDeleteAccountBtn(userSession, userStored) {
		let btn = document.getElementById('delete-account-btn');
		let msgEl = document.getElementById('danger-msg');

		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				console.log('Delete account button clicked');
				
				let confirmed = window.confirm(
					'Are you absolutely sure? This action cannot be undone.\n\nAll your data will be permanently deleted.'
				);
				
				if (!confirmed) {
					msgEl.textContent = '';
					return;
				}

				let userConfirmation = window.prompt(
					'Type DELETE (in uppercase) to confirm permanent account deletion:'
				);
				
				if (userConfirmation !== 'DELETE') {
					msgEl.textContent = 'Confirmation failed. Account not deleted.';
					msgEl.className = 'settings-msg error';
					return;
				}

				localStorage.removeItem('gc_user_' + userStored.email);
				localStorage.removeItem('gc_current_user');

				msgEl.textContent = 'Account deleted permanently. Redirecting...';
				msgEl.className = 'settings-msg success';

				console.log('Account deleted');

				setTimeout(() => {
					window.location.href = 'index.html';
				}, 1500);
			});
		}
	}

	// ========== THEME TOGGLE ==========
	function setupThemeToggle() {
		let themeSelect = document.getElementById('theme-select');
		let msgEl = document.getElementById('preferences-msg');

		if (themeSelect) {
			// Get saved theme (default to dark)
			let savedTheme = localStorage.getItem('gc_theme_mode') || 'dark';
			themeSelect.value = savedTheme;
			applyTheme(savedTheme);

			themeSelect.addEventListener('change', function() {
				let selectedTheme = this.value;
				localStorage.setItem('gc_theme_mode', selectedTheme);
				applyTheme(selectedTheme);
				
				msgEl.textContent = selectedTheme === 'light' ? 'Light mode enabled' : 'Dark mode enabled';
				msgEl.className = 'settings-msg ok';
				
				console.log('Theme changed to:', selectedTheme);
				
				// Broadcast to other pages
				window.dispatchEvent(new CustomEvent('themeChanged', {
					detail: { mode: selectedTheme }
				}));
				
				setTimeout(() => {
					msgEl.textContent = '';
				}, 2000);
			});
		}
	}

	function applyTheme(theme) {
		if (theme === 'light') {
			document.documentElement.classList.add('light-mode');
			document.body.classList.add('light-mode');
		} else {
			document.documentElement.classList.remove('light-mode');
			document.body.classList.remove('light-mode');
		}
	}

	// Apply saved theme on page load
	let savedTheme = localStorage.getItem('gc_theme_mode') || 'dark';
	applyTheme(savedTheme);

	// Listen for theme changes from other tabs/windows
	window.addEventListener('themeChanged', function(e) {
		console.log('Theme changed event received:', e.detail.mode);
		applyTheme(e.detail.mode);
	});

	// Listen for profile updates from other tabs/windows
	window.addEventListener('profileUpdated', function(e) {
		console.log('Profile updated event received:', e.detail.name);
		let profileName = document.getElementById('profile-name');
		let profileAvatar = document.getElementById('profile-avatar');
		
		if (profileName && e.detail.name) {
			profileName.textContent = e.detail.name;
		}
		
		if (profileAvatar && e.detail.avatarSeed) {
			let avatarUrl = 'https://robohash.org/' + encodeURIComponent(e.detail.avatarSeed) + '?size=80x80&set=set1';
			profileAvatar.src = avatarUrl;
		}
	});
});
