import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  set,
  onValue,
  child,
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


// Function to retrieve user ID from session
function getUserIdFromSession() {
  const userId = sessionStorage.getItem("userId");
  return userId;
}

// Function to fetch user data based on the user ID
async function fetchUserData(userId) {
  const userRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.val();
}

// Retrieve the user ID from the session
const userId = getUserIdFromSession();
let userData = null; // Variable to store user data

// Disable the address textboxes initially
const addressLine1Input = document.getElementById("addressLine1");
const addressLine2Input = document.getElementById("addressLine2");
addressLine1Input.disabled = true;
addressLine2Input.disabled = true;

// Add event listener to GCN and password verification button
const verifyBtn = document.getElementById("verifyGCNAndPassword");
if (verifyBtn) {
  verifyBtn.addEventListener("click", async () => {
    // Validate GCN and password
    const gcnInput = document.getElementById("garbageControlNumber").value;
    const passwordInput = document.getElementById("gcPassword").value;

    try {
      // Fetch data from the database based on the provided GCN
      const gcnRef = ref(db, `GarbageBinControlNumber/${gcnInput}`);
      const gcnSnapshot = await get(gcnRef);
      const gcnData = gcnSnapshot.val();

      // Check if the GCN and password are valid
      if (gcnData && passwordInput === gcnData.Password) {
        // Enable the address textboxes
        addressLine1Input.disabled = false;
        addressLine2Input.disabled = false;

        // Update user data with GCN and address information
        userData.gcn = gcnInput;
        userData.addressLine1 = addressLine1Input.value;
        userData.addressLine2 = addressLine2Input.value;

        // Disable the control number textbox, password textbox, and verify button
        document.getElementById("garbageControlNumber").disabled = true;
        document.getElementById("gcPassword").disabled = true;
        verifyBtn.disabled = true;

        // Enable the "Save changes" and "Cancel" buttons
        saveChangesBtn.disabled = false;
        cancelBtn.disabled = false;

        // Use SweetAlert for success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "GCN and Password are valid.",
          customClass: {
            popup: "swal2-mobile",
          },
        });
      } else {
        // Use SweetAlert for error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid GCN or Password. Please check your input.",
          customClass: {
            popup: "swal2-mobile",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching GCN data:", error);
    }
  });
}

