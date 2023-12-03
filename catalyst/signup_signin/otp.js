// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

function verifyOTP(enteredOTP, userEmail) {
    const usersRef = ref(db, 'Accounts/Users');

    // Find the user by email
    get(usersRef)
        .then(snapshot => {
            const users = snapshot.val();

            // Find the user with the specified email
            const userKey = Object.keys(users).find(key => users[key].email === userEmail);

            if (userKey) {
                const user = users[userKey];

                // Convert storedOTP to a string and trim whitespaces
                const storedOTP = String(user.otp).trim();

                // Compare entered OTP with stored OTP (case-insensitive and trim whitespaces)
                if (enteredOTP.trim().toLowerCase() === storedOTP.toLowerCase()) {
                    // OTP is correct, you can proceed with account verification

                    console.log('OTP is correct. Proceed with account verification.');

                    // Create a copy of the user data (excluding OTP)
                    const userDataCopy = { ...user, otp: null };

                    // Set the user data in the "VerifiedUserAccounts" database
                    const verifiedUserRef = ref(db, `Accounts/VerifiedUserAccounts/${userKey}`);
                    set(verifiedUserRef, userDataCopy).then(() => {
                        // Remove the original user data from the "Users" database
                        remove(ref(db, `Accounts/Users/${userKey}`)).then(() => {
                            // Access the user's unique ID
                            const userId = userKey;

                            // Store the user ID in a session or a cookie
                            sessionStorage.setItem('userId', userId);

                            // Redirect to user/user-index.html
                            window.location.href = '../user/user-index.html';
                        }).catch(error => {
                            console.error('Error removing user data from Users database:', error);
                        });
                    }).catch(error => {
                        console.error('Error updating user data in VerifiedUserAccounts database:', error);
                    });
                } else {
                    // OTP is incorrect
                    console.log('Incorrect OTP. Please try again.');
                }
            } else {
                // User not found
                console.log('User not found.');
            }
        })
        .catch(error => {
            console.error('Error getting users from Firebase:', error);
        });
}






// Get the email from the URL query parameters
function getEmailFromURL() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const emailParam = urlSearchParams.get('email');
    return emailParam ? decodeURIComponent(emailParam) : null;
}

// Add an event listener to the form for OTP verification
document.getElementById('otpForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the entered OTP
    const enteredOTP = Array.from(document.querySelectorAll('.otp-box input')).map(input => input.value).join('');

    // Get the user email from the URL
    const userEmail = getEmailFromURL();

    // Call the OTP verification function with the retrieved values
    verifyOTP(enteredOTP, userEmail);
});
