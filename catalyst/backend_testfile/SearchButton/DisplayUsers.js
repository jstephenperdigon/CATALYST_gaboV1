// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

let users; // Declare users at a higher scope

// Function to display all users
function displayAllUsers() {
    const usersRef = ref(db, "Accounts/Users");

    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                users = snapshot.val(); // Assign value to the higher-scoped variable

                // Display the users (customize based on your needs)
                const userDataDisplay = document.getElementById("userDataDisplay");
                userDataDisplay.innerHTML = "<h2>Users</h2>";

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
            } else {
                alert("No users found");
            }
        })
        .catch((error) => {
            console.error("Error displaying users: " + error);
        });
}

function searchData() {
    const searchBar = document.getElementById("searchBar");
    const filterSelect = document.getElementById("filter");
    const filterValue = filterSelect.value.toLowerCase();
    const searchText = searchBar.value.toLowerCase();

    // Filter users based on the selected filter and search text
    const filteredUsers = Object.keys(users).filter((userId) => {
        const user = users[userId];
        const fieldValue = user[filterValue];

        // Check if the property exists and if its value includes the search text
        return fieldValue !== undefined && fieldValue.toLowerCase().includes(searchText);
    });

    // Display the filtered users
    const userDataDisplay = document.getElementById("userDataDisplay");
    userDataDisplay.innerHTML = "<h2>Search Results</h2>";

    filteredUsers.forEach((userId) => {
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

    if (filteredUsers.length === 0) {
        userDataDisplay.innerHTML += "<p>No matching records found.</p>";
    }
}

// Add event listener to the Search button
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchData);

// Add event listener for Enter key on the search input field
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchData();
    }
});

// Call the displayAllUsers function when the page loads
document.addEventListener('DOMContentLoaded', displayAllUsers);