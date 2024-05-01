import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Retrieve userId from sessionStorage
const accountId = sessionStorage.getItem("uid");

// Logout function
function logout() {
  // Remove the UID from session storage
  sessionStorage.removeItem("uid");

  // Redirect to the sign-in page
  window.location.href = "RevisedMonitoringCenter/monitor-indexSI.html";
}

// Attach the logout function to the click event of the "SignOut" link
document.getElementById("signOut").addEventListener("click", logout);

//BENNINGING SCHEDULES

// Reference to the 'DeploymentHistory' node in Firebase
const deploymentHistoryRef = ref(db, "DeploymentHistory");

// Function to display deployment history
function displayDeploymentHistory() {
  const schedulesTableBody = document.querySelector("#schedulesTable tbody");

  // Listen for changes to deploymentHistoryRef
  onValue(
    deploymentHistoryRef,
    (snapshot) => {
      const historyData = snapshot.val();

      // Clear existing table body content
      schedulesTableBody.innerHTML = "";

      if (historyData) {
        // Convert historyData to an array of objects
        const historyArray = Object.entries(historyData).map(
          ([scheduleUID, scheduleInfo]) => ({
            scheduleUID,
            ...scheduleInfo,
          })
        );

        // Sort the historyArray based on combined DateInput and timeSent in descending order
        historyArray.sort((a, b) => {
          const combinedDateTimeA = new Date(`${a.DateInput} ${a.timeSent}`);
          const combinedDateTimeB = new Date(`${b.DateInput} ${b.timeSent}`);
          return combinedDateTimeB - combinedDateTimeA;
        });

        // Function to filter deployment history based on search input
        function filterDeploymentHistory(searchQuery) {
          const filteredHistory = [];

          // Iterate through each entry in historyArray and check if it matches the search query
          historyArray.forEach(
            ({
              scheduleUID,
              SelectedGCL,
              District,
              Barangay,
              status,
              timeSent,
              DateInput,
            }) => {
              // Check if any of the fields contain the search query
              if (
                scheduleUID.toLowerCase().includes(searchQuery) ||
                SelectedGCL.toLowerCase().includes(searchQuery) ||
                District.toLowerCase().includes(searchQuery) ||
                Barangay.toLowerCase().includes(searchQuery) ||
                timeSent.toLowerCase().includes(searchQuery) ||
                DateInput.toLowerCase().includes(searchQuery)
              ) {
                // If any field matches, add it to the filtered history
                filteredHistory.push({
                  scheduleUID,
                  SelectedGCL,
                  District,
                  Barangay,
                  status,
                  timeSent,
                  DateInput,
                });
              }
            }
          );

          return filteredHistory;
        }

        // Function to update deployment history table with filtered data
        function updateDeploymentHistoryTable(filteredData) {
          // Clear existing table body content
          schedulesTableBody.innerHTML = "";

          if (filteredData.length > 0) {
            // Iterate through filtered data and populate the table rows
            filteredData.forEach(
              ({
                scheduleUID,
                SelectedGCL,
                District,
                Barangay,
                status,
                timeSent,
                DateInput,
              }) => {
                // Create table row for each schedule
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td>${scheduleUID}</td>
                  <td>${SelectedGCL}</td>
                  <td>${District}</td>
                  <td>${Barangay}</td>
                  <td>${timeSent}</td>
                  <td>${DateInput}</td>
                  <td>${
                    status !== undefined ? status : "Not yet collected"
                  }</td>
                  <td><button class="btn btn-primary viewDetails" data-schedule-uid="${scheduleUID}">View</button></td>
                `;
                schedulesTableBody.appendChild(row);

                // Add event listener to the "ViewDetails" button
                const viewDetailsButton = row.querySelector(".viewDetails");
                viewDetailsButton.addEventListener("click", () => {
                  // Get the scheduleUID associated with the clicked button
                  const clickedScheduleUID =
                    viewDetailsButton.getAttribute("data-schedule-uid");

                  // Retrieve details based on scheduleUID (you can customize this part)
                  const details = historyData[clickedScheduleUID];

                  // Update modal content with details
                  const modalContent = document.querySelector(
                    "#modalScheduleContent"
                  );
                  modalContent.innerHTML = `
            <div class="row">
              <div class="col-md-6">
                <p><strong>Schedule UID:</strong> ${scheduleUID}</p>
                <p><strong>Selected GCL:</strong> ${details.SelectedGCL}</p>
                <p><strong>Selected GCN:</strong> ${details.SelectedGCN}</p>
                <p><strong>District:</strong> ${details.District}</p>
                <p><strong>Barangay:</strong> ${details.Barangay}</p>
                <p><strong>Status:</strong> ${
                  details.status !== undefined
                    ? details.status
                    : "Not yet collected"
                }</p>
              </div>
              <div class="col-md-6">
                <p><strong>Time Sent:</strong> ${details.timeSent}</p>
                <p><strong>Time Input:</strong> ${details.TimeInput}</p>
                <p><strong>Time Collection Ended:</strong> ${
                  details.TimeCollectionEnded !== undefined
                    ? details.TimeCollectionEnded
                    : "None"
                }</p>
                <p><strong>Selected Date Input:</strong> ${
                  details.DateInput
                }</p>
                <p><strong>Date Collection Ended:</strong> ${
                  details.DateCollectionEnded !== undefined
                    ? details.DateCollectionEnded
                    : "None"
                }</p>
                <p><strong>Biodegradable:</strong> ${details.Biodegradable}</p>
                <p><strong>Non-Biodegradable:</strong> ${
                  details.NonBiodegradable
                }</p>
                <p><strong>Recyclables:</strong> ${details.Recyclables}</p>
                <p><strong>Special:</strong> ${details.Special}</p>
                <p><strong>Total Quota:</strong> ${details.TotalQuota}</p>
              </div>
            </div>
          `;

                  // Show the modal
                  const detailsModal = new bootstrap.Modal(
                    document.getElementById("detailsModal")
                  );
                  detailsModal.show();
                });
              }
            );
          } else {
            // Handle case where there's no deployment history
            schedulesTableBody.innerHTML = `
        <tr>
          <td colspan="6">No deployment history available.</td>
        </tr>
      `;
          }
        }
        // Call the updateDeploymentHistoryTable function initially with all data
        updateDeploymentHistoryTable(historyArray);

        // Add event listener for the search input field
        const searchInput = document.querySelector("#searchHistory");
        searchInput.addEventListener("input", () => {
          const searchQuery = searchInput.value.toLowerCase();
          const filteredData = filterDeploymentHistory(searchQuery);
          updateDeploymentHistoryTable(filteredData);
        });
      } else {
        // Handle case where there's no deployment history
        schedulesTableBody.innerHTML = `
        <tr>
          <td colspan="6">No deployment history available.</td>
        </tr>
      `;
      }
    },
    (error) => {
      console.error("Error fetching DeploymentHistory:", error);
      // Handle error case
      schedulesTableBody.innerHTML = `
      <tr>
        <td colspan="4">Error fetching deployment history.</td>
      </tr>
    `;
    }
  );
}

// Call the function to display deployment history when the DOM content is loaded
document.addEventListener("DOMContentLoaded", displayDeploymentHistory);

//END OF SCHEDULES

function displayActivities() {
  const activitiesTabContent = document.querySelector(
    ".card-activity .card-body"
  );

  // Set up listener for 'DeploymentHistory' changes
  onValue(
    deploymentHistoryRef,
    (snapshot) => {
      const historyData = snapshot.val();

      // Clear existing content
      activitiesTabContent.innerHTML = "";

      if (historyData) {
        // Iterate through each entry in historyData
        Object.entries(historyData).forEach(([scheduleUID, scheduleInfo]) => {
          // Create card element for each schedule
          const cardElement = document.createElement("div");
          cardElement.classList.add("containerBins", "top-0");
          cardElement.innerHTML = `
          <div class="card rounded-5 border-0 p-3 shadow-none position-relative">
            <div class="d-flex align-items-center">
              <div class="bg-secondary rounded-4 p-3 me-3">
                <i class="fas fa-calendar-alt fa-2x text-light"></i>
              </div>
              <div>
                <p class="fw-bold fs-6 mb-0">Scheduled for collection</p>
              <p class="fw-light text-muted mb-0">
  ${scheduleInfo.SelectedGCL} is set to collect in Barangay ${scheduleInfo.Barangay}.
</p>

              </div>
            </div>
          </div>
        `;

          // Append the card to the activitiesTabContent
          activitiesTabContent.appendChild(cardElement);
        });
      } else {
        // Handle case where there's no deployment history
        activitiesTabContent.innerHTML = `
        <div class="container">
          <p>No deployment history available.</p>
        </div>
      `;
      }
    },
    (error) => {
      console.error("Error fetching DeploymentHistory:", error);
      // Handle error case
      activitiesTabContent.innerHTML = `
      <div class="container">
        <p>Error fetching deployment history.</p>
      </div>
    `;
    }
  );
}

// Call the function to display deployment history when the DOM content is loaded
document.addEventListener("DOMContentLoaded", displayActivities);
