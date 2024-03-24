import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

// Function to show the modal
async function showModal() {
    const selectedDescriptions = document.getElementById("selectedMarkers").querySelector("p:nth-child(1)").innerText.split(":")[1].trim();
    const selectedBarangay = document.getElementById("selectedMarkers").querySelector("p:nth-child(2)").innerText.split(":")[1].trim();
    const selectedDistrict = document.getElementById("selectedMarkers").querySelector("p:nth-child(3)").innerText.split(":")[1].trim();
    const selectedTotalQuota = document.getElementById("selectedMarkers").querySelector("p:nth-child(4)").innerText.split(":")[1].trim();

    // Update modal content with selected information
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = `
    <span class="close">&times;</span>
    <p>Selected GCN: ${selectedDescriptions}</p>
    <p>Barangay: ${selectedBarangay}</p>
    <p>District: ${selectedDistrict}</p>
    <p>Total Quota: ${selectedTotalQuota}</p>
    <label for="date">Date:</label>
    <input type="date" id="date" name="date">
    <br><br>
    <label for="time">Time:</label>
    <input type="time" id="time" name="time">
    <br><br>
    <label for="collector">Available Collector:</label>
    <select id="collector" name="collector">
      <!-- Collector options will be populated dynamically -->
    </select>
  `;

    // Fetch collectors data from Firebase Realtime Database
    const collectorsRef = child(ref(db), 'Accounts/Collectors');
    const snapshot = await get(collectorsRef);

    if (snapshot.exists()) {
        const collectors = snapshot.val();
        const collectorDropdown = document.getElementById('collector');

        // Filter collectors based on assigned area
        const matchingCollectors = Object.entries(collectors).filter(([collectorId, collectorData]) => {
            return collectorData.AssignedArea.barangay === selectedBarangay && collectorData.AssignedArea.district === selectedDistrict;
        });

        // Populate collector dropdown with matching collectors
        matchingCollectors.forEach(([collectorId, collectorData]) => {
            const option = document.createElement('option');
            option.value = collectorId;
            option.textContent = collectorData.GCL;
            collectorDropdown.appendChild(option);
        });
    }

    // Display the modal
    const modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Attach event listener to close button
    document.getElementsByClassName("close")[0].addEventListener("click", hideModal);
}

// Function to hide the modal
function hideModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Further Action button event listener
document.getElementById("furtherActionBtn").addEventListener("click", showModal);

// Close modal when clicking outside the modal
window.addEventListener("click", function (event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        hideModal();
    }
});
