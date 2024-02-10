import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
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

// Function to get user details by name
async function getUserDetails(name) {
  const userRef = ref(db, `Accounts/Collectors/${name}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.error(`User with name ${name} not found.`);
    return null;
  }
}

// Function to display user details on the page
function displayUserDetails(user) {
  document.getElementById("name").textContent =
    user.firstName + " " + user.lastName;
  document.getElementById("email").textContent = user.email;
  document.getElementById("mobile").textContent = user.mobileNumber;
  document.getElementById("district").textContent = user.district;
  document.getElementById("password").textContent = user.password;
}

// Function to navigate back to HouseholdList.html
function Back() {
  window.location.href = "CollectorList.html";
}

// Extract user name from the URL parameter
const params = new URLSearchParams(window.location.search);
const userName = params.get("name");

// Check if a user name is provided in the URL
if (userName) {
  // Fetch user details and display on the page
  getUserDetails(userName).then((user) => {
    if (user) {
      displayUserDetails(user);
    }
  });
} else {
  console.error("User name not provided in the URL.");
}

// Attach the goBack function to the BackButton click event
document.getElementById("BackButton").addEventListener("click", Back);
