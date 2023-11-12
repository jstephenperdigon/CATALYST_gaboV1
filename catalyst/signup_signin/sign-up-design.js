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
  

  // Form Validator / Required Input Fields
  var forms = document.querySelectorAll('.needs-validation');
  Array.prototype.slice.call(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');

      // Custom password validation
      var password = document.getElementById('password1').value;
      var passwordConfirmation = document.getElementById('passwordConfirmation').value;

      if (password !== passwordConfirmation) {
        document.getElementById('passwordConfirmation').setCustomValidity("Passwords must match");
      } else {
        document.getElementById('passwordConfirmation').setCustomValidity('');
      }
    }, false);
  });
    
  
  // Password Strength Meter Hider
  document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById('password-input');
    const passwordStrengthContainer = document.getElementById('passwordStrengthContainer');

    passwordInput.addEventListener('focus', function() {
        passwordStrengthContainer.style.display = 'block';
    });

    passwordInput.addEventListener('blur', function() {
        if (passwordInput.value === '') {
            passwordStrengthContainer.style.display = 'none';
        }
    });
});

//Password Strength Meter

// Code By Webdevtrick ( https://webdevtrick.com )
DOM = {
  passwForm: '.password-strength',
  passwErrorMsg: '.password-strength__error',
  passwInput: document.querySelector('.password-strength__input'),
  passwVisibilityBtn: '.password-strength__visibility',
  passwVisibility_icon: '.password-strength__visibility-icon',
  strengthBar: document.querySelector('.password-strength__bar'),
  submitBtn: document.querySelector('.password-strength__submit') };

//need to append classname with '.' symbol
const findParentNode = (elem, parentClass) => {

  parentClass = parentClass.slice(1, parentClass.length);

  while (true) {

    if (!elem.classList.contains(parentClass)) {
      elem = elem.parentNode;
    } else {
      return elem;
    }

  }

};

//*** MAIN CODE

const getPasswordVal = input => {
  return input.value;
};

const testPasswRegexp = (passw, regexp) => {

  return regexp.test(passw);

};

const testPassw = passw => {

  let strength = 'none';

  const moderate = /(?=.*[A-Z])(?=.*[a-z]).{5,}|(?=.*[\d])(?=.*[a-z]).{5,}|(?=.*[\d])(?=.*[A-Z])(?=.*[a-z]).{5,}/g;
  const strong = /(?=.*[A-Z])(?=.*[a-z])(?=.*[\d]).{7,}|(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=.*[\d]).{7,}/g;
  const extraStrong = /(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]).{9,}/g;

  if (testPasswRegexp(passw, extraStrong)) {
    strength = 'extra';
  } else if (testPasswRegexp(passw, strong)) {
    strength = 'strong';
  } else if (testPasswRegexp(passw, moderate)) {
    strength = 'moderate';
  } else if (passw.length > 0) {
    strength = 'weak';
  }

  return strength;

};

const testPasswError = passw => {

  const errorSymbols = /\s/g;

  return testPasswRegexp(passw, errorSymbols);

};

const setStrengthBarValue = (bar, strength) => {

  let strengthValue;

  switch (strength) {
    case 'weak':
      strengthValue = 25;
      bar.setAttribute('aria-valuenow', strengthValue);
      break;

    case 'moderate':
      strengthValue = 50;
      bar.setAttribute('aria-valuenow', strengthValue);
      break;

    case 'strong':
      strengthValue = 75;
      bar.setAttribute('aria-valuenow', strengthValue);
      break;

    case 'extra':
      strengthValue = 100;
      bar.setAttribute('aria-valuenow', strengthValue);
      break;

    default:
      strengthValue = 0;
      bar.setAttribute('aria-valuenow', 0);}


  return strengthValue;

};

//also adds a text label based on styles
const setStrengthBarStyles = (bar, strengthValue) => {

  bar.style.width = `${strengthValue}%`;

  bar.classList.remove('bg-success', 'bg-info', 'bg-warning');

  switch (strengthValue) {
    case 25:
      bar.classList.add('bg-danger');
      bar.textContent = 'Weak';
      break;

    case 50:
      bar.classList.remove('bg-danger');
      bar.classList.add('bg-warning');
      bar.textContent = 'Moderate';
      break;

    case 75:
      bar.classList.remove('bg-danger');
      bar.classList.add('bg-info');
      bar.textContent = 'Strong';
      break;

    case 100:
      bar.classList.remove('bg-danger');
      bar.classList.add('bg-success');
      bar.textContent = 'Extra Strong';
      break;

    default:
      bar.classList.add('bg-danger');
      bar.textContent = '';
      bar.style.width = `0`;}


};

const setStrengthBar = (bar, strength) => {

  //setting value
  const strengthValue = setStrengthBarValue(bar, strength);

  //setting styles
  setStrengthBarStyles(bar, strengthValue);
};



const findErrorMsg = input => {
  const passwForm = findParentNode(input, DOM.passwForm);
  return passwForm.querySelector(DOM.passwErrorMsg);
};

const showErrorMsg = input => {
  const errorMsg = findErrorMsg(input);
  errorMsg.classList.remove('js-hidden');
};

const hideErrorMsg = input => {
  const errorMsg = findErrorMsg(input);
  errorMsg.classList.add('js-hidden');
};

const passwordStrength = (input, strengthBar, btn) => {

  //getting password
  const passw = getPasswordVal(input);

  //check if there is an error
  const error = testPasswError(passw);

  if (error) {

    showErrorMsg(input);

  } else {

    //hide error messages
    hideErrorMsg(input);

    //finding strength
    const strength = testPassw(passw);

    //setting strength bar (value and styles)
    setStrengthBar(strengthBar, strength);

  }

};


const passwVisibilitySwitcher = (passwField, visibilityToggler) => {

  const visibilityStatus = passwordVisible(passwField);

  changeVisibiltyBtnIcon(visibilityToggler, visibilityStatus);
};


//EVENT LISTENERS
DOM.passwInput.addEventListener('input', () => {
  passwordStrength(DOM.passwInput, DOM.strengthBar, DOM.submitBtn);
});



// Alert Message
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

