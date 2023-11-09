import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

    // Function to handle login
function handleLogin(email, password) {
    // Replace the following lines with your actual authentication logic
    // For demonstration, we fetch data from the 'users' node in the database
    const userRef = ref(db, 'users/' + email);
  
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          alert("Login successful!");
        } else {
          alert("Invalid email or password. Please try again.");
        }
      } else {
        alert("User not found. Please sign up.");
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }
  
  // Login Function
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("typeEmailX");
    const passwordInput = document.getElementById("typePasswordX");
    const signInButton = document.querySelector(".btn-primary");
  
    signInButton.addEventListener("click", function () {
      const email = emailInput.value;
      const password = passwordInput.value;
  
      handleLogin(email, password);
    });
  });