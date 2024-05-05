// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  push,
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
  // Split the date string into month, day, and year parts
  var parts = report.DateSent.split("-");

  // Create a new Date object by specifying the year, month (0-indexed), and day
  var date = new Date(parts[2], parseInt(parts[0]) - 1, parts[1]);

  // Define an array of month names
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Construct the text date in the format: Month Day, Year
  var textDate =
    monthNames[date.getMonth()] +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear();

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
                  <td>${textDate}</td>
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
          // Add ReportStatus: Archived to reportData
          reportData.ReportStatus = "Archived";

          // Set report data to ReportsArchive without removing from Reports
          return set(archiveRef, reportData)
            .then(() => {
              console.log("Report moved to ReportsArchive successfully.");
              console.log("Report status updated to 'Archived'.");
            })
            .catch((error) => {
              console.error("Error moving report to archive:", error);
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
      <td>${collectors.GCL}</td>
      <td>${collectors.UserInfo.lastName} ${collectors.UserInfo.firstName} ${collectors.UserInfo.middleName} ${collectors.UserInfo.suffix}</td>
      <td>${collectors.UserInfo.email}</td>
      <td>${collectors.UserInfo.mobileNumber}</td>
      <td>${collectors.AssignedArea.district}</td>
      <td>${collectors.AssignedArea.barangay}</td>
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
                                <button id="editButton" class="btn btn-secondary shadow-none">
                                <i class="fas fa-edit"></i> Edit
                              </button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6"> 
                                <p class="text-muted"><strong>Control Number:</strong> <input type="text" class="form-control control-number" id="controlNumber" value="${
                                  collectorData.GCL || ""
                                }" disabled></p>

                            </div>
                            <div class="col-xl-6"> 
                                <p class="text-muted"><strong>Account Password:</strong> <input type="text" class="form-control collector-password" id="password" value="${
                                  collectorData.password || ""
                                }" disabled></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6">
                                <p class="fs-5 fw-bold">Personal Details</p>
                                <p class="text-muted"><strong>First Name:</strong> <input type="text" class="form-control first-name" id="firstName" value="${
                                  collectorData.UserInfo.firstName
                                }" disabled></p>
                                <p class="text-muted"><strong>Surname:</strong> <input type="text" class="form-control last-name" id="lastName" value="${
                                  collectorData.UserInfo.lastName
                                }" disabled></p>
                            </div>
                            <div class="col-xl-6">
                                <p>&nbsp;</p> <!-- Empty space to align with the other column -->
                                <p class="text-muted"><strong>Middle Name:</strong> <input type="text" class="form-control middle-name" id="middleName" value="${
                                  collectorData.UserInfo.middleName
                                }" disabled></p>
                                <p class="text-muted"><strong>Suffix:</strong> <input type="text" class="form-control collector-suffix" id="suffix" value="${
                                  collectorData.UserInfo.suffix
                                }" disabled></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-12">
                                <p class="fs-5 fw-bold">Contact Details</p>
                                <p class="text-muted"><strong>Email:</strong> <input type="email" class="form-control collector-email" id="email" value="${
                                  collectorData.UserInfo.email
                                }" disabled></p>
                                <p class="text-muted"><strong>Mobile Number:</strong> <input type="tel" class="form-control mobile-number" id="mobileNumber" value="${
                                  collectorData.UserInfo.mobileNumber
                                }" disabled></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6">
                                <p class="fs-5 fw-bold">Assigned Area</p>
                                <p class="text-muted"><strong>District:</strong> <input type="text" class="form-control collector-district" id="collector-district" value="${
                                  collectorData.AssignedArea.district
                                }" disabled></p>
                            </div>
                            <div class="col-xl-6">
                                <p>&nbsp;</p> <!-- Empty space to align with the other column -->
                                <p class="text-muted"><strong>Barangay:</strong> <input type="text" class="form-control collector-barangay" id="collector-barangay" value="${
                                  collectorData.AssignedArea.barangay
                                }" disabled></p>
                            </div>
                        </div>
                    </div>
                `;

        // Set collector information inside the modal
        const viewCollectorDetails = document.getElementById(
          "viewCollectorDetails"
        );
        viewCollectorDetails.innerHTML = collectorInfo;

        // Get reference to the editButton
        const editButton = document.getElementById("editButton");

        // Function to enable editing mode
        function enableEditMode() {
          // Change button text to "Save"
          editButton.innerText = "Save";
          editButton.classList.remove("btn-secondary");
          editButton.classList.add("btn-secondary");

          // Enable input fields for editing
          const inputs = document.querySelectorAll(
            ".first-name, .middle-name, .last-name, .collector-suffix, .collector-email, .mobile-number, .collector-district, .collector-barangay"
          );
          inputs.forEach((input) => {
            input.disabled = false;
            // Add event listener to track changes in input fields
            input.addEventListener("input", handleInputChange);
          });

          // Replace editButton click listener with saveUserData
          editButton.removeEventListener("click", enableEditMode);
          editButton.addEventListener("click", saveUserData);
          // Check if any input field has changed initially
          editButton.disabled = true;
          checkForChanges();
        }

        // Event listener to enable editing mode on edit button click
        editButton.addEventListener("click", enableEditMode);

        // Function to handle input changes and enable the save button
        function handleInputChange() {
          editButton.disabled = false; // Enable save button on any change
        }

        // Function to check for changes in the input fields
        function checkForChanges() {
          const inputs = document.querySelectorAll(
            ".first-name, .middle-name, .last-name, .collector-suffix, .collector-email, .mobile-number, .collector-district, .collector-barangay"
          );
          inputs.forEach((input) => {
            input.addEventListener("input", () => {
              editButton.disabled = false; // Enable save button on change
            });
          });
        }

        // Function to save updated user data
        async function saveUserData() {
          try {
            // Retrieve updated values from input fields
            const updatedFirstName = document.getElementById("firstName").value;
            const updatedMiddleName =
              document.getElementById("middleName").value;
            const updatedLastName = document.getElementById("lastName").value;
            const updatedSuffix = document.getElementById("suffix").value;
            const updatedEmail = document.getElementById("email").value;
            const updatedMobileNumber =
              document.getElementById("mobileNumber").value;

            const updatedDistrict =
              document.getElementById("collector-district").value;
            const updatedBarangay =
              document.getElementById("collector-barangay").value;

            if (collectorData) {
              // Prepare updated user data
              const updatedUserData = {
                ...collectorData,
                UserInfo: {
                  ...collectorData.UserInfo,
                  firstName: updatedFirstName,
                  middleName: updatedMiddleName,
                  lastName: updatedLastName,
                  suffix: updatedSuffix,
                  email: updatedEmail,
                  mobileNumber: updatedMobileNumber,
                },
                AssignedArea: {
                  ...collectorData.AssignedArea,
                  district: updatedDistrict,
                  barangay: updatedBarangay,
                },
              };

              // Update collector's data in the database using set method
              await set(collectorRef, updatedUserData);
              // Display the success message
              alert("Collector data updated successfully.");

              // Close the modal
              document.getElementById("viewCollectorModal").style.display =
                "none";

              // Refresh the page
              location.reload();
            } else {
              console.log(`Collector with UID ${UID} not found.`);
            }
          } catch (error) {
            console.error("Error updating collector data:", error);
          }
        }

        // Cleanup when modal is closed
        const viewCollectorModal =
          document.getElementById("viewCollectorModal");
        viewCollectorModal.addEventListener("hidden.bs.modal", () => {});
      } else {
        console.log(`Collector with UID ${UID} not found.`);
      }
    } catch (error) {
      console.error("Error fetching collector data:", error);
    }
  }
});

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

function performSearch() {
  const searchCollector = document
    .getElementById("searchCollector")
    .value.trim()
    .toLowerCase();
  const searchCategory = document.getElementById("searchCategory").value;
  const rows = document.querySelectorAll("#collectorsTable tbody tr");

  rows.forEach((row) => {
    const cell = row.querySelector(
      `td:nth-child(${getIndexA(searchCategory)})`
    );
    if (cell) {
      const cellText = cell.textContent.trim().toLowerCase();
      const isMatch = cellText.includes(searchCollector);
      // Show or hide the row based on match
      row.style.display = isMatch ? "" : "none";
    } else {
      // Hide the row if the specified search category is not found in the row
      row.style.display = "none";
    }
  });

  // Check if the search term is empty to display all rows
  if (searchCollector === "") {
    rows.forEach((row) => {
      row.style.display = "";
    });
  }
}

// Function to get the index of the selected column
function getIndexA(keyA) {
  const headers = [
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "district",
    "barangay",
    "suffix",
  ];
  return headers.indexOf(keyA) + 1; // Use indexOf to find the index of keyA in headers array
}


// Function to extract numeric part of GCL number
function extractNumericGCL(gcl) {
  // Use regular expression to extract numeric part of GCL
  const numericPart = gcl.match(/\d+/);
  // Return the numeric part as integer
  return numericPart ? parseInt(numericPart[0]) : 0; // Return 0 if no numeric part found
}

// Function to display collectors in the table
function displayCollectors() {
  onValue(collectorsRef, (snapshot) => {
    const collectorsData = snapshot.val();
    if (collectorsData) {
      const collectorsTableBody = document.querySelector(
        "#collectorsTable tbody"
      );
      let collectorsArray = Object.entries(collectorsData).map(
        ([collectorUID, collector]) => ({ uid: collectorUID, ...collector })
      );

      // Sort collectors by extracted numeric GCL number in descending order
      collectorsArray.sort(
        (a, b) => extractNumericGCL(b.GCL) - extractNumericGCL(a.GCL)
      );

      let tableHTML = "";
      collectorsArray.forEach((collector) => {
        tableHTML += generateCollectorHTML(collector.uid, collector);
      });
      collectorsTableBody.innerHTML = tableHTML;
    } else {
      console.log("No collectors found.");
    }
      // Initialize DataTable after data has been populated
          $("#collectorsTable").DataTable({
            paging: true,
            searching: true,
            ordering: false,
            info: true,
            pageLength: 10, // Show 10 entries per page
          });
      
  }
  
);
}

// TICKET RESPONDED
// Reference to the 'reports-responded' table body
const tableBodyResponded = document.querySelector(
  "#reportstableresponded tbody"
);

function renderTableResponded(reports) {
  // Clear existing table rows
  tableBodyResponded.innerHTML = "";

  // Loop through each report key (ticketNumber) and value (report object)
  Object.entries(reports).forEach(([ticketNumber, reportResponded]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ticketNumber}</td>
      <td>${reportResponded.GCN}</td>
      <td>${reportResponded.Issue}</td>
      <td>${reportResponded.district}</td>
      <td>${reportResponded.barangay}</td>
      <td>${reportResponded.TimeSent}</td>
      <td>${reportResponded.DateSent}</td>
      <td><button class="btn btn-primary viewTicketResponded" data-ticketresponded="${ticketNumber}">View</button></td>
    `;
    tableBodyResponded.appendChild(row);
  });
}

