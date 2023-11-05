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

