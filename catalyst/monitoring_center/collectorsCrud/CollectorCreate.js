// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  child,
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
  document.getElementById("submitBtn").disabled = true;

  // Get form values
  const firstName = document.getElementById("fName").value;
  const middleName = document.getElementById("mName").value;
  const lastName = document.getElementById("lName").value;
  const suffix = document.getElementById("sFix").value;
  const email = document.getElementById("eMail").value;
  const mobileNumber = document.getElementById("mobileNumber").value;
  const district = document.getElementById("districtDropdown").value;
  const barangay = document.getElementById("barangayDropdown").value;

  // Check if District and Barangay are selected
  if (district === "Select District" || barangay === "Select Barangay") {
    alert("Please select District and Barangay.");
    // Re-enable the submit button
    document.getElementById("submitBtn").disabled = false;
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
      "1",
      "2",
      "3",
      "4",
      "77",
      "78",
      "79",
      "80",
      "81",
      "82",
      "83",
      "84",
      "85",
      "132",
      "133",
      "134",
      "135",
      "136",
      "137",
      "138",
      "139",
      "140",
      "141",
      "142",
      "143",
      "144",
      "145",
      "146",
      "147",
      "148",
      "149",
      "150",
      "151",
      "152",
      "153",
      "154",
      "155",
      "156",
      "157",
      "158",
      "159",
      "160",
      "161",
      "162",
      "163",
      "164",
      "165",
      "166",
      "167",
      "168",
      "169",
      "170",
      "171",
      "172",
      "173",
      "174",
      "175",
      "176",
      "177",
    ],
    2: [
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
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
      "60",
      "61",
      "62",
      "63",
      "64",
      "65",
      "66",
      "67",
      "68",
      "69",
      "70",
      "71",
      "72",
      "73",
      "74",
      "75",
      "76",
      "86",
      "87",
      "88",
      "89",
      "90",
      "91",
      "92",
      "93",
      "94",
      "95",
      "96",
      "97",
      "98",
      "99",
      "100",
      "101",
      "102",
      "103",
      "104",
      "105",
      "106",
      "107",
      "108",
      "109",
      "110",
      "111",
      "112",
      "113",
      "114",
      "115",
      "116",
      "117",
      "118",
      "119",
      "120",
      "121",
      "123",
      "124",
      "125",
      "126",
      "127",
      "128",
      "129",
      "130",
      "131",
      "131",
    ],
    3: [
      "178",
      "179",
      "180",
      "181",
      "182",
      "183",
      "184",
      "185",
      "186",
      "187",
      "188",
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
