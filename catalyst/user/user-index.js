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

        // Display the updated content in the card
        updateCardContent();

        // Disable the control number textbox, password textbox, and verify button
        document.getElementById("garbageControlNumber").disabled = true;
        document.getElementById("gcPassword").disabled = true;
        verifyBtn.disabled = true;

        // Enable the "Save changes" and "Cancel" buttons
        saveChangesBtn.disabled = false;
        cancelBtn.disabled = false;

        alert("GCN and Password are valid.");
      } else {
        alert("Invalid GCN or Password. Please check your input.");
      }
    } catch (error) {
      console.error("Error fetching GCN data:", error);
    }
  });
}

// Function to update the content in the card
function updateCardContent() {
  const cardContent = document.querySelector(".card-body");
  if (cardContent) {
    cardContent.innerHTML = `
      <div class="fs-3 font-monospace text-center text-muted fw-light">
        ${userData && userData.gcn ? `GCN: ${userData.gcn}` : 'No device/s available.'}
      </div>
    `;
  }
}

// Add a click event listener to the "Save changes" button
const saveChangesBtn = document.getElementById("save");
if (saveChangesBtn) {
  // Disable the "Save changes" button initially
  saveChangesBtn.disabled = true;

  saveChangesBtn.addEventListener("click", async () => {
    // Update user data with the latest address information
    userData.addressLine1 = addressLine1Input.value;
    userData.addressLine2 = addressLine2Input.value;

    // Add the selected district and barangay to user data
    userData.district = document.getElementById("districtDropdown").value;
    userData.barangay = document.getElementById("barangayDropdown").value;

    try {
      // Update user data in Accounts/Users
      const userUpdateRef = ref(db, `Accounts/Users/${userId}`);
      await update(userUpdateRef, {
        addressLine1: userData.addressLine1,
        addressLine2: userData.addressLine2,
        gcn: userData.gcn,
        district: userData.district, // Add district to user data
        barangay: userData.barangay, // Add barangay to user data
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
        district: userData.district,
        barangay: userData.barangay,
      });

      alert("User data updated successfully.");

      // Check if the modal is open (assuming your modal ID is "addDeviceModal")
      const modalElement = document.getElementById("addDeviceModal");
      if (modalElement) {
        // Close the modal using MDB method
        mdb.Modal.getInstance(modalElement).hide();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  });
}

// Add a click event listener to the "Cancel" button
const cancelBtn = document.getElementById("cancel");
if (cancelBtn) {
  // Disable the "Cancel" button initially
  cancelBtn.disabled = true;

  cancelBtn.addEventListener("click", () => {
    // Disable the "Cancel" button, address textboxes, and the "Save changes" button
    cancelBtn.disabled = true;
    addressLine1Input.disabled = true;
    addressLine2Input.disabled = true;
    saveChangesBtn.disabled = true;

    // Enable the control number textbox, password textbox, and the verify button
    document.getElementById("garbageControlNumber").disabled = false;
    document.getElementById("gcPassword").disabled = false;
    verifyBtn.disabled = false;
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

        // Display the GCN in the card content if available
        updateCardContent();
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
