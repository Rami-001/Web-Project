// Basic client-side validation + localStorage inbox (no server required)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameEl = document.getElementById('c-name');
  const emailEl = document.getElementById('c-email');
  const subjectEl = document.getElementById('c-subject');
  const msgEl = document.getElementById('c-message');
  const status = document.getElementById('contact-msg');
  const mailto = document.getElementById('mailto-fallback');

  const setMsg = (type, text) => {
    status.textContent = text;
    status.classList.remove('ok','err');
    status.classList.add(type);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const subject = subjectEl.value.trim();
    const message = msgEl.value.trim();

    if (!name || !email || !subject || !message) {
      setMsg('err', 'Please fill out all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setMsg('err', 'Please enter a valid email address.');
      return;
    }

    // Simulated “send”: store in localStorage inbox
    const payload = { name, email, subject, message, ts: new Date().toISOString() };
    const inbox = JSON.parse(localStorage.getItem('gc_inbox') || '[]');
    inbox.push(payload);
    localStorage.setItem('gc_inbox', JSON.stringify(inbox));

    setMsg('ok', 'Thanks! Your message has been received.');
    form.reset();

    // Optional: show mailto fallback link (if user prefers email app)
    const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
    mailto.href = `mailto:support@globalcompass.example?subject=${encodeURIComponent(subject)}&body=${body}`;
    mailto.style.display = 'inline-block';
  });
});
