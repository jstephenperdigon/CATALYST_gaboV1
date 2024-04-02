import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

//Alert Content
function showAlert(type, message) {
  const alertContent = `
<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${
                  type === "success" ? "Success" : "Warning"
                }</h5>
            </div>
            <div class="modal-body">
                ${message}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn shadow-none btn-${
                  type === "success" ? "success" : "warning"
                }"  data-mdb-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
`;
  // Append the new modal to the body
  $("body").append(alertContent);

  // Show the modal
  $("#alertModal").modal("show");

  $("#alert").modal("close");
}
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

// Function to handle sign-in process
document
  .getElementById("adminSignInButton")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Retrieve username and password from input fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("typePasswordX").value;

    try {
      // Get a reference to the Firebase database
      const db = getDatabase();

      // Retrieve UID from the Admin node
      const adminSnapshot = await get(ref(db, "Accounts/Admin"));
      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.val();
        const uid = adminData.uid;

        // Check if username and password match
        if (
          adminData.username === username &&
          adminData.password === password
        ) {
          // Store Admin UID in session storage
          sessionStorage.setItem("uid", uid);

          // Redirect to the appropriate page based on usertype
          if (adminData.usertype === "Admin") {
            window.location.href = "../admin/adminIndex.html";
          } else if (adminData.usertype === "Monitoring") {
            window.location.href = "../index.html";
          } else {
            showAlert("warning", "Invalid user type");
          }
          return; // Exit the loop once a match is found
        }
      }

      // Retrieve UID from the Monitoring node
      const monitoringSnapshot = await get(ref(db, "Accounts/Monitoring"));
      if (monitoringSnapshot.exists()) {
        const monitoringData = monitoringSnapshot.val();
        const uid = monitoringData.uid;

        // Check if username and password match
        if (
          monitoringData.username === username &&
          monitoringData.password === password
        ) {
          // Store Monitoring UID in session storage
          sessionStorage.setItem("uid", uid);

          // Redirect to the appropriate page based on usertype
          if (monitoringData.usertype === "Admin") {
            window.location.href = "../admin/adminIndex.html";
          } else if (monitoringData.usertype === "Monitoring") {
            window.location.href = "../index.html";
          } else {
            showAlert("warning", "Invalid user type");
          }
          return; // Exit the loop once a match is found
        }
      }

      // If no match is found
      showAlert("warning", "Invalid username or password");
    } catch (error) {
      console.error("Error signing in:", error);
      showAlert("warning", "An error occurred while signing in");
    }
  });
