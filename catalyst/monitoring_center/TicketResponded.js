// Import the necessary Firebase modules
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
function generateReportHTMLResponded(reportsResponded) {
  return `
              <tr>
                  <td>${reportsResponded.ticketNumber}</td>
                  <td>${reportsResponded.GCN}</td>
                  <td>${reportsResponded.Issue}</td>
                  <td>${reportsResponded.district.split(" ")[1]}</td>
                  <td>${reportsResponded.barangay.split(" ")[1]}</td>
                  <td>${reportsResponded.TimeSent}</td>
                  <td>${reportsResponded.DateSent}</td>
                  <td class="viewRespondedContainer">
                      <button class="viewResponded btn btn-primary shadow-none ">View</button>
              </tr>
          `;
}

// Function to display the reports table
function displayReportsTableResponded(reportsRespondedArray) {

  const reportstableresponded = document.getElementById("reportstableresponded");
  const tablerespondedHTML = `
    <table class="tableresponded">
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
            ${reportsRespondedArray.map(generateReportHTMLResponded).join("")}
        </tbody>
    </table>
`;
  reportstableresponded.innerHTML = tablerespondedHTML;

  // Add event listener to "View" buttons
  document.querySelectorAll(".viewResponded").forEach((button) => {
    button.addEventListener("click", function () {
      const RespondedticketNumber = this.parentNode.parentNode.children[0].textContent;
      displayModalResponded(RespondedticketNumber);
    });
  });
}

// Function to update the table when data changes
function updateTableResponded() {
  const reportsrespondedRef = ref(db, "ReportsResponded");
  onValue(reportsrespondedRef, (snapshot) => {
    const reportsrespondedData = snapshot.val();
    if (reportsrespondedData) {
      const reportsRespondedArray = Object.entries(reportsrespondedData).map(
        ([RespondedticketNumber, reportResponded]) => ({ RespondedticketNumber, ...reportResponded })
      );
      displayReportsTableResponded(reportsRespondedArray);
    } else {
      displayReportsTableResponded([]);
    }
  });
}

function displayModalResponded(RespondedticketNumber) {
  // Retrieve report data from Firebase based on ticketNumber
  const reportrespondedRef = ref(db, `ReportsResponded/${RespondedticketNumber}`);
  get(reportrespondedRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const reportsResponded = snapshot.val();

        // Extracting only the numbers from Barangay and District
        const districtNumber = reportsResponded.district.split(" ")[1];
        const barangayNumber = reportsResponded.barangay.split(" ")[1];

        // Populate modal content with report details
        const respondContent = document.getElementById("respondContent");
        respondContent.innerHTML = `
        <div class="container">
        
          <div class="row">
            <div class="col-md-6">
              <p><span class="fw-bold">Ticket Number:</span> ${RespondedticketNumber}</p>
            </div>
            <div class="col-md-6">
              <p><span class="fw-bold">GCN:</span> ${reportsResponded.GCN}</p>
            </div>
          </div>

            <div class="row">
             <div class="col-md-6">
                  <p><span class="fw-bold">Issue:</span> ${reportsResponded.Issue}</p>
              </div>
              <div class="col-md-6">
                 <p><span class="fw-bold">Description:</span> ${
                   reportsResponded.Description || "N/A"
                 }</p>
              </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                  <p><span class="fw-bold">Date Sent:</span> ${
                    reportsResponded.DateSent
                  }</p>
                </div>
            </div>
            <div class="container">
            <p class="fs-5"> USER DETAILS</p>
            </div>
          <div class="row">
              <div class="col-md-6">
                  <p><span class="fw-bold">Name:</span> ${reportsResponded.firstName} ${
          reportsResponded.lastName
        }</p>
                  <p><span class="fw-bold">Email:</span> ${reportsResponded.email}</p>
                  <p><span class="fw-bold">Mobile Number:</span> ${
                    reportsResponded.mobileNumber
                  }</p>
            
          </div>
          <div class="row">
              <div class="col-md-6">
                <p><span class="fw-bold">District:</span> ${districtNumber}</p>
                <p><span class="fw-bold">Barangay:</span> ${barangayNumber}</p>
                <p><span class="fw-bold">City:</span> ${reportsResponded.city}</p>
              </div>
         
          </div>
          <div class="row">
              <div class="col-md-12">
              
                <p><span class="fw-bold">Address Line 1:</span> ${
                  reportsResponded.addressLine1
                }</p>
          <div class="modal-footer justify-content-center">
          </div>
      </div>
    </div>
  </div>
`;

        // Show the modal
        const modalResponded = new bootstrap.Modal(document.getElementById("modalResponded"));
        modalResponded.show();
      } else {
        // If the report doesn't exist, display a message
        const respondContent = document.getElementById("respondContent");
        respondContent.innerHTML = "<p>Report not found.</p>";

        // Show the modal
        const modalResponded = new bootstrap.Modal(document.getElementById("modalResponded"));
        modalResponded.show();
      }
    })
    .catch((error) => {
      console.error("Error retrieving report:", error);
      // Display an error message if there's an issue fetching the report
      const respondContent = document.getElementById("respondContent");
      respondContent.innerHTML = "<p>Error retrieving report data.</p>";

      // Show the modal
      const modalResponded = new bootstrap.Modal(document.getElementById("modalResponded"));
      modalResponded.show();
    });
}

// Display the initial reports table when the page loads
window.onload = function () {
  updateTableResponded();
};