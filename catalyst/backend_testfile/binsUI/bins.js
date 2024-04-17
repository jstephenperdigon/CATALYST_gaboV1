// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL: "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function generateReportHTML(bins) {
  // Check if district and barangay are present and not undefined
  let district = 'District not specified';
  let barangay = 'Barangay not specified';

  // Check if bins.Users is present and not undefined
  if (bins.Users !== undefined) {
    // Iterate over the keys of the Users object
    Object.keys(bins.Users).forEach(userId => {
      const user = bins.Users[userId];
      // Check if user has district and barangay fields
      if (user.district !== undefined && user.barangay !== undefined) {
        district = user.district;
        barangay = user.barangay;
        // Break the loop if district and barangay are found
        return;
      }
    });
  }

  // Define GCN variable for use in event listener
  const GCN = bins.GCN;

  const html = `
    <tr>
      <td>${bins.GCN}</td>
      <td>${bins.status}</td>
      <td>${district}</td>
      <td>${barangay}</td>
      <td class="actionButtons">
        <button class="viewButton" data-gcn="${bins.GCN}">View</button>
        <button class="editButton" data-gcn="${bins.GCN}">Edit</button>  
        <button class="resetButton" data-gcn="${bins.GCN}">Reset</button>
      </td>
    </tr>
  `;

  // Return HTML
  return html;
}
// Add event listener to each "Edit" button
document.querySelectorAll(".editButton").forEach((button) => {
  button.addEventListener("click", function () {
    const GCN = this.getAttribute("data-gcn");
    displayModal(GCN, true, function() {
      // Callback function to refresh the view or reload data
      updateTable(); // For example, you can call updateTable() to refresh the table
    });
  });
});

// Add event listener to handle edit button click
function handleEdit(GCN) {
  // Navigate to edit.html page with query parameter GCN
  displayModal(GCN, true);
}

// Modify the filterReports function to filter reports based on search input
function filterReports(searchInput, filter) {
  const reportsArray = document.querySelectorAll("#reportsTable tbody tr");
  reportsArray.forEach((bins) => {
    const value = bins.querySelector(`td:nth-child(${getIndex(filter)})`).textContent.toLowerCase(); // Assuming GCN is in the first column
    const displayStyle = value.includes(searchInput.toLowerCase()) ? "" : "none";
    bins.style.display = displayStyle;
  });
}

// Function to display the modal for the selected GCN
function displayModalForGCN(GCN) {
  // Display the modal for the selected GCN
  displayModal(GCN, true);
}

// Add event listener to each "Reset" button
document.querySelectorAll(".resetButton").forEach((button) => {
  button.addEventListener("click", async function () {
    const GCN = this.getAttribute("data-gcn");

    // Show confirmation modal
    const confirmed = await showConfirmationModal();
    
    // If user confirms reset
    if (confirmed) {
      try {
        const message = await resetDataForGCN(GCN);
        alert(message); // Display success message
        // Optionally, you can update the table here if needed
        updateTable();
      } catch (error) {
        console.error("Error resetting fill levels for GCN:", GCN, error.message); // Debugging statement
        alert(error.message); // Display error message
      }
    }
  });
});


// Function to show confirmation modal
async function showConfirmationModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirmationModal");
    const yesButton = modal.querySelector("#confirmYes");
    const noButton = modal.querySelector("#confirmNo");

    // Add event listener to "Yes" button
    yesButton.addEventListener("click", () => {
      modal.style.display = "none";
      resolve(true); // Resolve promise with true (user confirmed)
    });

    // Add event listener to "No" button
    noButton.addEventListener("click", () => {
      modal.style.display = "none";
      resolve(false); // Resolve promise with false (user canceled)
    });

    // Display the modal
    modal.style.display = "block";
  });
}

