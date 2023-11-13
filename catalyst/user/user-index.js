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
  const userId = sessionStorage.getItem("userId");
  return userId;
}

// Function to fetch user data based on the user ID
async function fetchUserData(userId) {
  const userRef = ref(db, `Accounts/Users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.val();
}

// Retrieve the user ID from the session
const userId = getUserIdFromSession();
let userData = null; // Variable to store user data

// Get the dropdown element
const userNameDropdown = document.querySelector(".nav-link.dropdown-toggle");

// Disable the address textboxes initially
const addressLine1Input = document.getElementById("addressLine1");
const addressLine2Input = document.getElementById("addressLine2");
addressLine1Input.disabled = true;
addressLine2Input.disabled = true;

// Add event listener to GCN and password verification button
const verifyBtn = document.getElementById("verifyGCNAndPassword");
if (verifyBtn) {
  verifyBtn.addEventListener("click", async () => {
    // Validate GCN and password
    const gcnInput = document.getElementById("garbageControlNumber").value;
    const passwordInput = document.getElementById("gcPassword").value;

    try {
      // Fetch data from the database based on the provided GCN
      const gcnRef = ref(db, `GarbageBinControlNumber/${gcnInput}`);
      const gcnSnapshot = await get(gcnRef);
      const gcnData = gcnSnapshot.val();

      // Check if the GCN and password are valid
      if (gcnData && passwordInput === gcnData.Password) {
        // Enable the address textboxes
        addressLine1Input.disabled = false;
        addressLine2Input.disabled = false;

        // Update user data with GCN and address information
        userData.gcn = gcnInput;
        userData.addressLine1 = addressLine1Input.value;
        userData.addressLine2 = addressLine2Input.value;

        alert("GCN and Password are valid. Address textboxes are enabled. User data updated.");
      } else {
        alert("Invalid GCN or Password. Please check your input.");
      }
    } catch (error) {
      console.error("Error fetching GCN data:", error);
    }
  });
}

// Add a click event listener to the "Save changes" button
const saveChangesBtn = document.getElementById("save");
if (saveChangesBtn) {
  saveChangesBtn.addEventListener("click", async () => {
    // Update user data with the latest address information
    userData.addressLine1 = addressLine1Input.value;
    userData.addressLine2 = addressLine2Input.value;

    try {
      // Update user data in Accounts/Users
      const userUpdateRef = ref(db, `Accounts/Users/${userId}`);
      await update(userUpdateRef, {
        addressLine1: userData.addressLine1,
        addressLine2: userData.addressLine2,
        gcn: userData.gcn,  
      });

      // Update user data in GarbageBinControlNumber/corresponding GCN/Users
      const gcnUpdateRef = ref(db, `GarbageBinControlNumber/${userData.gcn}/Users/${userId}`);
      await update(gcnUpdateRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        password: userData.password,
        addressLine1: userData.addressLine1,
        addressLine2: userData.addressLine2,
      });

      alert("User data updated successfully.");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  });
}

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
          gcn: user.gcn, // Add GCN to user data
          addressLine1: user.addressLine1, // Add address line 1 to user data
          addressLine2: user.addressLine2, // Add address line 2 to user data
        };

        // Set the first name as the username
        userNameDropdown.textContent = user.firstName;

        // If user data is not found, log an error and provide a default username
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
