// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
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

const usersRef = ref(db, "Accounts/Collectors");

// Function to handle form submission
async function addUser(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Disable the submit button to prevent multiple submissions
  document.getElementById("AddCollectorBtn").disabled = true;

  // Get form values
  const firstName = document.getElementById("fName").value;
  const middleName = document.getElementById("mName").value;
  const lastName = document.getElementById("lName").value;
  const suffix = document.getElementById("sFix").value;
  const email = document.getElementById("eMail").value;
  const mobileNumber = document.getElementById("mobileNumber").value;
  const district = document.getElementById("districtDropdownModal").value;
  const barangay = document.getElementById("districtDropdownModal").value;

  // Check if District and Barangay are selected
  if (district === "Select District" || barangay === "Select Barangay") {
    alert("Please select District and Barangay.");
    // Re-enable the submit button
    document.getElementById("AddCollectorBtn").disabled = false;
    return; // Stop further execution
  }

  // Generate unique ID
  const UId = push(usersRef).key;

  // Fetch existing GCL numbers to determine the new GCL number
  const gclNumbersSnapshot = await get(usersRef);
  const gclNumbers = Object.keys(gclNumbersSnapshot.val() || {}).map(
    (key) => gclNumbersSnapshot.val()[key].GCL
  );

  // Find the first available GCL number starting from "GCL001"
  let newGCLNumber = "GCL001";
  while (gclNumbers.includes(newGCLNumber)) {
    const number = parseInt(newGCLNumber.slice(3)) + 1;
    newGCLNumber = "GCL" + number.toString().padStart(3, "0");
  }

  const randomPassword = generateRandomPassword();

  // Create a new user object
  const newUser = {
    firstName,
    lastName,
    email,
    mobileNumber,
    middleName,
    suffix,
  };

  // Create a new user object
  const AssignedArea = {
    district,
    barangay,
  };

  // Push the new user data to the "users" node in the database
  set(ref(db, `Accounts/Collectors/${UId}`), {
    [`AssignedArea`]: AssignedArea,
    [`UserInfo`]: newUser,
    [`GCL`]: newGCLNumber,
    [`password`]: randomPassword,
  })
    .then(() => {
      // Redirect the user to another page after successful submission
      window.location.href = "CollectorList.html";
    })
    .catch((error) => {
      console.error("Error adding user: ", error);
    });
}

// Function to generate random password with 8 characters
function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Attach the addUser function to the form submission event
document.getElementById("viewForm").addEventListener("submit", addUser);

// Function to navigate back to HouseholdList.html
function Back() {
  window.location.href = "../index.html";
}

// Attach the goBack function to the BackButton click event
document.getElementById("BackButton").addEventListener("click", Back);