// Function to open modal and populate content with ticket details
function openModalWithTicketDetails(ticketNumber, reportsData) {
  // Retrieve the details of the selected ticket based on its ticket number
  const selectedTicket = reportsData[ticketNumber];

  // Open the modal
  $("#modal").modal("show");

  // Populate the modal content with the details of the selected ticket
  document.getElementById("modalContent").innerHTML = `
    <div class="row">
            <div class="col-md-6">
              <p><span class="fw-bold">Ticket Number:</span> ${ticketNumber}</p>
            </div>
            <div class="col-md-6">
              <p><span class="fw-bold">GCN:</span> ${selectedTicket.GCN}</p>
            </div>
          </div>

            <div class="row">
             <div class="col-md-6">
                  <p><span class="fw-bold">Issue:</span> ${
                    selectedTicket.Issue
                  }</p>
              </div>
              <div class="col-md-6">
                 <p><span class="fw-bold">Description:</span> ${
                   selectedTicket.Description || "N/A"
                 }</p>
              </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                  <p><span class="fw-bold">Date Sent:</span> ${
                    selectedTicket.DateSent
                  }</p>
                </div>
                <div class="col-md-6">
                 <p><span class="fw-bold">Status:</span> ${
                   selectedTicket.ReportStatus
                 }</p>
                </div>
            </div>
            <div class="container">
            <p class="fs-5"> USER DETAILS</p>
            </div>
          <div class="row">
              <div class="col-md-6">
                  <p><span class="fw-bold">Name:</span> ${
                    selectedTicket.firstName
                  } ${selectedTicket.lastName}</p>
                  <p><span class="fw-bold">Email:</span> ${
                    selectedTicket.email
                  }</p>
                  <p><span class="fw-bold">Mobile Number:</span> ${
                    selectedTicket.mobileNumber
                  }</p>
          </div>
          <div class="row">
              <div class="col-md-6">
                <p><span class="fw-bold">District:</span> ${
                  selectedTicket.district
                }</p>
                <p><span class="fw-bold">Barangay:</span> ${
                  selectedTicket.barangay
                }</p>
                <p><span class="fw-bold">City:</span> ${selectedTicket.city}</p>
              </div>
          </div>
          <div class="row">
              <div class="col-md-12">
              
                <p><span class="fw-bold">Address Line 1:</span> ${
                  selectedTicket.addressLine1
                }</p>
              </div>
          </div>
  `;

  // Add event listener to the close button inside the modal header
  const closeButton = document.querySelector("#modal .modal-header .btn-close");
  closeButton.addEventListener("click", function () {
    // Close the modal
    $("#modal").modal("hide");
  });
}

