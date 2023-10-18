// ++++++++++++++++++++++++++++++++++++++FIREBASE CONFIG STARTS HERE+++++++++++++++++++++++++++++++++++++++
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
    import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "AIzaSyDe0Zqpdy7oyxdKxEAWn1JhGjJvnZHldyc",
    authDomain: "gabov1-687d4.firebaseapp.com",
    projectId: "gabov1-687d4",
    storageBucket: "gabov1-687d4.appspot.com",
    messagingSenderId: "1093985183180",
    appId: "1:1093985183180:web:0fc81721634d413c426969",
    measurementId: "G-H9BRLBF3MQ"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);
    // CONFIGURATION FOR Database
    const accountCollection = collection(db, "Account");
// ++++++++++++++++++++++++++++++++++++++FIREBASE CONFIG STARTS HERE+++++++++++++++++++++++++++++++++++++++

    // ++++++++++++++++++++++++++++++++++++++FUNCTIONS STARTS HERE+++++++++++++++++++++++++++++++++++++++
    // Get the ul element to display the account data
const accountDataContainer = document.getElementById("account-data-container");

// Function to fetch and display user account data
async function displayAccountData() {
  // Query the Firestore collection
  const querySnapshot = await getDocs(accountCollection);

  // Clear existing list items
  accountDataContainer.innerHTML = "";

  // Loop through the documents and display the data
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const listItem = document.createElement("li");

    listItem.textContent = `Username: ${data.username}, Password: ${data.password}`;
    accountDataContainer.appendChild(listItem);
  });
}

// Call the function to display account data
displayAccountData();

    



