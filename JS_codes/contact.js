
    $(document).ready(function() {
      let $submitBtn = $('#contact-submit-btn');
      let $nameInput = $('#c-name');
      let $emailInput = $('#c-email');
      let $subjectInput = $('#c-subject');
      let $messageInput = $('#c-message');
      let $msgEl = $('#contact-msg');

      if ($submitBtn.length) {
        $submitBtn.on('click', function(e) {
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

          setTimeout(function() {
            $msgEl.text('');
          }, 3000);
        });
      }
    });
