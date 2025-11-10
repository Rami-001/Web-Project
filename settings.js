// settings.js
import {
  getAuth, onAuthStateChanged, updateProfile,
  sendPasswordResetEmail, deleteUser
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getApp, getApps
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getStorage, ref, uploadBytesResumable, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

/* ---------- Bind storage to the SAME app as auth ---------- */
const app = getApps().length ? getApp() : null; // auth.js initializes the app
const auth = getAuth(app || undefined);
const storage = getStorage(app || undefined);

/* ---------- DOM ---------- */
const emailEl   = document.getElementById('set-email');
const nameEl    = document.getElementById('set-name');
const saveBtn   = document.getElementById('btn-save-profile');
const avatarInp = document.getElementById('avatar-file');
const avatarImg = document.getElementById('avatar-preview');

const resetBtn  = document.getElementById('btn-reset-pass');
const delBtn    = document.getElementById('btn-delete');

const msg       = document.getElementById('settings-msg');
const resetMsg  = document.getElementById('reset-msg');
const delMsg    = document.getElementById('delete-msg');

const subCurrent = document.getElementById('sub-current');
const subSelect  = document.getElementById('sub-select');
const subChange  = document.getElementById('btn-change-plan');
const subCancel  = document.getElementById('btn-cancel-plan');
const subMsg     = document.getElementById('sub-msg');

/* ---------- Helpers ---------- */
const setMsg = (el, type, text) => {
  if (!el) return;
  el.classList.remove('success','error');
  el.classList.add(type === 'ok' ? 'success' : 'error');
  el.textContent = text;
};
const disable = (el, v=true) => { if (el) el.disabled = !!v; };

const key = (uid) => `gc_subscription_${uid}`;
const readSub = (uid) => {
  const raw = localStorage.getItem(key(uid));
  return raw ? JSON.parse(raw) : { plan: 'free', status: 'active' };
};
const writeSub = (uid, data) => localStorage.setItem(key(uid), JSON.stringify(data));
const label = (p) => p === 'pro' ? 'Pro' : p === 'standard' ? 'Standard' : 'Free';

const reflectSub = (uid) => {
  const s = readSub(uid);
  subCurrent.value = label(s.plan);
  subSelect.value  = s.plan;
  const isFree = s.plan === 'free';
  disable(subCancel, isFree);
  subCancel.title = isFree ? "You're on Free—there's no paid subscription to cancel." : "";
  return s;
};

const updateNavAvatar = (url) => {
  const nav = document.getElementById('nav-avatar');
  if (nav && url) nav.src = url;
};

/* ---------- Main ---------- */
onAuthStateChanged(auth, (user) => {
  if (!user) { window.location.href = "login.html"; return; }

  // Prefill
  if (emailEl) {
    emailEl.value = user.email || "";
    emailEl.setAttribute('disabled', 'disabled'); // hard-disable editing
    emailEl.classList.add('disabled-like');       // optional style hook
  }
  nameEl.value  = user.displayName || (user.email ? user.email.split("@")[0] : "");
  if (user.photoURL) avatarImg.src = user.photoURL;

  // Subscription
  reflectSub(user.uid);

  /* Save name */
  saveBtn.addEventListener('click', async () => {
    const newName = nameEl.value.trim();
    if (!newName) return setMsg(msg, 'err', 'Display name cannot be empty.');
    setMsg(msg, 'ok', 'Saving…');
    disable(saveBtn, true);
    try {
      await updateProfile(user, { displayName: newName });
      const span = document.getElementById('user-name');
      if (span) span.textContent = newName;
      setMsg(msg, 'ok', 'Profile updated.');
    } catch (e) {
      console.error(e);
      setMsg(msg, 'err', 'Could not update profile. Try again.');
    } finally {
      disable(saveBtn, false);
    }
  });

  /* Avatar upload with progress + automatic fallback */
avatarInp.addEventListener('change', () => {
  const file = avatarInp.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) return setMsg(msg, 'err', 'Please choose an image file.');
  if (file.size > 5 * 1024 * 1024)    return setMsg(msg, 'err', 'Max size is 5 MB.');

  setMsg(msg, 'ok', 'Uploading photo… 0%');
  disable(saveBtn, true);

  const path = `avatars/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, path);
  const task = uploadBytesResumable(fileRef, file, { contentType: file.type });

  let stalled = false;
  const stallTimer = setTimeout(() => { stalled = true; }, 8000); // if no progress >8s, we fallback

  task.on('state_changed',
    (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      setMsg(msg, 'ok', `Uploading photo… ${pct}%`);
      if (pct > 0) { clearTimeout(stallTimer); }  // progress started
    },
    async (err) => {
      clearTimeout(stallTimer);
      console.error('[resumable upload error]', err);
      // If resumable failed or stalled, try a simple upload as a fallback:
      try {
        setMsg(msg, 'ok', 'Retrying…');
        await uploadBytes(fileRef, file, { contentType: file.type });
        const url = await getDownloadURL(fileRef);
        await updateProfile(auth.currentUser, { photoURL: url });
        const busted = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
        avatarImg.src = busted;
        const nav = document.getElementById('nav-avatar'); if (nav) nav.src = busted;
        setMsg(msg, 'ok', 'Profile picture updated.');
      } catch (e) {
        console.error('[fallback upload error]', e);
        setMsg(
          msg,
          'err',
          'Upload failed. Check Firebase Storage is enabled and rules allow your user to write to /avatars.'
        );
      } finally {
        avatarInp.value = '';
        disable(saveBtn, false);
      }
    },
    async () => {
      // Resumable finished normally
      clearTimeout(stallTimer);
      try {
        const url = await getDownloadURL(task.snapshot.ref);
        await updateProfile(auth.currentUser, { photoURL: url });
        const busted = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
        avatarImg.src = busted;
        const nav = document.getElementById('nav-avatar'); if (nav) nav.src = busted;
        setMsg(msg, 'ok', 'Profile picture updated.');
      } catch (e) {
        console.error('[post-upload updateProfile error]', e);
        setMsg(msg, 'err', 'Could not apply the new picture.');
      } finally {
        avatarInp.value = '';
        disable(saveBtn, false);
      }
    }
  );

  // If it *never* fires progress (some environments), run the fallback after 9s
  setTimeout(async () => {
    if (!stalled) return; // resumable progressed or finished
    try {
      task.cancel();
    } catch {}
    try {
      setMsg(msg, 'ok', 'Retrying…');
      await uploadBytes(fileRef, file, { contentType: file.type });
      const url = await getDownloadURL(fileRef);
      await updateProfile(auth.currentUser, { photoURL: url });
      const busted = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
      avatarImg.src = busted;
      const nav = document.getElementById('nav-avatar'); if (nav) nav.src = busted;
      setMsg(msg, 'ok', 'Profile picture updated.');
    } catch (e) {
      console.error('[fallback (no progress) error]', e);
      setMsg(
        msg,
        'err',
        'Upload stalled. Verify Storage is enabled and rules allow authenticated writes to /avatars.'
      );
    } finally {
      avatarInp.value = '';
      disable(saveBtn, false);
    }
  }, 9000);
});


  /* Change plan */
  subChange.addEventListener('click', () => {
    const plan = subSelect.value; // free|standard|pro
    writeSub(user.uid, { plan, status: 'active', changedAt: new Date().toISOString() });
    reflectSub(user.uid);
    setMsg(subMsg, 'ok', `You're now on the ${label(plan)} plan.`);
  });

  /* Cancel subscription (no-op on Free) */
  subCancel.addEventListener('click', () => {
    const cur = readSub(user.uid);
    if (cur.plan === 'free') {
      return setMsg(subMsg, 'err', "You're already on the Free plan—there's nothing to cancel.");
    }
    if (!confirm("Cancel your paid subscription? You’ll switch to the Free plan.")) return;

    writeSub(user.uid, { plan: 'free', status: 'canceled', canceledAt: new Date().toISOString() });
    reflectSub(user.uid);
    setMsg(subMsg, 'ok', 'Subscription canceled. You’re on the Free plan.');
  });

  /* Security */
  resetBtn.addEventListener('click', async () => {
    setMsg(resetMsg, 'ok', 'Sending email…');
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMsg(resetMsg, 'ok', 'Reset email sent.');
    } catch (e) {
      console.error(e);
      setMsg(resetMsg, 'err', 'Failed to send reset email.');
    }
  });

  delBtn.addEventListener('click', async () => {
    if (!confirm("This permanently deletes your account. Continue?")) return;
    setMsg(delMsg, 'ok', 'Deleting…');
    try {
      await deleteUser(user);
      window.location.href = "signup.html";
    } catch (e) {
      console.error(e);
      setMsg(delMsg, 'err', e.code === 'auth/requires-recent-login'
        ? 'Please sign in again, then retry.'
        : 'Could not delete account.');
    }
  });
});

/* -------------------
   LIGHT/DARK TOGGLE
------------------- */
const themeBtn = document.getElementById("theme-toggle");
const themeMsg = document.getElementById("theme-msg");

function setTheme(mode) {
  document.body.classList.toggle("light-mode", mode === "light");
  localStorage.setItem("theme", mode);
  themeBtn.textContent = mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode";
  setMsg(themeMsg, "ok", mode === "light" ? "Light mode enabled." : "Dark mode enabled.");
}

// Load user preference
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

// Button listener
themeBtn.addEventListener("click", () => {
  const current = localStorage.getItem("theme") === "light" ? "dark" : "light";
  setTheme(current);
});
