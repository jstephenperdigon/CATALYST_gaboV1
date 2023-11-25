import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAsGSaps-o0KwXTF-5q3Z99knmyXPmSfU",
  authDomain: "smartgarbagebin-8c3ec.firebaseapp.com",
  databaseURL: "https://smartgarbagebin-8c3ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgarbagebin-8c3ec",
  storageBucket: "smartgarbagebin-8c3ec.appspot.com",
  messagingSenderId: "1062286948871",
  appId: "1:1062286948871:web:d62f6f620e010f8f22c8a2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.initMap = function () {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.769692648299028, lng: 121.07431573155776 },
    zoom: 18,
    disableDefaultUI: true,
  });

  // Fetch all Garbage Bin Control Numbers
  const binsRef = ref(db, 'GarbageBinControlNumber');
  get(binsRef).then((snapshot) => {
    snapshot.forEach((binSnapshot) => {
      const garbageBinControlNumber = binSnapshot.key;
      const binData = binSnapshot.val();

      // Create a custom marker content
      const contentString = `
        <div>
          <h3>${garbageBinControlNumber}</h3>
          <p>Status: ${binData.Status}</p>
          <p>Fill Level: ${binData.FillLevel}</p>
          <p>Address Line 1: ${binData.Users[Object.keys(binData.Users)[0]].addressLine1}</p>
          <p>Address Line 2: ${binData.Users[Object.keys(binData.Users)[0]].addressLine2}</p>
        </div>
      `;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      // Add a marker for each Garbage Bin Control Number
      const marker = new google.maps.Marker({
        position: {
          lat: binData.Location.Latitude,
          lng: binData.Location.Longitude,
        },
        map: map,
        title: garbageBinControlNumber,
      });

      // Open the info window when the marker is clicked
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  initMap();
});