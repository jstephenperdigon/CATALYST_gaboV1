import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL:
    "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to create an account and add it to the database
function createAccount() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status").value;
  const usertype = document.getElementById("usertype").value;

  if (username && password) {
    const userRef = ref(db, `Accounts/${usertype}`);
    const newAccountRef = push(userRef);
    const uid = newAccountRef.key; // Get the automatically generated UID

    set(userRef, {
      uid: uid,
      username: username,
      status: status,
      password: password,
      usertype: usertype,
    })
      .then(() => {
        console.log("Account created successfully");
        // You can add further actions here, such as showing a success message to the user
      })
      .catch((error) => {
        console.error("Error creating account: ", error);
        // You can add error handling here, such as showing an error message to the user
      });
  } else {
    console.error("Username and password are required");
    // You can add handling for missing username or password here
  }
}

// Attach the createAccount function to the button click event
document
  .getElementById("createAccountBtn")
  .addEventListener("click", createAccount);
