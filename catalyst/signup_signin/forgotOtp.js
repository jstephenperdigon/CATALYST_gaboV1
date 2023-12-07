// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Function to fetch OTP from the database based on email
async function fetchOTP(email) {
    try {
        const usersRef = ref(db, "Accounts/Users");
        const verifiedUsersRef = ref(db, "Accounts/VerifiedUserAccounts");

        // Check if the email matches in "Users" node
        const usersSnapshot = await get(usersRef);
        if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            const userWithEmail = Object.values(usersData).find(user => user.email === email);

            if (userWithEmail && userWithEmail.otp) {
                return { userId: userWithEmail.userId, otp: String(userWithEmail.otp) };
            }
        }

        // Check if the email matches in "VerifiedUserAccounts" node
        const verifiedUsersSnapshot = await get(verifiedUsersRef);
        if (verifiedUsersSnapshot.exists()) {
            const verifiedUsersData = verifiedUsersSnapshot.val();
            const verifiedUserWithEmail = Object.values(verifiedUsersData).find(user => user.email === email);

            if (verifiedUserWithEmail && verifiedUserWithEmail.otp) {
                return { userId: verifiedUserWithEmail.userId, otp: String(verifiedUserWithEmail.otp) };
            }
        }

        return null; // Email not found or OTP not available in either node
    } catch (error) {
        console.error("Error fetching OTP for the email:", error);
        return null;
    }
}

// Function to match user input with OTP from the database
async function matchInputWithOTP(userInput, email) {
    try {
        const fetchedOTPData = await fetchOTP(email);

        console.log("User Input:", userInput);
        console.log("OTP from the database:", fetchedOTPData ? fetchedOTPData.otp : null);

        if (fetchedOTPData !== null && userInput.trim() === fetchedOTPData.otp.trim()) {
            console.log("Input and OTP from the database match!");

            // Call function to delete OTP data for the matched email
            await deleteOTPData(email);

            // Redirect to newpassword.html if OTP matches
            const queryParams = new URLSearchParams(window.location.search);
            const userEmail = queryParams.get('email');
            const encodedEmail = encodeURIComponent(userEmail);
            window.location.href = `newpassword.html?email=${encodedEmail}`;
            
        } else {
            console.log("Input and OTP from the database do not match.");
        }
    } catch (error) {
        console.error("Error matching input with OTP:", error);
    }
}

// Function to delete OTP data for a user by email
async function deleteOTPData(email) {
    try {
        const usersRef = ref(db, "Accounts/Users");
        const verifiedUsersRef = ref(db, "Accounts/VerifiedUserAccounts");

        // Find the user with the specified email in "Users" node
        const usersSnapshot = await get(usersRef);
        if (usersSnapshot.exists()) {
            // Loop through each user in the collection
            usersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();

                // Check if the email matches
                if (userData.email === email) {
                    // If the user data exists, remove only the 'otp' field
                    const userId = userSnapshot.key;
                    const userToUpdateRef = ref(db, `Accounts/Users/${userId}/otp`);

                    // Remove the 'otp' field
                    remove(userToUpdateRef)
                        .then(() => {
                            console.log(`OTP data for ${email} deleted successfully from "Users" node.`);
                        })
                        .catch((error) => {
                            console.error(`Error deleting OTP data: ${error.message}`);
                        });
                }
            });
        }

        // Find the user with the specified email in "VerifiedUserAccounts" node
        const verifiedUsersSnapshot = await get(verifiedUsersRef);
        if (verifiedUsersSnapshot.exists()) {
            // Loop through each user in the collection
            verifiedUsersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();

                // Check if the email matches
                if (userData.email === email) {
                    // If the user data exists, remove only the 'otp' field
                    const userId = userSnapshot.key;
                    const userToUpdateRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}/otp`);

                    // Remove the 'otp' field
                    remove(userToUpdateRef)
                        .then(() => {
                            console.log(`OTP data for ${email} deleted successfully from "VerifiedUserAccounts" node.`);
                        })
                        .catch((error) => {
                            console.error(`Error deleting OTP data: ${error.message}`);
                        });
                }
            });
        }
    } catch (error) {
        console.error(`Error checking user data: ${error.message}`);
    }
}

// Call the function to match input with OTP when the form is submitted
const otpForm = document.getElementById("otpForm");
otpForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get OTP from input fields
    const userInput = document.getElementById("first").value +
        document.getElementById("second").value +
        document.getElementById("third").value +
        document.getElementById("fourth").value +
        document.getElementById("fifth").value +
        document.getElementById("sixth").value;

    // Get email from the URL parameter
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');

    // Call the function to match input with OTP
    await matchInputWithOTP(userInput, email);
});
