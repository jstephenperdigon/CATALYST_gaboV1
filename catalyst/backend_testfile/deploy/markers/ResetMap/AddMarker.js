import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

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

function addDataToFirebase() {
  // Get values from the form
  var gcnNumber = document.getElementById("gcn_number").value;
  var latitude = document.getElementById("latitude").value;
  var longitude = document.getElementById("longitude").value;
  var totalQuota = document.getElementById("total_quota").value;
  var sampleNumber = document.getElementById("sample_number").value;
  var barangay = document.getElementById("barangay").value;
  var district = document.getElementById("district").value;

  // Add data to the database under GarbageBinControlNumber
  const garbageBinControlNumberRef = ref(
    db,
    "GarbageBinControlNumber/" + gcnNumber
  );
  set(garbageBinControlNumberRef, {
    Location: {
      Latitude: latitude,
      Longitude: longitude,
    },
    TotalQuota: totalQuota,
  })
    .then(() => {
      console.log("Garbage bin control number data added successfully!");
    })
    .catch((error) => {
      console.error("Error adding garbage bin control number data: ", error);
    });

  // Add data to the database under Users nested inside GCN###
  const usersRef = ref(
    db,
    "GarbageBinControlNumber/" + gcnNumber + "/Users" + sampleNumber
  );
  set(usersRef, {
    barangay: barangay,
    district: district,
  })
    .then(() => {
      console.log("User data added successfully!");
    })
    .catch((error) => {
      console.error("Error adding user data: ", error);
    });
}

// Add event listener for form submission
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("garbageBinForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission
      addDataToFirebase(); // Call the addDataToFirebase function
    });
  }
});
