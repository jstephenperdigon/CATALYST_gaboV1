// Import the necessary Firebase modules
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
// Reference to the collectors node
const collectorsRef = ref(db, `Accounts/Collectors`);

// Function to generate the HTML for a single report
function generateReportHTML(report) {
  // Calculate the time difference
  const timeSent = new Date(report.DateSent + " " + report.TimeSent);
  const currentTime = new Date();
  const timeDifference = Math.abs(currentTime - timeSent); // Difference in milliseconds

  let timeAgo;
  // Convert milliseconds to appropriate time units
  if (timeDifference < 60000) {
    // Less than a minute
    timeAgo = Math.round(timeDifference / 1000) + " seconds ago";
  } else if (timeDifference < 3600000) {
    // Less than an hour
    timeAgo = Math.round(timeDifference / 60000) + " minutes ago";
  } else if (timeDifference < 86400000) {
    // Less than a day
    timeAgo = Math.round(timeDifference / 3600000) + " hours ago";
  } else {
    // More than a day
    timeAgo = Math.round(timeDifference / 86400000) + " days ago";
  }

  return `
              <tr>
                  <td>${report.ticketNumber}</td>
                  <td>${report.GCN}</td>
                  <td>${report.Issue}</td>
                  <td>${report.district.split(" ")[1]}</td>
                  <td>${report.barangay.split(" ")[1]}</td>
                  <td>${timeAgo}</td>
                  <td>${report.DateSent}</td>
                  <td class="viewButtonContainer">
                      <button class="viewButton btn btn-primary shadow-none ">Respond</button>
                      <button class="deleteButton btn btn-warning shadow-none " data-ticket="${
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

// Function to generate HTML for each collector
function generateCollectorHTML(collectorUID, collectors) {
  return `
    <tr>
      <td>${collectors.UserInfo.firstName}</td>
      <td>${collectors.UserInfo.lastName}</td>
      <td>${collectors.UserInfo.email}</td>
      <td>${collectors.UserInfo.mobileNumber}</td>
      <td>${collectors.AssignedArea.district}</td>
      <td>${collectors.AssignedArea.barangay}</td>
      <td>${collectors.UserInfo.suffix}</td>
      <td>
        <button class="btn btn-secondary shadow-none view-collector"
                data-uid="${collectorUID}"
                data-mdb-toggle="modal"
                data-mdb-target="#viewCollectorModal">
          <i class="fas fa-eye"></i>
        </button>
       
    </tr>
  `;
}

// Function to update user data in the database
async function updateUser(uid) {
    try {
        const collectorRef = ref(db, `Accounts/Collectors/${uid}`);
        const snapshot = await get(collectorRef);
        const collectorData = snapshot.val();

        if (collectorData) {
            const firstName = document.getElementById('firstName').value;
            const middleName = document.getElementById('middleName').value;
            const lastName = document.getElementById('lastName').value;
            const barangay = document.getElementById('barangay').value;
            const district = document.getElementById('district').value;
            const suffix = document.getElementById('suffix').value;
            const email = document.getElementById('email').value;
            const mobileNumber = document.getElementById('mobileNumber').value;

            const updatedUserData = {
                ...collectorData,
                UserInfo: {
                    ...collectorData.UserInfo,
                    firstName,
                    middleName,
                    lastName,
                    suffix,
                    email,
                    mobileNumber
                },
                AssignedArea: {
                    ...collectorData.AssignedArea,
                    barangay,
                    district
                }
            };

            await set(collectorRef, updatedUserData);
            console.log("User data updated successfully.");
        } else {
            console.error(`Collector with UID ${uid} not found.`);
        }
    } catch (error) {
        console.error("Error updating user data:", error);
    }
}

// Event listener for handling button clicks
document.addEventListener("click", async function (e) {
  if (e.target.matches(".view-collector")) {
    const UID = e.target.getAttribute("data-uid");

    try {
      // Retrieve collector data based on UID
      const collectorRef = ref(db, `Accounts/Collectors/${UID}`);
      const snapshot = await get(collectorRef);
      const collectorData = snapshot.val();

      if (collectorData) {
                // Prepare collector information
                const collectorInfo = `
                    <div class="container">
                        <div class="row">
                            <div class="col-xl-12 d-flex align-items-center justify-content-between">
                                <p class="fs-5 fw-bold">Account Details</p>
                                <button id="editButton" class="btn btn-secondary shadow-none" onclick="toggleInputs()">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6"> 
                                <p class="text-muted"><strong>Control Number:</strong> <input type="text" class="form-control" id="controlNumber" value="${collectorData.GCL}" disabled></p>
                            </div>
                            <div class="col-xl-6"> 
                                <p class="text-muted"><strong>Account Password:</strong> <input type="password" class="form-control" id="password" value="${collectorData.password}" disabled></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6">
                                <p class="fs-5 fw-bold">Personal Details</p>
                                <p class="text-muted"><strong>First Name:</strong> <input type="text" class="form-control" id="firstName" value="${collectorData.UserInfo.firstName}" disabled></p>
                                <p class="text-muted"><strong>Surname:</strong> <input type="text" class="form-control" id="lastName" value="${collectorData.UserInfo.lastName}" disabled></p>
                            </div>
                            <div class="col-xl-6">
                                <p>&nbsp;</p> <!-- Empty space to align with the other column -->
                                <p class="text-muted"><strong>Middle Name:</strong> <input type="text" class="form-control" id="middleName" value="${collectorData.UserInfo.middleName}" disabled></p>
                                <p class="text-muted"><strong>Suffix:</strong> <input type="text" class="form-control" id="suffix" value="${collectorData.UserInfo.suffix}" disabled></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-12">
                                <p class="fs-5 fw-bold">Contact Details</p>
                                <p class="text-muted"><strong>Email:</strong> <input type="email" class="form-control" id="email" value="${collectorData.UserInfo.email}" disabled></p>
                                <p class="text-muted"><strong>Mobile Number:</strong> <input type="tel" class="form-control" id="mobileNumber" value="${collectorData.UserInfo.mobileNumber}" disabled></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6">
                                <p class="fs-5 fw-bold">Assigned Area</p>
                                <p class="text-muted"><strong>District:</strong> <input type="text" class="form-control" id="district" value="${collectorData.AssignedArea.district}" disabled></p>
                            </div>
                            <div class="col-xl-6">
                                <p>&nbsp;</p> <!-- Empty space to align with the other column -->
                                <p class="text-muted"><strong>Barangay:</strong> <input type="text" class="form-control" id="barangay" value="${collectorData.AssignedArea.barangay}" disabled></p>
                            </div>
                        </div>
                    </div>
                `;

                // Set collector information inside the modal
                const viewCollectorDetails = document.getElementById("viewCollectorDetails");
                viewCollectorDetails.innerHTML = collectorInfo;

                // Show the modal using MDBootstrap
                const viewCollectorModal = new mdb.Modal(document.getElementById("viewCollectorModal"));
                viewCollectorModal.show();
                
                // Event listener for the "Save" button inside the modal
                const editButton = document.getElementById('editButton');
                editButton.addEventListener('click', async function () {
                    if (editButton.innerText.trim() === "Save" && !editButton.disabled) {
                        // If in "Save" mode and button is not disabled, update user data and close the modal
                        await updateUser(UID); // Update user data in the database
                        viewCollectorModal.hide(); // Close the modal
                    }
                });
            } else {
                console.log(`Collector with UID ${UID} not found.`);
            }
        } catch (error) {
            console.error("Error fetching collector data:", error);
        }
    }
});


// COLLECTORS SEARCH FUNCTION


// TICKETS SEARCH FUNCTION
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

// Function to display collectors in the table
function displayCollectors() {
  onValue(collectorsRef, (snapshot) => {
    const collectorsData = snapshot.val();
    if (collectorsData) {
      const collectorsTableBody = document.querySelector(
        "#collectorsTable tbody"
      );
      let tableHTML = "";
      Object.entries(collectorsData).forEach(([collectorUID, collector]) => {
        tableHTML += generateCollectorHTML(collectorUID, collector);
      });
      collectorsTableBody.innerHTML = tableHTML;
    } else {
      console.log("No collectors found.");
    }
  });
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
    <table class="table">
        <thead class="table-dark">
            <tr>
                <th scope="col">Ticket #</th>
                <th scope="col">GCN</th>
                <th scope="col">Issue</th>
                <th scope="col">District</th>
                <th scope="col">Barangay</th>
                <th scope="col">Time Sent</th>
                <th scope="col">Date Sent</th>
                <th scope="col">Action</th>
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
        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = `
        <div class="container">
        
          <div class="row">
            <div class="col-md-6">
              <p><span class="fw-bold">Ticket Number:</span> ${ticketNumber}</p>
            </div>
            <div class="col-md-6">
              <p><span class="fw-bold">GCN:</span> ${report.GCN}</p>
            </div>
          </div>

            <div class="row">
             <div class="col-md-6">
                  <p><span class="fw-bold">Issue:</span> ${report.Issue}</p>
              </div>
              <div class="col-md-6">
                 <p><span class="fw-bold">Description:</span> ${
                   report.Description || "N/A"
                 }</p>
              </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                  <p><span class="fw-bold">Date Sent:</span> ${
                    report.DateSent
                  }</p>
                </div>
            </div>
            <div class="container">
            <p class="fs-5"> USER DETAILS</p>
            </div>
          <div class="row">
              <div class="col-md-6">
                  <p><span class="fw-bold">Name:</span> ${report.firstName} ${
          report.lastName
        }</p>
                  <p><span class="fw-bold">Email:</span> ${report.email}</p>
                  <p><span class="fw-bold">Mobile Number:</span> ${
                    report.mobileNumber
                  }</p>
            
          </div>
          <div class="row">
              <div class="col-md-6">
                <p><span class="fw-bold">District:</span> ${districtNumber}</p>
                <p><span class="fw-bold">Barangay:</span> ${barangayNumber}</p>
                <p><span class="fw-bold">City:</span> ${report.city}</p>
              </div>
         
          </div>
          <div class="row">
              <div class="col-md-12">
              
                <p><span class="fw-bold">Address Line 1:</span> ${
                  report.addressLine1
                }</p>
                <p><span class="fw-bold">Address Line 2:</span> ${
                  report.addressLine2
                }</p>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-primary shadow-none" id="respondButton">Send Respond</button>
          </div>
      </div>
    </div>
  </div>
`;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById("modal"));
        modal.show();

        // Add event listener to the "Send Respond" button inside the modal
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
        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = "<p>Report not found.</p>";

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById("modal"));
        modal.show();
      }
    })
    .catch((error) => {
      console.error("Error retrieving report:", error);
      // Display an error message if there's an issue fetching the report
      const modalContent = document.getElementById("modalContent");
      modalContent.innerHTML = "<p>Error retrieving report data.</p>";

      // Show the modal
      const modal = new bootstrap.Modal(document.getElementById("modal"));
      modal.show();
    });
}

// Display the initial reports table when the page loads
window.onload = function () {
  updateTable();
  displayCollectors();
};
