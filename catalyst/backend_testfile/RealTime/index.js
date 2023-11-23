// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Add the event listener for the Check Control Number button
document.getElementById("checkControlNumber").addEventListener('click', function () {
  const controlNumber = document.getElementById("controlNumber").value;

  isControlNumberValid(controlNumber)
    .then((isValid) => {
      if (isValid) {
        alert("Valid Control Number");
      } else {
        alert("Invalid Control Number");
      }
    })
    .catch((error) => {
      console.error("Error checking Control Number validity: " + error);
    });
});

// Add the event listener for the Submit button
document.getElementById("submit").addEventListener('click', function () {
  // Get values from the form
  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const mobileNumber = document.getElementById("mobilenumber").value;
  const password = document.getElementById("password").value;
  const controlNumber = document.getElementById("controlNumber").value;
  const address = document.getElementById("address").value;

  // Check if the control number exists
  isControlNumberValid(controlNumber)
    .then((isValid) => {
      if (isValid) {
        // Check if the user already exists in the specified control number
        isUserInControlNumber(controlNumber, id)
          .then((isInControlNumber) => {
            if (isInControlNumber) {
              alert("This account already exists in the specified control number.");
            } else {
              // Check if the control number is already associated with an account in Accounts/Users
              isControlNumberInUse(controlNumber)
                .then((controlNumberInUse) => {
                  if (controlNumberInUse) {
                    alert("This control number is already associated with an account. Please choose a different control number.");
                  } else {
                    // Proceed with adding the user data

                    // Create a user object
                    const user = {
                      email: email,
                      firstName: firstName,
                      lastName: lastName,
                      mobileNumber: mobileNumber,
                      password: password,
                      // Add more fields as needed
                    };

                    // Reference to the specific control number and user in GarbageBinControlNumber
                    const userRefInControlNumber = ref(db, `GarbageBinControlNumber/${controlNumber}/Users/${id}`);

                    // Set user data in the GarbageBinControlNumber/Users table
                    set(userRefInControlNumber, user)
                      .then(() => {
                        // Reference to the specific user in Accounts/Users
                        const userRefInAccounts = ref(db, `Accounts/Users/${id}`);

                        // Update user data in the Accounts/Users table
                        set(userRefInAccounts, {
                          email: email,
                          firstName: firstName,
                          lastName: lastName,
                          mobileNumber: mobileNumber,
                          password: password,
                          controlNumber: controlNumber, // Add the control number to the user data
                          // Add more fields as needed
                        })
                          .then(() => {
                            alert("User information added to both GarbageBinControlNumber and Accounts/Users tables!");
                            // Clear the form after successful submission
                            clearForm();
                          })
                          .catch((error) => {
                            console.error("Error updating user information in Accounts/Users: " + error);
                          });
                      })
                      .catch((error) => {
                        console.error("Error adding user information to GarbageBinControlNumber: " + error);
                      });
                  }
                })
                .catch((error) => {
                  console.error("Error checking if control number is in use: " + error);
                });
            }
          })
          .catch((error) => {
            console.error("Error checking if user is in control number: " + error);
          });
      } else {
        alert("Invalid Control Number. Please enter a valid control number.");
      }
    })
    .catch((error) => {
      console.error("Error checking if control number is valid: " + error);
    });
});

// Function to check if the user is already in the specified control number
function isUserInControlNumber(controlNumber, userId) {
  const userRefInControlNumber = ref(db, `GarbageBinControlNumber/${controlNumber}/Users/${userId}`);

  return get(userRefInControlNumber)
    .then((snapshot) => {
      return snapshot.exists();
    })
    .catch((error) => {
      console.error("Error checking if user is in control number: " + error);
      return false;
    });
}

// Function to check if the control number is already associated with an account in Accounts/Users
function isControlNumberInUse(controlNumber) {
  const usersRef = ref(db, "Accounts/Users");

  return get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();

        for (const userId in users) {
          const user = users[userId];
          if (user.controlNumber === controlNumber) {
            return true; // Control number is already in use
          }
        }
      }
      return false; // Control number is not in use
    })
    .catch((error) => {
      console.error("Error checking if control number is in use: " + error);
      return false;
    });
}

// Function to check if GCN exists in the database
function isControlNumberValid(controlNumber) {
  const controlNumberRef = ref(db, `GarbageBinControlNumber/${controlNumber}`);

  return get(controlNumberRef)
    .then((snapshot) => {
      return snapshot.exists();
    })
    .catch((error) => {
      console.error("Error checking Control Number validity: " + error);
      return false;
    });
}

// Function to display all users
function displayAllUsers() {
  const usersRef = ref(db, "Accounts/Users"); // Adjust the reference based on your database structure

  get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();

        // Display the users (you can customize this based on your needs)
        const userDataDisplay = document.getElementById("userDataDisplay");
        userDataDisplay.innerHTML = "<h2>All Users:</h2>";

        Object.keys(users).forEach((userId) => {
          const user = users[userId];
          userDataDisplay.innerHTML += `
            <div>
              <strong>ID:</strong> ${userId}<br>
              <strong>Name:</strong> ${user.firstName} ${user.lastName}<br>
              <strong>Email:</strong> ${user.email}<br>
              <strong>Mobile Number:</strong> ${user.mobileNumber}<br>
              <strong>Password:</strong> ${user.password}<br>
              <button class="selectUser" data-user-id='${userId}'>Select User</button>
              <!-- Add more user data fields as needed -->
            </div>
            <br>
          `;
        });

        // Add event listeners to the "Select User" buttons
        document.querySelectorAll(".selectUser").forEach((button) => {
          button.addEventListener('click', function () {
            const userId = button.dataset.userId;
            populatePersonalInformation(userId);
          });
        });
      } else {
        alert("No users found");
      }
    })
    .catch((error) => {
      console.error("Error displaying users: " + error);
    });
}

// Function to populate personal information based on selected user
function populatePersonalInformation(userId) {
  const userRef = ref(db, `Accounts/Users/${userId}`);

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();

        document.getElementById("id").value = userId;
        document.getElementById("firstname").value = userData.firstName;
        document.getElementById("lastname").value = userData.lastName;
        document.getElementById("email").value = userData.email;
        document.getElementById("mobilenumber").value = userData.mobileNumber;
        document.getElementById("password").value = userData.password;
        // Add more fields as needed
      } else {
        alert("User not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data: " + error);
    });
}

// Function to clear the form fields
function clearForm() {
  document.getElementById("id").value = "";
  document.getElementById("firstname").value = "";
  document.getElementById("lastname").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobilenumber").value = "";
  document.getElementById("password").value = "";
  document.getElementById("controlNumber").value = "";
  document.getElementById("address").value = "";
}

// Call the displayAllUsers function when the page loads
document.addEventListener('DOMContentLoaded', displayAllUsers);