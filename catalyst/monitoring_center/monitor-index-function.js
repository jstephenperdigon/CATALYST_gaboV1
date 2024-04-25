import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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

// Function to handle data retrieval and display within the Schedules tab
function displayDeploymentHistory() {
  const schedulesTableBody = document.querySelector("#schedulesTable tbody");

  // Fetch DeploymentHistory data
  get(deploymentHistoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();

        // Clear existing table body content
        schedulesTableBody.innerHTML = "";

        // Iterate through each entry in historyData and populate the table rows
        Object.entries(historyData).forEach(([scheduleUID, scheduleInfo]) => {
          // Determine the status to display
          const status = scheduleInfo.status !== undefined ? scheduleInfo.status : "not yet collected";

          // Create table row for each schedule
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${scheduleUID}</td>
            <td>${scheduleInfo.SelectedGCL}</td>
            <td>${scheduleInfo.District}</td>
            <td>${scheduleInfo.Barangay}</td>
            <td>${status}</td>
            <td><button class="actionButton" data-schedule-uid="${scheduleUID}">Action</button></td>
          `;
          schedulesTableBody.appendChild(row);
        });
      } else {
        // Handle case where there's no deployment history
        schedulesTableBody.innerHTML = `
          <tr>
            <td colspan="4">No deployment history available.</td>
          </tr>
        `;
      }
    })
    .catch((error) => {
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