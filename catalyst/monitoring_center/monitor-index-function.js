import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.initMap = function () {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.769692648299028, lng: 121.07431573155776 },
    zoom: 18,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  const infowindow = new google.maps.InfoWindow();

  const binsRef = ref(db, "GarbageBinControlNumber");
  get(binsRef).then((snapshot) => {
    snapshot.forEach((binSnapshot) => {
      const garbageBinControlNumber = binSnapshot.key;
      const binData = binSnapshot.val();

      // Check if Location object and its properties exist
      if (
        binData &&
        binData.Location &&
        binData.Location.Latitude &&
        binData.Location.Longitude
      ) {
        const marker = new google.maps.Marker({
          position: {
            lat: binData.Location.Latitude,
            lng: binData.Location.Longitude,
          },
          map: map,
          title: garbageBinControlNumber,
        });

        // Set the custom image as the icon for the Google Maps marker
        marker.setIcon({
          url: "../img/bx-radio-circle-marked.svg", // Replace with the actual path to your image
          scaledSize: new google.maps.Size(30, 30), // Adjust the size as needed
        });

        const contentString = `<div>
                                  <p>Garbage Bin Control Number: ${garbageBinControlNumber}</p>
                                  <p>OWNER (GCN001): "Yra Shane Fontanilla"</p>
                                </div>`;

        marker.addListener("click", () => {
          // Zoom the map when a marker is clicked
          map.setZoom(20); // Adjust the zoom level as needed
          map.setCenter(marker.getPosition());

          infowindow.setContent(contentString);
          infowindow.open(map, marker);
        });
      } else {
        console.error(
          `Invalid data for Garbage Bin Control Number: ${garbageBinControlNumber}`
        );
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  initMap();
});
