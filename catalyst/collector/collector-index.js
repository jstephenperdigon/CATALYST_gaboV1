import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Function to retrieve user ID from session
function getUserIdFromSession() {
  return sessionStorage.getItem("userId");
}

// Function to fetch user data based on the user ID
async function fetchUserData(userId) {
  const userRef = ref(db, `Accounts/Collectors/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.val();
}

// Function to fetch accounts with the same district
async function fetchAccountsByDistrict(district) {
  const accountsRef = ref(db, 'Accounts/Users');
  const snapshot = await get(accountsRef);
  const accounts = snapshot.val();
  
  // Filter accounts with the same district
  const filteredAccounts = Object.values(accounts).filter(account => account.district === district);

  return filteredAccounts;
}

// Function to display accounts in the district list
function displayAccountsInDistrictList(accounts) {
  const districtList = document.getElementById('districtList');

  // Clear previous content
  districtList.innerHTML = '';

  // Display each account in the list
  accounts.forEach(account => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = `${account.firstName} ${account.lastName} - ${account.email}`;
    districtList.appendChild(listItem);
  });
}

// Function to handle logout
function logout() {
  // Clear the user ID from the session
  sessionStorage.removeItem("userId");

  // Redirect to the sign-in page
  window.location.href = "collector-sign-in.html";
}

// Function to update card content with user data
function updateCardContent() {
  // Get the card header element
  const cardHeader = document.querySelector(".card-header");

  // Check if district information is available
  if (userData && userData.district) {
    // Update the card header content with the district number
    cardHeader.textContent = ` ${userData.district}`;
  } else {
    // Handle the case where district information is not available
    cardHeader.textContent = "District information not found";
  }
}

// Retrieve the user ID from the session
const userId = getUserIdFromSession();
let userData = null; // Variable to store user data

// Get the dropdown element
const userNameDropdown = document.querySelector(".nav-link.dropdown-toggle");

// Check if the user ID is available
if (userId) {
  // Fetch user data and log it to the console
  fetchUserData(userId)
    .then((user) => {
      if (user) {
        // Store the user data in the variable for future use
        userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          password: user.password,
          district: user.district, // Assuming district information is available in the user object
        };

        // Set the first name as the username
        userNameDropdown.textContent = user.firstName;

        // Display the district in the card content if available
        updateCardContent();

        // Fetch accounts with the same district and display them
        fetchAccountsByDistrict(userData.district)
          .then(accounts => {
            displayAccountsInDistrictList(accounts);
          })
          .catch(error => {
            console.error('Error fetching accounts:', error);
          });
      } else {
        console.error("User data not found.");
        userNameDropdown.textContent = "Default Username";
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
} else {
  // Handle the case where the user ID is not found in the session
  console.error("User ID not found.");
  // You might want to redirect the user to the login page or take appropriate action.
}

// Add a click event listener to the "Log Out" button
const logOutBtn = document.getElementById("logOutBtn");
if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}
