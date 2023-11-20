// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Function to display all users
function displayAllUsers() {
    const usersRef = ref(db, "Accounts/Users");

    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();

                // Display the users (customize based on your needs)
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
                            <strong>Address Line 1:</strong> ${user.addressLine1}<br>
                            <strong>Address Line 2:</strong> ${user.addressLine2}<br>
                            <strong>Barangay:</strong> ${user.barangay}<br>
                            <strong>District:</strong> ${user.district}<br>
                            <button class="selectUser" data-user-id='${userId}' data-gcn='${user.gcn}'>Select User</button>
                            <!-- Add more user data fields as needed -->
                        </div>
                        <br>
                    `;
                });

                // Add event listeners to the "Select User" buttons
                document.querySelectorAll(".selectUser").forEach((button) => {
                    button.addEventListener('click', function () {
                        const userId = button.dataset.userId;
                        const gcn = button.dataset.gcn;

                        // Set the GCN value in the hidden input
                        document.getElementById("controlNumber").value = gcn;

                        // Populate other user information
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

                // Populate the textboxes with selected user data
                document.getElementById("id").value = userId;
                document.getElementById("firstname").value = userData.firstName;
                document.getElementById("lastname").value = userData.lastName;
                document.getElementById("email").value = userData.email;
                document.getElementById("mobilenumber").value = userData.mobileNumber;
                document.getElementById("password").value = userData.password;
                document.getElementById("addressLine1").value = userData.addressLine1;
                document.getElementById("addressLine2").value = userData.addressLine2;
                document.getElementById("barangay").value = userData.barangay;
                document.getElementById("district").value = userData.district;
                // Add more fields as needed
            } else {
                alert("User not found");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data: " + error);
        });
}

// Function to update user data in both Accounts/Users and GarbageBinControlNumber
function updateUserData(userId, newData) {
    const userRef = ref(db, `Accounts/Users/${userId}`);
    const garbageBinRef = ref(db, `GarbageBinControlNumber/${newData.controlNumber}/Users/${userId}`);

    // Update data in Accounts/Users
    update(userRef, newData)
        .then(() => {
            console.log("User data updated in Accounts/Users");
        })
        .catch((error) => {
            console.error("Error updating user data in Accounts/Users: " + error);
        });

    // Update data in GarbageBinControlNumber
    update(garbageBinRef, newData)
        .then(() => {
            console.log("User data updated in GarbageBinControlNumber");
        })
        .catch((error) => {
            console.error("Error updating user data in GarbageBinControlNumber: " + error);
        });
}

// Event listener for the "Update" button
document.getElementById("update").addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const userId = document.getElementById("id").value;
    const newData = {
        // Add all the fields you want to update here
        firstName: document.getElementById("firstname").value,
        lastName: document.getElementById("lastname").value,
        email: document.getElementById("email").value,
        mobileNumber: document.getElementById("mobilenumber").value,
        password: document.getElementById("password").value,
        addressLine1: document.getElementById("addressLine1").value,
        addressLine2: document.getElementById("addressLine2").value,
        barangay: document.getElementById("barangay").value,
        district: document.getElementById("district").value,
        controlNumber: document.getElementById("controlNumber").value,
    };

    // Call the function to update user data
    updateUserData(userId, newData);
});

// Call the displayAllUsers function when the page loads
document.addEventListener('DOMContentLoaded', displayAllUsers);
