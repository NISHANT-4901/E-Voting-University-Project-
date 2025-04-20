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
const signUpForm = document.querySelector(".sign-up form");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: signUpForm.querySelector("input[type='text']").value,
    email: signUpForm.querySelector("input[type='text']:nth-child(2)").value,
    password: signUpForm.querySelector("input[type='password']").value,
    ageVerified: document.getElementById("ageVerification").checked,
    gender: document.querySelector("input[name='gender']:checked").value,
    state: document.getElementById("state").value,
  };

  try {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or show success message
      alert("Registration successful!");
      // window.location.href = "/dashboard.html";
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during registration");
  }
});

// Handle login form submission
const signInForm = document.querySelector(".sign-in form");
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: signInForm.querySelector("input[type='text']").value,
    password: signInForm.querySelector("input[type='password']").value,
  };

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard or show success message
      alert("Login successful!");
      // window.location.href = "/dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during login");
  }
});
