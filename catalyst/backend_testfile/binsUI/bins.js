// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

let currentBinsData = null; // Define a global variable to store the bins data

function generateReportHTML(bins) {
  // Check if district and barangay are present and not undefined
  let district = 'District not specified';
  let barangay = 'Barangay not specified';

  // Check if bins.Users is present and not undefined
  if (bins.Users !== undefined) {
    // Iterate over the keys of the Users object
    Object.keys(bins.Users).forEach(userId => {
      const user = bins.Users[userId];
      // Check if user has district and barangay fields
      if (user.district !== undefined && user.barangay !== undefined) {
        district = user.district;
        barangay = user.barangay;
        // Break the loop if district and barangay are found
        return;
      }
    });
  }

  // Define GCN variable for use in event listener
  const GCN = bins.GCN;

  const html = `
    <tr>
      <td>${bins.GCN}</td>
      <td>${bins.status}</td>
      <td>${district}</td>
      <td>${barangay}</td>
      <td class="actionButtons">
        <button class="viewButton" data-gcn="${bins.GCN}">View</button>
        <button class="editButton" data-gcn="${bins.GCN}">Edit</button>  
        <button class="deleteButton" data-gcn="${bins.GCN}">Reset</button>
      </td>
    </tr>
  `;

  // Return HTML
  return html;
}

// Function to save the edited data to Firebase database
function saveEdit() {
  const GCN = this.getAttribute("data-gcn");
  const newAction = document.getElementById("editActionInput").value;

  // Save the edited action to the Firebase database
  update(ref(db, `GarbageBinControlNumber/${GCN}`), { action: newAction })
    .then(() => {
      console.log("Action updated successfully");
      // Close the modal
      document.getElementById("editModal").style.display = "none";
      // Refresh the table
      updateTable();
    })
    .catch((error) => {
      console.error("Error updating action:", error);
    });
}

// Add event listener to each "Edit" button
document.querySelectorAll(".editButton").forEach((button) => {
  button.addEventListener("click", function () {
    const GCN = this.getAttribute("data-gcn");
    displayModal(GCN, true, function() {
      // Callback function to refresh the view or reload data
      updateTable(); // For example, you can call updateTable() to refresh the table
    });
  });
});


// Add event listener to handle edit button click
function handleEdit(GCN) {
  // Navigate to edit.html page with query parameter GCN
  displayModal(GCN, true);
}

// Modify the filterReports function to filter reports based on search input
function filterReports(searchInput, sortKey) {
  const reportsArray = document.querySelectorAll("#reportsTable tbody tr");
  reportsArray.forEach((bins) => {
    const GCN = bins.querySelector("td:nth-child(1)").textContent; // Assuming GCN is in the first column
    const columnValue = bins
      .querySelector(`td:nth-child(${getIndex(sortKey)})`)
      .textContent.toLowerCase();
    const displayStyle = columnValue.includes(searchInput) ? "" : "none";
    bins.style.display = displayStyle;
  });
}

// Function to display the modal for the selected GCN
function displayModalForGCN(GCN) {
  // Display the modal for the selected GCN
  displayModal(GCN, true);
}

// Add event listener to each search result item (GCN) to show modal when clicked
function addEventListenerToSearchResults() {
  const searchResultItems = document.querySelectorAll("#reportsTable tbody tr");
  searchResultItems.forEach((bins) => {
    const GCN = bins.querySelector("td:nth-child(1)").textContent;
    bins.addEventListener("click", function() {
      displayModalForGCN(GCN);
    });
  });
}

/// Modify the searchReports function to use the filterReports function and add event listeners to search results
window.searchReports = function() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const sortKey = document.getElementById("sortDropdown").value;

  filterReports(searchInput, sortKey);
  addEventListenerToSearchResults(); // Add event listeners to search results after filtering
};

// Function to handle live search while typing
document.getElementById("searchInput").addEventListener("input", function () {
  window.searchReports();
});

// Function to get the index of the selected column
function getIndex(key) {
  const headers = [
    "GCN",
    "status",
    "district",
    "barangay",
  ];
  return headers.indexOf(key) + 1;
}

