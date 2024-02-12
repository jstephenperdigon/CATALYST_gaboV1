// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

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

const usersRef = ref(db, "Accounts/Collectors");

// Function to handle form submission
function addUser(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const mobileNumber = document.getElementById("mobileNumber").value;
  const district = document.getElementById("district").value;
  const password = document.getElementById("password").value;

  // Create a new user object
  const newUser = {
    firstName,
    lastName,
    email,
    mobileNumber,
    district,
    password,
  };

  // Push the new user data to the "users" node in the database
  const newUserRef = push(usersRef);
  set(newUserRef, newUser);

  // Optionally, you can redirect the user to another page after successful submission
  window.location.href = "CollectorList.html";
}

// Attach the addUser function to the form submission event
document.getElementById("viewForm").addEventListener("submit", addUser);

// Function to navigate back to HouseholdList.html
function Back() {
  window.location.href = "CollectorList.html";
}

// Attach the goBack function to the BackButton click event
document.getElementById("BackButton").addEventListener("click", Back);
