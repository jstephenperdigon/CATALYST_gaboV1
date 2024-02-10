// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
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

// Function to navigate back to HouseholdList.html
function goBack() {
  window.location.href = "CollectorList.html";
}

// Attach the goBack function to the BackButton click event
document.getElementById("BackButton").addEventListener("click", goBack);

// Function to update the user information in the database
function updateUserInfo(name, updatedInfo) {
  const userRef = ref(db, `Accounts/Collectors/${name}`);
  update(userRef, updatedInfo)
    .then(() => {
      console.log("User information updated successfully");
      goBack(); // Redirect back to the list after updating
    })
    .catch((error) => {
      console.error("Error updating user information: ", error);
    });
}

// Function to fetch user data and populate the form
function populateForm() {
  // Check if there is a query parameter for updating a specific user
  const params = new URLSearchParams(window.location.search);
  const userNameToUpdate = params.get("name");

  if (userNameToUpdate) {
    const userRef = ref(db, `Accounts/Collectors/${userNameToUpdate}`);
    get(userRef)
      .then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          // Populate the form fields with user data
          document.getElementById("firstName").value = userData.firstName || "";
          document.getElementById("lastName").value = userData.lastName || "";
          document.getElementById("email").value = userData.email || "";
          document.getElementById("mobile").value = userData.mobileNumber || "";
          document.getElementById("district").value = userData.district || "";
          document.getElementById("password").value = userData.password || "";
        } else {
          console.error("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user information: ", error);
      });
  } else {
    console.error("No user name provided in the query parameter");
  }
}

// Populate the form when the page loads
window.onload = function () {
  populateForm();
};

// Handle form submission
document
  .getElementById("updateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const updatedInfo = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      mobileNumber: document.getElementById("mobile").value,
      district: document.getElementById("district").value,
      password: document.getElementById("password").value,
    };

    // Check if there is a query parameter for updating a specific user
    const params = new URLSearchParams(window.location.search);
    const userNameToUpdate = params.get("name");

    if (userNameToUpdate) {
      updateUserInfo(userNameToUpdate, updatedInfo);
    } else {
      console.error("No user name provided in the query parameter");
    }
  });
