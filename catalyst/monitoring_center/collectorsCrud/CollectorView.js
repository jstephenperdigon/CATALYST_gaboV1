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

// Function to navigate back to CollectorList.html
function Back() {
  window.location.href = "CollectorList.html";
}

// Attach the goBack function to the BackButton click event
document.getElementById("BackButton").addEventListener("click", Back);

// Function to fetch and display the account details
function viewAccount(UId) {
  const accountRef = ref(db, `Accounts/Collectors/${UId}`);

  get(accountRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const accountData = snapshot.val();

        // Save UId to sessionStorage
        sessionStorage.setItem("currentUId", UId);

        // Display account details in HTML elements
        document.getElementById("GCL").textContent = accountData.GCL;
        document.getElementById(
          "Name"
        ).textContent = `${accountData.UserInfo.firstName} ${accountData.UserInfo.lastName}`;
        document.getElementById("email").textContent =
          accountData.UserInfo.email;
        document.getElementById("mobileNumber").textContent =
          accountData.UserInfo.mobileNumber;
        document.getElementById("district").textContent =
          accountData.AssignedArea.district;
        document.getElementById("barangay").textContent =
          accountData.AssignedArea.barangay;
        document.getElementById("password").textContent = accountData.password;
      } else {
        console.log("No such account exists");
      }
    })
    .catch((error) => {
      console.error("Error fetching account:", error);
    });
}

// Retrieve UId from sessionStorage
const storedUId = sessionStorage.getItem("currentUId");

// If UId is found in sessionStorage, call viewAccount with the stored UId
if (storedUId) {
  viewAccount(storedUId);
} else {
  // If UId is not found in sessionStorage or URL, navigate back to CollectorList.html
  Back();
}
