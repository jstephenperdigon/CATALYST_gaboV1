import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
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
var map;

const centerMap = {
  lat: 14.766794722678402,
  lng: 121.03637727931373,
};
const mapOptions = {
  center: centerMap,
  zoom: 13,
  disableDefaultUI: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: 36,
        },
        {
          color: "#000000",
        },
        {
          lightness: 40,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#000000",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
        {
          weight: 1.2,
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 29,
        },
        {
          weight: 0.2,
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 18,
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 19,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
        {
          lightness: 17,
        },
      ],
    },
  ],
};

// Retrieve userId from sessionStorage
const userId = sessionStorage.getItem("userId");

// Update the welcome message with the userId
if (userId) {
  document.getElementById("welcome-message").innerText = `Welcome, ${userId}!`;
}

// Logout function
function logout() {
  // Retrieve the user ID from the session
  const userId = sessionStorage.getItem("userId");

  if (userId) {
    // Clear the user ID from the session
    sessionStorage.removeItem("userId");

    // Get a reference to the user status field in the database
    const userStatusRef = ref(db, `Accounts/Monitoring/${userId}/status`);

    // Set the user status to null (remove the "LoggedIn" status)
    set(userStatusRef, null)
      .then(() => {
        // Redirect to the sign-in page after successfully removing the status
        window.location.href = "monitor-indexSI.html";
      })
      .catch((error) => {
        console.error("Error removing user status:", error);
      });
  } else {
    // If there is no user ID in the session, just redirect to the sign-in page
    window.location.href = "monitor-indexSI.html";
  }
}

// Attach the logout function to the click event of the "SignOut" link
document.getElementById("signOut").addEventListener("click", logout);

// Function to format timestamp
function formatTimestamp(timestamp) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(timestamp).toLocaleDateString("en-US", options);
}

// Function to initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById("map1"), mapOptions);

  const infowindow = new google.maps.InfoWindow();

  const binsRef = ref(db, "GarbageBinControlNumber");

  const markers = {};

  // Listen for changes in the data
  onValue(binsRef, (snapshot) => {
    snapshot.forEach((binSnapshot) => {
      const garbageBinControlNumber = binSnapshot.key;
      const binData = binSnapshot.val();

      // Check if Location object and its properties exist
      if (
        binData &&
        binData.DeviceStatus &&
        binData.FillLevel &&
        binData.FillLevel.GB1FillLevel &&
        binData.FillLevel.GB2FillLevel &&
        binData.FillLevel.GB3FillLevel &&
        binData.FillLevel.GB4FillLevel
      ) {
        if (markers[garbageBinControlNumber]) {
          // If the marker already exists, update its position
          markers[garbageBinControlNumber].setPosition({
            lat: binData.Location.Latitude,
            lng: binData.Location.Longitude,
          });
        } else {
          // If the marker doesn't exist, create a new one
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

          markers[garbageBinControlNumber] = marker;

          // Dynamically generate contentString based on data structure
          const contentString = `<div>
            <p>Garbage Bin Control Number: ${garbageBinControlNumber}</p>
            <p>Status: ${binData.DeviceStatus}</p>
            <p>Fill Level:</p>
            <p>   -Special Waste Bin: ${binData.FillLevel.GB1FillLevel.GB1}% | ${binData.FillLevel.GB1FillLevel.GB1Status}</p>
            <p>   -Hazardous Waste Bin: ${binData.FillLevel.GB2FillLevel.GB2}% | ${binData.FillLevel.GB2FillLevel.GB2Status}</p>
            <p>   -Biodegradable Waste Bin: ${binData.FillLevel.GB3FillLevel.GB3}% | ${binData.FillLevel.GB3FillLevel.GB3Status}</p>
            <p>   -Non-Biodegradable Waste Bin: ${binData.FillLevel.GB4FillLevel.GB4}% | ${binData.FillLevel.GB4FillLevel.GB4Status}</p>
          </div>`;

          marker.addListener("click", () => {
            // Zoom the map when a marker is clicked
            map.setZoom(20); // Adjust the zoom level as needed
            map.setCenter(marker.getPosition());

            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          });
        }
      } else {
        console.error(
          `Invalid data for Garbage Bin Control Number: ${garbageBinControlNumber}`
        );
      }
    });
  });
}

// Your existing event listener
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map and fetch reports
  initMap();
});

// Function to append reports to the notification content
function displayAllReportsInNotification(database) {
  const notificationContent = document.getElementById("notificationContent");

  // Clear previous content
  notificationContent.innerHTML = "";

  // Check if the database is not empty
  if (database && Object.keys(database).length > 0) {
    // Loop through each garbage bin in the database
    Object.entries(database).forEach(([garbageBinControlNumber, binData]) => {
      // Check if the garbage bin has reports
      if (binData.reports && Object.keys(binData.reports).length > 0) {
        // Sort reports by timestamp in descending order
        const sortedReports = Object.values(binData.reports).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Loop through each sorted report and create HTML elements
        sortedReports.forEach((report) => {
          // Create a div for each report
          const reportDiv = document.createElement("div");
          reportDiv.className = "report";

          // Create HTML content for the report
          reportDiv.innerHTML = `
            <div>
              <p>Garbage Bin Control Number: ${garbageBinControlNumber}</p>
              <p>Report Title: ${report.title}</p>
              <p>Report Message: ${report.message}</p>
              <p>Timestamp: ${formatTimestamp(report.timestamp)}</p>
              <hr>
            </div>
          `;

          // Append the report div to the notification content
          notificationContent.appendChild(reportDiv);
        });
      }
    });
  } else {
    // If there are no reports, display a message
    notificationContent.innerHTML = "<p>No reports available</p>";
  }
}