// Update the updateTable() function to fetch data from Firebase
function updateTable() {
  const reportsRef = ref(db, "GarbageBinControlNumber");
  onValue(reportsRef, (snapshot) => {
    const reportsData = snapshot.val();
    if (reportsData) {
      const reportsArray = Object.entries(reportsData).map(
        ([GCN, bins]) => ({ GCN, ...bins })
      );
      displayReportsTable(reportsArray);
    } else {
      displayReportsTable([]);
    }
  });
}

// Function to display the reports table
function displayReportsTable(reportsArray) {
  const reportsTable = document.getElementById("reportsTable");
  const tableHTML = `
    <table border="1">
      <thead>
        <tr>
          <th>GCN UNIT</th>
          <th>STATUS</th>
          <th>DISTRICT</th>
          <th>BARANGAY</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        ${reportsArray.map(generateReportHTML).join("")}
      </tbody>
    </table>
  `;
  reportsTable.innerHTML = tableHTML;
  
  // Add event listener to "View" buttons
  document.querySelectorAll(".viewButton").forEach((button) => {
    button.addEventListener("click", function () {
      const GCN = this.getAttribute("data-gcn");
      displayModal(GCN);
    });
  });

  // Add event listener to "Edit" buttons
  document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function () {
      const GCN = this.getAttribute("data-gcn");
      handleEdit(GCN);
    });
  });

  // Add event listener to "Save" button
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveChanges); // Tiyakin na tawagin ang tamang function
  }
}


// Function to reset the list
window.resetList = function () {
  // Clear the search input
  document.getElementById("searchInput").value = "";

  // Reset the sort dropdown to the default option
  document.getElementById("sortDropdown").selectedIndex = 0;

  // Retrieve the initial data and update the table
  updateTable();
};

// Function to close the modal when the user clicks on the close button
document.querySelectorAll(".close").forEach((closeButton) => {
  closeButton.addEventListener("click", function () {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  });
});


// Gawing global variable
let currentGCN = null;

