import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
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

function handleLogin(username, password) {
  console.log("Entered username:", username);
  console.log("Entered password:", password);

  const monitoringRef = ref(db, "Accounts/Monitoring");

  get(monitoringRef)
    .then((monitoringSnapshot) => {
      if (monitoringSnapshot.exists()) {
        const monitoringData = monitoringSnapshot.val();

        // Check if the provided username and password match any in Monitoring
        const userTypes = Object.keys(monitoringData);

        for (const userType of userTypes) {
          const userData = monitoringData[userType];

          // Exact match for username and password
          if (
            userData.username === username &&
            userData.password === password
          ) {
            console.log("Account matched:", userData);

            if (userData.status === "LoggedIn") {
              showAlert("warning", "User is already logged in.");
              return;
            }

            showAlert("success", "Login successful!");

            // Update user status to "LoggedIn"
            const userRef = ref(db, `Accounts/Monitoring/${userType}`);
            set(userRef, { ...userData, status: "LoggedIn" });

            // Access the user's unique ID
            const userId = userType;

            // Store the user ID in a session or a cookie
            sessionStorage.setItem("userId", userId);

            // Redirect to user/user-index.html
            window.location.href = "index.html";
            return;
          }
        }

        showAlert("warning", "Invalid username or password. Please try again.");
      } else {
        showAlert("warning", "Monitoring data not available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching Monitoring data:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("typePasswordX");
  const signInButton = document.querySelector(".btn-primary");

  signInButton.addEventListener("click", function () {
    const username = usernameInput.value;
    const password = passwordInput.value;

    handleLogin(username, password);
  });
});