// Function to fetch and display reports from Firebase
function displayReportsResponded() {
  const reportsRef = ref(db, "ReportsResponded");

  // Listen for changes in the reports data
  onValue(
    reportsRef,
    (snapshot) => {
      const reportsData = snapshot.val();

      if (reportsData) {
        // Render the reports into the table
        renderTableResponded(reportsData);

        // Attach event listener to the document that listens for clicks on elements with class '.viewTicketResponded'
        document.addEventListener("click", function (event) {
          // Check if the clicked element has class '.viewTicketResponded'
          if (event.target.classList.contains("viewTicketResponded")) {
            // Retrieve the ticket number associated with the clicked button
            const ticketNumber = event.target.dataset.ticketresponded;
            // Open modal and populate content with ticket details
            openModalWithTicketDetails(ticketNumber, reportsData);
          }
        });
      } else {
        // No reports found, display a message or handle accordingly
        tableBody.innerHTML = '<tr><td colspan="7">No reports found.</td></tr>';
      }
    },
    (error) => {
      console.error("Error fetching reports:", error.message);
      tableBody.innerHTML =
        '<tr><td colspan="7">Error fetching reports.</td></tr>';
    }
  );
}

// Call the displayReports function to initially populate the table
displayReportsResponded();

// SEARCH FOR TICKET RESPONDED
// Function to filter responded tickets based on search input and selected sorting column
function filterTicketsResponded(searchInput, sortKey) {
  const ticketsArray = document.querySelectorAll(
    "#reportstableresponded tbody tr"
  );
  ticketsArray.forEach((ticket) => {
    const columnValue = ticket
      .querySelector(`td:nth-child(${getIndexResponded(sortKey)})`)
      .textContent.toLowerCase();
    const displayStyle = columnValue.includes(searchInput) ? "" : "none";
    ticket.style.display = displayStyle;
  });
}

