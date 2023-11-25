import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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
  databaseURL:"https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function handleLogin(email, password) {
  const usersRef = ref(db, "Accounts/Users");
  get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKeys = Object.keys(users);

        for (const userKey of userKeys) {
          const userData = users[userKey];
          if (userData.email === email && userData.password === password) {
            showAlert("success", "Login successful!");
          
            // Access the user's unique ID
            const userId = userKey;
          
            // Store the user ID in a session or a cookie
            sessionStorage.setItem("userId", userId);
          
            // Redirect to user/user-index.html
            window.location.href = "../user/user-index.html";
            return;
          }
        }

        showAlert("warning", "Invalid email or password. Please try again.");
      } else {
        showAlert("warning", "User not found. Please sign up.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Login Function
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("typeEmailX");
  const passwordInput = document.getElementById("typePasswordX");
  const signInButton = document.querySelector(".btn-primary");

  signInButton.addEventListener("click", function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    handleLogin(email, password);
  });
});
