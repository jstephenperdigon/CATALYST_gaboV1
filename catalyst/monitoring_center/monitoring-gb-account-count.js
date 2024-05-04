// Your web app's Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

//COLLECTOR USERS
// Reference to the UID node
const uidRef = ref(db, "Accounts/Collectors");

// Get the container element for UID count
const uidCountContainer = document.getElementById("uidCount");

// Listen for changes in the database and update the UID count
onValue(uidRef, (snapshot) => {
  const data = snapshot.val();
  //console.log("Received data:", data);

  if (data) {
    const uidCount = Object.keys(data).length;
    uidCountContainer.textContent = `${uidCount}`;
  } else {
    uidCountContainer.textContent = "No Users found.";
  }
});

//SMART GARBAGE BIN USERS
// Reference to the GB node
const gbRef = ref(db, "GarbageBinControlNumber");

// Get the container element for UID count
const gbCountContainer = document.getElementById("gbCount");

// Listen for changes in the database and update the GB count
onValue(gbRef, (snapshot) => {
  const gbdata = snapshot.val();
  console.log("Received data:", gbdata);

  if (gbdata) {
    const gbCount = Object.keys(gbdata).length;
    gbCountContainer.textContent = `${gbCount}`;
  } else {
    gbCountContainer.textContent = "No Garbage Bins found.";
  }
});

//HOUSEHOLD USERS
// Reference to the UID node
const hsRef = ref(db, "Accounts/HouseHoldUsers");

// Get the container element for UID count
const hsCountContainer = document.getElementById("hsCount");

// Listen for changes in the database and update the UID count
onValue(hsRef, (snapshot) => {
  const hsdata = snapshot.val();
  console.log("Received data:", hsdata);

  if (hsdata) {
    const hsCount = Object.keys(hsdata).length;
    hsCountContainer.textContent = `${hsCount}`;
  } else {
    hsCountContainer.textContent = "No Users found.";
  }
});

//TOTAL BAGS
// Reference to the DeploymentHistory node
const deploymentHistoryRef = ref(db, 'DeploymentHistory');

// Get the <p> element for displaying the total bags
const totalBagsElement = document.getElementById("TotalBags");

// Function to convert TotalQuota values from string to integer in the database
function convertTotalQuotaToNumber() {
  // Get the data snapshot of DeploymentHistory
  get(deploymentHistoryRef).then((snapshot) => {
    const deploymentHistory = snapshot.val();

    if (!deploymentHistory) {
      console.log("DeploymentHistory is empty.");
      return;
    }

    // Iterate through each entry in DeploymentHistory
    Object.entries(deploymentHistory).forEach(([key, entry]) => {
      // Check if entry has status "complete" and TotalQuota is a string
      if (entry.status === "complete" && typeof entry.TotalQuota === 'string') {
        // Convert TotalQuota from string to integer
        const totalQuotaNumber = parseInt(entry.TotalQuota, 10); // Parse string to integer

        // Update the TotalQuota value in the database to be a number
        update(ref(deploymentHistoryRef, key), { TotalQuota: totalQuotaNumber })
          .then(() => {
            console.log(`Converted TotalQuota to number for entry with key: ${key}`);
          })
          .catch((error) => {
            console.error(`Error converting TotalQuota to number for entry with key ${key}:`, error);
          });
      }
    });
  }).catch((error) => {
    console.error("Error retrieving DeploymentHistory data:", error);
  });
}

// Function to calculate and display the total sum of TotalQuota for entries with status "complete"
function calculateAndDisplayTotalQuota(snapshot) {
  const deploymentHistory = snapshot.val();

  if (!deploymentHistory) {
    totalBagsElement.textContent = "";
    return;
  }

  let totalQuotaSum = 0;

  // Loop through each entry in DeploymentHistory
  Object.values(deploymentHistory).forEach(entry => {
    // Check if entry has status "complete" and TotalQuota is defined
    if (entry.status === "complete" && typeof entry.TotalQuota === 'number') {
      // Convert TotalQuota to integer and add to the sum
      totalQuotaSum += parseInt(entry.TotalQuota); // or totalQuotaSum += +entry.TotalQuota;
    }
  });

  // Log the total sum of TotalQuota to the console
 // console.log("Total sum of TotalQuota:", totalQuotaSum);

  // Format the total bags display string
  const totalBagsDisplay = `${totalQuotaSum} Bags`;

  // Update the content of the <p> element with the formatted total bags display
  totalBagsElement.textContent = totalBagsDisplay;
}

// Listen for changes to the DeploymentHistory node
onValue(deploymentHistoryRef, (snapshot) => {
  calculateAndDisplayTotalQuota(snapshot);
});