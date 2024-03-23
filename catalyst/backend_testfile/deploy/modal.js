import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
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

const selectBarangayTxtField = document.getElementById(
  "selectBarangayTxtField"
);
const nextButton = document.getElementById("nextButton");
const districtInput = document.getElementById("district");
const barangayInput = document.getElementById("barangay");
const collectorDropdown = document.getElementById("collector");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");

// Function to check if the value matches the given items
function isValidValue(value) {
  const validItems = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ];
  return validItems.includes(value);
}

// Function to fetch available collectors based on district and barangay
function fetchAvailableCollectors(district, barangay) {
  const collectorsRef = ref(db, "Accounts/Collectors");
  onValue(collectorsRef, (snapshot) => {
    collectorDropdown.innerHTML = ""; // Clear previous options
    snapshot.forEach((childSnapshot) => {
      const collector = childSnapshot.val();
      if (
        collector.AssignedArea.district === district &&
        collector.AssignedArea.barangay === barangay
      ) {
        const option = document.createElement("option");
        option.value = collector.GCL;
        option.textContent = collector.GCL;
        collectorDropdown.appendChild(option);
      }
    });
  });
}

// Event listener for input changes in the selectBarangayTxtField field
document
  .getElementById("selectBarangayTxtField")
  .addEventListener("input", () => {
    const value = document.getElementById("selectBarangayTxtField").value;
    const isValid = isValidValue(value);
    nextButton.disabled = !isValid;
  });

// Open the modal
document.getElementById("openModalBtn").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "block";
});

// Show hidden elements when next button is clicked
document.getElementById("nextButton").addEventListener("click", function () {
  const barangay = document.getElementById("selectBarangayTxtField").value;
  document.getElementById("barangayText").textContent = barangay;
  const district = getDistrictForBarangay(barangay);
  document.getElementById("districtText").textContent = district;

  document.querySelector(".border-line").classList.remove("hidden");
  document
    .getElementById("districtBarangayContainer")
    .classList.remove("hidden");
  document.getElementById("dateTimeContainer").classList.remove("hidden");
  document.getElementById("confirmButton").classList.remove("hidden");
  document.getElementById("cancelButton").classList.remove("hidden");
  document.getElementById("collectorContainer").classList.remove("hidden");

  fetchAvailableCollectors(district, barangay);

  // Disable next button and selectBarangayTxtField
  nextButton.disabled = true;
  document.getElementById("selectBarangayTxtField").disabled = true;
});

// Event listener for date and time inputs
document
  .getElementById("scheduleDate")
  .addEventListener("input", validateConfirmButton);
document
  .getElementById("scheduleTime")
  .addEventListener("input", validateConfirmButton);
document
  .getElementById("collector")
  .addEventListener("change", validateConfirmButton);

// Function to validate confirm button
function validateConfirmButton() {
  const dateValue = document.getElementById("scheduleDate").value;
  const timeValue = document.getElementById("scheduleTime").value;
  const collectorValue = document.getElementById("collector").value;

  if (dateValue && timeValue && collectorValue) {
    confirmButton.disabled = false;
  } else {
    confirmButton.disabled = true;
  }
}

// Event listener for cancel button
document.getElementById("cancelButton").addEventListener("click", function () {
  document.querySelector(".border-line").classList.add("hidden");
  document.getElementById("districtBarangayContainer").classList.add("hidden");
  document.getElementById("dateTimeContainer").classList.add("hidden");
  document.getElementById("confirmButton").classList.add("hidden");
  document.getElementById("cancelButton").classList.add("hidden");
  document.getElementById("collectorContainer").classList.add("hidden");

  // Enable next button and selectBarangayTxtField
  document.getElementById("nextButton").disabled = true;
  document.getElementById("selectBarangayTxtField").disabled = false;
  document.getElementById("selectBarangayTxtField").value = "";

  // Clear date, time, and collector dropdown values
  document.getElementById("scheduleDate").value = "";
  document.getElementById("scheduleTime").value = "";
  document.getElementById("collector").value = "";

  // Disable confirm button
  document.getElementById("confirmButton").disabled = true;
});

// Function to get district based on barangay
function getDistrictForBarangay(barangay) {
  const districtMapping = {
    1: ["1", "4", "5"],
    2: ["2", "3", "7"],
    13: ["6", "9", "11"],
  };

  for (const [district, barangays] of Object.entries(districtMapping)) {
    if (barangays.includes(barangay)) {
      return district;
    }
  }
  return null; // No district found
}
