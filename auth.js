// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUDn94RBQsMLL3tHcp-WYQLXuYmGPpoKs",
  authDomain: "global-express-612e1.firebaseapp.com",
  projectId: "global-express-612e1",
  storageBucket: "global-express-612e1.firebasestorage.app",
  messagingSenderId: "697208415387",
  appId: "1:697208415387:web:e888f4ed2083a67df0523e",
  measurementId: "G-MT9LM1BM9F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
 
// Map Firebase error codes to user-friendly text
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
  el.classList.remove("success", "error");
  el.classList.add(type);
  el.textContent = text;
}

/* ============================================
   Login & signup handlers
   ============================================ */
$(function () {
  // ---------- LOGIN ----------
  let loginForm = $("#login-form");

  if (loginForm.length) {
    loginForm.on("submit", async function (e) {
      e.preventDefault();

      let email = $("#login-email").val().trim();
      let password = $("#login-password").val();
      let msg = document.getElementById("login-msg");

      if (!email) {
        return setMsg(msg, "error", "Please enter your email.");
      }
      if (!password) {
        return setMsg(msg, "error", "Please enter your password.");
      }

      setMsg(msg, "success", "Signing you in…");

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setMsg(msg, "success", "Login successful! Redirecting…");
        setTimeout(() => (window.location.href = "index.html"), 700);
      } catch (err) {
        setMsg(msg, "error", friendlyAuthMessage(err.code));
      }
    });
  }

  // ---------- SIGNUP ----------
  let signupForm = $("#signup-form");

  if (signupForm.length) {
    signupForm.on("submit", async function (e) {
      e.preventDefault();

      let email = $("#signup-email").val().trim();
      let password = $("#signup-password").val();
      let confirm = $("#signup-confirm").val();
      let msg = document.getElementById("signup-msg");

      if (!email) {
        return setMsg(msg, "error", "Please enter your email.");
      }
      if (!password) {
        return setMsg(msg, "error", "Please enter a password.");
      }
      if (password !== confirm) {
        return setMsg(msg, "error", "Passwords do not match.");
      }

      setMsg(msg, "success", "Creating your account…");

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setMsg(msg, "success", "Account created! Redirecting…");
        setTimeout(() => (window.location.href = "index.html"), 700);
      } catch (err) {
        setMsg(msg, "error", friendlyAuthMessage(err.code));
      }
    });
  }
});

/* ============================================
   Auth state listener (updates navbar on all pages)
   ============================================ */
onAuthStateChanged(auth, (user) => {
  const loginSignup = document.querySelector(".Login-Signup");
  const profileDropdown = document.querySelector(".profile-dropdown");
  const welcomeUser = document.getElementById("welcome-user");
  const userNameSpan = document.getElementById("user-name");
  const navAvatar = document.getElementById("nav-avatar");
  const setEmail = document.getElementById("set-email");
  const setName = document.getElementById("set-name");

  if (user) {
    const name = user.displayName || (user.email ? user.email.split("@")[0] : "User");

    if (loginSignup) loginSignup.style.display = "none";
    if (profileDropdown) profileDropdown.style.display = "flex";
    if (welcomeUser) {
      welcomeUser.style.display = "flex";
      if (userNameSpan) userNameSpan.textContent = name;
    }
    if (navAvatar && user.photoURL) navAvatar.src = user.photoURL;
    
    // Populate settings page if on settings.html
    if (setEmail) setEmail.value = user.email || "";
    if (setName) setName.value = user.displayName || "";
  } else {
    if (loginSignup) loginSignup.style.display = "flex";
    if (profileDropdown) profileDropdown.style.display = "none";
    if (welcomeUser) welcomeUser.style.display = "none";
    if (navAvatar) navAvatar.src = "imgs/profile.svg";
  }
});

// Add save display name function
window.saveDisplayName = async function() {
  const nameInput = document.getElementById("set-name");
  const msg = document.getElementById("name-msg");
  const newName = nameInput.value.trim();
  
  if (!newName) {
    msg.textContent = "Please enter a name.";
    msg.classList.remove("success");
    msg.classList.add("error");
    msg.style.display = "block";
    return;
  }
  
  try {
    await updateProfile(auth.currentUser, {
      displayName: newName
    });
    msg.textContent = "Display name saved!";
    msg.classList.remove("error");
    msg.classList.add("success");
    msg.style.display = "block";
    
    // Update navbar
    const userNameSpan = document.getElementById("user-name");
    if (userNameSpan) userNameSpan.textContent = newName;
    
    setTimeout(() => msg.style.display = "none", 3000);
  } catch (err) {
    msg.textContent = "Error saving name. Try again.";
    msg.classList.remove("success");
    msg.classList.add("error");
    msg.style.display = "block";
  }
}

/* ============================================
   Logout handler
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch (err) {
        console.error("Logout error:", err);
      }
    });
  }
});
