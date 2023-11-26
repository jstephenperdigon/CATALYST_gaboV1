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
                            <strong>Name:</strong> ${user.firstName} ${user.lastName}<br>
                            <strong>Barangay:</strong> ${user.barangay}<br>
                            <strong>District:</strong> ${user.district}<br>
                            <strong>GCN:</strong> ${user.gcn}<br>
                            <br>
                        </div>
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

// Function to filter users based on search input and filter dropdown
function filterUsers() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filterSelect = document.getElementById("filter");
    const filterOption = filterSelect.options[filterSelect.selectedIndex].value.toLowerCase();

    const usersRef = ref(db, "Accounts/Users");

    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const filteredUsers = Object.keys(users).filter((userId) => {
                    const user = users[userId];
                    const fieldValue = user[filterOption].toLowerCase();
                    return fieldValue.includes(searchInput);
                });

                const userDataDisplay = document.getElementById("userDataDisplay");
                userDataDisplay.innerHTML = "<h2>Filtered Users:</h2>";

                filteredUsers.forEach((userId) => {
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
                        </div>
                        <br>
                    `;
                });
            } else {
                alert("No users found");
            }
        })
        .catch((error) => {
            console.error("Error filtering users: " + error);
        });
}
// Call the displayAllUsers function when the page loads
document.addEventListener('DOMContentLoaded', displayAllUsers);