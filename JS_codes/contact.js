// Contact form handler (jQuery)
$(document).ready(function() {
  // Cache DOM elements
  let $submitBtn    = $('#contact-submit-btn');
  let $nameInput    = $('#c-name');
  let $emailInput   = $('#c-email');
  let $subjectInput = $('#c-subject');
  let $messageInput = $('#c-message');
  let $msgEl        = $('#contact-msg');

  // Handle contact form submission
  if ($submitBtn.length) {
    $submitBtn.on('click', function(e) {
      e.preventDefault();

      // Read and normalize input values
      let name    = $nameInput.val().trim();
      let email   = $emailInput.val().trim();
      let subject = $subjectInput.val().trim();
      let message = $messageInput.val().trim();

      // Reset status message
      $msgEl.text('').removeClass('ok err');

      // Basic validation: required fields
      if (!name || !email || !subject || !message) {
        $msgEl.text('Please fill in all fields.').addClass('err');
        return;
      }

      // Basic validation: email format
      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $msgEl.text('Please enter a valid email address.').addClass('err');
        return;
      }

      // Basic validation: minimum message length
      if (message.length < 10) {
        $msgEl.text('Message must be at least 10 characters long.').addClass('err');
        return;
      }

      // Store message in localStorage
      let contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
      };

      let messages = JSON.parse(localStorage.getItem('gc_contact_messages') || '[]');
      messages.push(contactData);
      localStorage.setItem('gc_contact_messages', JSON.stringify(messages));

      // Show success message and reset form
      $msgEl.text('Message sent successfully! We\'ll get back to you soon.').addClass('ok');

      $nameInput.val('');
      $emailInput.val('');
      $subjectInput.val('');
      $messageInput.val('');

      // Auto-clear status message
      setTimeout(() => {
        $msgEl.text('');
      }, 3000);
    });
  }
});
