const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Toggle between sign-up and sign-in forms
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Handle sign-up form submission
const signUpForm = document.getElementById("signupForm");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: signUpForm.querySelector("[name='name']").value,
    email: signUpForm.querySelector("[name='email']").value,
    password: signUpForm.querySelector("[name='password']").value,
    ageVerified: document.getElementById("ageVerification").checked,
    gender: document.querySelector("input[name='gender']:checked").value,
    state: document.getElementById("state").value,
  };

  console.log("Signup form data:", formData);

  try {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Signup response:", data);

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success message and reload page
      alert("Registration successful! Please login with your credentials.");
      window.location.reload();
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred during registration");
  }
});

// Handle login form submission
const signInForm = document.getElementById("loginForm");
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: signInForm.querySelector("[name='email']").value,
    password: signInForm.querySelector("[name='password']").value,
  };

  console.log("Login form data:", formData);

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success message and redirect to dashboard
      alert("Login successful! You will be redirected to the dashboard.");
      window.location.href = "/dashboard";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login");
  }
});
