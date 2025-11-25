// Settings page handler - client-side only, fully functional

document.addEventListener('DOMContentLoaded', function() {
	let currentUser = localStorage.getItem('gc_current_user');
	
	// Redirect if not logged in
	if (!currentUser) {
		window.location.href = 'login.html';
		return;
	}

	let user = JSON.parse(currentUser);
	let storedUser = JSON.parse(localStorage.getItem('gc_user_' + user.email));

	if (!storedUser) {
		window.location.href = 'login.html';
		return;
	}

	// Array of 100 avatar identifiers
	let avatarList = generateAvatarList();
	
	// Initialize current avatar index
	if (storedUser.avatarIndex === undefined) {
		storedUser.avatarIndex = 0;
		localStorage.setItem('gc_user_' + storedUser.email, JSON.stringify(storedUser));
	}

	// Initialize plan if not exists
	if (!storedUser.plan) {
		storedUser.plan = 'Starter';
		localStorage.setItem('gc_user_' + storedUser.email, JSON.stringify(storedUser));
	}

	// Load profile data
	loadProfileData(user, storedUser, avatarList);

	// Setup event listeners
	setupUpdateNameBtn(user, storedUser, avatarList);
	setupUpdatePasswordBtn(user, storedUser);
	setupDeleteAccountBtn(user, storedUser);
	setupThemeToggle();
	setupAvatarCycler(storedUser, avatarList);

	// ========== GENERATE 100 AVATARS ==========
	function generateAvatarList() {
		let avatars = [];
		for (let i = 1; i <= 100; i++) {
			avatars.push('avatar_' + i);
		}
		return avatars;
	}

	// ========== LOAD PROFILE DATA ==========
	function loadProfileData(userSession, userStored, avatars) {
		let profileName = document.getElementById('profile-name');
		let profileEmail = document.getElementById('profile-email');
		let settingsAvatar = document.getElementById('settings-avatar');
		let settingsEmail = document.getElementById('settings-email');
		let settingsName = document.getElementById('settings-name');
		let navAvatar = document.getElementById('nav-avatar');

		if (profileName) profileName.textContent = userStored.name;
		if (profileEmail) profileEmail.textContent = userStored.email;
		
		let currentAvatarId = avatars[userStored.avatarIndex];
		if (settingsAvatar) {
			settingsAvatar.src = 'https://robohash.org/' + encodeURIComponent(currentAvatarId) + '?size=80x80&set=set1';
			settingsAvatar.alt = 'Avatar for ' + userStored.name;
		}
		
		if (navAvatar) {
			navAvatar.src = 'https://robohash.org/' + encodeURIComponent(currentAvatarId) + '?size=32x32&set=set1';
			navAvatar.alt = 'Avatar for ' + userStored.name;
		}
		
		if (settingsEmail) settingsEmail.value = userStored.email;
		if (settingsName) settingsName.value = userStored.name;
	}

	// ========== AVATAR CYCLER ==========
	function setupAvatarCycler(userStored, avatars) {
		let editAvatarBtn = document.getElementById('edit-avatar-btn');
		let settingsAvatar = document.getElementById('settings-avatar');
		let navAvatar = document.getElementById('nav-avatar');

		if (editAvatarBtn && settingsAvatar) {
			editAvatarBtn.addEventListener('click', function(e) {
				e.preventDefault();
				
				// Move to next avatar (cycle through 100)
				userStored.avatarIndex = (userStored.avatarIndex + 1) % avatars.length;
				
				// Fade out
				settingsAvatar.style.transition = 'opacity 0.3s ease';
				settingsAvatar.style.opacity = '0.3';
				
				// Update after fade
				setTimeout(function() {
					let newAvatarId = avatars[userStored.avatarIndex];
					let newAvatarUrl = 'https://robohash.org/' + encodeURIComponent(newAvatarId) + '?size=80x80&set=set1';
					
					// Update settings avatar
					settingsAvatar.src = newAvatarUrl;
					
					// Update nav avatar too
					if (navAvatar) {
						navAvatar.src = 'https://robohash.org/' + encodeURIComponent(newAvatarId) + '?size=32x32&set=set1';
					}

					// SYNC AVATAR GLOBALLY
					let allAvatars = document.querySelectorAll('[data-avatar-sync="true"]');
					allAvatars.forEach(avatar => {
						avatar.src = 'https://robohash.org/' + encodeURIComponent(newAvatarId) + '?size=32x32&set=set1';
					});
					
					// Fade in
					settingsAvatar.style.opacity = '1';
				}, 150);
				
				// Save to localStorage
				localStorage.setItem('gc_user_' + userStored.email, JSON.stringify(userStored));

				// Broadcast to other tabs/windows
				window.dispatchEvent(new CustomEvent('avatarChanged', { 
					detail: { avatar: avatars[userStored.avatarIndex], email: userStored.email }
				}));
			});
		}
	}

	// ========== UPDATE NAME ==========
	function setupUpdateNameBtn(userSession, userStored, avatars) {
		let btn = document.getElementById('update-name-btn');
		let msgEl = document.getElementById('name-msg');
		let nameInput = document.getElementById('settings-name');

		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				
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

				// Update name in stored user
				userStored.name = newName;
				// IMPORTANT: Preserve avatarIndex and plan when updating
				localStorage.setItem('gc_user_' + userStored.email, JSON.stringify(userStored));

				// Update current session
				userSession.name = newName;
				localStorage.setItem('gc_current_user', JSON.stringify(userSession));

				msgEl.textContent = 'Name updated successfully!';
				msgEl.className = 'settings-msg success';

				setTimeout(() => {
					msgEl.textContent = '';
					location.reload();
				}, 1500);
			});
		}
	}

	// ========== UPDATE PASSWORD ==========
	function setupUpdatePasswordBtn(userSession, userStored) {
		let btn = document.getElementById('update-pwd-btn');
		let msgEl = document.getElementById('pwd-msg');
		let oldPwd = document.getElementById('settings-old-pwd');
		let newPwd = document.getElementById('settings-new-pwd');
		let confirmPwd = document.getElementById('settings-confirm-pwd');

		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				
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

				setTimeout(() => {
					msgEl.textContent = '';
				}, 2000);
			});
		}
	}

	// ========== DELETE ACCOUNT ==========
	function setupDeleteAccountBtn(userSession, userStored) {
		let btn = document.getElementById('delete-account-btn');
		let msgEl = document.getElementById('delete-msg');

		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				
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

				setTimeout(() => {
					window.location.href = 'index.html';
				}, 1500);
			});
		}
	}

	// ========== THEME TOGGLE ==========
	function setupThemeToggle() {
		let darkBtn = document.getElementById('dark-mode-btn');
		let lightBtn = document.getElementById('light-mode-btn');

		if (darkBtn && lightBtn) {
			let savedTheme = localStorage.getItem('gc_dark_mode');
			let isDark = savedTheme !== 'false';
			
			updateThemeButtons(isDark);
			applyTheme(isDark);

			darkBtn.addEventListener('click', function(e) {
				e.preventDefault();
				localStorage.setItem('gc_dark_mode', 'true');
				updateThemeButtons(true);
				applyTheme(true);
				showThemeMessage('Dark mode enabled');
			});

			lightBtn.addEventListener('click', function(e) {
				e.preventDefault();
				localStorage.setItem('gc_dark_mode', 'false');
				updateThemeButtons(false);
				applyTheme(false);
				showThemeMessage('Light mode enabled');
			});
		}
	}

	function updateThemeButtons(isDark) {
		let darkBtn = document.getElementById('dark-mode-btn');
		let lightBtn = document.getElementById('light-mode-btn');

		if (darkBtn && lightBtn) {
			if (isDark) {
				darkBtn.classList.add('active');
				lightBtn.classList.remove('active');
			} else {
				darkBtn.classList.remove('active');
				lightBtn.classList.add('active');
			}
		}
	}

	function showThemeMessage(message) {
		let themeMsg = document.getElementById('theme-msg');
		if (themeMsg) {
			themeMsg.textContent = message;
			themeMsg.className = 'settings-msg success';
			setTimeout(() => {
				themeMsg.textContent = '';
			}, 2000);
		}
	}

	function applyTheme(isDark) {
		if (isDark) {
			document.body.classList.remove('light-mode');
		} else {
			document.body.classList.add('light-mode');
		}
	}

	// ========== LISTEN FOR AVATAR CHANGES FROM OTHER TABS ==========
	window.addEventListener('avatarChanged', function(e) {
		let navAvatar = document.getElementById('nav-avatar');
		if (navAvatar && e.detail.email === user.email) {
			navAvatar.src = 'https://robohash.org/' + encodeURIComponent(e.detail.avatar) + '?size=32x32&set=set1';
		}
	});

	// ========== LOAD THEME ON PAGE LOAD ==========
	let savedTheme = localStorage.getItem('gc_dark_mode');
	let isDark = savedTheme !== 'false';
	applyTheme(isDark);
	updateThemeButtons(isDark);
});
