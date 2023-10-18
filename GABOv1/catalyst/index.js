// Import/s here
import { db, getDocs, addDoc, collection } from "./connection/firebaseConfig.js";

// CONFIGURATION FOR Database
    const accountCollection = collection(db, "Account");


  // ++++++++++++++++++++++++++++++++++++++FUNCTIONS STARTS HERE+++++++++++++++++++++++++++++++++++++++
  // Function to fetch and display all user accounts
  async function displayUserAccounts() {
    const querySnapshot = await getDocs(accountCollection);
    const userAccounts = [];

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        userAccounts.push(`Username: ${data.username}, Password: ${data.password}`);
    });

    const userAccountsDiv = document.getElementById("userAccounts");
    userAccountsDiv.innerHTML = userAccounts.join("<br>");
  }

  document.getElementById("addUserForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Add the username and password to Firestore
    addDoc(accountCollection, {
        username: username,
        password: password
    })
    .then(function (docRef) {
        console.log("User account added successfully.");
        document.getElementById("addUserForm").reset();

        // Display all user accounts
        displayUserAccounts();
    })
    .catch(function (error) {
        console.error("Error adding user account: ", error);
    });
  });

  // Call the function to display user accounts on page load
  displayUserAccounts();
      



