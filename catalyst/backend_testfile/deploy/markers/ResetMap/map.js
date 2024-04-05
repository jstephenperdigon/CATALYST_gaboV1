import { db, ref, onValue } from "./firebaseConfig.js"; // Import Firebase database utilities

// Define an array to store all markers
let markers = [];

// Function to fetch data from Firebase and display markers on the map
function displayMarkersOnMap(map) {
  // Reference to the GarbageBinControlNumber node in the database
  const garbageBinRef = ref(db, "GarbageBinControlNumber");
  const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

  // Fetch data from Firebase in real-time
  onValue(garbageBinRef, (snapshot) => {
    const data = snapshot.val(); // Get the data from the snapshot

    // Loop through each garbage bin in the data
    for (const gcnKey in data) {
      const location = data[gcnKey]?.Location; // Get the location object
      const totalQuota = data[gcnKey]?.TotalQuota; // Get total quota
      const gb1QuotaCount =
        data[gcnKey]?.FillLevel?.GB1FillLevel?.GB1QuotaCount;
      const gb2QuotaCount =
        data[gcnKey]?.FillLevel?.GB2FillLevel?.GB2QuotaCount;
      const gb3QuotaCount =
        data[gcnKey]?.FillLevel?.GB3FillLevel?.GB3QuotaCount;
      const gb4QuotaCount =
        data[gcnKey]?.FillLevel?.GB4FillLevel?.GB4QuotaCount;

      // Check if Users object exists and has at least one user
      const users = data[gcnKey]?.Users;
      const firstUserId = users ? Object.keys(users)[0] : null;
      const district = firstUserId ? users[firstUserId]?.district : "";
      const barangay = firstUserId ? users[firstUserId]?.barangay : "";

      // Extract numerical parts from district and barangay values
      const districtNumeric = district ? district.match(/\d+/) : null;
      const barangayNumeric = barangay ? barangay.match(/\d+/) : null;

      // Condition to display markers only if totalQuota is 4 or above
      if (location && totalQuota >= 4) {
        const latitude = location.Latitude;
        const longitude = location.Longitude;

        // Check if marker already exists
        let existingMarker = markers.find((marker) => marker.title === gcnKey);

        if (existingMarker) {
          // If marker exists, update its position and info window content
          existingMarker.setPosition({ lat: latitude, lng: longitude });
          existingMarker.infoWindow.setContent(
            `<div>
              <h2>GCN: ${gcnKey}</h2>
              <p>District: ${districtNumeric}</p>
              <p>Barangay: ${barangayNumeric}</p>
              <p>Total Quota: ${totalQuota}</p>
              <p>Recyclables: ${gb1QuotaCount !== undefined ? gb1QuotaCount : "none"
            }</p>
              <p>Biodegradable: ${gb2QuotaCount !== undefined ? gb2QuotaCount : "none"
            }</p>
              <p>Special: ${gb3QuotaCount !== undefined ? gb3QuotaCount : "none"
            }</p>
              <p>Non-Biodegradable: ${gb4QuotaCount !== undefined ? gb4QuotaCount : "none"
            }</p>
            </div>`
          );
        } else {
          // Create a new marker if it doesn't exist
          const marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: gcnKey,
            icon: defaultIcon,
          });

          // Create info window for the new marker
          marker.infoWindow = new google.maps.InfoWindow({
            content: `<div>
                        <h2>GCN: ${gcnKey}</h2>
                        <p>District: ${districtNumeric}</p>
                        <p>Barangay: ${barangayNumeric}</p>
                        <p>Total Quota: ${totalQuota}</p>
                        <p>Recyclables: ${gb1QuotaCount !== undefined ? gb1QuotaCount : "none"
              }</p>
                        <p>Biodegradable: ${gb2QuotaCount !== undefined ? gb2QuotaCount : "none"
              }</p>
                        <p>Special: ${gb3QuotaCount !== undefined ? gb3QuotaCount : "none"
              }</p>
                        <p>Non-Biodegradable: ${gb4QuotaCount !== undefined ? gb4QuotaCount : "none"
              }</p>
                      </div>`,
          });

          // Add click event listener to marker to open info window
          marker.addListener("click", () => {
            marker.infoWindow.open(map, marker);
          });

          // Push the new marker to the markers array
          markers.push(marker);
        }
      } else {
        // If marker exists but doesn't meet the condition, remove it from the map
        let existingMarkerIndex = markers.findIndex(
          (marker) => marker.title === gcnKey
        );
        if (existingMarkerIndex !== -1) {
          markers[existingMarkerIndex].setMap(null);
          markers.splice(existingMarkerIndex, 1);
        }
      }
    }
  });
}

