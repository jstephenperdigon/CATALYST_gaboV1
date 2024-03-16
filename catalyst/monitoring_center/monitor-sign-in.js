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

//ADMIN SIGN IN FUNCTION
function findAdminIndex() {
  const adminFolderPath = "catalyst/admin/"; // Path to the admin folder
  const adminIndexFilename = "adminIndex.html"; // Name of the admin index file

  // Recursive function to traverse directories
  function traverseDirectories(folderPath) {
    const folders = fs.readdirSync(folderPath); // Read contents of the folder

    // Check if adminIndex.html exists in the current folder
    if (folders.includes(adminIndexFilename)) {
      return `${folderPath}/${adminIndexFilename}`;
    }

    // If adminIndex.html not found, recursively search through subfolders
    for (const folder of folders) {
      const fullPath = `${folderPath}/${folder}`;
      if (fs.lstatSync(fullPath).isDirectory()) {
        const foundPath = traverseDirectories(fullPath);
        if (foundPath) {
          return foundPath; // Return the path if adminIndex.html is found
        }
      }
    }

    // Return null if adminIndex.html is not found in the directory structure
    return null;
  }

  // Start the recursive search from the root directory
  const adminIndexPath = traverseDirectories(adminFolderPath);
  return adminIndexPath;
}

// Function to handle admin sign in
function handleAdminSignIn() {
  const adminIndexPath = findAdminIndex(); // Get the path to adminIndex.html
  console.log("Admin index path:", adminIndexPath); // Debug log
  if (adminIndexPath) {
    console.log("Redirecting to admin index page...");
    window.location.href = adminIndexPath; // Redirect to admin index page
  } else {
    console.error("Admin index page not found.");
    // Handle the case when adminIndex.html is not found
    alert("Admin index page not found."); // Display an alert for user notification
  }
}

// Wait for the DOM content to be loaded before adding event listener
document.addEventListener("DOMContentLoaded", function () {
  const adminSignInButton = document.getElementById("adminSignInButton");

  adminSignInButton.addEventListener("click", function () {
    // Call the function to handle admin sign in
    handleAdminSignIn();
  });
});

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

//ADMIN SIGN IN FUNCTION