// Add event listener to handle reset button clicks using event delegation
document.addEventListener("click", function(event) {
  // Check if the clicked element is a reset button
  if (event.target.classList.contains("resetButton")) {
    // Get the GCN value from the data-gcn attribute of the clicked button
    const GCN = event.target.getAttribute("data-gcn");

    // Call the reset function with the GCN value
    resetDataForGCN(GCN)
      .then((message) => {
        // Reset successful
        alert(message);
        updateTable(); // Optionally, update the table
      })
      .catch((error) => {
        // Reset failed
        alert(error.message);
      });
  }
});

// Modify the searchReports function to use the filterReports function and trigger filtering on input change
window.searchReports = function() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterDropdown").value;

  filterReports(searchInput, filter);
};

// Add event listener to the search input to trigger search on input change
document.getElementById("searchInput").addEventListener("input", function() {
  window.searchReports();
});


// Add event listener to the search button to trigger search
document.getElementById("searchButton").addEventListener("click", function() {
  window.searchReports();
});

// Function to handle live search while typing - Remove this function

// Function to get the index of the selected column
function getIndex(key) {
  const headers = [
    "GCN",
    "status",
    "district",
    "barangay",
  ];
  return headers.indexOf(key) + 1;
}

// Update the updateTable() function to fetch data from Firebase
function updateTable() {
  const reportsRef = ref(db, "GarbageBinControlNumber");
  onValue(reportsRef, (snapshot) => {
    const reportsData = snapshot.val();
    if (reportsData) {
      const reportsArray = Object.entries(reportsData).map(
        ([GCN, bins]) => ({ GCN, ...bins })
      );
      displayReportsTable(reportsArray);
    } else {
      displayReportsTable([]);
    }
  });
}

// Function to display the reports table
function displayReportsTable(reportsArray) {
  const reportsTable = document.getElementById("reportsTable");
  const tableHTML = `
    <table border="1">
      <thead>
        <tr>
          <th>GCN UNIT</th>
          <th>STATUS</th>
          <th>DISTRICT</th>
          <th>BARANGAY</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        ${reportsArray.map(generateReportHTML).join("")}
      </tbody>
    </table>
  `;
  reportsTable.innerHTML = tableHTML;
  
  // Add event listener to "View" buttons
  document.querySelectorAll(".viewButton").forEach((button) => {
    button.addEventListener("click", function () {
      const GCN = this.getAttribute("data-gcn");
      displayModal(GCN);
    });
  });

  // Add event listener to "Edit" buttons
  document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function () {
      const GCN = this.getAttribute("data-gcn");
      handleEdit(GCN);
    });
  });

  // Add event listener to "Save" button
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveChanges); // Tiyakin na tawagin ang tamang function
  }
}

// Function to reset the list
window.resetList = function () {
  // Clear the search input
  document.getElementById("searchInput").value = "";

  // Reset the sort dropdown to the default option
  document.getElementById("sortDropdown").selectedIndex = 0;

  // Retrieve the initial data and update the table
  updateTable();
};

// Function to close the modal when the user clicks on the close button
document.querySelectorAll(".close").forEach((closeButton) => {
  closeButton.addEventListener("click", function () {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  });
});

// Function to fetch GCN numbers from Firebase and populate the autocomplete list
async function populateAutocompleteList() {
  const reportsRef = ref(db, "GarbageBinControlNumber");
  try {
    const snapshot = await get(reportsRef);
    const reportsData = snapshot.val();
    const gcnList = [];

    if (reportsData) {
      Object.keys(reportsData).forEach((gcn) => {
        gcnList.push(gcn);
      });
    }

    // Initialize the autocomplete functionality
    autocomplete(document.getElementById("searchInput"), gcnList);
  } catch (error) {
    console.error("Error fetching GCN numbers:", error);
  }
}