document.addEventListener("DOMContentLoaded", function () {
  const districtDropdown = document.getElementById("districtDropdown");
  const barangayDropdown = document.getElementById("barangayDropdown");

  // Define the mapping of districts to barangays
  const districtToBarangays = {
    1: [
      "Brgy 1",
      "Brgy 2",
      "Brgy 3",
      "Brgy 4",
      "Brgy 77",
      "Brgy 78",
      "Brgy 79",
      "Brgy 80",
      "Brgy 81",
      "Brgy 82",
      "Brgy 83",
      "Brgy 84",
      "Brgy 85",
      "Brgy 132",
      "Brgy 133",
      "Brgy 134",
      "Brgy 135",
      "Brgy 136",
      "Brgy 137",
      "Brgy 138",
      "Brgy 139",
      "Brgy 140",
      "Brgy 141",
      "Brgy 142",
      "Brgy 143",
      "Brgy 144",
      "Brgy 145",
      "Brgy 146",
      "Brgy 147",
      "Brgy 148",
      "Brgy 149",
      "Brgy 150",
      "Brgy 151",
      "Brgy 152",
      "Brgy 153",
      "Brgy 154",
      "Brgy 155",
      "Brgy 156",
      "Brgy 157",
      "Brgy 158",
      "Brgy 159",
      "Brgy 160",
      "Brgy 161",
      "Brgy 162",
      "Brgy 163",
      "Brgy 164",
      "Brgy 165",
      "Brgy 166",
      "Brgy 167",
      "Brgy 168",
      "Brgy 169",
      "Brgy 170",
      "Brgy 171",
      "Brgy 172",
      "Brgy 173",
      "Brgy 174",
      "Brgy 175",
      "Brgy 176",
      "Brgy 177",

    ],
    2: [
      "Brgy5",
      "Brgy 6",
      "Brgy 7",
      "Brgy 8",
      "Brgy 9",
      "Brgy 10",
      "Brgy 11",
      "Brgy 12",
      "Brgy 13",
      "Brgy 14",
      "Brgy 15",
      "Brgy 16",
      "Brgy 17",
      "Brgy 18",
      "Brgy 19",
      "Brgy 20",
      "Brgy 21",
      "Brgy 22",
      "Brgy 23",
      "Brgy 24",
      "Brgy 25",
      "Brgy 26",
      "Brgy 27",
      "Brgy 28",
      "Brgy 29",
      "Brgy 30",
      "Brgy 31",
      "Brgy 32",
      "Brgy 33",
      "Brgy 34",
      "Brgy 35",
      "Brgy 36",
      "Brgy 37",
      "Brgy 38",
      "Brgy 39",
      "Brgy 40",
      "Brgy 41",
      "Brgy 42",
      "Brgy 43",
      "Brgy 44",
      "Brgy 45",
      "Brgy 46",
      "Brgy 47",
      "Brgy 48",
      "Brgy 49",
      "Brgy 50",
      "Brgy 51",
      "Brgy 52",
      "Brgy 53",
      "Brgy 54",
      "Brgy 55",
      "Brgy 56",
      "Brgy 57",
      "Brgy 58",
      "Brgy 59",
      "Brgy 60",
      "Brgy 61",
      "Brgy 62",
      "Brgy 63",
      "Brgy 64",
      "Brgy 65",
      "Brgy 66",
      "Brgy 67",
      "Brgy 68",
      "Brgy 69",
      "Brgy 70",
      "Brgy 71",
      "Brgy 72",
      "Brgy 73",
      "Brgy 74",
      "Brgy 75",
      "Brgy 76",
      "Brgy 86",
      "Brgy 87",
      "Brgy 88",
      "Brgy 89",
      "Brgy 90",
      "Brgy 91",
      "Brgy 92",
      "Brgy 93",
      "Brgy 94",
      "Brgy 95",
      "Brgy 96",
      "Brgy 97",
      "Brgy 98",
      "Brgy 99",
      "Brgy 100",
      "Brgy 101",
      "Brgy 102",
      "Brgy 103",
      "Brgy 104",
      "Brgy 105",
      "Brgy 106",
      "Brgy 107",
      "Brgy 108",
      "Brgy 109",
      "Brgy 110",
      "Brgy 111",
      "Brgy 112",
      "Brgy 113",
      "Brgy 114",
      "Brgy 115",
      "Brgy 116",
      "Brgy 117",
      "Brgy 118",
      "Brgy 119",
      "Brgy 120",
      "Brgy 121",
      "Brgy 123",
      "Brgy 124",
      "Brgy 125",
      "Brgy 126",
      "Brgy 127",
      "Brgy 128",
      "Brgy 129",
      "Brgy 130",
      "Brgy 131",

    ],
    3: [
      "Brgy 178",
      "Brgy 179",
      "Brgy 180",
      "Brgy 181",
      "Brgy 182",
      "Brgy 183",
      "Brgy 184",
      "Brgy 185",
      "Brgy 186",
      "Brgy 187",
      "Brgy 188",
    ],
  };

  // Function to update the Barangay dropdown based on the selected District
  function updateBarangayDropdown() {
    const selectedDistrict = districtDropdown.value;
    const barangays = districtToBarangays[selectedDistrict] || [];

    // Clear existing options
    barangayDropdown.innerHTML =
      "<option selected disabled>Select Barangay</option>";

    // Add new options
    barangays.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.text = `${barangay}`;
      barangayDropdown.appendChild(option);
    });
  }

  // Attach an event listener to the District dropdown
  districtDropdown.addEventListener("change", updateBarangayDropdown);
});