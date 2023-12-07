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

const forgotPasswordForm = document.getElementById('forgotPasswordForm');

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value;

    // Check if the email exists in "Accounts/VerifiedUserAccounts"
    const verifiedUserAccountsRef = ref(db, 'Accounts/VerifiedUserAccounts');
    const verifiedUserAccountsSnapshot = await get(verifiedUserAccountsRef);

    if (verifiedUserAccountsSnapshot.exists()) {
        const verifiedUserAccounts = verifiedUserAccountsSnapshot.val();

        // Check if the email exists in any of the verified user accounts
        const verifiedEmailExists = Object.entries(verifiedUserAccounts).find(([userId, user]) => user.email === email);

        if (verifiedEmailExists) {
            const [userId, user] = verifiedEmailExists;

            // Generate a random 6-digit OTP
            const generatedOTP = Math.floor(100000 + Math.random() * 900000);

            // Set the OTP in the database
            const otpData = {
                otp: generatedOTP,
            };

            // Store email and generatedOTP in localStorage
            localStorage.setItem('signupEmail', email);
            localStorage.setItem('generatedOTP', generatedOTP);

            // Send OTP via email
            sendOTP(email, user.firstName, generatedOTP)
                .then((response) => {
                    console.log('OTP sent successfully:', response);

                    // Update the user data with the generated OTP
                    const updatedUser = { ...user, otp: generatedOTP };
                    update(ref(db, `Accounts/VerifiedUserAccounts/${userId}`), updatedUser);

                    // Redirect to otp.html
                    localStorage.removeItem('signupEmail');
                    localStorage.removeItem('generatedOTP');
                    window.location.href = `forgotOtp.html?email=${encodeURIComponent(email)}`;
                })
                .catch((error) => {
                    console.error('Error sending OTP:', error);
                });
        } else {
            console.log('Email does not exist in "Accounts/VerifiedUserAccounts"');
            // Add your logic here for handling the case where the email does not exist
        }
    }

    // Check if the email exists in "Accounts/Users"
    const usersRef = ref(db, 'Accounts/Users');
    const usersSnapshot = await get(usersRef);

    if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();

        // Check if the email exists in any of the user accounts
        const userEmailExists = Object.entries(users).find(([userId, user]) => user.email === email);

        if (userEmailExists) {
            const [userId, user] = userEmailExists;

            // Generate a random 6-digit OTP
            const generatedOTP = Math.floor(100000 + Math.random() * 900000);

            // Set the OTP in the database
            const otpData = {
                otp: generatedOTP,
            };

            // Store email and generatedOTP in localStorage
            localStorage.setItem('signupEmail', email);
            localStorage.setItem('generatedOTP', generatedOTP);

            // Send OTP via email
            sendOTP(email, user.firstName, generatedOTP)
                .then((response) => {
                    console.log('OTP sent successfully:', response);

                    // Update the user data with the generated OTP
                    const updatedUser = { ...user, otp: generatedOTP };
                    update(ref(db, `Accounts/Users/${userId}`), updatedUser);

                    // Redirect to otp.html
                    localStorage.removeItem('signupEmail');
                    localStorage.removeItem('generatedOTP');
                    window.location.href = `forgotOtp.html?email=${encodeURIComponent(email)}`;
                })
                .catch((error) => {
                    console.error('Error sending OTP:', error);
                });
        } else {
            console.log('Email does not exist in "Accounts/Users"');
            // Add your logic here for handling the case where the email does not exist
        }
    }
});
