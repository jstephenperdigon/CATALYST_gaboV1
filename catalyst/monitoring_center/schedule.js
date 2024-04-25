// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
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

// Reference to the 'DeploymentHistory' node in Firebase
const deploymentHistoryRef = ref(db, 'DeploymentHistory');

function displayDeploymentHistory() {
  const activitiesTabContent = document.querySelector('.card-activity .card-body');

  // Fetch DeploymentHistory data
  get(deploymentHistoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();

        // Clear existing content
        activitiesTabContent.innerHTML = '';

        // Iterate through each entry in historyData
        Object.entries(historyData).forEach(([scheduleUID, scheduleInfo]) => {
          // Create card element for each schedule
          const cardElement = document.createElement('div');
          cardElement.classList.add('container', 'top-0');
          cardElement.innerHTML = `
            <div class="card rounded-5 border-0 p-3 shadow-none position-relative">
              <div class="d-flex align-items-center">
                <div class="bg-secondary rounded-4 p-3 me-3">
                  <i class="fas fa-calendar-alt fa-2x text-light"></i>
                </div>
                <div>
                  <p class="fw-bold fs-6 mb-0">Scheduled for collection</p>
                  <p class="fw-light text-muted mb-0">
                    ${scheduleInfo.SelectedGCL} has set to collect on Barangay ${scheduleInfo.Barangay}.
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
    })
    .catch((error) => {
      console.error('Error fetching DeploymentHistory:', error);
      // Handle error case
      activitiesTabContent.innerHTML = `
        <div class="container">
          <p>Error fetching deployment history.</p>
        </div>
      `;
    });
}


// Call the function to display deployment history when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayDeploymentHistory);