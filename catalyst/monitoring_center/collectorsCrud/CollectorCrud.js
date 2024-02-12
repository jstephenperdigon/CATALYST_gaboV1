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

window.viewReport = function (name) {
  window.location.href = `CollectorView.html?name=${name}`;
};

window.updateReport = function (name) {
  window.location.href = `CollectorUpdate.html?name=${name}`;
};

window.AddUser = function () {
  window.location.href = `CollectorCreate.html?name=${""}`;
};

// Function to generate the HTML for a single report
function generateReportHTML(report) {
  return `
        <tr>
            <td>${report.firstName} ${report.lastName}</td>
            <td>${report.email}</td>
            <td>${report.mobileNumber}</td>
            <td>${report.district}</td>
            <td>${report.password}</td>
            <td class="actions-column">
                <button onclick="viewReport('${report.name}')">View</button>
                <button onclick="updateReport('${report.name}')">Update</button>
                <button onclick="deleteReport('${report.name}')">Delete</button>
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
    "Name",
    "email",
    "mobileNumber",
    "district",
    "password",
    "action",
  ];
  return headers.indexOf(key) + 1;
}

// Function to display the reports table
function displayReportsTable(reportsArray) {
  // Sort reports alphabetically based on last name
  reportsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const reportsTable = document.getElementById("reportsTable");
  const tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number(+63)</th>
                    <th>District</th>
                    <th>Password</th>
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
      const reportsArray = Object.entries(reportsData).map(
        ([name, report]) => ({ name, ...report })
      );
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
  const userNameToView = params.get("name");

  if (userNameToView) {
    // If there is a user name in the query parameter, trigger the viewReport function
    window.viewReport(userNameToView);
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
window.deleteReport = function (name) {
  // Reference to the specific report in the database
  const reportRef = ref(db, `Accounts/Collectors/${name}`);

  // Ask for confirmation before deleting the report
  const confirmation = confirm(
    `Are you sure you want to delete ${name}'s report?`
  );

  if (confirmation) {
    // Remove the report from the database
    remove(reportRef)
      .then(() => {
        console.log(`Report with name ${name} deleted successfully.`);
        // Update the table after deletion
        updateTable();
      })
      .catch((error) => {
        console.error(
          `Error deleting report with name ${name}:`,
          error.message
        );
      });
  } else {
    console.log(`Deletion of ${name}'s report canceled.`);
  }
};
