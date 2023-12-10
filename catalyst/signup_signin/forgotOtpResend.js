// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// emailjs config
emailjs.init('TN6jayxVlZMzQ3Ljt');

// Function to send OTP via email
function sendOTP(toEmail, firstName, otp) {
    const templateParams = {
        to_email: toEmail,
        first_name: firstName,
        otp: otp,
    };

    return emailjs.send('service_qpkq4ee', 'template_l3cy9we', templateParams)
        .then(() => {
            // Return both OTP and email for further processing
            return { otp: otp, email: toEmail };
        });
}

// Resend OTP function
function resendOTP() {
    const emailParam = new URLSearchParams(window.location.search).get('email');
    const firstNameParam = new URLSearchParams(window.location.search).get('firstname');
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);

    // Update the OTP for the user in 'Accounts/Users'
    const usersRef = ref(db, 'Accounts/Users');
    get(usersRef).then((userSnapshot) => {
        if (userSnapshot.exists()) {
            const users = userSnapshot.val();
            const userId = Object.keys(users).find(
                (key) => users[key].email === emailParam
            );

            if (userId) {
                // Update the OTP for that user in 'Accounts/Users'
                const userRef = ref(db, `Accounts/Users/${userId}/otp`);
                set(userRef, generatedOTP)
                    .then(() => {
                        // Update your logic to send OTP via email here
                        sendOTP(emailParam, firstNameParam, generatedOTP)
                            .then(response => {
                                // Handle success (if needed)
                                console.log('OTP resent successfully for Accounts/Users:', response);
                            })
                            .catch(error => {
                                // Handle error (if needed)
                                console.error('Error resending OTP for Accounts/Users:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error updating OTP for Accounts/Users:', error);
                    });
            }
        } else {
            console.error('No users found in the "Accounts/Users" database');
        }
    });

    // Update the OTP for the user in 'Accounts/VerifiedUserAccounts'
    const verifiedUsersRef = ref(db, 'Accounts/VerifiedUserAccounts');
    get(verifiedUsersRef).then((verifiedUserSnapshot) => {
        if (verifiedUserSnapshot.exists()) {
            const verifiedUsers = verifiedUserSnapshot.val();
            const userId = Object.keys(verifiedUsers).find(
                (key) => verifiedUsers[key].email === emailParam
            );

            if (userId) {
                // Update the OTP for that user in 'Accounts/VerifiedUserAccounts'
                const verifiedUserRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}/otp`);
                set(verifiedUserRef, generatedOTP)
                    .then(() => {
                        // Update your logic to send OTP via email here
                        sendOTP(emailParam, firstNameParam, generatedOTP)
                            .then(response => {
                                // Handle success (if needed)
                                console.log('OTP resent successfully for Accounts/VerifiedUserAccounts:', response);
                            })
                            .catch(error => {
                                // Handle error (if needed)
                                console.error('Error resending OTP for Accounts/VerifiedUserAccounts:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error updating OTP for Accounts/VerifiedUserAccounts:', error);
                    });
            }
        } else {
            console.error('No users found in the "Accounts/VerifiedUserAccounts" database');
        }
    });
}

// Add event listener to the resend button
const resendButton = document.getElementById('resend-button');
if (resendButton) {
    resendButton.addEventListener('click', resendOTP);
}