// Add a click event listener to the "Save changes" button
const saveChangesBtn = document.getElementById("save");
if (saveChangesBtn) {
  // Disable the "Save changes" button initially
  saveChangesBtn.disabled = true;

  saveChangesBtn.addEventListener("click", async () => {
    // Update user data with the latest address information
    userData.addressLine1 = addressLine1Input.value;
    userData.addressLine2 = addressLine2Input.value;

    // Add the selected district and barangay to user data
    userData.district = document.getElementById("districtDropdown").value;
    userData.barangay = document.getElementById("barangayDropdown").value;

    // Get latitude and longitude values
    const latitude = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);

    try {
      // Update user data in Accounts/Users
      const userUpdateRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}`);
      await update(userUpdateRef, {
        addressLine1: userData.addressLine1,
        addressLine2: userData.addressLine2,
        gcn: userData.gcn,
        district: userData.district, // Add district to user data
        barangay: userData.barangay, // Add barangay to user data 
      });

      // Update user data in GarbageBinControlNumber/corresponding GCN/Users
      const gcnUpdateRef = ref(
        db,
        `GarbageBinControlNumber/${userData.gcn}/Users/${userId}`
      );
      await update(gcnUpdateRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        password: userData.password,
        addressLine1: userData.addressLine1,
        addressLine2: userData.addressLine2,
        district: userData.district,
        barangay: userData.barangay,
      });

      // Update latitude and longitude in GarbageBinControlNumber/Location
      const locationUpdateRef = ref(
        db,
        `GarbageBinControlNumber/${userData.gcn}/Location`
      );
      await update(locationUpdateRef, {
        Latitude: latitude,
        Longitude: longitude,
      });

      alert("User data and location updated successfully.");

      // Check and display bins immediately after updating the user's address
      await checkAndDisplayBins();

      // Check if the modal is open (assuming your modal ID is "addDeviceModal")
      const modalElement = document.getElementById("addDeviceModal");
      if (modalElement) {
        // Close the modal using MDB method
        mdb.Modal.getInstance(modalElement).hide();
      }
    } catch (error) {
      console.error("Error updating user data and location:", error);
    }
  });
}


// Add a click event listener to the "Cancel" button
const cancelBtn = document.getElementById("next");
if (cancelBtn) {
  // Disable the "Cancel" button initially
  cancelBtn.disabled = true;

  cancelBtn.addEventListener("click", () => {
    // Disable the "Cancel" button, address textboxes, and the "Save changes" button
    //cancelBtn.disabled = true;
    //addressLine1Input.disabled = true;
    //addressLine2Input.disabled = true;
    //saveChangesBtn.disabled = true;

    // Enable the control number textbox, password textbox, and the verify button
    document.getElementById("garbageControlNumber").disabled = false;
    document.getElementById("gcPassword").disabled = false;
    verifyBtn.disabled = false;
  });
}

// Check if the user ID is available
if (userId) {
  // Fetch user data and log it to the console
  fetchUserData(userId)
    .then((user) => {
      if (user) {
        // Store the user data in the variable for future use
        userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          password: user.password,
          gcn: user.gcn, // Add GCN to user data
          addressLine1: user.addressLine1, // Add address line 1 to user data
          addressLine2: user.addressLine2, // Add address line 2 to user data
        };

        // Set the first name in the HTML span element
        document.getElementById("userFirstName").textContent = user.firstName;

        // Set the first name in the HTML element with id "userNameHeader"
        document.getElementById("userNameHeader").textContent = user.firstName;
      } else {
        console.error("User data not found.");
        document.getElementById("userFirstName").textContent =
          "Default Username";
        document.getElementById("userNameHeader").textContent =
          "Default Username";
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
} else {
  // Handle the case where the user ID is not found in the session
  console.error("User ID not found.");
  // You might want to redirect the user to the login page or take appropriate action.
}

// Logout function
function logout() {
  // Retrieve the user ID from the session
  const userId = sessionStorage.getItem("userId");

  if (userId) {
    // Clear the user ID from the session
    sessionStorage.removeItem("userId");

    // Get a reference to the user status field in the database
    const userStatusRef = ref(
      db,
      `Accounts/VerifiedUserAccounts/${userId}/status`
    );

    // Set the user status to null (remove the "LoggedIn" status)
    set(userStatusRef, null)
      .then(() => {
        // Redirect to the sign-in page after successfully removing the status
        window.location.href = "../signup_signin/sign-in.html";
      })
      .catch((error) => {
        console.error("Error removing user status:", error);
      });
  } else {
    // If there is no user ID in the session, just redirect to the sign-in page
    window.location.href = "../signup_signin/sign-in.html";
  }
}

// Attach click event listener to the signOut button
document.getElementById("signOut").addEventListener("click", logout);

// Add a click event listener to the "Log Out" button
const logOutBtn = document.getElementById("logOutBtn");
if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

// Function to display fill levels for GB1 to GB4 based on the user's control number
function displayFillLevels() {
  // Retrieve user data
  fetchUserData(userId)
    .then((user) => {
      if (user && user.gcn) {
        const gb1Ref = ref(
          db,
          `GarbageBinControlNumber/${user.gcn}/FillLevel/GB1FillLevel`
        );
        const gb2Ref = ref(
          db,
          `GarbageBinControlNumber/${user.gcn}/FillLevel/GB2FillLevel`
        );
        const gb3Ref = ref(
          db,
          `GarbageBinControlNumber/${user.gcn}/FillLevel/GB3FillLevel`
        );
        const gb4Ref = ref(
          db,
          `GarbageBinControlNumber/${user.gcn}/FillLevel/GB4FillLevel`
        );
        onValue(
          gb1Ref,
          (snapshot) => {
            if (snapshot.exists()) {
              const fillLevelsGB1 = snapshot.val();

              // Update the fill level and color for GB1
              updateFillLevel("GB1", fillLevelsGB1.GB1);
            } else {
              console.log("No data available for GB1");
            }
          },
          (error) => {
            console.error("Error listening for data changes for GB1:", error);
          }
        );

        // Listen for changes in the database for GB2
        onValue(
          gb2Ref,
          (snapshot) => {
            if (snapshot.exists()) {
              const fillLevelsGB2 = snapshot.val();

              // Update the fill level and color for GB2
              updateFillLevel("GB2", fillLevelsGB2.GB2);
            } else {
              console.log("No data available for GB2");
            }
          },
          (error) => {
            console.error("Error listening for data changes for GB2:", error);
          }
        );

        // Listen for changes in the database for GB3
        onValue(
          gb3Ref,
          (snapshot) => {
            if (snapshot.exists()) {
              const fillLevelsGB3 = snapshot.val();

              // Update the fill level and color for GB3
              updateFillLevel("GB3", fillLevelsGB3.GB3);
            } else {
              console.log("No data available for GB3");
            }
          },
          (error) => {
            console.error("Error listening for data changes for GB3:", error);
          }
        );

        // Listen for changes in the database for GB4
        onValue(
          gb4Ref,
          (snapshot) => {
            if (snapshot.exists()) {
              const fillLevelsGB4 = snapshot.val();

              // Update the fill level and color for GB4
              updateFillLevel("GB4", fillLevelsGB4.GB4);
            } else {
              console.log("No data available for GB4");
            }
          },
          (error) => {
            console.error("Error listening for data changes for GB4:", error);
          }
        );

        listenForFillLevelChangesGB1(user.gcn);
        listenForFillLevelChangesGB2(user.gcn);
        listenForFillLevelChangesGB3(user.gcn);
        listenForFillLevelChangesGB4(user.gcn);
        listenForStatusChanges(user.gcn);
      } else {
        console.error("User data or control number not available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// Function to listen for changes in the fill level and display notification
function listenForFillLevelChangesGB1(gcn) {
  const fillLevelRef = ref(
    db,
    `GarbageBinControlNumber/${gcn}/FillLevel/GB1FillLevel`
  );
  let initialized80to99 = false; // Flag to track whether the listener is initialized for 80-99 fill level range
  let reportGenerated80to99 = false; // Flag to track whether a report has been generated for 80-99 fill level range

  let initialized100andAbove = false; // Flag to track whether the listener is initialized for fill levels 100 and above
  let reportGenerated100andAbove = false; // Flag to track whether a report has been generated for fill levels 100 and above

  onValue(
    fillLevelRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const fillLevels = snapshot.val();

        // Check if the listener is initialized for 80-99 fill level range
        if (initialized80to99) {
          // Check if the fill level is 80-99 and a report hasn't been generated for this range
          if (
            fillLevels.GB1 >= 80 &&
            fillLevels.GB1 <= 99 &&
            !reportGenerated80to99
          ) {
            generateNotification(
              "Fill Level Alert (80%)",  // Updated title
              `The fill level of GB1 is ${fillLevels.GB1}%.`
            );
            reportGenerated80to99 = true; // Set the flag to indicate that a report has been generated for 80-99 range
          } else if (
            (fillLevels.GB1 < 80 || fillLevels.GB1 > 99) &&
            fillLevels.GB1 < 100
          ) {
            // Reset the flag if the fill level goes below 80, above 99, and is less than 100
            reportGenerated80to99 = false;
          }
        }

        // Check if the listener is initialized for fill levels 100 and above
        if (initialized100andAbove) {
          // Check if the fill level is 100 or above and a report hasn't been generated for this range
          if (fillLevels.GB1 >= 100 && !reportGenerated100andAbove) {
            generateNotification(
              "Fill Level Alert (100%)",  // Updated title
              `The fill level of GB1 is ${fillLevels.GB1}%. Please pull out the garbage bag!`
            );
            reportGenerated100andAbove = true; // Set the flag to indicate that a report has been generated for fill levels 100 and above
          } else if (fillLevels.GB1 < 100) {
            // Reset the flag if the fill level goes below 100
            reportGenerated100andAbove = false;
          }
        }

        // Update the initialization status for 80-99 fill level range and 100 and above
        initialized80to99 = true;
        initialized100andAbove = true;
      } else {
        console.log("No fill level data available");
      }
    },
    (error) => {
      console.error("Error listening for fill level changes:", error);
    }
  );
}


// Function to listen for changes in the fill level and display notification
function listenForFillLevelChangesGB2(gcn) {
  const fillLevelRef = ref(
    db,
    `GarbageBinControlNumber/${gcn}/FillLevel/GB2FillLevel`
  );
  let initialized80to99 = false; // Flag to track whether the listener is initialized for 80-99 fill level range
  let reportGenerated80to99 = false; // Flag to track whether a report has been generated for 80-99 fill level range

  let initialized100andAbove = false; // Flag to track whether the listener is initialized for fill levels 100 and above
  let reportGenerated100andAbove = false; // Flag to track whether a report has been generated for fill levels 100 and above

  onValue(
    fillLevelRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const fillLevels = snapshot.val();

        // Check if the listener is initialized for 80-99 fill level range
        if (initialized80to99) {
          // Check if the fill level is 80-99 and a report hasn't been generated for this range
          if (
            fillLevels.GB2 >= 80 &&
            fillLevels.GB2 <= 99 &&
            !reportGenerated80to99
          ) {
            generateNotification(
              "Fill Level Alert (80%)",  // Updated title
              `The fill level of GB2 is ${fillLevels.GB2}%.`
            );
            reportGenerated80to99 = true; // Set the flag to indicate that a report has been generated for 80-99 range
          } else if (
            (fillLevels.GB2 < 80 || fillLevels.GB2 > 99) &&
            fillLevels.GB2 < 100
          ) {
            // Reset the flag if the fill level goes below 80, above 99, and is less than 100
            reportGenerated80to99 = false;
          }
        }

        // Check if the listener is initialized for fill levels 100 and above
        if (initialized100andAbove) {
          // Check if the fill level is 100 or above and a report hasn't been generated for this range
          if (fillLevels.GB2 >= 100 && !reportGenerated100andAbove) {
            generateNotification(
              "Fill Level Alert (100%)",  // Updated title
              `The fill level of GB2 is ${fillLevels.GB2}%. Please pull out the garbage bag!`
            );
            reportGenerated100andAbove = true; // Set the flag to indicate that a report has been generated for fill levels 100 and above
          } else if (fillLevels.GB2 < 100) {
            // Reset the flag if the fill level goes below 100
            reportGenerated100andAbove = false;
          }
        }

        // Update the initialization status for 80-99 fill level range and 100 and above
        initialized80to99 = true;
        initialized100andAbove = true;
      } else {
        console.log("No fill level data available");
      }
    },
    (error) => {
      console.error("Error listening for fill level changes:", error);
    }
  );
}

// Function to listen for changes in the fill level and display notification
function listenForFillLevelChangesGB3(gcn) {
  const fillLevelRef = ref(
    db,
    `GarbageBinControlNumber/${gcn}/FillLevel/GB3FillLevel`
  );
  let initialized80to99 = false; // Flag to track whether the listener is initialized for 80-99 fill level range
  let reportGenerated80to99 = false; // Flag to track whether a report has been generated for 80-99 fill level range

  let initialized100andAbove = false; // Flag to track whether the listener is initialized for fill levels 100 and above
  let reportGenerated100andAbove = false; // Flag to track whether a report has been generated for fill levels 100 and above

  onValue(
    fillLevelRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const fillLevels = snapshot.val();

        // Check if the listener is initialized for 80-99 fill level range
        if (initialized80to99) {
          // Check if the fill level is 80-99 and a report hasn't been generated for this range
          if (
            fillLevels.GB3 >= 80 &&
            fillLevels.GB3 <= 99 &&
            !reportGenerated80to99
          ) {
            generateNotification(
              "Fill Level Alert (80%)",  // Updated title
              `The fill level of GB3 is ${fillLevels.GB3}%.`
            );
            reportGenerated80to99 = true; // Set the flag to indicate that a report has been generated for 80-99 range
          } else if (
            (fillLevels.GB3 < 80 || fillLevels.GB3 > 99) &&
            fillLevels.GB3 < 100
          ) {
            // Reset the flag if the fill level goes below 80, above 99, and is less than 100
            reportGenerated80to99 = false;
          }
        }

        // Check if the listener is initialized for fill levels 100 and above
        if (initialized100andAbove) {
          // Check if the fill level is 100 or above and a report hasn't been generated for this range
          if (fillLevels.GB3 >= 100 && !reportGenerated100andAbove) {
            generateNotification(
              "Fill Level Alert (100%)",  // Updated title
              `The fill level of GB3 is ${fillLevels.GB3}%. Please pull out the garbage bag!`
            );
            reportGenerated100andAbove = true; // Set the flag to indicate that a report has been generated for fill levels 100 and above
          } else if (fillLevels.GB3 < 100) {
            // Reset the flag if the fill level goes below 100
            reportGenerated100andAbove = false;
          }
        }

        // Update the initialization status for 80-99 fill level range and 100 and above
        initialized80to99 = true;
        initialized100andAbove = true;
      } else {
        console.log("No fill level data available");
      }
    },
    (error) => {
      console.error("Error listening for fill level changes:", error);
    }
  );
}

// Function to listen for changes in the fill level and display notification
function listenForFillLevelChangesGB4(gcn) {
  const fillLevelRef = ref(
    db,
    `GarbageBinControlNumber/${gcn}/FillLevel/GB4FillLevel`
  );
  let initialized80to99 = false; // Flag to track whether the listener is initialized for 80-99 fill level range
  let reportGenerated80to99 = false; // Flag to track whether a report has been generated for 80-99 fill level range

  let initialized100andAbove = false; // Flag to track whether the listener is initialized for fill levels 100 and above
  let reportGenerated100andAbove = false; // Flag to track whether a report has been generated for fill levels 100 and above

  onValue(
    fillLevelRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const fillLevels = snapshot.val();

        // Check if the listener is initialized for 80-99 fill level range
        if (initialized80to99) {
          // Check if the fill level is 80-99 and a report hasn't been generated for this range
          if (
            fillLevels.GB4 >= 80 &&
            fillLevels.GB4 <= 99 &&
            !reportGenerated80to99
          ) {
            generateNotification(
              "Fill Level Alert (80%)",  // Updated title
              `The fill level of GB4 is ${fillLevels.GB4}%.`
            );
            reportGenerated80to99 = true; // Set the flag to indicate that a report has been generated for 80-99 range
          } else if (
            (fillLevels.GB4 < 80 || fillLevels.GB4 > 99) &&
            fillLevels.GB4 < 100
          ) {
            // Reset the flag if the fill level goes below 80, above 99, and is less than 100
            reportGenerated80to99 = false;
          }
        }

        // Check if the listener is initialized for fill levels 100 and above
        if (initialized100andAbove) {
          // Check if the fill level is 100 or above and a report hasn't been generated for this range
          if (fillLevels.GB4 >= 100 && !reportGenerated100andAbove) {
            generateNotification(
              "Fill Level Alert (100%)",  // Updated title
              `The fill level of GB4 is ${fillLevels.GB4}%. Please pull out the garbage bag!`
            );
            reportGenerated100andAbove = true; // Set the flag to indicate that a report has been generated for fill levels 100 and above
          } else if (fillLevels.GB4 < 100) {
            // Reset the flag if the fill level goes below 100
            reportGenerated100andAbove = false;
          }
        }

        // Update the initialization status for 80-99 fill level range and 100 and above
        initialized80to99 = true;
        initialized100andAbove = true;
      } else {
        console.log("No fill level data available");
      }
    },
    (error) => {
      console.error("Error listening for fill level changes:", error);
    }
  );
}

// Function to listen for changes in the status and display notification
function listenForStatusChanges(gcn) {
  const statusRef = ref(db, `GarbageBinControlNumber/${gcn}/Status`);
  let initialized = false; // Flag to track whether the listener is initialized

  onValue(
    statusRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();

        // Check if the listener is initialized
        if (initialized) {
          // Check if the status is "off" and it was different from the previous status
          if (status === "off") {
            generateNotification(
              "Garbage Bin Status Alert",
              "The device is offline."
            );
          }
          if (status === "on") {
            generateNotification(
              "Garbage Bin Status Alert",
              "The device is online."
            );
          }
        }

        // Update the initialization status
        initialized = true;
      } else {
        console.log("No status data available");
      }
    },
    (error) => {
      console.error("Error listening for status changes:", error);
    }
  );
}

function generateNotification(title, message) {
  // Fetch user ID from session
  const userId = getUserIdFromSession();

  // Check if user ID and GCN exist
  if (userId && userData && userData.gcn) {
    // Reference to the 'GarbageBinControlNumber' database for the corresponding GCN
    const gcnReportsRef = ref(
      db,
      `GarbageBinControlNumber/${userData.gcn}/reports`
    );

    // Create a timestamp for the notification
    const timestamp = new Date();

    // Format the date as MM-DD-YYYY
    const formattedDate =
      (timestamp.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      timestamp.getDate().toString().padStart(2, "0") +
      "-" +
      timestamp.getFullYear();

    // Format the time as HH:MM:SS AM/PM (12-hour format)
    const formattedTime12 = timestamp.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Create a unique notification ID based on timestamp and a random four-alphanumeric string
    const notificationId = `${formattedDate.replace(
      /-/g,
      ""
    )}${generateRandomAlphanumeric()}`;

    // Prepare the notification data
    const notificationData = {
      title: title,
      message: message,
      timestamp: formattedDate + " " + formattedTime12,
      userId: userId,
    };

    // Set the notification data in the 'GarbageBinControlNumber' database
    set(child(gcnReportsRef, notificationId), notificationData)
      .then(() => {
        console.log("Notification saved successfully in GCN reports.");
      })
      .catch((error) => {
        console.error("Error saving notification in GCN reports:", error);
      });
  } else {
    console.error("User ID or GCN not available.");
  }
}

// Function to update fill level for a specific bin
function updateFillLevel(binId, fillLevel) {
  const binElement = document.getElementById(binId);

  // Check if the element with the specified ID exists
  if (binElement) {
    const fillLevelElement = binElement.closest(".fill-level");

    // Update the fill level style and data-percentage attribute
    fillLevelElement.style.height = fillLevel + "%";
    fillLevelElement.setAttribute("data-percentage", fillLevel);

    // Update the text content inside the container
    const containerElement = fillLevelElement.querySelector(".container");
    containerElement.textContent = `${fillLevel}`;

    // Update the fill level color based on conditions
    updateFillLevelColor(fillLevelElement, fillLevel);
  } else {
    console.error(`Element with ID ${binId} not found.`);
  }
}

// Function to update fill level color based on conditions
function updateFillLevelColor(fillLevelElement, fillLevel) {
  if (fillLevel < 30) {
    fillLevelElement.classList.remove("fill-level2", "fill-level3");
    fillLevelElement.classList.add("fill-level1");
  } else if (fillLevel >= 30 && fillLevel < 70) {
    fillLevelElement.classList.remove("fill-level1", "fill-level3");
    fillLevelElement.classList.add("fill-level2");
  } else {
    fillLevelElement.classList.remove("fill-level1", "fill-level2");
    fillLevelElement.classList.add("fill-level3");
  }
}

// Function to fetch user information including GCN from the database based on user ID
async function getUserInfoFromDatabase(userId) {
  try {
    // Replace the following line with your actual logic to fetch user information based on the user ID
    const userRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}`);
    const userSnapshot = await get(userRef);
    const user = userSnapshot.val();

    // Assuming you have properties like gcn, firstName, lastName, email, mobileNumber, district, barangay, addressLine1, addressLine2 in the user data
    if (
      user &&
      user.gcn &&
      user.firstName &&
      user.lastName &&
      user.email &&
      user.mobileNumber &&
      user.district &&
      user.barangay &&
      user.addressLine1 &&
      user.addressLine2
    ) {
      return {
        gcn: user.gcn,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        district: user.district,
        barangay: user.barangay,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
      };
    } else {
      console.error("User information not found for the user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
}

// Function to generate a random four-alphanumeric string
function generateRandomAlphanumeric() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < 4; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
}

function submitForm() {
  // Fetch user ID from session
  const userId = getUserIdFromSession();

  // Check if user ID exists
  if (userId) {
    // Fetch user information including GCN from the database using userID
    getUserInfoFromDatabase(userId)
      .then((userInfo) => {
        // Check if user information exists
        if (userInfo) {
          // Fetch form data
          const issueTypeElement = document.getElementById("issueType");
          const issueType = issueTypeElement.value;
          const otherIssueDescriptionElement = document.getElementById(
            "otherIssueDescription"
          );
          const otherIssueDescription = otherIssueDescriptionElement.value;
          const reportDescriptionElement = document.getElementById(
            "reportDescriptionFields"
          );
          const reportDescription = reportDescriptionElement.value;

          // Check if the selected issueType is the default placeholder value
          if (issueType === "") {
            console.log("Please select a valid problem type.");
            return; // Do not proceed further
          }

          // Check if the issueType is 'other' and otherIssueDescription is empty
          if (issueType === "other" && otherIssueDescription.trim() === "") {
            console.log(
              'Please provide a description for the "other" problem type.'
            );
            return; // Do not proceed further
          }

          // Check if the issueType is not 'other' and reportDescription is not provided
          if (issueType !== "other" && reportDescription.trim() === "") {
            console.log(
              "Warning: No description provided for the selected problem type."
            );
            // Allow to proceed even if reportDescription is empty
          }

          // Create a timestamp for the report
          const timestamp = new Date();

          // Format the date as MM-DD-YYYY
          const formattedDate =
            (timestamp.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            timestamp.getDate().toString().padStart(2, "0") +
            "-" +
            timestamp.getFullYear();

          // Format the time as HH:MM:SS AM/PM (12-hour format)
          const formattedTime12 = timestamp.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

          // Generate a unique ticket number without hyphens and with a random four-alphanumeric string
          const ticketNumber = `${userInfo.gcn}${formattedDate.replace(
            /-/g,
            ""
          )}${generateRandomAlphanumeric()}`;

          // Prepare the report data including user information
          const reportData = {
            Date: formattedDate,
            Problem: issueType,
            Description:
              issueType === "other" ? otherIssueDescription : reportDescription,
            gcn: userInfo.gcn,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            mobileNumber: userInfo.mobileNumber,
            district: userInfo.district,
            barangay: userInfo.barangay,
            addressLine1: userInfo.addressLine1,
            addressLine2: userInfo.addressLine2,
            timeFormat12: formattedTime12,
            userID: userId,
          };

          // Reference to the 'Reports' database
          const reportsRef = ref(db, "Reports");

          // Use set instead of push to set a specific key (ticket number) for the record
          set(child(reportsRef, ticketNumber), reportData)
            .then(() => {
              console.log("Report submitted successfully.");

              // Clear the values of textboxes after submitting the report
              issueTypeElement.value = "";
              otherIssueDescriptionElement.value = "";
              reportDescriptionElement.value = "";
              // Hide the description text areas
              document.getElementById("otherIssueFields").style.display =
                "none";
              document.getElementById("reportDescription").style.display =
                "none";
            })
            .catch((error) => {
              console.error("Error submitting report:", error);
            });
        } else {
          console.log("User information not found for the user.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user information:", error);
      });
  } else {
    console.log("User ID not found in the session.");
  }
}

// Attach click event listener to the button
document.getElementById("submitReport").addEventListener("click", submitForm);

// Function to update the visibility of Connect and Remove Device buttons
function updateDeviceButtons(hasGCN) {
  const connectDeviceBtn = document.getElementById("connectDeviceBtn");
  const removeDeviceBtn = document.getElementById("removeDeviceBtn");

  if (hasGCN) {
    // If the user has a GCN, show the "Remove Device" button and hide the "Connect Device" button
    connectDeviceBtn.style.display = "none";
    removeDeviceBtn.style.display = "inline-block";
  } else {
    // If the user doesn't have a GCN, show the "Connect Device" button and hide the "Remove Device" button
    connectDeviceBtn.style.display = "inline-block";
    removeDeviceBtn.style.display = "none";
  }
}

// Function to reset the Add Device modal
function resetAddDeviceModal() {
  // Clear input fields
  document.getElementById("garbageControlNumber").value = "";
  document.getElementById("gcPassword").value = "";
  document.getElementById("districtDropdown").value = "Select District";
  document.getElementById("barangayDropdown").value = "Select Barangay";
  document.getElementById("addressLine1").value = "";
  document.getElementById("addressLine2").value = "";

  // Reset dropdown button labels
  document.getElementById("districtDropdownButtonLabel").innerText =
    "District: Select District";
  document.getElementById("barangayDropdownButtonLabel").innerText =
    "Barangay: Select Barangay";

  // Disable address textboxes
  addressLine1Input.disabled = true;
  addressLine2Input.disabled = true;

  // Enable the control number textbox, password textbox, and the verify button
  document.getElementById("garbageControlNumber").disabled = false;
  document.getElementById("gcPassword").disabled = false;
  verifyBtn.disabled = false;

  // Disable the "Save changes" button
  saveChangesBtn.disabled = true;
}

// Function to remove a device with validation prompt
async function removeDevice(userId, gcn) {
  try {
    // Display a confirmation prompt before proceeding
    const confirmation = window.confirm(
      "Are you sure you want to remove the device?"
    );

    // If the user confirms, proceed with device removal
    if (confirmation) {
      // Reference to the 'Accounts/Users' database
      const userRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}`);

      // Reference to the 'GarbageBinControlNumber' database
      const gcnRef = ref(db, `GarbageBinControlNumber/${gcn}/Users/${userId}`);

      // Reference to the 'GarbageBinControlNumber/Location' database
      const locationRef = ref(
        db,
        `GarbageBinControlNumber/${gcn}/Location`
      );

      // Remove specific fields from user data
      const updatedUserData = {
        addressLine1: null,
        addressLine2: null,
        barangay: null,
        district: null,
        gcn: null,
        latitude: null, // Remove latitude
        longitude: null, // Remove longitude
      };

      // Update user data in 'Accounts/Users'
      await update(userRef, updatedUserData);

      // Remove the user from 'GarbageBinControlNumber/Users'
      await set(gcnRef, null);

      // Remove latitude and longitude from 'GarbageBinControlNumber/Location'
      await update(locationRef, {
        Latitude: null,
        Longitude: null,
      });

      // After successful removal, update the UI
      updateDeviceButtons(false);

      // Immediately update the UI by calling checkAndDisplayBins
      await checkAndDisplayBins();

      // Reset the Add Device modal
      resetAddDeviceModal();

      // You may also want to update any other parts of the UI or perform additional tasks

      console.log("Device removed successfully");
    } else {
      // If the user cancels, do nothing or provide feedback if needed
      console.log("Device removal canceled");
    }
  } catch (error) {
    console.error("Error removing device:", error);
    // Handle errors appropriately, e.g., show an error message to the user
  }
}

// Check if the user has a GCN and update the UI accordingly
async function checkAndDisplayBins() {
  try {
    const user = await fetchUserData(userId);

    if (user && user.gcn) {
      // User has a GCN, display bins
      document.getElementById("binsRow").style.display = "flex";
      document.getElementById("noDeviceRow").style.display = "none";

      // Update the visibility of Connect and Remove Device buttons
      updateDeviceButtons(true);

      // Wait for the UI to update before calling displayFillLevels
      await displayFillLevels();

      // Display latest reports
      await displayLatestReports(user.gcn);
    } else {
      // User does not have a GCN, display "No Device Available"
      document.getElementById("binsRow").style.display = "none";
      document.getElementById("noDeviceRow").style.display = "flex";

      // Update the visibility of Connect and Remove Device buttons
      updateDeviceButtons(false);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Update the function to include real-time updates for reports
async function displayLatestReports(gcn) {
  try {
    // Reference to the 'GarbageBinControlNumber' database for the specified GCN
    const gcnRef = ref(db, `GarbageBinControlNumber/${gcn}/reports`);

    // Subscribe to real-time updates
    onValue(gcnRef, (snapshot) => {
      const reports = snapshot.val();
      // Display the reports in the notification content
      displayLatestReportsInNotification(reports);
      displayAllReportsInNotification(reports);
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
  }
}

// Function to display reports in the notification content
function displayAllReportsInNotification(reports) {
  const notificationContent = document.getElementById("notificationContent");

  // Clear previous content
  notificationContent.innerHTML = "";

  // Check if there are reports
  if (reports) {
    // Sort reports by timestamp in descending order
    const sortedReports = Object.values(reports).sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Loop through each sorted report and create HTML elements
    for (const report of sortedReports) {
      // Create a div for each report
      const reportDiv = document.createElement("div");
      reportDiv.className = "report";

      // Create HTML content for the report with a static design
      reportDiv.innerHTML = `
        <div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 10px; background-color: #f8f8f8; margin-bottom: 20px;">
          <p style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">${report.title}</p>
          <p style="font-size: 16px; margin-bottom: 10px;">${report.message}</p>
          <p style="font-size: 14px; color: #888;">${report.timestamp}</p>
        </div>
      `;

      // Append the report div to the notification content
      notificationContent.appendChild(reportDiv);
    }
  } else {
    // If there are no reports, display a message
    notificationContent.innerHTML = "<p>No reports available</p>";
  }
}

function displayLatestReportsInNotification(reports) {
  const notificationContent = document.querySelector(".card-body.notification");

  if (notificationContent) {
    // Check if there are reports
    if (reports && Object.keys(reports).length > 0) {
      // Convert timestamps to numbers for proper sorting
      const reportsArray = Object.values(reports).map((report) => {
        return { ...report, timestamp: new Date(report.timestamp).getTime() };
      });

      // Sort reports based on timestamp in descending order
      const sortedReports = reportsArray.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      // Display the most recent report
      const latestReport = sortedReports[0];

      // Check if the latest report is different from the currently displayed one
      if (
        !notificationContent.lastReport ||
        notificationContent.lastReport.timestamp < latestReport.timestamp
      ) {
        // Clear previous content
        notificationContent.innerHTML = "";

        // Create and append the new report element
        const reportElement = document.createElement("div");
        reportElement.className = "notification-card shadow-none p-1";

        reportElement.innerHTML = `
          <div class="card-body">
          <i class="fa fa-trash mr-3" aria-hidden="true"></i>
          <div class="media-body">
          <h6 class="mt-2 mb-0">${latestReport.message}</h6>
          <small class="text">${new Date(
          latestReport.timestamp
        ).toLocaleString()}</small>
        </div>
          </div>
        `;

        notificationContent.appendChild(reportElement);

        // Update the lastReport property for future comparisons
        notificationContent.lastReport = latestReport;
      }
    } else {
      // Create and append the "No recent notification" message
      const noNotificationElement = document.createElement("p");
      noNotificationElement.textContent = "No recent notification.";
      notificationContent.appendChild(noNotificationElement);

      // Reset the lastReport property since there are no reports
      notificationContent.lastReport = null;
    }
  }
}

// Example: Add a click event listener for the "Remove Device" button
const removeDeviceBtn = document.getElementById("removeDeviceBtn");

removeDeviceBtn.addEventListener("click", async () => {
  try {
    const user = await fetchUserData(userId);
    if (user && user.gcn) {
      await removeDevice(userId, user.gcn, user);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// Invoke the function to check and display bins
checkAndDisplayBins();
