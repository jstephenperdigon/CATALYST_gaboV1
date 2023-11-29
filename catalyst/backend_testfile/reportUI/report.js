// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Function to generate the HTML for a single report
function generateReportHTML(report) {
    return `
        <tr>
            <td>${report.ticketNumber}</td>
            <td>${report.gcn}</td>
            <td>${report.Date}</td>
            <td>${report.timeFormat12}</td>
            <td>${report.Problem}</td>
            <td>${report.Description}</td>
            <td>${report.addressLine1}</td>
            <td>${report.addressLine2}</td>
            <td>${report.barangay}</td>
            <td>${report.district}</td>
            <td>${report.firstName} ${report.lastName}</td>
            <td>${report.email}</td>
            <td>${report.mobileNumber}</td>
        </tr>
    `;
}

// Function to search reports based on input value
window.searchReports = function () {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const reportsArray = document.querySelectorAll('#reportsTable tbody tr');

    reportsArray.forEach(report => {
        const reportText = report.textContent.toLowerCase();
        report.style.display = reportText.includes(searchInput) ? '' : 'none';
    });
};

// Function to sort search results based on selected option, including time sorting
window.sortSearchResults = function () {
    const sortKey = document.getElementById('sortDropdown').value;
    const visibleReportsArray = document.querySelectorAll('#reportsTable tbody tr:not([style*="none"])');

    const sortedReports = Array.from(visibleReportsArray).sort((a, b) => {
        if (sortKey === 'timeFormat12' || sortKey === 'oldestTime' || sortKey === 'latestTime') {
            const aValueElement = a.querySelector(`td:nth-child(${getIndex('timeFormat12')})`);
            const bValueElement = b.querySelector(`td:nth-child(${getIndex('timeFormat12')})`);

            // Additional checks to ensure the elements and their textContent are accessible
            const aValue = aValueElement ? new Date('1970/01/01 ' + aValueElement.textContent) : null;
            const bValue = bValueElement ? new Date('1970/01/01 ' + bValueElement.textContent) : null;

            if (aValue && bValue) {
                if (sortKey === 'timeFormat12') {
                    return bValue - aValue;
                } else if (sortKey === 'oldestTime') {
                    return aValue - bValue;
                } else if (sortKey === 'latestTime') {
                    return bValue - aValue;
                }
            } else {
                return 0; // Handle the case where the date values are not accessible
            }
        } else {
            const aValue = a.querySelector(`td:nth-child(${getIndex(sortKey)})`).textContent;
            const bValue = b.querySelector(`td:nth-child(${getIndex(sortKey)})`).textContent;

            return aValue.localeCompare(bValue);
        }
    });

    const tbody = document.querySelector('#reportsTable tbody');
    tbody.innerHTML = '';
    sortedReports.forEach(report => tbody.appendChild(report));
};

// Function to get the index of the selected column
function getIndex(key) {
    const headers = ['ticketNumber', 'gcn', 'Date', 'timeFormat12', 'Problem', 'Description', 'addressLine1', 'addressLine2', 'barangay', 'district', 'Name', 'email', 'mobileNumber'];
    return headers.indexOf(key) + 1;
}

// Function to display the reports table
async function displayReportsTable() {
    const reportsTable = document.getElementById('reportsTable');
    const reportsRef = ref(db, 'Reports');

    try {
        const reportsSnapshot = await get(reportsRef);
        const reportsData = reportsSnapshot.val();

        if (reportsData) {
            const reportsArray = Object.entries(reportsData).map(([ticketNumber, report]) => ({ ticketNumber, ...report }));
            const tableHTML = `
                <table border="1">
                    <thead>
                        <tr>
                            <th>Ticket #</th>
                            <th>GCN</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Problem</th>
                            <th>Description</th>
                            <th>Address Line 1</th>
                            <th>Address Line 2</th>
                            <th>Barangay</th>
                            <th>District</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile Number(+63)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportsArray.map(generateReportHTML).join('')}
                    </tbody>
                </table>
            `;
            reportsTable.innerHTML = tableHTML;

            // Set up an onValue listener for real-time updates
            onValue(reportsRef, (snapshot) => {
                const updatedReportsData = snapshot.val();

                if (updatedReportsData) {
                    const updatedReportsArray = Object.entries(updatedReportsData).map(([ticketNumber, report]) => ({ ticketNumber, ...report }));
                    const updatedTableHTML = updatedReportsArray.map(generateReportHTML).join('');
                    reportsTable.querySelector('tbody').innerHTML = updatedTableHTML;
                } else {
                    reportsTable.innerHTML = 'No reports available.';
                }
            });
        } else {
            reportsTable.innerHTML = 'No reports available.';
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
    }
}

// Display the reports table when the page loads
window.onload = function () {
    displayReportsTable();
};
