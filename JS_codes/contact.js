// Contact form handler - Client-side only, no backend calls
document.addEventListener('DOMContentLoaded', function() {
	let form = document.getElementById('contact-form');
	let msgEl = document.getElementById('contact-msg');
	let mailtoFallback = document.getElementById('mailto-fallback');

	if (!form) return;

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		
		// Get form values
		let name = document.getElementById('c-name').value.trim();
		let email = document.getElementById('c-email').value.trim();
		let subject = document.getElementById('c-subject').value.trim();
		let message = document.getElementById('c-message').value.trim();

		// Validate
		if (!name || !email || !subject || !message) {
			msgEl.textContent = 'Please fill in all fields.';
			msgEl.className = 'contact-msg err';
			return;
		}

		// Email validation
		let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			msgEl.textContent = 'Please enter a valid email.';
			msgEl.className = 'contact-msg err';
			return;
		}

		// Create mailto link (fallback for no backend)
		let mailtoLink = `mailto:support@globalcompass.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
		
		// Show success
		msgEl.textContent = 'Message ready to send! Redirecting to your email client...';
		msgEl.className = 'contact-msg ok';
		
		// Set fallback link
		mailtoFallback.href = mailtoLink;
		
		// Trigger email client after delay
		setTimeout(() => {
			window.location.href = mailtoLink;
		}, 1500);

		// Reset form
		setTimeout(() => {
			form.reset();
			msgEl.textContent = '';
		}, 2000);
	});
});
