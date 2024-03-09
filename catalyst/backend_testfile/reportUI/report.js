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
            <td>${report.ticketNumber}</td>
            <td>${report.GCN}</td>
            <td>${report.firstName} ${report.lastName}</td>
            <td>${report.email}</td>
            <td>${report.mobileNumber}</td>
            <td>${report.Issue}</td>
            <td>${report.Description}</td>
            <td>${report.district}</td>
            <td>${report.barangay}</td>
            <td>${report.TimeSent}</td>
            <td>${report.DateSent}</td>
            <td>${report.addressLine1}</td>
            <td>${report.addressLine2}</td>
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

// Modify the searchReports function to use the filterReports function
window.searchReports = function () {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const sortKey = document.getElementById("sortDropdown").value;

  filterReports(searchInput, sortKey);
};

// Function to handle live search while typing
document.getElementById("searchInput").addEventListener("input", function () {
  window.searchReports();
});

// Function to get the index of the selected column
function getIndex(key) {
  const headers = [
    "ticketNumber",
    "GCN",
    "Name",
    "email",
    "mobileNumber",
    "Issue",
    "Description",
    "district",
    "barangay",
    "TimeSent",
    "DateSent",
    "addressLine1",
    "addressLine2",
  ];
  return headers.indexOf(key) + 1;
}

// Function to display the reports table
function displayReportsTable(reportsArray) {
  // Sort the reports based on TimeSent and DateSent in ascending order (oldest to newest)
  reportsArray.sort((a, b) => {
    const timeSentA = new Date(`${a.DateSent} ${a.TimeSent}`).getTime();
    const timeSentB = new Date(`${b.DateSent} ${b.TimeSent}`).getTime();
    return timeSentA - timeSentB;
  });

  const reportsTable = document.getElementById("reportsTable");
  const tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Ticket #</th>
                    <th>GCN</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number(+63)</th>
                    <th>Issue</th>
                    <th>Description</th>
                    <th>District</th>
                    <th>Barangay</th>
                    <th>Time Sent</th>
                    <th>Date Sent</th>
                    <th>Address Line 1</th>
                    <th>Address Line 2</th>  
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
  const reportsRef = ref(db, "Reports");
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

// Function to reset the list
window.resetList = function () {
  // Clear the search input
  document.getElementById("searchInput").value = "";

  // Reset the sort dropdown to the default option
  document.getElementById("sortDropdown").selectedIndex = 0;

  // Retrieve the initial data and update the table
  updateTable();
};

// Display the initial reports table when the page loads
window.onload = function () {
  updateTable();
};
