// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
  remove, // Import the remove function
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

// Function to redirect to the "View User" page
window.viewReport = function (UId) {
  // Add the logic to redirect to the "View User" page with the appropriate query parameter
  window.location.href = `CollectorView.html?UId=${UId}`;
};

// Function to redirect to the "Update User" page
window.updateReport = function (UId) {
  // Add the logic to redirect to the "Update User" page with the appropriate query parameter
  window.location.href = `CollectorUpdate.html?UId=${UId}`;
};

// Function to redirect to the "Add User" page
window.AddUser = function () {
  // Add the logic to redirect to the "Add User" page
  window.location.href = `CollectorCreate.html?UId=${""}`;
};

// Function to generate the HTML for a single report
function generateReportHTML(report) {
  return `
        <tr>
            <td>${report.GCL}</td>
            <td>${report.UserInfo.firstName} ${report.UserInfo.lastName}</td>
            <td>${report.UserInfo.email}</td>
            <td>${report.UserInfo.mobileNumber}</td>
            <td>${report.UserInfo.district}</td>
            <td>${report.UserInfo.barangay}</td>
          <td class="actions-column">
            <div class="horizontal-icons">
              <button class="view-button" onclick="viewReport('${report.UId}')">
                <i class='bx bxs-show'></i>
              </button>
              <button class="update-button" onclick="updateReport('${report.UId}')">
                <i class='bx bxs-edit'></i>
              </button>
              <button class="delete-button" onclick="deleteReport('${report.UId}')">
                <i class='bx bxs-trash'></i>
              </button>
            </div>
          </td>
        </tr>
    `;
}

// Function to filter reports based on search input and selected sorting column
function filterReports(searchInput, sortKey) {
  const reportsArray = document.querySelectorAll("#reportsTable tbody tr");
  reportsArray.forEach((report) => {
    const columnValue = report
      .querySelector(`td:nth-child(${getIndex(sortKey)})`)
      .textContent.toLowerCase();
    const displayStyle = columnValue.includes(searchInput) ? "" : "none";
    report.style.display = displayStyle;
  });
}

// Add an event listener for Enter key press on the search input field
document
  .getElementById("searchInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchReports();
    }
  });

// Modify the searchReports function to use the filterReports function
window.searchReports = function () {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const sortKey = document.getElementById("sortDropdown").value;

  filterReports(searchInput, sortKey);
};

// Function to get the index of the selected column
function getIndex(key) {
  const headers = [
    "GCL",
    "Name",
    "email",
    "mobileNumber",
    "district",
    "barangay",
  ];
  return headers.indexOf(key) + 1;
}

// Function to display the reports table
function displayReportsTable(reportsArray) {
  // Sort reports by GCL number
  reportsArray.sort((a, b) => a.GCL.localeCompare(b.GCL));

  const reportsTable = document.getElementById("reportsTable");
  const tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>GCL Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number(+63)</th>
                    <th>District</th>
                    <th>Barangay</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${reportsArray.map(generateReportHTML).join("")}
            </tbody>
        </table>
    `;
  reportsTable.innerHTML = tableHTML;
}

// Function to update the table when data changes
function updateTable() {
  const reportsRef = ref(db, "Accounts/Collectors");
  onValue(reportsRef, (snapshot) => {
    const reportsData = snapshot.val();
    if (reportsData) {
      const reportsArray = Object.entries(reportsData).map(([UId, report]) => ({
        UId,
        ...report,
      }));
      displayReportsTable(reportsArray);
    } else {
      displayReportsTable([]);
    }
  });
}

// Display the initial reports table when the page loads
window.onload = function () {
  updateTable();

  // Check if there is a query parameter for viewing a specific user
  const params = new URLSearchParams(window.location.search);
  const UIdToView = params.get("newUserId");

  if (UIdToView) {
    // If there is a GCL in the query parameter, trigger the viewReport function
    window.viewReport(UIdToView);
  }
};

function updateReport(name) {
  // Check if there is a query parameter for viewing a specific user
  const params = new URLSearchParams(window.location.search);
  const userNameToView = params.get("name");

  if (userNameToUpdate) {
    // If there is a user name in the query parameter, trigger the viewReport function
    window.updateReport(userNameToUpdate);
  }
}

// Function to delete a report
window.deleteReport = function (UId) {
  // Reference to the specific report in the database
  const reportRef = ref(db, `Accounts/Collectors/${UId}`);

  // Ask for confirmation before deleting the report
  const confirmation = confirm(
    `Are you sure you want to delete the report with UId ${UId}?`
  );

  if (confirmation) {
    // Remove the report from the database
    remove(reportRef)
      .then(() => {
        console.log(`Report with UId ${UId} deleted successfully.`);
        // Update the table after deletion
        updateTable();
      })
      .catch((error) => {
        console.error(`Error deleting report with UId ${UId}:`, error.message);
      });
  } else {
    console.log(`Deletion of the report with UId ${UId} canceled.`);
  }
};