// Function to display all markers on the map
function showAllMarkers(map) {
  markers.forEach((marker) => {
    const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    marker.setIcon(defaultIcon);
    marker.setMap(map);
  });
}

// Function to enable/disable barangay dropdown based on district dropdown selection
function toggleBarangayDropdown() {
  const districtDropdown = document.getElementById("district");
  const barangayDropdown = document.getElementById("barangay");

  // Define the barangay options based on the selected district
  const barangayOptions = {
    1: ["1", "3", "5", "168", "176", "177"],
    2: ["2", "7", "9"],
    3: ["4", "6", "8"],
  };

  // Get the selected district value
  const selectedDistrict = districtDropdown.value;

  // Clear existing options in the barangay dropdown
  barangayDropdown.innerHTML =
    "<option value='' selected disabled>Select Barangay</option>";

  // If a district is selected, populate the barangay dropdown with corresponding options and enable it
  if (selectedDistrict !== "") {
    barangayOptions[selectedDistrict].forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.text = barangay;
      barangayDropdown.appendChild(option);
    });
    barangayDropdown.disabled = false;
  } else {
    // If no district is selected, disable the barangay dropdown
    barangayDropdown.disabled = true;
  }
}

function removeMarkersNotMatchingSelection(selectedDistrict, selectedBarangay) {
  // Filter markers based on selected district and barangay
  const filteredMarkers = markers.filter((marker) => {
    const district = marker.infoWindow.content.match(/District: (\d+)/);
    const barangay = marker.infoWindow.content.match(/Barangay: (\d+)/);

    return (
      district &&
      barangay &&
      district[1] === selectedDistrict &&
      barangay[1] === selectedBarangay
    );
  });

  // Remove markers that don't match the selected district and barangay
  markers.forEach((marker) => {
    if (!filteredMarkers.includes(marker)) {
      marker.setMap(null); // Remove marker from the map
    }
  });
}

// Function to reset the status of dropdowns, select button, and cancel button
function resetMapSelection() {
  const districtDropdown = document.getElementById("district");
  const barangayDropdown = document.getElementById("barangay");
  const selectButton = document.getElementById("selectButton");
  const cancelButton = document.getElementById("cancelButton");

  // Reset dropdowns to initial state
  districtDropdown.selectedIndex = 0;
  districtDropdown.disabled = false;
  barangayDropdown.innerHTML =
    "<option value='' selected disabled>Select Barangay</option>";
  barangayDropdown.disabled = true;

  // Reset buttons to initial state
  selectButton.disabled = true;
  cancelButton.disabled = true;
}

// Function to move the map to new coordinates
function moveMapToCoordinates(map, lat, lng) {
  const newCenter = { lat: lat, lng: lng };
  map.setCenter(newCenter);
}

// Function to populate Available Collector dropdown based on selected district and barangay
function populateCollectorDropdown(selectedDistrict, selectedBarangay) {
  const dropdownCollector = document.getElementById("dropdownCollector");

  // Clear existing options
  dropdownCollector.innerHTML = '<option value="" selected disabled>Select Collector</option>';

  // Query Firebase Database for collectors with matching assigned area
  const collectorsRef = ref(db, "Accounts/Collectors");
  onValue(collectorsRef, (snapshot) => {
    const collectors = snapshot.val();

    // Iterate over collectors to find matching ones
    for (const userId in collectors) {
      const collector = collectors[userId];
      const assignedArea = collector.AssignedArea;

      // Check if assigned district and barangay match selected values
      if (assignedArea && assignedArea.district == selectedDistrict && assignedArea.barangay == selectedBarangay) {
        const gcl = collector.GCL;

        // Create new option element for the dropdown
        const option = document.createElement("option");
        option.value = gcl;
        option.textContent = gcl;

        // Append option to dropdown
        dropdownCollector.appendChild(option);
      }
    }
  });
}



