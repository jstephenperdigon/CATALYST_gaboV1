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
                userDataDisplay.innerHTML = "<h2>Users<h2>";

                Object.keys(users).forEach((userId) => {
                    const user = users[userId];
                    userDataDisplay.innerHTML += `
                        <div>
                            <strong>Name:</strong> ${user.firstName} ${user.lastName}
                            <strong>Barangay:</strong> ${user.barangay}
                            <strong>District:</strong> ${user.district}
                            <strong>GCN:</strong> ${user.gcn}
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
function applyFilter() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filterSelect = document.getElementById("filter");
    const filterOption = filterSelect.options[filterSelect.selectedIndex].value.toLowerCase();

    switch (filterOption) {
        case "name":
            filterUsersByName();
            break;
        case "barangay":
            filterUsersByBarangay();
            break;
        case "district":
            filterUsersByDistrict();
            break;
        case "gcn":
            filterUsersByGCN();
            break;
        default:
            alert("Invalid filter option");
            break;
    }
}
// Example usage: Call the applyFilter function when the filter is changed
document.getElementById("filter").addEventListener('change', applyFilter);

// Call the displayAllUsers function when the page loads
document.addEventListener('DOMContentLoaded', displayAllUsers);