import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL:"https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// Function to retrieve user ID from session
function getUserIdFromSession() {
    const userId = sessionStorage.getItem("userId");
    return userId;
  }
  
  // Function to fetch user data based on the user ID
  async function fetchUserData(userId) {
    const userRef = ref(db, "Accounts/Users/" + userId);;
    const snapshot = await get(userRef);
    return snapshot.val();
  }
  
  // Retrieve the user ID from the session
  const userId = getUserIdFromSession();

// Get the dropdown element
const userNameDropdown = document.querySelector(".nav-link.dropdown-toggle");

// Check if the user ID is available
if (userId) {
  // Fetch user data and populate the username in the dropdown
  fetchUserData(userId)
    .then(user => {
      if (user) {
        // Set the first name as the username
        userNameDropdown.textContent = user.firstName;
      } else {
        // If user data is not found, you can provide a default username
        userNameDropdown.textContent = "Default Username";
        console.error("User data not found.");
      }
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
    });
} else {
  // Handle the case where the user ID is not found in the session
  console.error("User ID not found.");
  // You might want to redirect the user to the login page or take appropriate action.
}

// Logout function
function logout() {
    // Clear the user ID from the session
    sessionStorage.removeItem("userId");
    
    // Redirect to the sign-in page
    window.location.href = "../signup_signin/sign-in.html";
  }
  
  // Add a click event listener to the "Log Out" button
  const logOutBtn = document.getElementById("logOutBtn");
  if (logOutBtn) {
    logOutBtn.addEventListener("click", logout);
  }