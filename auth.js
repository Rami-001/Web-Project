
// /js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// --- your config (keep it exactly as Firebase gave you) ---
const firebaseConfig = {
  apiKey: "AIzaSyBUDn94RBQsMLL3tHcp-WYQLXuYmGPpoKs",
  authDomain: "global-express-612e1.firebaseapp.com",
  projectId: "global-express-612e1",
  storageBucket: "global-express-612e1.firebasestorage.app",
  messagingSenderId: "697208415387",
  appId: "1:697208415387:web:e888f4ed2083a67df0523e",
  measurementId: "G-MT9LM1BM9F",
};

// --- initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// --- helpers (put near the top of auth.js) ---
function friendlyAuthMessage(code) {
  switch (code) {
    case "auth/invalid-email":         return "Please enter a valid email address.";
    case "auth/missing-password":      return "Please enter your password.";
    case "auth/user-not-found":        return "No account found with that email.";
    case "auth/wrong-password":        return "Incorrect password. Try again.";
    case "auth/invalid-credential":    return "Email or password is incorrect.";
    case "auth/email-already-in-use":  return "That email is already registered.";
    case "auth/weak-password":         return "Password should be at least 6 characters.";
    case "auth/too-many-requests":     return "Too many attempts. Please wait and try again.";
    case "auth/network-request-failed":return "Network error. Check your connection.";
    default:                           return "Something went wrong. Please try again.";
  }
}
function setMsg(el, type, text) {
  if (!el) return;
  el.classList.remove("success","error");
  el.classList.add(type); // 'success' or 'error'
  el.textContent = text;
}

// LOGIN FORM
const loginForm = document.getElementById("login-form");
// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const msg = document.getElementById("login-msg");

    // basic client-side checks
    if (!email) return setMsg(msg, "error", "Please enter your email.");
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
// SIGNUP
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

