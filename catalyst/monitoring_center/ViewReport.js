// Import the functions you need from the SDKs you need
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

// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("openModalBtn");

// Function to get data from Firebase and populate modal
function getDataFromFirebase(ticketNumber) {
  // Reference to the specific report in Firebase based on ticket number
  const reportRef = ref(db, `Reports/${ticketNumber}`);

  // Get the data once from Firebase
  get(reportRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Populate the modal with the retrieved data
        document.getElementById("ticketNumber").textContent = ticketNumber;
        document.getElementById("GCN").textContent = data.GCN || "";
        document.getElementById("Name").textContent =
          `${data.firstName}  ${data.lastName}` || "";
        document.getElementById("email").textContent = data.email || "";
        document.getElementById("mobileNumber").textContent =
          data.mobileNumber || "";
        document.getElementById("Issue").textContent = data.Issue || "";
        document.getElementById("district").textContent = data.district || "";
        document.getElementById("barangay").textContent = data.barangay || "";
        document.getElementById("city").textContent = data.city || "";
        document.getElementById("province").textContent = data.province || "";
        document.getElementById("country").textContent = data.country || "";
        document.getElementById("TimeSent").textContent = data.TimeSent || "";
        document.getElementById("DateSent").textContent = data.DateSent || "";
        document.getElementById("addressLine1").textContent =
          data.addressLine1 || "";
        document.getElementById("addressLine2").textContent =
          data.addressLine2 || "";

        // Display the modal
        modal.style.display = "block";
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error getting data:", error);
    });
}

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  // Assuming you want to fetch data for a specific ticket number, you need to pass it to getDataFromFirebase function
  const ticketNumber = "GCN00103152024TW74"; // Replace this with your actual ticket number
  getDataFromFirebase(ticketNumber);
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
