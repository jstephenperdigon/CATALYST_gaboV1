document.getElementById("loginButton").addEventListener("click", function () {
  var email = document.getElementById("typeEmailX").value;
  var password = document.getElementById("typePasswordX").value;
  var rememberMe = document.getElementById("rememberMe").checked;

  // Store email and password based on the "Remember Me" checkbox status
  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
    localStorage.setItem("rememberedPassword", password);
  } else {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
  }
});

// Populate the email and password fields if remembered
window.addEventListener("load", function () {
  var rememberedEmail = localStorage.getItem("rememberedEmail");
  var rememberedPassword = localStorage.getItem("rememberedPassword");

  if (rememberedEmail && rememberedPassword) {
    document.getElementById("typeEmailX").value = rememberedEmail;
    document.getElementById("typePasswordX").value = rememberedPassword;
    document.getElementById("rememberMe").checked = true;

    // Toggle the class to hide the label
    document.getElementById("typeEmailX").classList.add("has-value");
    document.getElementById("typePasswordX").classList.add("has-value");
  }
});

// Add event listeners to toggle the class on input focus and blur
document.getElementById("typeEmailX").addEventListener("focus", function () {
  this.classList.add("has-value");
});

document.getElementById("typeEmailX").addEventListener("blur", function () {
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

document.querySelector('.show-password').addEventListener('click', function() {
    const passwordInput = document.querySelector(this.getAttribute('toggle'));
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.classList.remove('fa-eye-slash');
      this.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      this.classList.remove('fa-eye');
      this.classList.add('fa-eye-slash');
    }
  });