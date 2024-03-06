// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
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

// Attach the updateCollector function to the form submission event
document
  .getElementById("updateForm")
  .addEventListener("submit", updateCollector);

// Attach the Back function to the BackButton click event
document.getElementById("BackButton").addEventListener("click", Back);

document.addEventListener("DOMContentLoaded", function () {
  try {
    // Get UId from sessionStorage
    const currentUId = sessionStorage.getItem("currentUId");

    // Get reference to the specific collector in the database using the stored UId
    const collectorRef = ref(db, `Accounts/Collectors/${currentUId}`);

    // Fetch collector data from the database
    get(collectorRef).then((snapshot) => {
      if (snapshot.exists()) {
        const collectorData = snapshot.val();

        // Populate form fields with collector data
        document.getElementById("firstName").value =
          collectorData.UserInfo.firstName;
        document.getElementById("lastName").value =
          collectorData.UserInfo.lastName;
        document.getElementById("email").value = collectorData.UserInfo.email;
        document.getElementById("mobile").value =
          collectorData.UserInfo.mobileNumber;
        document.getElementById("districtDropdown").value =
          collectorData.UserInfo.district;
        document.getElementById("barangayDropdown").value =
          collectorData.UserInfo.barangay;
        document.getElementById("password").value = collectorData.password;

        // Update the barangay dropdown based on the selected district
        updateBarangayDropdown(collectorData.UserInfo.district);
      } else {
        console.log("Collector not found");
      }
    });
  } catch (error) {
    console.error("Error fetching collector information: ", error);
  }

  const districtDropdown = document.getElementById("districtDropdown");
  const barangayDropdown = document.getElementById("barangayDropdown");

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

  function updateBarangayDropdown(selectedDistrict) {
    const barangays = districtToBarangays[selectedDistrict] || [];

    barangayDropdown.innerHTML =
      "<option selected disabled>Select Barangay</option>";

    barangays.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.text = `${barangay}`;
      barangayDropdown.appendChild(option);
    });
  }

  districtDropdown.addEventListener("change", function () {
    const selectedDistrict = districtDropdown.value;
    updateBarangayDropdown(selectedDistrict);
  });

  // Function to generate a random password
  function generatePassword() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newPassword = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters[randomIndex];
    }
    return newPassword;
  }

  // Add event listener to the Generate New Password button
  document
    .getElementById("generatePasswordButton")
    .addEventListener("click", function () {
      // Generate a new password
      const newPassword = generatePassword();
      // Set the generated password to the password field
      document.getElementById("password").value = newPassword;
    });
});

// Function to navigate back to HouseholdList.html
function Back() {
  window.location.href = "CollectorList.html";
}

// Function to update collector information
function updateCollector(event) {
  event.preventDefault(); // Prevent form submission

  // Get form inputs
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const district = document.getElementById("districtDropdown").value;
  const barangay = document.getElementById("barangayDropdown").value;
  const password = document.getElementById("password").value;
  const currentUId = sessionStorage.getItem("currentUId");

  // Construct the updated data object
  const newData = {
    UserInfo: {
      firstName,
      lastName,
      email,
      mobileNumber: mobile,
      district,
      barangay,
    },
    password,
  };

  // Update collector data in the database
  const collectorRef = ref(db, `Accounts/Collectors/${currentUId}`);
  update(collectorRef, newData)
    .then(() => {
      console.log("Collector information updated successfully");
      // Redirect to CollectorList.html after successful update
      window.location.href = "CollectorList.html";
    })
    .catch((error) => {
      console.error("Error updating collector information: ", error);
    });
}
