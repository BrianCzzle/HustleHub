// FORM ELEMENTS
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const usernameSignup = document.getElementById("usernameSignup");
const locationSignup = document.getElementById("locationSignup");
const descriptionSignup = document.getElementById("descriptionSignup");
const priceSignup = document.getElementById("priceSignup");
const whatsAppSignup = document.getElementById("whatsAppSignup");

const signupForm = document.getElementById("signupForm");
const goToLogin = document.getElementById("goToLogin");
const goToSignup = document.getElementById("goToSignup");

const emailSignup = document.getElementById("emailSignup");
const passwordSignup = document.getElementById("passwordSignup");
const confirmPasswordSignup = document.getElementById("confirmPasswordSignup");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const matchError = document.getElementById("matchError");
const passwordErrorSignup = document.getElementById("passwordErrorSignup");
const matchErrorSignup = document.getElementById("matchErrorSignup");

// 🌈 SweetAlert Error Popup
function showError(message) {
  playSound("error");
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonText: "Got it",
    showClass: {
      popup: "animate__animated animate__shakeX",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
}

// ✅ SweetAlert Success Popup
function showSuccess(message) {
  playSound("success");
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonText: "Cool 😎",
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
}

// 🔊 Optional: Audio Feedback
function playSound(type) {
  const audio = new Audio(
    type === "success"
      ? "https://cdn.pixabay.com/download/audio/2021/08/04/audio_8fefc89a09.mp3?filename=notification-736.mp3"
      : "https://cdn.pixabay.com/download/audio/2021/08/04/audio_4904c24d42.mp3?filename=error-39.mp3"
  );
  audio.play();
}



// 🎛️ Switching between forms
goToLogin.addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

goToSignup.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

// 🛡️ Validation
emailInput.addEventListener("input", () => {
  const email = emailInput.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.textContent = pattern.test(email) ? "" : "Invalid email format.";
});

emailSignup.addEventListener("input", () => {
  const email = emailSignup.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.textContent = pattern.test(email) ? "" : "Invalid email format";
});

passwordSignup.addEventListener("input", () => {
  const pass = passwordSignup.value.trim();
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  passwordErrorSignup.textContent = strong.test(pass)
    ? ""
    : "Password must include at least: 8+ chars, one lowercase, one uppercase, one digit, one special char";
  passwordErrorSignup.style.display = strong.test(pass) ? "none" : "block";
});

confirmPasswordSignup.addEventListener("input", () => {
  const match = confirmPasswordSignup.value === passwordSignup.value;
  matchErrorSignup.textContent = match ? "" : "Passwords do not match.";
  matchErrorSignup.style.display = match ? "none" : "block";
});

passwordInput.addEventListener("input", () => {
  const pass = passwordInput.value.trim();
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  passwordError.textContent = strong.test(pass)
    ? ""
    : "Password must include at least: 8+ chars, one lowercase, one uppercase, one digit, one special char";
  passwordError.style.display = strong.test(pass) ? "none" : "block";
});

confirmPassword.addEventListener("input", () => {
  const match = confirmPassword.value === passwordInput.value;
  matchError.textContent = match ? "" : "Passwords do not match.";
  matchError.style.display = match ? "none" : "block";
});

// 🧠 SIGNUP
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. Get values and trim/normalize
  const username = usernameSignup.value.trim();
  const email = emailSignup.value.trim().toLowerCase();
  const password = passwordSignup.value.trim();
  const confirm = confirmPasswordSignup.value.trim();
  const location = locationSignup.value.trim();
  const description = descriptionSignup.value.trim();
  const price = priceSignup.value.trim();
  const whatsApp = whatsAppSignup.value.trim();

  // 2. Check for empty required fields
  if (!username || !email || !password || !confirm) {
    showError("Please fill in all required fields.");
    return;
  }

  // 3. Email format validation
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) {
    showError("Invalid email format.");
    return;
  }

  // 4. Password match check
  if (password !== confirm) {
    showError("Passwords do not match.");
    return;
  }

  // 5. Check for duplicate email
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = storedUsers.some(user => user.email.toLowerCase() === email);

  if (emailExists) {
    showError("This email is already registered. Try logging in instead.");
    return;
  }

  // 6. Create new user object
  const newUser = {
    username,
    email,
    password,
    location,
    description,
    price,
    whatsApp
  };

  // 7. Save user and confirm
  storedUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(storedUsers));
  showSuccess("Signup successful!");

  signupForm.reset();
});

// Login
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError("Please enter both email and password.");
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  const matchedUser = storedUsers.find(
    user => user.email.toLowerCase() === email && user.password === password
  );

  if (matchedUser) {
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));
    showSuccess(`Hey ${matchedUser.username}, welcome back!`);

    setTimeout(() => {
      window.location.href = "browse.html";
    }, 1000);

    form.reset();
  } else {
    showError("Invalid email or password. Try again.");
  }
});
