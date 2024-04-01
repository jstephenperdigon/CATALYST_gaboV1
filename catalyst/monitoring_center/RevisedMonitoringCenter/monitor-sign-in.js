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

      // Retrieve all UIDs from the database
      const uidSnapshot = await get(ref(db, "Accounts"));
      if (uidSnapshot.exists()) {
        const uids = Object.keys(uidSnapshot.val());

        // Loop through each UID to find a match for the provided username and password
        for (const uid of uids) {
          const userDataSnapshot = await get(
            child(ref(db, `Accounts/${uid}`), "/")
          );
          const userData = userDataSnapshot.val();

          // Check if username and password match
          if (
            userData.username === username &&
            userData.password === password
          ) {
            // Store UID in session storage
            sessionStorage.setItem("uid", uid);

            // Check user's usertype and redirect accordingly
            if (userData.usertype === "Admin") {
              window.location.href = "../admin/adminIndex.html";
            } else if (userData.usertype === "Monitoring") {
              window.location.href = "../index.html";
            } else {
              showAlert("warning", "Invalid user type");
            }
            return; // Exit the loop once a match is found
          }
        }

        // If no match is found after looping through all UIDs
        showAlert("warning", "Invalid username or password");
      } else {
        showAlert("warning", "No users found in the database");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      showAlert("warning", "An error occurred while signing in");
    }
  });
