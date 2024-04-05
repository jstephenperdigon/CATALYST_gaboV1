// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL: "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// Update the updateTable() function to fetch data from Firebase
function updateTable() {
  const reportsRef = ref(db, "GarbageBinControlNumber");
  onValue(reportsRef, (snapshot) => {
    const reportsData = snapshot.val();
    if (reportsData) {
      const reportsArray = Object.entries(reportsData).map(
        ([GCN, bins]) => ({ GCN, ...bins })
      );
      displayReportsTable(reportsArray);
    } else {
      displayReportsTable([]);
    }
  });
}


// Add this function to pre-populate the form with data
function populateFormWithData(data) {
    document.getElementById('GB1').value = data.FillLevel.GB1FillLevel || '';
    document.getElementById('GB1Flag').value = data.FillLevel.GB1Flag || '';
    document.getElementById('GB1QuotaFlag').value = data.FillLevel.GB1QuotaFlag || '';
    document.getElementById('GB1Status').value = data.FillLevel.GB1Status || '';

    // Populate other fields similarly for GB2 to GB4
    document.getElementById('GB2').value = data.FillLevel.GB2FillLevel || '';
    document.getElementById('GB2Flag').value = data.FillLevel.GB2Flag || '';
    document.getElementById('GB2QuotaFlag').value = data.FillLevel.GB2QuotaFlag || '';
    document.getElementById('GB2Status').value = data.FillLevel.GB2Status || '';

    document.getElementById('GB3').value = data.FillLevel.GB3FillLevel || '';
    document.getElementById('GB3Flag').value = data.FillLevel.GB3Flag || '';
    document.getElementById('GB3QuotaFlag').value = data.FillLevel.GB3QuotaFlag || '';
    document.getElementById('GB3Status').value = data.FillLevel.GB3Status || '';

    document.getElementById('GB4').value = data.FillLevel.GB4FillLevel || '';
    document.getElementById('GB4Flag').value = data.FillLevel.GB4Flag || '';
    document.getElementById('GB4QuotaFlag').value = data.FillLevel.GB4QuotaFlag || '';
    document.getElementById('GB4Status').value = data.FillLevel.GB4Status || '';

    // Populate password field
    document.getElementById('password').value = data.Password || '';

    // Populate user fields
    const user = data.Users.user1;
    document.getElementById('addressLine1').value = user.addressLine1 || '';
    document.getElementById('addressLine2').value = user.addressLine2 || '';
    document.getElementById('barangay').value = user.barangay || '';
    document.getElementById('city').value = user.city || '';
    document.getElementById('district').value = user.district || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('firstname').value = user.firstName || '';
    document.getElementById('lastname').value = user.lastName || '';
    document.getElementById('mobilenumber').value = user.mobileNumber || '';
    document.getElementById('province').value = user.province || '';
}

// Call the function to populate the form when the page loads
window.onload = function() {
    // Assuming you have retrieved the data from Firebase and stored it in a variable called 'binData'
    // Replace 'binData' with your actual data object
    populateFormWithData(binData);
};

// Function to handle form submission for updating data
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect data from form fields
    const updatedData = {
        FillLevel: {
            GB1FillLevel: document.getElementById('GB1').value || '',
            GB1Flag: document.getElementById('GB1Flag').value || '',
            GB1QuotaFlag: document.getElementById('GB1QuotaFlag').value || '',
            GB1Status: document.getElementById('GB1Status').value || '',

            GB2FillLevel: document.getElementById('GB2').value || '',
            GB2Flag: document.getElementById('GB2Flag').value || '',
            GB2QuotaFlag: document.getElementById('GB2QuotaFlag').value || '',
            GB2Status: document.getElementById('GB2Status').value || '',

            GB3FillLevel: document.getElementById('GB3').value || '',
            GB3Flag: document.getElementById('GB3Flag').value || '',
            GB3QuotaFlag: document.getElementById('GB3QuotaFlag').value || '',
            GB3Status: document.getElementById('GB3Status').value || '',

            GB4illLevel: document.getElementById('GB4').value || '',
            GB4Flag: document.getElementById('GB4Flag').value || '',
            GB4QuotaFlag: document.getElementById('GB4QuotaFlag').value || '',
            GB4Status: document.getElementById('GB4Status').value || '',

        },
        Password: document.getElementById('password').value || '',
        Users: {
            user1: {
                addressLine1: document.getElementById('addressLine1').value || '',
                addressLine2: document.getElementById('addressLine2').value || '',
                barangay: document.getElementById('barangay').value || '',
                city: document.getElementById('city').value || '',
                district: document.getElementById('district').value || '',
                email: document.getElementById('email').value || '',
                firstName: document.getElementById('firstname').value || '',
                lastName: document.getElementById('lastname').value || '',
                mobileNumber: document.getElementById('mobilenumber').value || '',
                province: document.getElementById('province').value || '',
            }
        }
    };

    // Call your updateDataInFirebase function to update the data in Firebase with the updatedData object
    updateDataInFirebase(updatedData);
}

// Attach event listener to form submission
document.getElementById('data').addEventListener('submit', handleSubmit);

// Retrieve data from Firebase and populate the form
function populateFormFromDatabase() {
  get(binRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const binData = snapshot.val();
        populateFormWithData(binData);
      } else {
        console.error("Snapshot does not exist.");
        // Optionally, handle the case where the snapshot does not exist
        // Display a message to the user or clear the form fields
      }
    })
    .catch((error) => {
      console.error("Error fetching data from Firebase: ", error);
    });
}

// Call the function to populate the form when the page loads
window.onload = populateFormFromDatabase;

// Function to update data in Firebase
function updateDataInFirebase(dataToUpdate) {
  update(binRef, dataToUpdate)
    .then(() => {
      console.log("Data updated successfully.");
      // Optionally, perform any actions after data is updated
    })
    .catch((error) => {
      console.error("Error updating data in Firebase: ", error);
    });
}


