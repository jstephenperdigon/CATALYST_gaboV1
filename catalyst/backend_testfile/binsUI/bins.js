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

// Add event listener to the edit button
document.querySelectorAll(".editButton").forEach((button) => {
  button.addEventListener("click", function () {
    const GCN = this.getAttribute("data-gcn");
    handleEdit(GCN);
  });
});

// Add event listener to handle edit button click
function handleEdit(GCN) {
  // Display the modal and populate it with data
  displayModal(GCN, true);

  // Populate the edit modal with the data from the "View" button
  const editActionInput = document.getElementById("editActionInput");
  if (currentBinsData) {
    editActionInput.value = currentBinsData.action;
  }
  

  // Add event listener to the save edit button
  const saveEditButton = document.getElementById("saveEditButton");
  saveEditButton.setAttribute("data-gcn", GCN); // Store GCN in the button for later use
  saveEditButton.addEventListener("click", saveEdit); // Add event listener here
}

// Add event listener to close edit modal button
const closeEditButton = document.getElementById("closeEditButton");
closeEditButton.addEventListener("click", function () {
  const editModal = document.getElementById("editModal");
  editModal.style.display = "none";
});

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

// Function to handle displaying modal for the selected GCN
function displayModalForGCN(GCN) {
  // Display the modal for the selected GCN
  displayModal(GCN, true);
}

// Add event listener to each search result item (GCN) to show modal when clicked
function addEventListenerToSearchResults() {
  const searchResultItems = document.querySelectorAll("#reportsTable tbody tr");
  searchResultItems.forEach((bins) => {
    const GCN = bins.querySelector("td:nth-child(1)").textContent; // Assuming GCN is in the first column
    bins.addEventListener("click", function() {
      displayModalForGCN(GCN);
    });
  });
}

// Modify the searchReports function to use the filterReports function and add event listeners to search results
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

function displayModal(GCN, isEditModal = false) {
  // Code for displaying modal content...

  // Retrieve report data from Firebase based on GCN
  const reportRef = ref(db, `GarbageBinControlNumber/${GCN}`);
  get(reportRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const bins = snapshot.val();

        // Initialize an empty string to store the fill level details
        let fillLevelDetails = '';

        // Iterate over each fill level (GB1FillLevel to GB4FillLevel)
        for (let i = 1; i <= 4; i++) {
          const fillLevelKey = `GB${i}FillLevel`;
          const fillLevelData = bins.FillLevel[fillLevelKey];
          if (fillLevelData) {
            // Append fill level details to the string
            fillLevelDetails += `
              <h4>${fillLevelKey}</h4>
              <p>GB${i}: ${fillLevelData[`GB${i}`]}</p>
              <p>Flag: ${fillLevelData[`GB${i}Flag`]}</p>
              <p>Quota Count: ${fillLevelData[`GB${i}QuotaCount`]}</p>
              <p>Quota Flag: ${fillLevelData[`GB${i}QuotaFlag`]}</p>
              <p>Status: ${fillLevelData[`GB${i}Status`]}</p>
              <hr>
            `;
          }
        }

          // Add password field if it's an edit modal
          let passwordField = '';
          if (isEditModal) {
            passwordField = `
              <p>Password: ${bins.Password}</p>
            `;
          }

        // Populate modal content with fill level details, password field, and user details
        modalContent.innerHTML = `
          <h4>FILL LEVEL DETAILS:</h4>
          ${fillLevelDetails}
          ${passwordField}
          <h4>Users:</h4>
          <ul>
            ${Object.keys(bins.Users).map((userId) => {
              const user = bins.Users[userId];
              return `
                  <p>Address Line 1: ${bins.addressLine1}</p>
                  <p>Address Line 2: ${bins.addressLine2}</p>
                  <p>Barangay: ${bins.barangay}</p>
                  <p>City: ${bins.city}</p>
                  <p>Country: ${bins.country}</p>
                  <p>District: ${bins.district}</p>
                  <p>Email: ${bins.email}</p>
                  <p>First Name: ${bins.firstName}</p>
                  <p>Last Name: ${bins.lastName}</p>
                  <p>Mobile Number: ${bins.mobileNumber}</p>
              `;
            }).join("")}
          </ul>
          ${isEditModal ? '<button id="saveEditModalButton">Save</button>' : ''} <!-- Save button for edit modal -->
        `;

        // If it's an edit modal, add event listener to the save button
        if (isEditModal) {
          const saveEditModalButton = document.getElementById("saveEditModalButton");
          saveEditModalButton.addEventListener("click", saveEdit);
        }

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



// Display the initial reports table when the page loads
window.onload = function () {
  updateTable();
};
