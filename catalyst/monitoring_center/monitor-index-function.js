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

// Reference to the 'DeploymentHistory' node in Firebase
const deploymentHistoryRef = ref(db, "DeploymentHistory");

// Function to display deployment history
function displayDeploymentHistory() {
  const schedulesTableBody = document.querySelector("#schedulesTable tbody");

  // Listen for changes to deploymentHistoryRef
  onValue(deploymentHistoryRef, (snapshot) => {
    const historyData = snapshot.val();

    // Clear existing table body content
    schedulesTableBody.innerHTML = "";

      if (historyData) {
      // Iterate through each entry in historyData and populate the table rows
      Object.entries(historyData).forEach(([scheduleUID, scheduleInfo]) => {
        // Determine the status to display
        const status = scheduleInfo.status !== undefined ? scheduleInfo.status : "Not yet collected";

        // Create table row for each schedule
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${scheduleUID}</td>
          <td>${scheduleInfo.SelectedGCL}</td>
          <td>${scheduleInfo.District}</td>
          <td>${scheduleInfo.Barangay}</td>
          <td>${status}</td>
          <td><button class="btn btn-primary viewDetails" data-schedule-uid="${scheduleUID}">View</button></td>
        `;
        schedulesTableBody.appendChild(row);

        // Add event listener to the "ViewDetails" button
        const viewDetailsButton = row.querySelector(".viewDetails");
        viewDetailsButton.addEventListener("click", () => {
          // Get the scheduleUID associated with the clicked button
          const clickedScheduleUID = viewDetailsButton.getAttribute("data-schedule-uid");

          // Retrieve details based on scheduleUID (you can customize this part)
          const details = historyData[clickedScheduleUID];

          // Update modal content with details
          const modalContent = document.querySelector("#modalContent");
          modalContent.innerHTML = `
            <div class="row">
              <div class="col-md-6">
                <p><strong>Schedule UID:</strong> ${scheduleUID}</p>
                <p><strong>Selected GCL:</strong> ${details.SelectedGCL}</p>
                <p><strong>Selected GCN:</strong> ${details.SelectedGCN}</p>
                <p><strong>District:</strong> ${details.District}</p>
                <p><strong>Barangay:</strong> ${details.Barangay}</p>
                <p><strong>Status:</strong> ${details.status !== undefined ? details.status : "Not yet collected"}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Time Sent:</strong> ${details.timeSent}</p>
                <p><strong>Time Input:</strong> ${details.TimeInput}</p>
                <p><strong>Time Collection Ended:</strong> ${details.TimeCollectionEnded !== undefined ? details.TimeCollectionEnded : "None"}</p>
                <p><strong>Selected Date Input:</strong> ${details.DateInput}</p>
                <p><strong>Date Collection Ended:</strong> ${details.DateCollectionEnded !== undefined ? details.DateCollectionEnded : "None"}</p>
                <p><strong>Biodegradable:</strong> ${details.Biodegradable}</p>
                <p><strong>Non-Biodegradable:</strong> ${details.NonBiodegradable}</p>
                <p><strong>Recyclables:</strong> ${details.Recyclables}</p>
                <p><strong>Special:</strong> ${details.Special}</p>
                <p><strong>Total Quota:</strong> ${details.TotalQuota}</p>
              </div>
            </div>
          `;

          // Show the modal
          const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
          detailsModal.show();
        });
      });
    } else {
      // Handle case where there's no deployment history
      schedulesTableBody.innerHTML = `
        <tr>
          <td colspan="6">No deployment history available.</td>
        </tr>
      `;
    }
  }, (error) => {
    console.error("Error fetching DeploymentHistory:", error);
    // Handle error case
    schedulesTableBody.innerHTML = `
      <tr>
        <td colspan="4">Error fetching deployment history.</td>
      </tr>
    `;
  });
}

// Call the function to display deployment history when the DOM content is loaded
document.addEventListener("DOMContentLoaded", displayDeploymentHistory);