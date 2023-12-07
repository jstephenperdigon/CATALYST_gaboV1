// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
    authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
    databaseURL: "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smartgarbagebin-8c3ec",
    storageBucket: "smartgarbagebin-8c3ec.appspot.com",
    messagingSenderId: "1062286948871",
    appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// emailjs config
emailjs.init('TN6jayxVlZMzQ3Ljt');

// Function to validate first name and last name
function isValidName(name) {
    // Regular expression to check if the name contains only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

// Function to validate password length
function isValidPassword(password) {
    return password.length >= 8;
}

// Function to send OTP via email
function sendOTP(toEmail, firstName, otp) {
    const templateParams = {
        to_email: toEmail,
        first_name: firstName,
        otp: otp,
    };

    return emailjs.send('service_qpkq4ee', 'template_l3cy9we', templateParams)
        .then(() => {
            // Return both OTP and email for further processing
            return { otp: otp, email: toEmail };
        });
}

function isValidEmail(email) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the general format
  if (!emailRegex.test(email)) {
      return false;
  }

  // List of valid email domains
  const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'outlook.ph'];

  // Extract the email domain
  const domain = email.split('@')[1].toLowerCase();

  // Check if the email domain is in the list of valid domains
  if (!validDomains.includes(domain)) {
      return false;
  }

  return true;
}

function isValidPhilippineNumber(mobileNumber) {
    // Regular expression to check if the mobile number follows the format XXX-XXX-XXXX
    const philippineNumberRegex = /^(\+?63|0)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/;

    // Check if the mobile number matches the pattern
    return philippineNumberRegex.test(mobileNumber);
}

function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
}
   
   function phoneNumberFormatter() {
    const inputField = document.getElementById('mobile_number');
    const formattedInputValue = formatPhoneNumber(inputField.value);
    inputField.value = formattedInputValue;
   }

document.getElementById("submit").addEventListener('click', function (e) {
    e.preventDefault();

    // Trigger front-end validations from design.js
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.classList.add('was-validated');
    });

    // Check if front-end validations passed
    if (!document.querySelector('.was-validated')) {
        // Front-end validations failed, exit
        return;
    }

    // Get input values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const mobileNumber = document.getElementById('mobile_number').value;
    const password = document.getElementById('password-input').value;
    const confirmPassword = document.getElementById('passwordConfirmation').value;
    const agreeTermsCheckbox = document.getElementById('agreeTerms');

    // Validate first name format
    if (!isValidName(firstName)) {
        alert("Please enter a valid first name without numbers or special characters.");
        return;
    }

    // Validate last name format
    if (!isValidName(lastName)) {
        alert("Please enter a valid last name without numbers or special characters.");
        return;
    }

    // Validate password length
    if (!isValidPassword(password)) {
        alert("Please enter a password with at least 8 characters.");
        return;
    }

    // Check if required fields are not empty and checkbox is checked
    if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || mobileNumber.trim() === '' || password.trim() === '' || !agreeTermsCheckbox.checked) {
        console.log("Please fill in all required fields and agree to the terms.");
        return;
    }

    // Check if password and password confirmation match
    if (password !== confirmPassword) {
        alert("Password and password confirmation do not match.");
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate Philippine country code
    if (!isValidPhilippineNumber(mobileNumber)) {
        alert("Please enter a valid Philippine mobile number.");
        return;
    }

    // Format the phone number
    phoneNumberFormatter();

    // Check if the email or mobile number already exists
    get(ref(db, 'Accounts/Users'))
        .then((snapshot) => {
            let emailExists = false;
            let mobileExists = false;

            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.email === email) {
                    emailExists = true;
                }
                if (user.mobileNumber === mobileNumber) {
                    mobileExists = true;
                }
            });

            if (emailExists) {
                alert("This email is already registered. Please use a different email.");
            } else if (mobileExists) {
                alert("This mobile number is already registered. Please use a different number.");
            } else {
                // Email and mobile number do not exist, proceed to add the user data
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    mobileNumber: mobileNumber,
                    password: password
                };

                // Generate a random 6-digit OTP
                const generatedOTP = Math.floor(100000 + Math.random() * 900000);

                // Set the OTP in the database
                const otpData = {
                    otp: generatedOTP,
                    
                };

                // Create a new user node with the OTP data
                const newUserRef = push(ref(db, 'Accounts/Users'));
                set(newUserRef, { ...userData, ...otpData })
                    .then(() => {
                        // Data added successfully
                        alert("Register Successful");

                        // Store email and generatedOTP in localStorage
                        localStorage.setItem('signupEmail', email);
                        localStorage.setItem('generatedOTP', generatedOTP);


                            sendOTP(email, firstName, generatedOTP)
                                .then((response) => {
                                    console.log('OTP sent successfully:', response);
                                      // Redirect to otp.html
                                      localStorage.removeItem('signupEmail');
                                      localStorage.removeItem('generatedOTP');
                                      window.location.href = `otp.html?email=${encodeURIComponent(email)}`;
                                })
                                .catch((error) => {
                                    console.error('Error sending OTP:', error);
                                });
                        
                    })
                    .catch((error) => {
                        // Handle any errors
                        alert("Error adding data: " + error.message);
                    });
            }
        })
        .catch((error) => {
            // Handle any errors in retrieving data
            alert("Error fetching data: " + error.message);
        });
});