// Modify the searchTicketsResponded function to use the filterTicketsResponded function
window.searchTicketsResponded = function () {
  const searchInput = document
    .getElementById("searchInputResponded")
    .value.toLowerCase();
  const sortKey = document.getElementById("sortDropdownResponded").value;

  filterTicketsResponded(searchInput, sortKey);
};

// Function to handle live search while typing for responded tickets
document
  .getElementById("searchInputResponded")
  .addEventListener("input", function () {
    window.searchTicketsResponded();
  });

// Function to get the index of the selected column for responded tickets
function getIndexResponded(key) {
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

// TICKET ARCHIVES
// Reference to the 'reports-responded' table body
const tableBodyArchive = document.querySelector("#reportstablearchive tbody");

// Function to render data into the table
function renderTableArchive(reports) {
  // Clear existing table rows
  tableBodyArchive.innerHTML = "";

  // Loop through each report key (ticketNumber) and value (report object)
  Object.entries(reports).forEach(([ticketNumber, reportArchive]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ticketNumber}</td>
      <td>${reportArchive.GCN}</td>
      <td>${reportArchive.Issue}</td>
      <td>${reportArchive.district}</td>
      <td>${reportArchive.barangay}</td>
      <td>${reportArchive.TimeSent}</td>
      <td>${reportArchive.DateSent}</td>
      <td><button class="btn btn-primary viewTicketArchive" data-ticketarchive="${ticketNumber}">View</button></td>
    `;
    tableBodyArchive.appendChild(row);
  });
}

// Function to open modal and populate content with ticket details
function openModalWithTicketDetailsArchive(ticketNumber, reportsData) {
  // Retrieve the details of the selected ticket based on its ticket number
  const selectedTicket = reportsData[ticketNumber];

  // Open the modal
  $("#modal").modal("show");

  // Populate the modal content with the details of the selected ticket
  document.getElementById("modalContent").innerHTML = `
    <div class="row">
            <div class="col-md-6">
              <p><span class="fw-bold">Ticket Number:</span> ${ticketNumber}</p>
            </div>
            <div class="col-md-6">
              <p><span class="fw-bold">GCN:</span> ${selectedTicket.GCN}</p>
            </div>
          </div>

            <div class="row">
             <div class="col-md-6">
                  <p><span class="fw-bold">Issue:</span> ${
                    selectedTicket.Issue
                  }</p>
              </div>
              <div class="col-md-6">
                 <p><span class="fw-bold">Description:</span> ${
                   selectedTicket.Description || "N/A"
                 }</p>
              </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                  <p><span class="fw-bold">Date Sent:</span> ${
                    selectedTicket.DateSent
                  }</p>
                </div>
                <div class="col-md-6">
                 <p><span class="fw-bold">Status:</span> ${
                   selectedTicket.ReportStatus
                 }</p>
                </div>
            </div>
            <div class="container">
            <p class="fs-5"> USER DETAILS</p>
            </div>
          <div class="row">
              <div class="col-md-6">
                  <p><span class="fw-bold">Name:</span> ${
                    selectedTicket.firstName
                  } ${selectedTicket.lastName}</p>
                  <p><span class="fw-bold">Email:</span> ${
                    selectedTicket.email
                  }</p>
                  <p><span class="fw-bold">Mobile Number:</span> ${
                    selectedTicket.mobileNumber
                  }</p>
          </div>
          <div class="row">
              <div class="col-md-6">
                <p><span class="fw-bold">District:</span> ${
                  selectedTicket.district
                }</p>
                <p><span class="fw-bold">Barangay:</span> ${
                  selectedTicket.barangay
                }</p>
                <p><span class="fw-bold">City:</span> ${selectedTicket.city}</p>
              </div>
          </div>
          <div class="row">
              <div class="col-md-12">
              
                <p><span class="fw-bold">Address Line 1:</span> ${
                  selectedTicket.addressLine1
                }</p>
              </div>
          </div>
  `;

  // Add event listener to the close button inside the modal header
  const closeButton = document.querySelector("#modal .modal-header .btn-close");
  closeButton.addEventListener("click", function () {
    // Close the modal
    $("#modal").modal("hide");
  });
}

// Function to fetch and display reports from Firebase for the archive
function displayReportsArchive() {
  const reportsRef = ref(db, "ReportsArchive");

  // Listen for changes in the reports data
  onValue(
    reportsRef,
    (snapshot) => {
      const reportsData = snapshot.val();

      if (reportsData) {
        // Render the reports into the table
        renderTableArchive(reportsData);

        // Attach event listener to the document that listens for clicks on elements with class '.viewTicketArchive'
        document.addEventListener("click", function (event) {
          // Check if the clicked element has class '.viewTicketArchive'
          if (event.target.classList.contains("viewTicketArchive")) {
            // Retrieve the ticket number associated with the clicked button
            const ticketNumber = event.target.dataset.ticketarchive;
            // Open modal and populate content with ticket details
            openModalWithTicketDetailsArchive(ticketNumber, reportsData);
          }
        });
      } else {
        // No reports found, display a message or handle accordingly
        tableBodyArchive.innerHTML =
          '<tr><td colspan="7">No reports found.</td></tr>';
      }
    },
    (error) => {
      console.error("Error fetching reports:", error.message);
      tableBodyArchive.innerHTML =
        '<tr><td colspan="7">Error fetching reports.</td></tr>';
    }
  );
}

// Call the displayReports function to initially populate the table
displayReportsArchive();

//SEARCH FOR TICKETS ARCHIVE
// Function to filter archived tickets based on search input and selected sorting column
function filterTicketsArchive(searchInput, sortKey) {
  const ticketsArray = document.querySelectorAll(
    "#reportstablearchive tbody tr"
  );
  ticketsArray.forEach((ticket) => {
    const columnValue = ticket
      .querySelector(`td:nth-child(${getIndexArchive(sortKey)})`)
      .textContent.toLowerCase();
    const displayStyle = columnValue.includes(searchInput) ? "" : "none";
    ticket.style.display = displayStyle;
  });
}

// Modify the searchTicketsArchive function to use the filterTicketsArchive function
window.searchTicketsArchive = function () {
  const searchInput = document
    .getElementById("searchInputArchive")
    .value.toLowerCase();
  const sortKey = document.getElementById("sortDropdownArchive").value;

  filterTicketsArchive(searchInput, sortKey);
};

// Function to handle live search while typing for archived tickets
document
  .getElementById("searchInputArchive")
  .addEventListener("input", function () {
    window.searchTicketsArchive();
  });

// Function to get the index of the selected column for archived tickets
function getIndexArchive(key) {
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

// Function to display the reports tables
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

        // Split the date string into month, day, and year parts
        var parts = report.DateSent.split("-");

        // Create a new Date object by specifying the year, month (0-indexed), and day
        var date = new Date(parts[2], parseInt(parts[0]) - 1, parts[1]);

        // Define an array of month names
        var monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        // Construct the text date in the format: Month Day, Year
        var textDate =
          monthNames[date.getMonth()] +
          " " +
          date.getDate() +
          ", " +
          date.getFullYear();

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
                  <p><span class="fw-bold">Date Sent:</span> ${textDate}</p>
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
              </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-primary shadow-none" id="respondButton">Send Respond</button>
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
                    reportData.ReportStatus = "Responded";
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

//--------------------------------ADD COLLECTOR FUNCTION----------------------------------------------------//

const usersRef = ref(db, "Accounts/Collectors");

// Function to clear the text fields inside the modal
function clearModalFields() {
  document.getElementById("fName").value = "";
  document.getElementById("mName").value = "";
  document.getElementById("lName").value = "";
  document.getElementById("sFix").value = "";
  document.getElementById("eMail").value = "";
  document.getElementById("mobileNumberModal").value = "";
  document.getElementById("districtDropdownModal").selectedIndex = 0;
  document.getElementById("barangayDropdownModal").innerHTML =
    "<option selected disabled>Select Barangay</option>";
}

// Function to handle form submission
async function addUser(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form values
  const firstName = document.getElementById("fName").value;
  const middleName = document.getElementById("mName").value;
  const lastName = document.getElementById("lName").value;
  const suffix = document.getElementById("sFix").value;
  const email = document.getElementById("eMail").value;
  const mobileNumberField = document.getElementById("mobileNumberModal");
  const mobileNumber = mobileNumberField.value;
  const district = document.getElementById("districtDropdownModal").value;
  const barangay = document.getElementById("districtDropdownModal").value;

  // Regular expression pattern to allow only letters
  const lettersOnlyPattern = /^[A-Za-z]+$/;

  // Regular expression pattern to allow only Gmail addresses
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail.com$/;

  // Regular expression pattern to allow only numbers and limit to 11 characters
  const mobileNumberPattern = /^[0-9]{1,11}$/;

  // Validation for firstName
  if (!lettersOnlyPattern.test(firstName)) {
    alert("First name should contain only letters.");
    return;
  }

  // Validation for middleName
  if (!lettersOnlyPattern.test(middleName)) {
    alert("Middle name should contain only letters.");
    return;
  }

  // Validation for lastName
  if (!lettersOnlyPattern.test(lastName)) {
    alert("Last name should contain only letters.");
    return;
  }

  // Validation for suffix
  if (suffix && !lettersOnlyPattern.test(suffix)) {
    alert("Suffix should contain only letters.");
    return;
  }

  // Validation for email
  if (!gmailPattern.test(email)) {
    alert("Only Gmail email addresses are allowed.");
    return;
  }

  // Validation for mobileNumber
  if (!mobileNumberPattern.test(mobileNumber) || mobileNumber.length !== 11) {
    alert(
      "Mobile number should contain only numbers and should be exactly 11 digits."
    );
    return;
  }

  // Check if District and Barangay are selected
  if (district === "Select District" || barangay === "Select Barangay") {
    alert("Please select District and Barangay.");
    return; // Stop further execution
  }

  try {
    // Generate unique ID
    const UId = push(usersRef).key;

    // Fetch existing GCL numbers to determine the new GCL number
    const gclNumbersSnapshot = await get(usersRef);
    const gclNumbers = Object.keys(gclNumbersSnapshot.val() || {}).map(
      (key) => gclNumbersSnapshot.val()[key].GCL
    );

    // Find the first available GCL number starting from "GCL001"
    let newGCLNumber = "GCL001";
    while (gclNumbers.includes(newGCLNumber)) {
      const number = parseInt(newGCLNumber.slice(3)) + 1;
      newGCLNumber = "GCL" + number.toString().padStart(3, "0");
    }

    const randomPassword = generateRandomPassword();

    // Create a new user object
    const newUser = {
      firstName,
      lastName,
      email,
      mobileNumber,
      middleName,
      suffix,
    };

    // Create a new user object
    const AssignedArea = {
      district,
      barangay,
    };

    // Push the new user data to the "users" node in the database
    await set(ref(db, `Accounts/Collectors/${UId}`), {
      AssignedArea,
      UserInfo: newUser,
      GCL: newGCLNumber,
      password: randomPassword,
    });

    // Success message or any further action after adding the user
    alert("User added successfully!");

    // Close the modal after adding the user successfully
    $("#addCollectorModal").modal("hide");

    // Refresh the page
    location.reload();
  } catch (error) {
    console.error("Error adding user: ", error);
    // Handle error, display error message, or re-enable the submit button
    alert("An error occurred while adding the user. Please try again.");
  }
}

// Function to generate random password with 8 characters
function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Attach the addUser function to the form submission event
document.getElementById("viewForm").addEventListener("submit", addUser);

document.addEventListener("DOMContentLoaded", function () {
  const districtDropdownModal = document.getElementById(
    "districtDropdownModal"
  );
  const barangayDropdownModal = document.getElementById(
    "barangayDropdownModal"
  );

  // Define the mapping of districts to barangays
  const districtToBarangays = {
    1: [
      "Brgy 1",
      "Brgy 2",
      "Brgy 3",
      "Brgy 4",
      "Brgy 77",
      "Brgy 78",
      "Brgy 79",
      "Brgy 80",
      "Brgy 81",
      "Brgy 82",
      "Brgy 83",
      "Brgy 84",
      "Brgy 85",
      "Brgy 132",
      "Brgy 133",
      "Brgy 134",
      "Brgy 135",
      "Brgy 136",
      "Brgy 137",
      "Brgy 138",
      "Brgy 139",
      "Brgy 140",
      "Brgy 141",
      "Brgy 142",
      "Brgy 143",
      "Brgy 144",
      "Brgy 145",
      "Brgy 146",
      "Brgy 147",
      "Brgy 148",
      "Brgy 149",
      "Brgy 150",
      "Brgy 151",
      "Brgy 152",
      "Brgy 153",
      "Brgy 154",
      "Brgy 155",
      "Brgy 156",
      "Brgy 157",
      "Brgy 158",
      "Brgy 159",
      "Brgy 160",
      "Brgy 161",
      "Brgy 162",
      "Brgy 163",
      "Brgy 164",
      "Brgy 165",
      "Brgy 166",
      "Brgy 167",
      "Brgy 168",
      "Brgy 169",
      "Brgy 170",
      "Brgy 171",
      "Brgy 172",
      "Brgy 173",
      "Brgy 174",
      "Brgy 175",
      "Brgy 176",
      "Brgy 177",
    ],
    2: [
      "Brgy5",
      "Brgy 6",
      "Brgy 7",
      "Brgy 8",
      "Brgy 9",
      "Brgy 10",
      "Brgy 11",
      "Brgy 12",
      "Brgy 13",
      "Brgy 14",
      "Brgy 15",
      "Brgy 16",
      "Brgy 17",
      "Brgy 18",
      "Brgy 19",
      "Brgy 20",
      "Brgy 21",
      "Brgy 22",
      "Brgy 23",
      "Brgy 24",
      "Brgy 25",
      "Brgy 26",
      "Brgy 27",
      "Brgy 28",
      "Brgy 29",
      "Brgy 30",
      "Brgy 31",
      "Brgy 32",
      "Brgy 33",
      "Brgy 34",
      "Brgy 35",
      "Brgy 36",
      "Brgy 37",
      "Brgy 38",
      "Brgy 39",
      "Brgy 40",
      "Brgy 41",
      "Brgy 42",
      "Brgy 43",
      "Brgy 44",
      "Brgy 45",
      "Brgy 46",
      "Brgy 47",
      "Brgy 48",
      "Brgy 49",
      "Brgy 50",
      "Brgy 51",
      "Brgy 52",
      "Brgy 53",
      "Brgy 54",
      "Brgy 55",
      "Brgy 56",
      "Brgy 57",
      "Brgy 58",
      "Brgy 59",
      "Brgy 60",
      "Brgy 61",
      "Brgy 62",
      "Brgy 63",
      "Brgy 64",
      "Brgy 65",
      "Brgy 66",
      "Brgy 67",
      "Brgy 68",
      "Brgy 69",
      "Brgy 70",
      "Brgy 71",
      "Brgy 72",
      "Brgy 73",
      "Brgy 74",
      "Brgy 75",
      "Brgy 76",
      "Brgy 86",
      "Brgy 87",
      "Brgy 88",
      "Brgy 89",
      "Brgy 90",
      "Brgy 91",
      "Brgy 92",
      "Brgy 93",
      "Brgy 94",
      "Brgy 95",
      "Brgy 96",
      "Brgy 97",
      "Brgy 98",
      "Brgy 99",
      "Brgy 100",
      "Brgy 101",
      "Brgy 102",
      "Brgy 103",
      "Brgy 104",
      "Brgy 105",
      "Brgy 106",
      "Brgy 107",
      "Brgy 108",
      "Brgy 109",
      "Brgy 110",
      "Brgy 111",
      "Brgy 112",
      "Brgy 113",
      "Brgy 114",
      "Brgy 115",
      "Brgy 116",
      "Brgy 117",
      "Brgy 118",
      "Brgy 119",
      "Brgy 120",
      "Brgy 121",
      "Brgy 123",
      "Brgy 124",
      "Brgy 125",
      "Brgy 126",
      "Brgy 127",
      "Brgy 128",
      "Brgy 129",
      "Brgy 130",
      "Brgy 131",
    ],
    3: [
      "Brgy 178",
      "Brgy 179",
      "Brgy 180",
      "Brgy 181",
      "Brgy 182",
      "Brgy 183",
      "Brgy 184",
      "Brgy 185",
      "Brgy 186",
      "Brgy 187",
      "Brgy 188",
    ],
  };

  // Function to update the Barangay dropdown based on the selected District
  function updateBarangayDropdown() {
    const selectedDistrict = districtDropdownModal.value;
    const barangays = districtToBarangays[selectedDistrict] || [];

    // Clear existing options
    barangayDropdownModal.innerHTML =
      "<option selected disabled>Select Barangay</option>";

    // Add new options
    barangays.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.text = `${barangay}`;
      barangayDropdownModal.appendChild(option);
    });
  }

  // Attach an event listener to the District dropdown
  districtDropdownModal.addEventListener("change", updateBarangayDropdown);
});

// Add an event listener to clear the modal fields when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  clearModalFields();

  // Add event listener to mobile number field
  document
    .getElementById("mobileNumberModal")
    .addEventListener("click", function () {
      this.value = "09";
    });
});
