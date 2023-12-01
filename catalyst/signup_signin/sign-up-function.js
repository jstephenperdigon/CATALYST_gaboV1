// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL:
    "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// emailjs config
emailjs.init("TN6jayxVlZMzQ3Ljt");

// Function to send OTP via email
function sendOTP(toEmail, firstName, otp) {
  const templateParams = {
    to_email: toEmail,
    first_name: firstName,
    otp: otp,
  };

  return emailjs
    .send("service_qpkq4ee", "template_l3cy9we", templateParams)
    .then(() => {
      // Return both OTP and email for further processing
      return { otp: otp, email: toEmail };
    });
}

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();

  // Trigger front-end validations from design.js
  const forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.classList.add("was-validated");
  });

  // Check if front-end validations passed
  if (!document.querySelector(".was-validated")) {
    // Front-end validations failed, exit
    return;
  }

  // Get input values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const mobileNumber = document.getElementById("mobile_number").value;
  const password = document.getElementById("password-input").value;
  const confirmPassword = document.getElementById("passwordConfirmation").value;
  const agreeTermsCheckbox = document.getElementById("agreeTerms");

  // Check if required fields are not empty and checkbox is checked
  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    email.trim() === "" ||
    mobileNumber.trim() === "" ||
    password.trim() === "" ||
    !agreeTermsCheckbox.checked
  ) {
    console.log("Please fill in all required fields and agree to the terms.");
    return;
  }

  // Check if password and password confirmation match
  if (password !== confirmPassword) {
    alert("Password and password confirmation do not match.");
    return;
  }

  // Check if the email or mobile number already exists
  get(ref(db, "Accounts/Users"))
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
        alert(
          "This email is already registered. Please use a different email."
        );
      } else if (mobileExists) {
        alert(
          "This mobile number is already registered. Please use a different number."
        );
      } else {
        // Email and mobile number do not exist, proceed to add the user data
        const userData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNumber: mobileNumber,
          password: password,
        };

        // Generate a random 6-digit OTP
        const generatedOTP = Math.floor(100000 + Math.random() * 900000);

        // Set the OTP and timestamp in the database
        const otpData = {
          otp: generatedOTP,
          timestamp: Date.now() + 10 * 1000, // 1 minute in milliseconds
        };

        // Create a new user node with the OTP data
        const newUserRef = push(ref(db, "Accounts/Users"));
        set(newUserRef, { ...userData, ...otpData })
          .then(() => {
            // Data added successfully
            alert("Register Successful");

            // Store email and generatedOTP in localStorage
            localStorage.setItem("signupEmail", email);
            localStorage.setItem("generatedOTP", generatedOTP);

            // Set a timer to erase the OTP when it expires
            const expirationTime = otpData.timestamp - Date.now();
            setTimeout(() => {
              localStorage.removeItem("generatedOTP");
              alert("OTP has expired and been erased.");

              // Remove the OTP from the real-time database
              const otpRef = ref(db, `Accounts/Users/${newUserRef.key}/otp`);
              set(otpRef, null) // Setting the value to null effectively removes it
                .then(() => {
                  alert("OTP removed from the database.");
                })
                .catch((error) => {
                  console.error("Error removing OTP from the database:", error);
                });
            }, expirationTime);
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
