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

// Resend OTP function for Users
function resendOTPForUsers(emailParam, firstNameParam) {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);

    // Get a reference to the user in the database based on their email
    const usersRef = ref(db, 'Accounts/Users');
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            const userId = Object.keys(users).find(
                (key) => users[key].email === emailParam
            );

            if (userId) {
                // Update the OTP for that user
                const userRef = ref(db, `Accounts/Users/${userId}/otp`);
                set(userRef, generatedOTP)
                    .then(() => {
                        // Update your logic to send OTP via email here
                        sendOTP(emailParam, firstNameParam, generatedOTP)
                            .then(response => {
                                // Handle success (if needed)
                                console.log('OTP resent successfully for Users:', response);
                            })
                            .catch(error => {
                                // Handle error (if needed)
                                console.error('Error resending OTP for Users:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error updating OTP for Users:', error);
                    });
            } else {
                console.error('User not found with the given email for Users:', emailParam);
            }
        } else {
            console.error('No users found in the database for Users');
        }
    });
}

// Resend OTP function for VerifiedUserAccounts
function resendOTPForVerifiedUserAccounts(emailParam, firstNameParam) {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);

    // Get a reference to the user in the database based on their email
    const verifiedUsersRef = ref(db, 'Accounts/VerifiedUserAccounts');
    get(verifiedUsersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            const userId = Object.keys(users).find(
                (key) => users[key].email === emailParam
            );

            if (userId) {
                // Update the OTP for that user
                const userRef = ref(db, `Accounts/VerifiedUserAccounts/${userId}/otp`);
                set(userRef, generatedOTP)
                    .then(() => {
                        // Update your logic to send OTP via email here
                        sendOTP(emailParam, firstNameParam, generatedOTP)
                            .then(response => {
                                // Handle success (if needed)
                                console.log('OTP resent successfully for VerifiedUserAccounts:', response);
                            })
                            .catch(error => {
                                // Handle error (if needed)
                                console.error('Error resending OTP for VerifiedUserAccounts:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error updating OTP for VerifiedUserAccounts:', error);
                    });
            } else {
                console.error('User not found with the given email for VerifiedUserAccounts:', emailParam);
            }
        } else {
            console.error('No users found in the database for VerifiedUserAccounts');
        }
    });
}

// Add event listener to the resend button
const resendButton = document.getElementById('resend-button');
if (resendButton) {
    resendButton.addEventListener('click', () => {
        const emailParam = new URLSearchParams(window.location.search).get('email');
        const firstNameParam = new URLSearchParams(window.location.search).get('firstname');
        
        // Call both functions
        resendOTPForUsers(emailParam, firstNameParam);
        resendOTPForVerifiedUserAccounts(emailParam, firstNameParam);
    });
}