// Autocomplete function
function autocomplete(input, arr) {
  let currentFocus;
  input.addEventListener("input", function(e) {
    let val = this.value;
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;
    let matches = arr.filter((item) => {
      return item.toLowerCase().includes(val.toLowerCase());
    });
    let autocompleteList = document.createElement("div");
    autocompleteList.setAttribute("id", this.id + "autocomplete-list");
    autocompleteList.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(autocompleteList);
    for (let i = 0; i < matches.length; i++) {
      let autocompleteOption = document.createElement("div");
      autocompleteOption.innerHTML = "<strong>" + matches[i].substr(0, val.length) + "</strong>";
      autocompleteOption.innerHTML += matches[i].substr(val.length);
      autocompleteOption.innerHTML += "<input type='hidden' value='" + matches[i] + "'>";
      autocompleteOption.addEventListener("click", function(e) {
        input.value = this.getElementsByTagName("input")[0].value;
        closeAllLists();
      });
      autocompleteList.appendChild(autocompleteOption);
    }
  });
  function closeAllLists(elmnt) {
    let autocompleteItems = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < autocompleteItems.length; i++) {
      if (elmnt != autocompleteItems[i] && elmnt != input) {
        autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

// Call the function to populate the autocomplete list on window load
window.onload = function() {
  populateAutocompleteList();
};


// Gawing global variable
let currentGCN = null;
function displayModal(GCN, isEditModal = false) {
  currentGCN = GCN; // Set the GCN to a global variable

  // Get the report data from Firebase based on the GCN
  const reportRef = ref(db, 'GarbageBinControlNumber/' + GCN + '/FillLevel'); // Correct path to FillLevel data
  get(reportRef)
    .then((snapshot) => {
      const fillLevelData = snapshot.exists() ? snapshot.val() : null;

      // Initialize an empty string to store the fill level details
      let fillLevelDetails = '';

      if (fillLevelData) {
        // Iterate over each fill level (GB1FillLevel to GB4FillLevel)
        for (let i = 1; i <= 4; i++) {
          const fillLevelKey = `GB${i}FillLevel`;
          const fillLevelDataSingle = fillLevelData[fillLevelKey];
          if (fillLevelDataSingle) { // Check if fill level data exists
            // Append fill level details to the string
            fillLevelDetails += `
              <h4>${fillLevelKey}</h4>
              ${isEditModal ? `
                <label for="${fillLevelKey}">GB${i}</label>
                <input type="text" id="${fillLevelKey}" class="input-field" value="${fillLevelDataSingle[`GB${i}`]}">
                <br>
                <label for="${fillLevelKey}Flag">Flag:</label>
                <input type="text" id="${fillLevelKey}Flag" class="input-field" value="${fillLevelDataSingle[`GB${i}Flag`]}">
                <br>
                <label for="${fillLevelKey}QuotaCount">Quota Count:</label>
                <input type="text" id="${fillLevelKey}QuotaCount" class="input-field" value="${fillLevelDataSingle[`GB${i}QuotaCount`]}">
                <br>
                <label for="${fillLevelKey}QuotaFlag">Quota Flag:</label>
                <input type="text" id="${fillLevelKey}QuotaFlag" class="input-field" value="${fillLevelDataSingle[`GB${i}QuotaFlag`]}">
                <br>
                <label for="${fillLevelKey}Status">Status:</label>
                <input type="text" id="${fillLevelKey}Status" class="input-field" value="${fillLevelDataSingle[`GB${i}Status`]}">
                <br>
              ` : `
              <p>GB${i}: ${fillLevelDataSingle[`GB${i}`]}</p>
              <p>Flag: ${fillLevelDataSingle[`GB${i}Flag`]}</p>
              <p>Quota Count: ${fillLevelDataSingle[`GB${i}QuotaCount`]}</p>
              <p>Quota Flag: ${fillLevelDataSingle[`GB${i}QuotaFlag`]}</p>
              <p>Status: ${fillLevelDataSingle[`GB${i}Status`]}</p>
              <hr>
              `}
            `;
          }
        }
      } else {
        // Display "No Fill Level Found" message
        fillLevelDetails = "<p>No Fill Level Found</p>";
      }

      // Add password field if it's an edit modal
      let passwordField = '';
      if (isEditModal) {
        // Get the password data from Firebase
        const passwordRef = ref(db, `GarbageBinControlNumber/${GCN}/Password`);
        get(passwordRef)
          .then((snapshot) => {
            // Check if the password exists
            const password = snapshot.exists() ? snapshot.val() : '';

            // Populate the password field
            passwordField = `
              <h4>Password</h4>
              <label>Password</label>
              <input type="text" id="password" class="input-field" value="${password}">
            `;

            // Get the Total Quota data from Firebase
            const totalQuotaRef = ref(db, `GarbageBinControlNumber/${GCN}/TotalQuota`);
            get(totalQuotaRef)
              .then((totalQuotaSnapshot) => {
                // Check if the Total Quota exists
                const totalQuota = totalQuotaSnapshot.exists() ? totalQuotaSnapshot.val() : '';

                // Populate the Total Quota field
                const totalQuotaField = `
                  <h4>Total Quota</h4>
                  <label>Total Quota</label>
                  <input type="text" id="totalQuota" class="input-field" value="${totalQuota}">
                `;

                // Fetch and display user details
                displayUserDetails(isEditModal);

                // Add the Total Quota details to the modal content
                modalContent.innerHTML = `
                  <h4>FILL LEVEL DETAILS:</h4>
                  ${fillLevelDetails}
                  ${passwordField}
                  ${totalQuotaField}
                `;
              })
              .catch((error) => {
                console.error("Error retrieving Total Quota data:", error);
                // Display an error message if there's an issue fetching the Total Quota data
                modalContent.innerHTML = "<h4>Total Quota Details:</h4><p>Error retrieving Total Quota data.</p>";
              });
          })
          .catch((error) => {
            console.error("Error retrieving password:", error);
            // Display an error message if there's an issue fetching the password
            passwordField = `
              <h4>Password</h4>
              <p>Error retrieving password data.</p>
            `;
          });
      } else {
        // Fetch and display user details
        displayUserDetails(isEditModal);

        // Add the fill level details, password field, and user details to the modal content
        modalContent.innerHTML = `
          <h4>FILL LEVEL DETAILS:</h4>
          ${fillLevelDetails}
          ${passwordField}
        `;
      }

      // Display the modal
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Error retrieving report:", error);
      // Display an error message if there's an issue fetching the report
      modalContent.innerHTML = "<p>No Fill Level Found</p><p>Error retrieving report data.</p>";
      // Display the modal
      modal.style.display = "block";
    });

  // Close modal when the user clicks on the close button
  const closeButton = modal.querySelector(".close");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  // Close modal when the user clicks outside the modal
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Function to fetch and display user details
function displayUserDetails(isEditModal) {
  // Fetch user data for the specified GCN
  const usersRef = ref(db, 'GarbageBinControlNumber/' + currentGCN + '/Users');
  get(usersRef)
    .then((userSnapshot) => {
      // Check if user data exists
      if (userSnapshot.exists()) {
        const usersData = userSnapshot.val();
        let usersHTML = ''; // Initialize variable to store user details HTML

        // Iterate over each user and construct the HTML
        Object.keys(usersData).forEach(userId => {
          const user = usersData[userId];
          usersHTML += `
            <h4>User Details:</h4>
            ${isEditModal ? `
              <label for="addressLine1_${userId}">Address Line 1</label>
              <input type="text" id="addressLine1_${userId}" class="input-field" value="${user.addressLine1 || ''}">
              <br>
              <label for="barangay_${userId}">Barangay</label>
              <input type="text" id="barangay_${userId}" class="input-field" value="${user.barangay || ''}">
              <br>
              <label for="city_${userId}">City</label>
              <input type="text" id="city_${userId}" class="input-field" value="${user.city || ''}">
              <br>
              <label for="country_${userId}">Country</label>
              <input type="text" id="country_${userId}" class="input-field" value="${user.country || ''}">
              <br>
              <label for="district_${userId}">District</label>
              <input type="text" id="district_${userId}" class="input-field" value="${user.district || ''}">
              <br>
              <label for="email_${userId}">Email</label>
              <input type="email" id="email_${userId}" class="input-field" value="${user.email || ''}">
              <br>
              <label for="firstName_${userId}">First Name</label>
              <input type="text" id="firstName_${userId}" class="input-field" value="${user.firstName || ''}">
              <br>
              <label for="lastName_${userId}">Last Name</label>
              <input type="text" id="lastName_${userId}" class="input-field" value="${user.lastName || ''}">
              <br>
              <label for="mobileNumber_${userId}">Mobile Number</label>
              <input type="tel" id="mobileNumber_${userId}" class="input-field" value="${user.mobileNumber || ''}">
              <br>
              <label for="province_${userId}">Province</label>
              <input type="text" id="province_${userId}" class="input-field" value="${user.province || ''}">                
              <br>
            ` : `
            <p>Address Line 1: ${user.addressLine1}</p>
            <p>Barangay: ${user.barangay}</p>
            <p>City: ${user.city}</p>
            <p>Country: ${user.country}</p>
            <p>District: ${user.district}</p>
            <p>Email: ${user.email}</p>
            <p>First Name: ${user.firstName}</p>
            <p>Last Name: ${user.lastName}</p>
            <p>Mobile Number: ${user.mobileNumber}</p>
            <p>Province: ${user.province}</p>
            `}
          `;
        });

        // Add user details HTML to the modal content
        modalContent.innerHTML += usersHTML;

      } else {
        // If no users found, display a message
        modalContent.innerHTML += "<h4>User Details:</h4><p>No User Found</p>";
      }

      // Add save button if it's an edit modal
      if (isEditModal) {
        modalContent.innerHTML += '<button id="saveBtn" class="btn">Save</button>';
        const saveBtn = modalContent.querySelector("#saveBtn"); // Use modalContent to query the save button
        saveBtn.addEventListener("click", saveChanges);
      }
    })
    .catch((error) => {
      console.error("Error retrieving user data:", error);
      // Display an error message if there's an issue fetching the user data
      modalContent.innerHTML += "<h4>User Details:</h4><p>Error retrieving user data.</p>";
    });
}

async function saveChanges() {
  console.log("Save button clicked"); // Debugging statement

  const GCN = currentGCN; // Get the current GCN

  // Construct the reference to the GCN node
  const gcnRef = ref(db, `GarbageBinControlNumber/${GCN}`);

  // Create an object to hold the updated data
  const updatedData = {};

  // Loop through each garbage bin fill level
  for (let i = 1; i <= 4; i++) {
    const fillLevelKey = `GB${i}FillLevel`; // Construct the fill level key
    const fillLevelData = {}; // Initialize fill level data object

    // Get the fill level value and other details from the modal
    fillLevelData[`GB${i}`] = document.getElementById(`${fillLevelKey}`).value;
    fillLevelData[`GB${i}Flag`] = document.getElementById(`${fillLevelKey}Flag`).value || '';
    fillLevelData[`GB${i}QuotaCount`] = document.getElementById(`${fillLevelKey}QuotaCount`).value || '';
    fillLevelData[`GB${i}QuotaFlag`] = document.getElementById(`${fillLevelKey}QuotaFlag`).value || '';
    fillLevelData[`GB${i}Status`] = document.getElementById(`${fillLevelKey}Status`).value || '';

    // Add the fill level data to the updatedData object
    updatedData[`FillLevel/${fillLevelKey}`] = fillLevelData;
  }

  // Get the password value from the modal
  const password = document.getElementById("password").value;

  // Add the password to the updatedData object
  updatedData["Password"] = password;

  // Get the total quota value from the modal
  const totalQuota = document.getElementById("totalQuota").value;

  // Add the total quota to the updatedData object
  updatedData["TotalQuota"] = totalQuota;

  // Get user data from the modal
  const usersData = {};
  const userElements = document.querySelectorAll("[id^=addressLine1]");
  userElements.forEach(element => {
    const userId = element.id.split("_")[1];
    const user = {
      addressLine1: document.getElementById(`addressLine1_${userId}`).value,
      barangay: document.getElementById(`barangay_${userId}`).value,
      city: document.getElementById(`city_${userId}`).value,
      country: document.getElementById(`country_${userId}`).value,
      district: document.getElementById(`district_${userId}`).value,
      email: document.getElementById(`email_${userId}`).value,
      firstName: document.getElementById(`firstName_${userId}`).value,
      lastName: document.getElementById(`lastName_${userId}`).value,
      mobileNumber: document.getElementById(`mobileNumber_${userId}`).value,
      province: document.getElementById(`province_${userId}`).value
    };

    // Check if level field exists
    const levelField = document.getElementById(`level_${userId}`);
    if (levelField) {
      user.level = levelField.value;
    }

    usersData[userId] = user;
  });

  // Add the user data to the updatedData object
  updatedData["Users"] = usersData;

  console.log("Updated Data:", updatedData); // Debugging statement

  try {
    // Update the data in the database
    await update(gcnRef, updatedData);
    console.log("Changes saved successfully!"); // Debugging statement
    alert("Changes saved successfully!"); // Show success message
  } catch (error) {
    console.error("Error updating data:", error);
    alert("Failed to save changes. Please try again."); // Show error message
  }
}

async function resetDataForGCN(GCN) {
  // Display confirmation dialog before resetting
  const confirmed = await showResetConfirmationDialog();

  // If user confirms reset
  if (confirmed) {
    const defaultFillLevel = "10"; // Set your default fill level value here
    const defaultQuotaCount = "0";

    try {
      // Construct the reference to the GCN node
      const gcnRef = ref(db, `GarbageBinControlNumber/${GCN}`);

      // Reset fill levels for the specified GCN
      await update(gcnRef, {
        FillLevel: {
          GB1FillLevel: {
            GB1: defaultFillLevel,
            GB1Flag: "false",
            GB1QuotaCount: defaultQuotaCount,
            GB1QuotaFlag: "false",
            GB1Status: "Not Connected",
          },
          GB2FillLevel: {
            GB2: defaultFillLevel,
            GB2Flag: "false",
            GB2QuotaCount: defaultQuotaCount,
            GB2QuotaFlag: "false",
            GB2Status: "Not Connected",
          },
          GB3FillLevel: {
            GB3: defaultFillLevel,
            GB3Flag: "false",
            GB3QuotaCount: defaultQuotaCount,
            GB3QuotaFlag: "false",
            GB3Status: "Not Connected",
          },
          GB4FillLevel: {
            GB4: defaultFillLevel,
            GB4Flag: "false",
            GB4QuotaCount: defaultQuotaCount,
            GB4QuotaFlag: "false",
            GB4Status: "Not Connected",
          },
        },
        TotalQuota: "0", // Reset TotalQuota to zero
        Location: null, // Remove Reports data
        reports: null, // Remove Location data
        Users: null, // Remove Users data
      });

      // Return a success message
      return "Reset successfully!";
    } catch (error) {
      // Return an error message
      throw new Error("Reset failed. Please try again.");
    }
  } else {
    throw new Error("Reset canceled"); // Throw error message if reset is canceled by user
  }
}

// Function to display the confirmation dialog before reset
async function showResetConfirmationDialog() {
  return new Promise((resolve) => {
    const confirmation = confirm("Are you sure you want to reset?"); // Display browser's built-in confirmation dialog
    resolve(confirmation); // Resolve the promise with user's confirmation choice
  });
}


// Itakda ang mga event listeners sa labas ng function na displayModal
window.onload = function () {
  updateTable();
};

