import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, update, set, onValue, child } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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


// Function to display fill levels for GB1 to GB4 based on the user's control number
function displayFillLevels() {
// Retrieve user data
fetchUserData(userId)
  .then((user) => {
    if (user && user.gcn) {
      // Use the user's control number to construct the path
      const gcnRef = ref(db, `GarbageBinControlNumber/${user.gcn}/FillLevel`);

      // Listen for changes in the database
      onValue(gcnRef, (snapshot) => {
        if (snapshot.exists()) {
          const fillLevels = snapshot.val();

          // Update the fill levels and colors for each bin
          updateFillLevel('GB1', fillLevels.GB1);
          updateFillLevel('GB2', fillLevels.GB2);
          updateFillLevel('GB3', fillLevels.GB3);
          updateFillLevel('GB4', fillLevels.GB4);
        } else {
          console.log("No data available");
        }
      }, (error) => {
        console.error("Error listening for data changes:", error);
      });
    } else {
      console.error("User data or control number not available.");
    }
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });
}


// Function to update fill level for a specific bin
function updateFillLevel(binId, fillLevel) {
const binElement = document.getElementById(binId);

// Check if the element with the specified ID exists
if (binElement) {
  const fillLevelElement = binElement.closest('.fill-level');

  // Update the fill level style and data-percentage attribute
  fillLevelElement.style.height = fillLevel + '%';
  fillLevelElement.setAttribute('data-percentage', fillLevel);

  // Update the text content inside the container
  const containerElement = fillLevelElement.querySelector('.container');
  containerElement.textContent = `${fillLevel}`;

  // Update the fill level color based on conditions
  updateFillLevelColor(fillLevelElement, fillLevel);
} else {
  console.error(`Element with ID ${binId} not found.`);
}
}

// Function to update fill level color based on conditions
function updateFillLevelColor(fillLevelElement, fillLevel) {
if (fillLevel < 30) {
  fillLevelElement.classList.remove('fill-level2', 'fill-level3');
  fillLevelElement.classList.add('fill-level1');
} else if (fillLevel >= 30 && fillLevel < 70) {
  fillLevelElement.classList.remove('fill-level1', 'fill-level3');
  fillLevelElement.classList.add('fill-level2');
} else {
  fillLevelElement.classList.remove('fill-level1', 'fill-level2');
  fillLevelElement.classList.add('fill-level3');
}
}

// Function to fetch user information including GCN from the database based on user ID
async function getUserInfoFromDatabase(userId) {
try {
  // Replace the following line with your actual logic to fetch user information based on the user ID
  const userRef = ref(db, `Accounts/Users/${userId}`);
  const userSnapshot = await get(userRef);
  const user = userSnapshot.val();

  // Assuming you have properties like gcn, firstName, lastName, email, mobileNumber, district, barangay, addressLine1, addressLine2 in the user data
  if (user && user.gcn && user.firstName && user.lastName && user.email && user.mobileNumber && user.district && user.barangay && user.addressLine1 && user.addressLine2) {
    return {
      gcn: user.gcn,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      district: user.district,
      barangay: user.barangay,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
    };
  } else {
    console.error('User information not found for the user.');
    return null;
  }
} catch (error) {
  console.error('Error fetching user information:', error);
  return null;
}
}

// Function to generate a random four-alphanumeric string
function generateRandomAlphanumeric() {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let randomString = '';
for (let i = 0; i < 4; i++) {
  randomString += characters.charAt(Math.floor(Math.random() * characters.length));
}
return randomString;
}

function submitForm() {
// Fetch user ID from session
const userId = getUserIdFromSession();

// Check if user ID exists
if (userId) {
  // Fetch user information including GCN from the database using userID
  getUserInfoFromDatabase(userId)
    .then((userInfo) => {
      // Check if user information exists
      if (userInfo) {
        // Fetch form data
        const issueTypeElement = document.getElementById('issueType');
        const issueType = issueTypeElement.value;
        const otherIssueDescriptionElement = document.getElementById('otherIssueDescription');
        const otherIssueDescription = otherIssueDescriptionElement.value;
        const reportDescriptionElement = document.getElementById('reportDescriptionFields');
        const reportDescription = reportDescriptionElement.value;

        // Check if the selected issueType is the default placeholder value
        if (issueType === "") {
          console.log('Please select a valid problem type.');
          return; // Do not proceed further
        }

        // Check if the issueType is 'other' and otherIssueDescription is empty
        if (issueType === 'other' && otherIssueDescription.trim() === "") {
          console.log('Please provide a description for the "other" problem type.');
          return; // Do not proceed further
        }

        // Check if the issueType is not 'other' and reportDescription is not provided
        if (issueType !== 'other' && reportDescription.trim() === "") {
          console.log('Warning: No description provided for the selected problem type.');
          // Allow to proceed even if reportDescription is empty
        }

        // Create a timestamp for the report
        const timestamp = new Date();

        // Format the date as MM-DD-YYYY
        const formattedDate = (timestamp.getMonth() + 1).toString().padStart(2, '0') + '-' +
                              (timestamp.getDate()).toString().padStart(2, '0') + '-' +
                              timestamp.getFullYear();

        // Format the time as HH:MM:SS AM/PM (12-hour format)
        const formattedTime12 = timestamp.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

        // Generate a unique ticket number without hyphens and with a random four-alphanumeric string
        const ticketNumber = `${userInfo.gcn}${formattedDate.replace(/-/g, '')}${generateRandomAlphanumeric()}`;

        // Prepare the report data including user information
        const reportData = {
          Date: formattedDate,
          Problem: issueType,
          Description: issueType === 'other' ? otherIssueDescription : reportDescription,
          gcn: userInfo.gcn,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          mobileNumber: userInfo.mobileNumber,
          district: userInfo.district,
          barangay: userInfo.barangay,
          addressLine1: userInfo.addressLine1,
          addressLine2: userInfo.addressLine2,
          timeFormat12: formattedTime12,
          userID: userId,
        };

        // Reference to the 'Reports' database
        const reportsRef = ref(db, 'Reports');

        // Use set instead of push to set a specific key (ticket number) for the record
        set(child(reportsRef, ticketNumber), reportData)
          .then(() => {
            console.log('Report submitted successfully.');
          })
          .catch((error) => {
            console.error('Error submitting report:', error);
          });
      } else {
        console.log('User information not found for the user.');
      }
    })
    .catch((error) => {
      console.error('Error fetching user information:', error);
    });
} else {
  console.log('User ID not found in the session.');
}
}

// Attach click event listener to the button
document.getElementById('submitReport').addEventListener('click', submitForm);


// Check if the user has a GCN and update the UI accordingly
fetchUserData(userId)
    .then((user) => {
        if (user && user.gcn) {
            // User has a GCN, display bins
            document.getElementById("binsRow").style.display = "flex";
            document.getElementById("noDeviceRow").style.display = "none";
        } else {
            // User does not have a GCN, display "No Device Available"
            document.getElementById("binsRow").style.display = "none";
            document.getElementById("noDeviceRow").style.display = "flex";
        }

    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });

            // Call the displayFillLevels function to initiate the update
            displayFillLevels();    