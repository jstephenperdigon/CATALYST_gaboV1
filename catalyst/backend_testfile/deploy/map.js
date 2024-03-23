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
// Function to update marker data text and apply styling based on quota limits
function updateMarkerDataText(selectedMarkers) {
  const totalQuota = selectedMarkers.reduce((acc, m) => acc + m.TotalQuota, 0);
  const barangays = [...new Set(selectedMarkers.map((m) => m.barangay))];
  const selectedGCNs = selectedMarkers.map((m) => m.title).join(", ");

  // Set the minimum requirement and maximum limit
  const minRequirement = 45;
  const maxLimit = 50;

  let text = `Selected GCN: ${selectedGCNs} | Barangay: ${barangays.join(", ")} | TotalQuota: ${totalQuota}`;

  // Check if the total quota meets the minimum requirement
  if (totalQuota < minRequirement) {
    text += ` (Below minimum requirement)`;
    document.getElementById("markerDataText").style.color = "red";
  } else if (totalQuota > maxLimit) {
    text += ` (Exceeds maximum limit)`;
    document.getElementById("markerDataText").style.color = "red";
  } else {
    // Total quota is within valid range
    document.getElementById("markerDataText").style.color = "green";
  }

  // Update marker data text
  document.getElementById("markerDataText").textContent = text;
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  const customMarkerUrl =
    "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

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

  // Define a variable to track the SelectState
  let SelectState = false;

  // Event listener for the select button
  document.getElementById("selectBtn").addEventListener("click", () => {
    // Toggle the SelectState
    SelectState = !SelectState;

    // Update the text content of the button
    const selectBtn = document.getElementById("selectBtn");
    if (SelectState) {
      selectBtn.textContent = "Cancel";
      allMarkers.forEach((marker) => {
        marker.infoWindow.close();
      });
    } else {
      selectBtn.textContent = "Select";
      // Clear data for markerDataText
      document.getElementById("markerDataText").textContent = "";

      // Return all markers to original state
      allMarkers.forEach((marker) => {
        marker.setIcon(customMarkerUrl);
        marker.highlighted = false;
        marker.setVisible(true);
      });
    }
  });

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
      // Check if SelectState is true
      if (SelectState) {
        // Toggle highlight state
        marker.highlighted = !marker.highlighted;

        // Change marker color based on its highlighted state
        if (marker.highlighted) {
          marker.setIcon(
            "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
          );
        } else {
          marker.setIcon(
            "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          );
        }

        // Filter markers based on barangay if there are highlighted markers
        const hasHighlightedMarkers = allMarkers.some((m) => m.highlighted);
        if (!hasHighlightedMarkers) {
          allMarkers.forEach((m) => {
            m.setVisible(true);
          });
        } else {
          const clickedBarangay = marker.barangay;
          allMarkers.forEach((m) => {
            if (m !== marker) {
              if (m.barangay !== clickedBarangay) {
                m.setVisible(false);
              } else {
                m.setVisible(true);
              }
            }
          });
        }

        // Fetch data and handle display in <p> element
        const selectedMarkers = allMarkers.filter((m) => m.highlighted);

        // Update marker data text and apply styling based on quota limits
        updateMarkerDataText(selectedMarkers);
      } else {
        // Open info window
        infoWindow.open(map, marker);
      }
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
}
