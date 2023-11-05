// Sign-up Show Password 
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

  document.querySelector('.show-password2').addEventListener('click', function() {
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


function showAlert(message, alertType) {
  const alertContainer = document.getElementById('alertContainer');

  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', 'alert-dismissible', 'fade', 'show', `alert-${alertType}`);
  alertElement.setAttribute('role', 'alert');

  alertElement.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertContainer.appendChild(alertElement);

  // Automatically remove the alert after a few seconds (optional)
  setTimeout(() => {
      alertElement.remove();
  }, 5000); // 5000 milliseconds = 5 seconds
}

// Email Validation and Auto format

document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Get the input value
  const emailInput = document.getElementById('email');
  const emailValue = emailInput.value;

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(emailValue)) {
      // Valid email format
      showAlert('Email is valid!', 'success');
  } else {
      // Invalid email format
      showAlert('Please enter a valid email address.', 'danger');
  }
});
