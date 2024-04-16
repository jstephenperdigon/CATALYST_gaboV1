// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
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

// Initialize EmailJS with your User ID
emailjs.init("TN6jayxVlZMzQ3Ljt");

// Function to generate the HTML for a single report
function generateReportHTML(report) {
  return `
              <tr>
                  <td>${report.ticketNumber}</td>
                  <td>${report.GCN}</td>
                  <td>${report.Issue}</td>
                  <td>${report.district.split(" ")[1]}</td>
                  <td>${report.barangay.split(" ")[1]}</td>
                  <td>${report.TimeSent}</td>
                  <td>${report.DateSent}</td>
                  <td class="viewButtonContainer">
                      <button class="viewButton">Respond</button>
                      <button class="deleteButton" data-ticket="${
                        report.ticketNumber
                      }">Archive</button>
              </tr>
          `;
}

function handleMoveToArchive(ticketNumber) {
  const reportRef = ref(db, `Reports/${ticketNumber}`);
  const archiveRef = ref(db, `ReportsArchive/${ticketNumber}`);

  // Retrieve report data from Reports
  get(reportRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const reportData = snapshot.val();

        // Show confirmation dialog for archiving
        if (
          confirm("Are you sure you want to move this report to the archive?")
        ) {
          // Set report data to ReportsArchive
          return set(archiveRef, reportData)
            .then(() => {
              console.log("Report moved to ReportsArchive successfully.");

              // Once moved to ReportsArchive, add ReportStatus: Archived
              reportData.ReportStatus = "Archived";

              // Once moved to ReportsArchive, remove ticketNumber from Reports
              const reportToRemoveRef = ref(db, `Reports/${ticketNumber}`);
              return remove(reportToRemoveRef);
            })
            .then(() => {
              console.log("TicketNumber removed from Reports successfully.");
            })
            .catch((error) => {
              console.error("Error removing ticketNumber from Reports:", error);
            });
        } else {
          console.log("Archive action canceled by user.");
          return Promise.reject(new Error("Archive action canceled by user."));
        }
      } else {
        // If report not found, log an error and exit
        const errorMessage = `Report not found for ticketNumber: ${ticketNumber}`;
        console.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
    })
    .catch((error) => {
      console.error("Error handling move to archive action:", error);
    });
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
    "Issue",
    "district",
    "barangay",
    "TimeSent",
    "DateSent",
    "Action",
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
                          <th>Issue</th>
                          <th>District</th>
                          <th>Barangay</th>
                          <th>Time Sent</th>
                          <th>Date Sent</th>
                          <th>Action</th>
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
      const ticketNumber = this.parentNode.parentNode.children[0].textContent;
      displayModal(ticketNumber);
    });
  });

  // Add event listener to "Delete" buttons
  document.querySelectorAll(".deleteButton").forEach((button) => {
    button.addEventListener("click", function () {
      const ticketNumber = this.dataset.ticket;
      handleMoveToArchive(ticketNumber);
    });
  });
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

function displayModal(ticketNumber) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  // Retrieve report data from Firebase based on ticketNumber
  const reportRef = ref(db, `Reports/${ticketNumber}`);
  get(reportRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const report = snapshot.val();

        // Extracting only the numbers from Barangay and District
        const districtNumber = report.district.split(" ")[1];
        const barangayNumber = report.barangay.split(" ")[1];

        // Populate modal content with report details
        modalContent.innerHTML = `
          <p>Ticket Number: ${ticketNumber}</p>
          <p>GCN: ${report.GCN}</p>
          <p>Name: ${report.firstName} ${report.lastName}</p>
          <p>Email: ${report.email}</p>
          <p>Mobile Number: ${report.mobileNumber}</p>
          <p>Issue: ${report.Issue}</p>
          <p>Description: ${report.Description || "N/A"}</p>
          <p>District: ${districtNumber}</p>
          <p>Barangay: ${barangayNumber}</p>
          <p>City: ${report.city}</p>
          <p>Province: ${report.province}</p>
          <p>Country: ${report.country}</p>
          <p>Time Sent: ${report.TimeSent}</p>
          <p>Date Sent: ${report.DateSent}</p>
          <p>Address Line 1: ${report.addressLine1}</p>
          <p>Address Line 2: ${report.addressLine2}</p>
        
        `;
        // Add event listener to the button inside the modal
        const respondButton = document.getElementById("respondButton");
        respondButton.addEventListener("click", function () {
          // Get the email from the report data
          const userEmail = report.email;
          const userName = `${report.firstName} ${report.lastName}`;

          const templateParams = {
            to_email: userEmail,
            UserName: userName,
          };

          emailjs
            .send("service_qpkq4ee", "template_l3cy9we", templateParams)
            .then((response) => {
              console.log("Email sent successfully:", response);
              alert("Email sent successfully!");

              // Once email is sent successfully, move the report to ReportsResponded
              const respondedReportRef = ref(
                db,
                `ReportsResponded/${ticketNumber}`
              );
              const reportRef = ref(db, `Reports/${ticketNumber}`);

              get(reportRef)
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    const reportData = snapshot.val();
                    reportData.ReportsResponded = "Responded";
                    return set(respondedReportRef, reportData);
                  } else {
                    console.error("Report not found.");
                    return Promise.reject(new Error("Report not found."));
                  }
                })
                .then(() => {
                  console.log("Report moved to ReportsResponded successfully.");
                  return remove(reportRef);
                })
                .then(() => {
                  console.log("Report removed from Reports successfully.");

                  // Close the modal after responding
                  modal.style.display = "none";
                })
                .catch((error) => {
                  console.error(
                    "Error moving report to ReportsResponded:",
                    error
                  );
                });
            })
            .catch((error) => {
              console.error("Error sending Email:", error);
              alert("Error sending Email. Please try again.");
            });
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
  const closeButton = document.querySelector(".close");
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
