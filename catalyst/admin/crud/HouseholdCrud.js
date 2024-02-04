// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
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

// Function to generate the HTML for a single report
function generateReportHTML(report) {
  return `
        <tr>
            <td>${report.gcn}</td>
            <td>${report.firstName} ${report.lastName}</td>
            <td>${report.email}</td>
            <td>${report.mobileNumber}</td>
            <td>${report.barangay}</td>
            <td>${report.district}</td>
            <td>${report.addressLine1}</td>
            <td>${report.addressLine2}</td>
            <td class="actions-column">
                <button onclick="updateReport('${report.gcn}')">Update</button>
                <button onclick="viewReport('${report.gcn}')">View</button>
                <button onclick="deleteReport('${report.gcn}')">Delete</button>
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
    "gcn",
    "Name",
    "email",
    "mobileNumber",
    "barangay",
    "district",
    "addressLine1",
    "addressLine2",
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
                    <th>GCN</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number(+63)</th>
                    <th>Barangay</th>
                    <th>District</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>
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
  const reportsRef = ref(db, "Accounts/VerifiedUserAccounts");
  onValue(reportsRef, (snapshot) => {
    const reportsData = snapshot.val();
    if (reportsData) {
      const reportsArray = Object.entries(reportsData).map(
        ([ticketNumber, report]) => ({ ticketNumber, ...report })
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
};

function updateReport(gcn) {
  // Implement your update logic here using the GCN
  console.log(`Update report with GCN: ${gcn}`);
}

function viewReport(gcn) {
  // Implement your view logic here using the GCN
  console.log(`View report with GCN: ${gcn}`);
}

function deleteReport(gcn) {
  // Implement your delete logic here using the GCN
  console.log(`Delete report with GCN: ${gcn}`);
}