// Display modal function
function displayModal(GCN, isEditModal = false) {
  currentGCN = GCN; // Set the GCN to a global variable

  // Get the report data from Firebase based on the GCN
  const reportRef = ref(db, 'GarbageBinControlNumber/' + GCN + '/FillLevel'); // Correct path to FillLevel data
  get(reportRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const fillLevelData = snapshot.val();

        // Initialize an empty string to store the fill level details
        let fillLevelDetails = '';

        // Iterate over each fill level (GB1FillLevel to GB4FillLevel)
        for (let i = 1; i <= 4; i++) {
          const fillLevelKey = `GB${i}FillLevel`;
          const fillLevelDataSingle = fillLevelData[fillLevelKey];
          if (fillLevelDataSingle) { // Check if fill level data exists
            // Append fill level details to the string
            fillLevelDetails += `
              <h4>${fillLevelKey}</h4>
              ${isEditModal ? `
                <label for="${fillLevelKey}">GB${i}</label>
                <input type="text" id="${fillLevelKey}" class="input-field" value="${fillLevelDataSingle[`GB${i}`]}">
                <br>
                <label for="${fillLevelKey}Flag">Flag:</label>
                <input type="text" id="${fillLevelKey}Flag" class="input-field" value="${fillLevelDataSingle[`GB${i}Flag`]}">
                <br>
                <label for="${fillLevelKey}QuotaCount">Quota Count:</label>
                <input type="text" id="${fillLevelKey}QuotaCount" class="input-field" value="${fillLevelDataSingle[`GB${i}QuotaCount`]}">
                <br>
                <label for="${fillLevelKey}QuotaFlag">Quota Flag:</label>
                <input type="text" id="${fillLevelKey}QuotaFlag" class="input-field" value="${fillLevelDataSingle[`GB${i}QuotaFlag`]}">
                <br>
                <label for="${fillLevelKey}Status">Status:</label>
                <input type="text" id="${fillLevelKey}Status" class="input-field" value="${fillLevelDataSingle[`GB${i}Status`]}">
                <br>
              ` : `
              <p>GB${i}: ${fillLevelDataSingle[`GB${i}`]}</p>
              <p>Flag: ${fillLevelDataSingle[`GB${i}Flag`]}</p>
              <p>Quota Count: ${fillLevelDataSingle[`GB${i}QuotaCount`]}</p>
              <p>Quota Flag: ${fillLevelDataSingle[`GB${i}QuotaFlag`]}</p>
              <p>Status: ${fillLevelDataSingle[`GB${i}Status`]}</p>
              <hr>
              `}
            `;
          }
        }

// Add password field if it's an edit modal
let passwordField = '';
if (isEditModal) {
  // Get the password data from Firebase
  const passwordRef = ref(db, `GarbageBinControlNumber/${GCN}/Password`);
  get(passwordRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const password = snapshot.val();
        // Populate the password field
        passwordField = `
          <h4>Password</h4>
          <label>Password</label>
          <input type="text" id="password" class="input-field" value="${password}">
        `;
      } else {
        // If the password doesn't exist, display an empty field
        passwordField = `
          <h4>Password</h4>
          <label>Password</label>
          <input type="text" id="password" class="input-field" value="">
        `;
      }
      // Add the password field to the modal content
      modalContent.innerHTML = `
        <h4>FILL LEVEL DETAILS:</h4>
        ${fillLevelDetails}
        ${passwordField}
        <h4>Users:</h4>
        <!-- User details -->
      `;
      // Rest of the modal display logic...
    })
    .catch((error) => {
      console.error("Error retrieving password:", error);
      // Display an error message if there's an issue fetching the password
      passwordField = `
        <h4>Password</h4>
        <p>Error retrieving password data.</p>
      `;
      // Add the password field to the modal content
      modalContent.innerHTML = `
        <h4>FILL LEVEL DETAILS:</h4>
        ${fillLevelDetails}
        ${passwordField}
        <h4>Users:</h4>
        <!-- User details -->
      `;
      // Rest of the modal display logic...
    });
} else {
  // If it's not an edit modal, do not display the password field
  passwordField = '';
}


        // Fetch user data for the specified GCN
        const usersRef = ref(db, 'GarbageBinControlNumber/' + GCN + '/Users');
        get(usersRef)
          .then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const usersData = userSnapshot.val();
              let usersHTML = ''; // Initialize variable to store user details HTML

              // Iterate over each user and construct the HTML
              Object.keys(usersData).forEach(userId => {
                const user = usersData[userId];
                usersHTML += `
                  <h4>User Details:</h4>
                  ${isEditModal ? `
                    <label for="addressLine1_${userId}">Address Line 1</label>
                    <input type="text" id="addressLine1_${userId}" class="input-field" value="${user.addressLine1 || ''}">
                    <br>
                    <label for="barangay_${userId}">Barangay</label>
                    <input type="text" id="barangay_${userId}" class="input-field" value="${user.barangay || ''}">
                    <br>
                    <label for="city_${userId}">City</label>
                    <input type="text" id="city_${userId}" class="input-field" value="${user.city || ''}">
                    <br>
                    <label for="country_${userId}">Country</label>
                    <input type="text" id="country_${userId}" class="input-field" value="${user.country || ''}">
                    <br>
                    <label for="district_${userId}">District</label>
                    <input type="text" id="district_${userId}" class="input-field" value="${user.district || ''}">
                    <br>
                    <label for="email_${userId}">Email</label>
                    <input type="email" id="email_${userId}" class="input-field" value="${user.email || ''}">
                    <br>
                    <label for="firstName_${userId}">First Name</label>
                    <input type="text" id="firstName_${userId}" class="input-field" value="${user.firstName || ''}">
                    <br>
                    <label for="lastName_${userId}">Last Name</label>
                    <input type="text" id="lastName_${userId}" class="input-field" value="${user.lastName || ''}">
                    <br>
                    <label for="mobileNumber_${userId}">Mobile Number</label>
                    <input type="tel" id="mobileNumber_${userId}" class="input-field" value="${user.mobileNumber || ''}">
                    <br>
                    <label for="province_${userId}">Province</label>
                    <input type="text" id="province_${userId}" class="input-field" value="${user.province || ''}">                
                    <br>
                  ` : `
                  <p>Address Line 1: ${user.addressLine1}</p>
                  <p>Barangay: ${user.barangay}</p>
                  <p>City: ${user.city}</p>
                  <p>Country: ${user.country}</p>
                  <p>District: ${user.district}</p>
                  <p>Email: ${user.email}</p>
                  <p>First Name: ${user.firstName}</p>
                  <p>Last Name: ${user.lastName}</p>
                  <p>Mobile Number: ${user.mobileNumber}</p>
                  <p>Province: ${user.province}</p>
                  `}
                `;
              });

              // Add user details HTML to the modal content
              modalContent.innerHTML = `
                <h4>FILL LEVEL DETAILS:</h4>
                ${fillLevelDetails}
                ${passwordField}
                ${usersHTML} <!-- Add user details HTML here -->
                ${isEditModal ? '<button id="saveBtn" class="btn">Save</button>' : ''}
              `;
              
              // If it's an edit modal, add event listener to the save button
              if (isEditModal) {
                const saveBtn = document.getElementById("saveBtn");
                saveBtn.addEventListener("click", saveChanges);
              }
            } else {
              // If no users found, display a message
              modalContent.innerHTML = "<p>No users found.</p>";
            }
          })
          .catch((error) => {
            console.error("Error retrieving user data:", error);
            // Display an error message if there's an issue fetching the user data
            modalContent.innerHTML = "<p>Error retrieving user data.</p>";
          });
      } else {
        // If the report doesn't exist, display a message
        modalContent.innerHTML = "<p>Report not found.</p>";
      }

      // Display the modal
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Error retrieving report:", error);
      // Display an error message if there's an issue fetching the report
      modalContent.innerHTML = "<p>Error retrieving report data.</p>";
      // Display the modal
      modal.style.display = "block";
    });

  // Close modal when the user clicks on the close button
  const closeButton = modal.querySelector(".close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  // Close modal when the user clicks outside the modal
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}


