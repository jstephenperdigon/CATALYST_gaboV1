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
    appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Extract email parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const encodedEmail = urlParams.get('email');
const decodedEmail = decodeURIComponent(encodedEmail);

// Reference to the user accounts in the database
const usersRef = ref(db, 'Accounts/Users');
const verifiedUsersRef = ref(db, 'Accounts/VerifiedUserAccounts');

// Function to update the password in the database
const updatePasswordInDatabase = async (userId, newPassword) => {
    const userRefInUsers = ref(db, `Accounts/Users/${userId}`);
    const userRefInVerifiedUsers = ref(db, `Accounts/VerifiedUserAccounts/${userId}`);
    
    try {
        // Fetch the current user data from both locations
        const userSnapshotInUsers = await get(userRefInUsers);
        const userSnapshotInVerifiedUsers = await get(userRefInVerifiedUsers);

        // Check and update the password in the appropriate location
        if (userSnapshotInUsers.exists()) {
            // Update the password field in Accounts/Users
            await set(ref(userRefInUsers, 'password'), newPassword);

            console.log('Password successfully updated in Accounts/Users!');
        } else if (userSnapshotInVerifiedUsers.exists()) {
            // Update the password field in Accounts/VerifiedUserAccounts
            await set(ref(userRefInVerifiedUsers, 'password'), newPassword);

            console.log('Password successfully updated in Accounts/VerifiedUserAccounts!');
        } else {
            console.error('User not found in either location.');
        }
    } catch (error) {
        console.error('Error updating password in the database:', error);
    }
};

// Query the 'Users' table for the user details based on the email
get(usersRef).then((usersSnapshot) => {
    // Query the 'VerifiedUserAccounts' table for the user details based on the email
    get(verifiedUsersRef).then((verifiedUsersSnapshot) => {
        const usersData = usersSnapshot.val() || {};
        const verifiedUsersData = verifiedUsersSnapshot.val() || {};

        // Combine the data from both tables
        const allUsersData = { ...usersData, ...verifiedUsersData };

        // Find the user based on the email
        const user = Object.values(allUsersData).find(user => user.email === decodedEmail);

        if (user) {
            // Log the current password to the console
            console.log('Current Password:', user.password);

            // Update the HTML with the user's input for the new password
            document.getElementById('newPasswordForm').addEventListener('submit', async (event) => {
                event.preventDefault();

                // Get the new password entered by the user
                const newPassword = document.getElementById('newPassword').value;

                // Update the password in the database
                try {
                    await updatePasswordInDatabase(user.UserId, newPassword);

                    // Log success message
                    console.log('Password change successful!');
                } catch (error) {
                    // Log error message
                    console.error('Error updating password:', error);
                }
            });
        } else {
            console.error('User not found');
            // Handle the case when the user is not found
        }
    }).catch((error) => {
        console.error('Error getting verified user accounts', error);
        // Handle errors for the 'VerifiedUserAccounts' table
    });
}).catch((error) => {
    console.error('Error getting user accounts', error);
    // Handle errors for the 'Users' table
});