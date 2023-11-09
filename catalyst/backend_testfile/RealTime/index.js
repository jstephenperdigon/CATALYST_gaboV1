// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL: "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add the event listener for the Check Control Number button
document.getElementById("checkControlNumber").addEventListener('click', function () {
  const controlNumber = document.getElementById("controlNumber").value;

  isControlNumberValid(controlNumber)
    .then((isValid) => {
      if (isValid) {
        alert("Valid Control Number");
      } else {
        alert("Invalid Control Number");
      }
    })
    .catch((error) => {
      console.error("Error checking Control Number validity: " + error);
    });
});

// Function to check if GCN exists in the database
function isControlNumberValid(controlNumber) {
  const controlNumberRef = ref(db, `GarbageBinControlNumber/${controlNumber}`);

  return get(controlNumberRef)
    .then((snapshot) => {
      return snapshot.exists();
    })
    .catch((error) => {
      console.error("Error checking Control Number validity: " + error);
      return false;
    });
}

// Function to display all users
function displayAllUsers() {
  const usersRef = ref(db, "Accounts/Users"); // Adjust the reference based on your database structure

  get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();

        // Display the users (you can customize this based on your needs)
        const userDataDisplay = document.getElementById("userDataDisplay");
        userDataDisplay.innerHTML = "<h2>All Users:</h2>";

        Object.keys(users).forEach((userId) => {
          const user = users[userId];
          userDataDisplay.innerHTML += `
            <div>
              <strong>ID:</strong> ${userId}<br>
              <strong>Name:</strong> ${user.firstname} ${user.lastname}<br>
              <strong>Email:</strong> ${user.email}<br>
              <strong>Mobile Number:</strong> ${user.mobilenumber}<br>
              <strong>Password:</strong> ${user.password}<br>
              <button class="selectUser" data-user-id='${userId}'>Select User</button>
              <!-- Add more user data fields as needed -->
            </div>
            <br>
          `;
        });

        // Add event listeners to the "Select User" buttons
        document.querySelectorAll(".selectUser").forEach((button) => {
          button.addEventListener('click', function () {
            const userId = button.dataset.userId;
            populatePersonalInformation(userId);
          });
        });
      } else {
        alert("No users found");
      }
    })
    .catch((error) => {
      console.error("Error displaying users: " + error);
    });
}

// Function to populate personal information based on selected user
function populatePersonalInformation(userId) {
  document.getElementById("id").value = userId;
  document.getElementById("firstname").value = userData.firstName;
  document.getElementById("lastname").value = userData.lastName;
  document.getElementById("email").value = userData.email;
  document.getElementById("mobilenumber").value = userData.mobileNumber;
  document.getElementById("password").value = userData.password;
  // You can add additional logic to fetch and display other user details if needed
}

// Call the displayAllUsers function when the page loads
document.addEventListener('DOMContentLoaded', displayAllUsers);
