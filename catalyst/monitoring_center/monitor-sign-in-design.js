// Add event listeners to toggle the class on input focus and blur
document.getElementById("username").addEventListener("focus", function () {
  this.classList.add("has-value");
});

document.getElementById("username").addEventListener("blur", function () {
  if (this.value === "") {
    this.classList.remove("has-value");
  }
});

document.getElementById("typePasswordX").addEventListener("focus", function () {
  this.classList.add("has-value");
});

document.getElementById("typePasswordX").addEventListener("blur", function () {
  if (this.value === "") {
    this.classList.remove("has-value");
  }
});

document.querySelector(".show-password").addEventListener("click", function () {
  const passwordInput = document.querySelector(this.getAttribute("toggle"));

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    this.classList.remove("fa-eye-slash");
    this.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    this.classList.remove("fa-eye");
    this.classList.add("fa-eye-slash");
  }
});
