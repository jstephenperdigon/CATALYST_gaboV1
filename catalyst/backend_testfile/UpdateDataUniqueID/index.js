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

// Function to load user data into the display area
function loadUserData(userId) {
    const userRef = ref(db, `/Accounts/Users/${userId}`);
    
    get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            document.getElementById("displayFirstName").innerText = userData.firstName || "";
            document.getElementById("displayLastName").innerText = userData.lastName || "";
            document.getElementById("displayEmail").innerText = userData.email || "";
            document.getElementById("displayAddressLine1").innerText = userData.addressLine1 || "";
            document.getElementById("displayAddressLine2").innerText = userData.addressLine2 || "";
            document.getElementById("displayBarangay").innerText = userData.barangay || "";
            document.getElementById("displayDistrict").innerText = userData.district || "";
            document.getElementById("displayGCN").innerText = userData.gcn || "";
            document.getElementById("displayMobileNumber").innerText = userData.mobileNumber || "";
            // Add other fields accordingly
        }
    });
}

// Function to update user data
function updateUserData() {
    const userId = document.getElementById("userSelector").value;
    const userRef = ref(db, `/Accounts/Users/${userId}`);

    const updatedData = {
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        email: document.getElementById("editEmail").value,
        addressLine1: document.getElementById("editAddressLine1").value,
        addressLine2: document.getElementById("editAddressLine2").value,
        barangay: document.getElementById("editBarangay").value,
        district: document.getElementById("editDistrict").value,
        gcn: document.getElementById("editGCN").value,
        mobileNumber: document.getElementById("editMobileNumber").value,
        // Add other fields accordingly
    };

    set(userRef, updatedData).then(() => {
        console.log("User data updated successfully!");
        // Reload displayed data after update
        loadUserData(userId);
    }).catch((error) => {
        console.error("Error updating user data:", error);
    });
}

// Function to populate the user list
function populateUserList() {
    const userList = document.getElementById("userList");
    const usersRef = ref(db, "/Accounts/Users");

    get(usersRef).then((snapshot) => {
        snapshot.forEach((userSnapshot) => {
            const userId = userSnapshot.key;
            const userButton = document.createElement("button");
            userButton.innerText = userId;
            userButton.addEventListener("click", () => {
                loadUserData(userId);
            });
            userList.appendChild(userButton);
        });

        // Load the first user's data by default
        const firstUser = snapshot.docs[0];
        if (firstUser) {
            const firstUserId = firstUser.key;
            loadUserData(firstUserId);
        }
    });
}


// Call the function to populate the user list
populateUserList();
