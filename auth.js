// Firebase via CDN (no build tools needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

/* ---- Your Firebase Config ---- */
const firebaseConfig = {
  apiKey: "AIzaSyBUDn94RBQsMLL3tHcp-WYQLXuYmGPpoKs",
  authDomain: "global-express-612e1.firebaseapp.com",
  projectId: "global-express-612e1",
  storageBucket: "global-express-612e1.firebasestorage.app",
  messagingSenderId: "697208415387",
  appId: "1:697208415387:web:e888f4ed2083a67df0523e",
  measurementId: "G-MT9LM1BM9F",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---- Helpers ---- */
function friendlyAuthMessage(code) {
  switch (code) {
    case "auth/invalid-email":          return "Please enter a valid email address.";
    case "auth/missing-password":       return "Please enter your password.";
    case "auth/user-not-found":         return "No account found with that email.";
    case "auth/wrong-password":         return "Incorrect password. Try again.";
    case "auth/invalid-credential":     return "Email or password is incorrect.";
    case "auth/email-already-in-use":   return "That email is already registered.";
    case "auth/weak-password":          return "Password should be at least 6 characters.";
    case "auth/too-many-requests":      return "Too many attempts. Please wait and try again.";
    case "auth/network-request-failed": return "Network error. Check your connection.";
    default:                            return "Something went wrong. Please try again.";
  }
}
function setMsg(el, type, text) {
  if (!el) return;
  el.classList.remove("success","error");
  el.classList.add(type);
  el.textContent = text;
}

/* ---- Login ---- */
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const msg = document.getElementById("login-msg");

    if (!email)    return setMsg(msg, "error", "Please enter your email.");
    if (!password) return setMsg(msg, "error", "Please enter your password.");

    setMsg(msg, "success", "Signing you in…");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg(msg, "success", "Login successful! Redirecting…");
      setTimeout(() => (window.location.href = "index.html"), 700);
    } catch (err) {
      setMsg(msg, "error", friendlyAuthMessage(err.code));
    }
  });
}

/* ---- Signup ---- */
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const msg = document.getElementById("signup-msg");

    if (!email)    return setMsg(msg, "error", "Please enter your email.");
    if (!password) return setMsg(msg, "error", "Please enter a password.");
    if (password !== confirm) return setMsg(msg, "error", "Passwords do not match.");

    setMsg(msg, "success", "Creating your account…");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMsg(msg, "success", "Account created! Redirecting…");
      setTimeout(() => (window.location.href = "index.html"), 700);
    } catch (err) {
      setMsg(msg, "error", friendlyAuthMessage(err.code));
    }
  });
}

/* ---- Navbar greeting + visibility + Logout ---- */
onAuthStateChanged(auth, (user) => {
  const loginSignup     = document.querySelector(".Login-Signup");
  const profileDropdown = document.querySelector(".profile-dropdown");
  const welcomeUser     = document.getElementById("welcome-user");
  const userNameSpan    = document.getElementById("user-name");

  if (user) {
    const name = user.displayName || (user.email ? user.email.split("@")[0] : "User");
    if (loginSignup)     loginSignup.style.display = "none";
    if (profileDropdown) profileDropdown.style.display = "flex";
    if (welcomeUser && userNameSpan) {
      userNameSpan.textContent = name;
      welcomeUser.style.display = "flex";
    }
  } else {
    if (loginSignup)     loginSignup.style.display = "flex";
    if (profileDropdown) profileDropdown.style.display = "none";
    if (welcomeUser)     welcomeUser.style.display = "none";
  }
});

// Logout
const logoutLink = document.getElementById("logout-link");
if (logoutLink) {
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out. Please try again.");
    }
  });
}
