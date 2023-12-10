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


// Function to update the password of the user
const updatePassword = async (userId, newPassword) => {
    // Create references for both Users and VerifiedUserAccounts
    const userRef = ref(db, `Accounts/Users/${userId}`);
    const verifiedUserRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}`);

    try {
        // Retrieve existing user data from the Users table
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
            const existingUserData = userSnapshot.val();

            // Update the password in the Users table
            await set(userRef, { ...existingUserData, password: newPassword });
        }

        // Retrieve existing user data from the VerifiedUserAccounts table
        const verifiedUserSnapshot = await get(verifiedUserRef);
        if (verifiedUserSnapshot.exists()) {
            const existingVerifiedUserData = verifiedUserSnapshot.val();

            // Update the password in the VerifiedUserAccounts table
            await set(verifiedUserRef, { ...existingVerifiedUserData, password: newPassword });
        }
    } catch (error) {
        console.error('Error updating password:', error.message);
    }
};

// Event listener for the form submission
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the new password and confirmed new password from the input fields
    const newPassword = document.getElementById('newPassword').value;
    const cNewPassword = document.getElementById('cNewPassword').value;

    // Check if the new password and confirmed new password match
    if (newPassword === cNewPassword) {
        try {
            // Obtain the userId before calling the updatePassword function
            const userId = await getUserIdByEmail(decodedEmail);

            // Call the function to update the password
            if (userId) {
                // Update the password
                await updatePassword(userId, newPassword);

                // Display success message
                alert('Password successfully changed!');

                // Clear text fields
                document.getElementById('newPassword').value = '';
                document.getElementById('cNewPassword').value = '';

                // Redirect to sign-in.html and prevent going back
                window.location.replace('sign-in.html');
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error obtaining userId:', error.message);
        }
    } else {
        console.log('New password and confirmed new password do not match');
    }
});

// Function to get the userId based on email
const getUserIdByEmail = async (email) => {
    // Form a reference to the user in the Users table based on the provided email
    const usersQuery = ref(db, `Accounts/Users`);
    const verifiedUsersQuery = ref(db, `Accounts/VerifiedUserAccounts`);

    try {
        // Retrieve the user details from the Users table
        const usersSnapshot = await get(usersQuery);
        if (usersSnapshot.exists()) {
            const userId = Object.keys(usersSnapshot.val()).find(key => usersSnapshot.val()[key].email === email);
            return userId || null;
        }

        // If user not found in Users table, try finding in VerifiedUserAccounts table
        const verifiedUsersSnapshot = await get(verifiedUsersQuery);
        if (verifiedUsersSnapshot.exists()) {
            const userId = Object.keys(verifiedUsersSnapshot.val()).find(key => verifiedUsersSnapshot.val()[key].email === email);
            return userId || null;
        }

        // User not found in either table
        return null;
    } catch (error) {
        console.error('Error obtaining userId:', error.message);
        throw error;
    }
};
