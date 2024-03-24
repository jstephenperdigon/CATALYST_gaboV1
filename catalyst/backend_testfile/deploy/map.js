

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
      barangays = [
        "1",
        "2",
        "3",
        "4",
        "77",
        "78",
        "79",
        "80",
        "81",
        "82",
        "83",
        "84",
        "85",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
        "139",
        "140",
        "141",
        "142",
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
        "149",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "164",
        "165",
        "166",
        "167",
        "168",
        "169",
        "170",
        "171",
        "172",
        "173",
        "174",
        "175",
        "176",
        "177"
      ];
    } else if (district === "2") {
      barangays = [
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "67",
        "68",
        "69",
        "70",
        "71",
        "72",
        "73",
        "74",
        "75",
        "76",
        "86",
        "87",
        "88",
        "89",
        "90",
        "91",
        "92",
        "93",
        "94",
        "95",
        "96",
        "97",
        "98",
        "99",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
        "119",
        "120",
        "121",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
        "129",
        "130",
        "131",
        "131"

      ];
    } else if (district === "3") {
      barangays = [
        "178",
        "179",
        "180",
        "181",
        "182",
        "183",
        "184",
        "185",
        "186",
        "187",
        "188"
      ];
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
      option.text = `${barangay}`;
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
      barangay: "2",
      district: "1",
      TotalQuota: 40,
    },
    {
      position: { lat: 14.769826984613763, lng: 121.07434180712067 },
      description: "GCN002",
      barangay: "1",
      district: "1",
      TotalQuota: 4,
    },
    {
      position: { lat: 14.7695188824759, lng: 121.07366282142037 },
      description: "GCN003",
      barangay: "1",
      district: "1",
      TotalQuota: 30,
    },
    {
      position: { lat: 14.769214447791597, lng: 121.07394351941939 },
      description: "GCN004",
      barangay: "2",
      district: "2",
      TotalQuota: 5,
    },
    {
      position: { lat: 14.7693244844737, lng: 121.07458836617384 },
      description: "GCN005",
      barangay: "3",
      district: "2",
      TotalQuota: 10,
    },
    {
      position: { lat: 14.769794122216513, lng: 121.07285593266207 },
      description: "GCN006",
      barangay: "1",
      district: "1",
      TotalQuota: 15,
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
      visible: markerData.TotalQuota >= 4, // Initially show all markers
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
    const selectedMarkers = allMarkers.filter(
      (marker) => marker.barangay === selectedBarangay && marker.getVisible()
    );

    // Sort markers based on total quota in descending order
    selectedMarkers.sort((a, b) => b.TotalQuota - a.TotalQuota);

    // Hide markers that don't match the selected barangay
    allMarkers.forEach((marker) => {
      if (marker.barangay !== selectedBarangay) {
        marker.setVisible(false);
      }
    });

    // Filter markers based on total quota condition
    let totalQuota = 0;
    const filteredMarkers = selectedMarkers.filter((marker) => {
      if (totalQuota + marker.TotalQuota <= 50) {
        totalQuota += marker.TotalQuota;
        return true;
      }
      return false;
    });

    // Display selected markers and highlight them
    const selectedDescriptions = filteredMarkers
      .map((marker) => {
        marker.setIcon({
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new google.maps.Size(32, 32),
        });
        return marker.title;
      })
      .join(", ");

    const selectedTotalQuota = filteredMarkers.reduce(
      (total, marker) => total + marker.TotalQuota,
      0
    );

    // Check if total quota meets the condition
    if (selectedTotalQuota >= 45 && selectedTotalQuota <= 50) {
      const selectedMarkersHTML = `
    <div>
    <p>Selected GCN: ${selectedDescriptions}</p>
    <p>Barangay: ${selectedBarangay}</p>
    <p>District: ${districtDropdown.value}</p>
    <p>Total Quota: ${selectedTotalQuota}</p>
    </div>
  `;
      document.getElementById("selectedMarkers").innerHTML =
        selectedMarkersHTML;
      // Show further action button
      document.getElementById("furtherActionBtn").style.display = "block";
    } else {
      document.getElementById("selectedMarkers").innerHTML =
        "<p>No valid selection. Total quota does not meet the condition.</p>";
      // Hide further action button
      document.getElementById("furtherActionBtn").style.display = "none";
    }

    // Disable select button and enable cancel button
    document.getElementById("selectBtn").disabled = true;
    document.getElementById("cancelBtn").disabled = false;
    document.getElementById("district").disabled = true;
    document.getElementById("barangay").disabled = true;
  });

  // Cancel button event listener
  document.getElementById("cancelBtn").addEventListener("click", function () {
    // Reset dropdowns
    document.getElementById("district").selectedIndex = 0;
    document.getElementById("barangay").innerHTML =
      "<option value=''>Select</option>";

    // Show all markers and reset their icons to default
    allMarkers.forEach((marker) => {
      marker.setVisible(true);
      marker.setIcon({
        url: customMarkerUrl,
        scaledSize: new google.maps.Size(32, 32),
      });
    });

    // Clear selected markers display
    document.getElementById("selectedMarkers").innerHTML = "";

    // Disable select button and enable cancel button
    document.getElementById("selectBtn").disabled = true;
    document.getElementById("cancelBtn").disabled = true;
    document.getElementById("district").disabled = false;
    document.getElementById("barangay").disabled = false;
    document.getElementById("furtherActionBtn").style.display = "none";
  });


}
