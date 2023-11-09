// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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
  
function checkControlNumberExists(controlNumber) {
    const gcnRef = ref(db, 'GarbageBinControlNumber');

    get(gcnRef)
        .then((snapshot) => {
            let gcnExists = false;
            snapshot.forEach((childSnapshot) => {
                const gcn = childSnapshot.val();
                if (gcn === controlNumber) {
                    gcnExists = true;
                }
            });

            if (gcnExists) {
                // GCN exists in the database
                alert("Control Number exists in the database");
            } else {
                // GCN does not exist in the database
                alert("Control Number does not exist in the database");
            }
        })
        .catch((error) => {
            alert("Error checking Control Number: " + error.message);
        });
}

// Event listener for the Check Control Number button
document.getElementById('checkControlNumber').addEventListener('click', function(event) {
    event.preventDefault();
    const controlNumber = document.getElementById('controlNumber').value;
    checkControlNumberExists(controlNumber);
});