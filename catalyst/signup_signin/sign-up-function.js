// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

document.getElementById("submit").addEventListener('click', function (e) {
    e.preventDefault();
  
    // Get input values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const mobileNumber = document.getElementById('mobile_number').value;
    const password = document.getElementById('password-input').value;
  
    const usersRef = ref(db, 'Accounts/Users');
  
    // Check if the email or mobile number already exists
    get(usersRef)
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
  
          // Get a new unique key for the user
          const newUserRef = push(usersRef); // Firebase will generate a unique key
  
          // Set the user data under the unique key
          set(newUserRef, userData)
            .then(() => {
              // Data added successfully
              alert("Data added to Firebase under Accounts/Users");
              // Reload the page to prevent duplicate entries
              window.location.reload();
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
  