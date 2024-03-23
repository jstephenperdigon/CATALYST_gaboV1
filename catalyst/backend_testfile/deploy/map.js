const centerMap = {
  lat: 14.769617915353559,
  lng: 121.07431904782344,
};
const mapOptions = {
  center: centerMap,
  zoom: 18,
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
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  const customMarkerUrl =
    "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

  // Populate Barangay dropdown based on the selected District
  const districtDropdown = document.getElementById("district");
  const barangayDropdown = document.getElementById("barangay");
  const selectBtn = document.getElementById("selectBtn"); // Get select button

  // Disable select button initially
  selectBtn.disabled = true;

  districtDropdown.addEventListener("change", function () {
    const district = this.value;
    let barangays = [];

    if (district === "1") {
      barangays = ["1", "4", "6", "7", "10"];
    } else if (district === "2") {
      barangays = ["2", "3", "5", "8", "11"];
    } else if (district === "3") {
      barangays = ["9", "12", "13", "14", "15"];
    }

    // Clear previous options
    barangayDropdown.innerHTML = "";

    // Add new options
    const selectOption = document.createElement("option");
    selectOption.value = "";
    selectOption.text = "Select";
    selectOption.disabled = true; // Disable the "Select" option
    selectOption.selected = true; // Make "Select" the default selected option
    barangayDropdown.appendChild(selectOption);

    barangays.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.text = `Barangay ${barangay}`;
      barangayDropdown.appendChild(option);
    });

    // Validate dropdowns after populating barangays
    validateDropdowns();
  });

  // Add event listener for barangay dropdown change
  barangayDropdown.addEventListener("change", validateDropdowns);

  // Function to validate dropdowns
  function validateDropdowns() {
    const districtValue = districtDropdown.value;
    const barangayValue = barangayDropdown.value;

    // Enable select button only if both dropdowns have valid values
    selectBtn.disabled = districtValue === "" || barangayValue === "";
  }

  // Marker positions, descriptions, barangay, and TotalQuota
  const markers = [
    {
      position: { lat: 14.769617915353559, lng: 121.07431904782344 },
      description: "GCN001",
      barangay: "1",
      TotalQuota: 25,
    },
    {
      position: { lat: 14.769826984613763, lng: 121.07434180712067 },
      description: "GCN002",
      barangay: "1",
      TotalQuota: 25,
    },
    {
      position: { lat: 14.7695188824759, lng: 121.07366282142037 },
      description: "GCN003",
      barangay: "2",
      TotalQuota: 30,
    },
    {
      position: { lat: 14.769214447791597, lng: 121.07394351941939 },
      description: "GCN004",
      barangay: "2",
      TotalQuota: 15,
    },
    {
      position: { lat: 14.7693244844737, lng: 121.07458836617384 },
      description: "GCN005",
      barangay: "3",
      TotalQuota: 10,
    },
    {
      position: { lat: 14.769794122216513, lng: 121.07285593266207 },
      description: "GCN006",
      barangay: "1",
      TotalQuota: 25,
    },
  ];

  // Create markers array to store references to all markers
  const allMarkers = [];

  // Loop through markers and add markers with descriptions
  markers.forEach((markerData) => {
    const marker = new google.maps.Marker({
      position: markerData.position,
      map: map,
      title: markerData.description, // Use the description as the marker title
      visible: true, // Initially show all markers
      barangay: markerData.barangay, // Store barangay info in marker object
      TotalQuota: markerData.TotalQuota, // Store TotalQuota info in marker object
      highlighted: false,
      icon: {
        url: customMarkerUrl,
        scaledSize: new google.maps.Size(32, 32), // Adjust the size of your custom marker
      }, // Initially not highlighted
    });

    // Push marker to allMarkers array
    allMarkers.push(marker);

    // Create info window content
    const infoContent = `<strong>Description:</strong> ${markerData.description}<br><strong>Barangay:</strong> ${markerData.barangay}<br><strong>TotalQuota:</strong> ${markerData.TotalQuota}`;

    // Create info window for each marker
    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });

    // Marker click event listener
    marker.addListener("click", () => {
      // Open info window
      infoWindow.open(map, marker);
    });

    // Store the info window reference with the marker
    marker.infoWindow = infoWindow;
  });

  // Close info windows when the map is clicked
  map.addListener("click", () => {
    allMarkers.forEach((marker) => {
      marker.infoWindow.close();
    });
  });

  // Select button event listener
  document.getElementById("selectBtn").addEventListener("click", function () {
    const selectedBarangay = document.getElementById("barangay").value;

    // Loop through all markers
    allMarkers.forEach((marker) => {
      // Check if the marker's barangay matches the selected barangay
      if (marker.barangay === selectedBarangay) {
        // Show the marker
        marker.setVisible(true);
      } else {
        // Hide the marker
        marker.setVisible(false);
      }
    });

    // Disable select button and enable cancel button
    document.getElementById("selectBtn").disabled = true;
    document.getElementById("cancelBtn").disabled = false;
  });

  // Cancel button event listener
  document.getElementById("cancelBtn").addEventListener("click", function () {
    // Reset dropdowns
    districtDropdown.selectedIndex = 0;
    barangayDropdown.innerHTML = "<option value=''>Select</option>";

    // Show all markers
    allMarkers.forEach((marker) => {
      marker.setVisible(true);
    });

    // Enable select button and disable cancel button
    document.getElementById("selectBtn").disabled = true;
    document.getElementById("cancelBtn").disabled = true;
  });
}
