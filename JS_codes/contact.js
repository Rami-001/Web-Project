

$(document).ready(function () {
  let $chatModal = $('#chat-modal');
  let $chatBtn = $('#contact-submit-btn');
  let $chatClose = $('.chat-modal-close');
  let $chatConfirm = $('.chat-modal-btn');

  // Open modal when button is clicked
  if ($chatBtn.length) {
    $chatBtn.on('click', function (e) {
      e.preventDefault();
      $chatModal.addClass('active');
    });
  }

  // Close modal when close button is clicked
  $chatClose.on('click', function () {
    $chatModal.removeClass('active');
  });

  // Close modal when confirm button is clicked
  $chatConfirm.on('click', function () {
    $chatModal.removeClass('active');
  });

  // Close modal when overlay is clicked (outside the modal)
  $chatModal.on('click', function (e) {
    if (e.target === this) {
      $chatModal.removeClass('active');
    }
  });

  // Close modal on Escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $chatModal.hasClass('active')) {
      $chatModal.removeClass('active');
    }
  });

  let $submitBtn = $('.contact-btn[type="button"]');
  let $nameInput = $('#c-name');
  let $emailInput = $('#c-email');
  let $subjectInput = $('#c-subject');
  let $messageInput = $('#c-message');
  let $msgEl = $('#contact-msg');

  if ($submitBtn.length > 1) {
    $submitBtn.eq(1).on('click', function (e) {
      e.preventDefault();

      let name = $nameInput.val().trim();
      let email = $emailInput.val().trim();
      let subject = $subjectInput.val().trim();
      let message = $messageInput.val().trim();

      $msgEl.text('').removeClass('err ok');

      if (!name || !email || !subject || !message) {
        $msgEl.text('Please fill in all fields.').addClass('contact-msg err');
        return;
      }

      let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        $msgEl.text('Please enter a valid email address.').addClass('contact-msg err');
        return;
      }

      if (message.length < 10) {
        $msgEl.text('Message must be at least 10 characters long.').addClass('contact-msg err');
        return;
      }

      let contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
      };

      let messages = JSON.parse(localStorage.getItem('gc_contact_messages') || '[]');
      messages.push(contactData);
      localStorage.setItem('gc_contact_messages', JSON.stringify(messages));

      $msgEl.text('Message sent successfully! We\'ll get back to you soon.').addClass('contact-msg ok');

      $nameInput.val('');
      $emailInput.val('');
      $subjectInput.val('');
      $messageInput.val('');

      setTimeout(function () {
        $msgEl.text('');
      }, 3000);
    });
  }

});