// Export the initMap function
export function initMap() {
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

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  // Call function to display markers on the map
  displayMarkersOnMap(map);

  // Add event listener to reset button
  const resetButton = document.getElementById("cancelButton");
  resetButton.addEventListener("click", function () {
    resetMapSelection();

    showAllMarkers(map);

    const selectedMarkersDiv = document.getElementById("selectedMarkers");
    selectedMarkersDiv.innerHTML = "";

    const additionalFieldsDiv = document.getElementById("additionalFields");
    additionalFieldsDiv.style.display = "none";

    const dateInputField = document.getElementById("dateInputField");
    dateInputField.value = '';

    const timeInputField = document.getElementById("timeInputField");
    timeInputField.value = '';

    const dropdownCollector = document.getElementById("dropdownCollector");
    dropdownCollector.selectedIndex = 0;
  });


  let highLatitude;
  let highLongitude;

  function updateSelectedMarkers(
    selectedGCNs,
    selectedDistrict,
    selectedBarangay,
    totalQuotaSum,
    gb1QuotaSum,
    gb2QuotaSum,
    gb3QuotaSum,
    gb4QuotaSum
  ) {
    const selectedMarkersDiv = document.getElementById("selectedMarkers");
    let message = "";

    if (totalQuotaSum <= 44) {
      message = "Not enough to meet the requirements";
    } else if (totalQuotaSum >= 45 && totalQuotaSum <= 50) {
      message = "Valid Requirement";
      // Show the deploy button
    } else {
      message = "Too much, invalid requirement";
    }

    selectedMarkersDiv.innerHTML = `
    <p>Selected GCN: ${selectedGCNs.join(", ")}</p>
    <p>District: ${selectedDistrict}</p>
    <p>Barangay: ${selectedBarangay}</p>
    <p>Total Quota: ${totalQuotaSum}</p>
    <p>Recyclables: ${gb1QuotaSum}</p>
    <p>Biodegradable: ${gb2QuotaSum}</p>
    <p>Special: ${gb3QuotaSum}</p>
    <p>Non-Biodegradable: ${gb4QuotaSum}</p>
    <p>${message}</p>
  `;

    const additionalFieldsDiv = document.getElementById("additionalFields");

    // Toggle visibility of additional fields based on the message
    if (message === "Valid Requirement") {
      additionalFieldsDiv.style.display = "block"; // Show the additional fields
    } else {
      additionalFieldsDiv.style.display = "none"; // Hide the additional fields
    }
  }

  // Function to enable/disable select button based on barangay dropdown selection
  function toggleSelectButton() {
    const districtDropdown = document.getElementById("district");
    const barangayDropdown = document.getElementById("barangay");
    const selectButton = document.getElementById("selectButton");
    const cancelButton = document.getElementById("cancelButton");

    // Get the selected barangay value
    const selectedBarangay = barangayDropdown.value;

    // Enable select button if a valid barangay is selected
    selectButton.disabled = selectedBarangay === "";

    // Add event listener to select button only if it's not added before
    if (!selectButton.hasEventListener) {
      selectButton.hasEventListener = true; // Mark the button to indicate the event listener is added
      selectButton.addEventListener("click", () => {
        const selectedDistrict = districtDropdown.value;
        const selectedBarangay = barangayDropdown.value;

        populateCollectorDropdown(selectedDistrict, selectedBarangay);

        // Filter markers based on selected district and barangay
        const filteredMarkers = markers.filter((marker) => {
          const district = marker.infoWindow.content.match(/District: (\d+)/);
          const barangay = marker.infoWindow.content.match(/Barangay: (\d+)/);

          return (
            district &&
            barangay &&
            district[1] === selectedDistrict &&
            barangay[1] === selectedBarangay
          );
        });

        // Remove markers not matching the selected district and barangay
        removeMarkersNotMatchingSelection(selectedDistrict, selectedBarangay);

        // Sort filtered markers by highest total quota
        filteredMarkers.sort((a, b) => {
          const totalQuotaA = parseInt(
            a.infoWindow.content.match(/Total Quota: (\d+)/)[1]
          );
          const totalQuotaB = parseInt(
            b.infoWindow.content.match(/Total Quota: (\d+)/)[1]
          );
          return totalQuotaB - totalQuotaA;
        });

        // Accumulate details of matching markers while considering the limit
        let selectedGCNs = [];
        let totalQuotaSum = 0;
        let gb1QuotaSum = 0;
        let gb2QuotaSum = 0; // Initialize gb2QuotaSum
        let gb3QuotaSum = 0; // Initialize gb3QuotaSum
        let gb4QuotaSum = 0; // Initialize gb4QuotaSum
        for (const marker of filteredMarkers) {
          const gcn = marker.infoWindow.content.match(/GCN: (.+?)</)[1];
          const totalQuota = parseInt(
            marker.infoWindow.content.match(/Total Quota: (\d+)/)[1]
          );
          const gb1QuotaCount = parseInt(
            marker.infoWindow.content.match(/Recyclables: (\d+)/)?.[1] || 0
          );
          const gb2QuotaCount = parseInt(
            marker.infoWindow.content.match(/Biodegradable: (\d+)/)?.[1] || 0
          );
          const gb3QuotaCount = parseInt(
            marker.infoWindow.content.match(/Special: (\d+)/)?.[1] || 0
          );
          const gb4QuotaCount = parseInt(
            marker.infoWindow.content.match(/Non-Biodegradable: (\d+)/)?.[1] ||
            0
          );

          // Check if adding this marker will exceed the limit
          if (totalQuotaSum + totalQuota <= 50) {
            selectedGCNs.push(gcn); // Add GCN to the selectedGCNs array
            totalQuotaSum += totalQuota;
            gb1QuotaSum += gb1QuotaCount; // Accumulate gb1QuotaCount
            gb2QuotaSum += gb2QuotaCount; // Accumulate gb2QuotaCount
            gb3QuotaSum += gb3QuotaCount; // Accumulate gb3QuotaCount
            gb4QuotaSum += gb4QuotaCount; // Accumulate gb4QuotaCount

            // If the total quota exceeds 50, break the loop
            if (totalQuotaSum > 50) break;
          }
        }

        // Change icon of all selected markers (GCNs)
        const blueDotIcon =
          "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        for (const marker of filteredMarkers) {
          const gcn = marker.infoWindow.content.match(/GCN: (.+?)</)[1];
          if (selectedGCNs.includes(gcn)) {
            marker.setIcon(blueDotIcon);
          }
        }

        // Update HTML display with the selected GCNs, district, barangay, total quota, and message
        updateSelectedMarkers(
          selectedGCNs,
          selectedDistrict,
          selectedBarangay,
          totalQuotaSum,
          gb1QuotaSum,
          gb2QuotaSum,
          gb3QuotaSum,
          gb4QuotaSum
        );

        // Print latitude and longitude of GCN with the highest total quota
        if (filteredMarkers.length > 0) {
          const highestQuotaMarker = filteredMarkers[0]; // Get the marker with the highest total quota
          const gcn =
            highestQuotaMarker.infoWindow.content.match(/GCN: (.+?)</);
          const highestQuotaMarkerlatitude = highestQuotaMarker
            .getPosition()
            .lat();
          const highestQuotaMarkerlongitude = highestQuotaMarker
            .getPosition()
            .lng();

          // Assign values to highLatitude and highLongitude
          highLatitude = highestQuotaMarkerlatitude;
          highLongitude = highestQuotaMarkerlongitude;
        } else {
          console.log("No markers matching the selection criteria found.");
        }

        // Disable the district and barangay dropdowns
        districtDropdown.disabled = true;
        barangayDropdown.disabled = true;

        // Disable itself
        selectButton.disabled = true;

        // Enable the cancel button
        cancelButton.disabled = false;

        const newLat = highLatitude;
        const newLng = highLongitude;
        moveMapToCoordinates(map, newLat, newLng);
      });
    }
  }

  // Add event listener to district dropdown
  document
    .getElementById("district")
    .addEventListener("change", toggleBarangayDropdown);

  // Add event listener to barangay dropdown
  document
    .getElementById("barangay")
    .addEventListener("change", toggleSelectButton);
}

// Make initMap accessible in the global scope
window.initMap = initMap;