// Update function for saving changes
function saveChanges() {
  console.log("Save button clicked"); // Debugging statement

  const GCN = currentGCN; // Get the current GCN

  // Construct the reference to the GCN node
  const gcnRef = ref(db, `GarbageBinControlNumber/${GCN}`);

  // Create an object to hold the updated data
  const updatedData = {};

  // Loop through each garbage bin fill level
  for (let i = 1; i <= 4; i++) {
    const fillLevelKey = `GB${i}FillLevel`; // Construct the fill level key
    const fillLevelData = {}; // Initialize fill level data object

    // Get the fill level value and other details from the modal
    fillLevelData[`GB${i}`] = document.getElementById(`GB${i}`).value;
    fillLevelData[`GB${i}Flag`] = document.getElementById(`GB${i}Flag`).value || '';
    fillLevelData[`GB${i}QuotaCount`] = document.getElementById(`GB${i}QuotaCount`).value || '';
    fillLevelData[`GB${i}QuotaFlag`] = document.getElementById(`GB${i}QuotaFlag`).value || '';
    fillLevelData[`GB${i}Status`] = document.getElementById(`GB${i}Status`).value || '';

    // Add the fill level data to the updatedData object
    updatedData[`FillLevel/${fillLevelKey}`] = fillLevelData;
  }

  // Get the password value from the modal
  const password = document.getElementById("password").value;
  console.log("Password:", password); // Debugging statement
  // Add the password to the updatedData object
  updatedData["Password"] = password;

  // Get all user input fields
  const users = document.querySelectorAll(".input-field");

  // Loop through each user input field
  users.forEach((input) => {
    const fieldId = input.id.split("_"); // Split the input field ID
    const userId = fieldId[fieldId.length - 1]; // Get the user ID
    const fieldType = fieldId.slice(0, -1).join('_'); // Get the field type

    if (!updatedData[`Users/${userId}`]) {
      updatedData[`Users/${userId}`] = {}; // Initialize user data object
    }

    const value = input.value.trim(); // Trim the value to remove leading and trailing spaces

    // Check if value is not empty before adding to updatedData
    if (value !== "") {
      updatedData[`Users/${userId}`][fieldType] = value; // Set the user data
    }
  });

  console.log("Updated Data:", updatedData); // Debugging statement

  // Update the data in the database
  update(gcnRef, updatedData)
    .then(() => {
      alert("Changes saved successfully!"); // Show success message
    })
    .catch((error) => {
      console.error("Error updating data:", error);
      alert("Failed to save changes. Please try again."); // Show error message
    });
}


// Itakda ang mga event listeners sa labas ng function na displayModal
window.onload = function () {
  updateTable();
};

