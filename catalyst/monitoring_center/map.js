import { db, ref, onValue, set, get, child, update } from "./firebaseConfig.js"; // Import Firebase database utilities

// Define an array to store all markers
let markers = [];

// Function to fetch data from Firebase and display markers on the map
function displayMarkersOnMap(map) {
  // Reference to the GarbageBinControlNumber node in the database
  const garbageBinRef = ref(db, "GarbageBinControlNumber");
  const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  const greenIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // Green marker icon

  // Fetch data from Firebase in real-time
  onValue(garbageBinRef, (snapshot) => {
    const data = snapshot.val(); // Get the data from the snapshot

    // Loop through each garbage bin in the data
    for (const gcnKey in data) {
      const location = data[gcnKey]?.Location; // Get the location object
      const gb1QuotaCount =
        data[gcnKey]?.FillLevel?.GB1FillLevel?.GB1QuotaCount || 0;
      const gb2QuotaCount =
        data[gcnKey]?.FillLevel?.GB2FillLevel?.GB2QuotaCount || 0;
      const gb3QuotaCount =
        data[gcnKey]?.FillLevel?.GB3FillLevel?.GB3QuotaCount || 0;
      const gb4QuotaCount =
        data[gcnKey]?.FillLevel?.GB4FillLevel?.GB4QuotaCount || 0;

      // Calculate total quota by summing up individual quota counts
      const totalQuota =
        gb1QuotaCount + gb2QuotaCount + gb3QuotaCount + gb4QuotaCount;

      // Check if Users object exists and has at least one user
      const users = data[gcnKey]?.Users;
      const firstUserId = users ? Object.keys(users)[0] : null;
      const district = firstUserId ? users[firstUserId]?.district : "";
      const barangay = firstUserId ? users[firstUserId]?.barangay : "";

      // Extract numerical parts from district and barangay values
      const districtNumeric = district ? district.match(/\d+/) : null;
      const barangayNumeric = barangay ? barangay.match(/\d+/) : null;

      // Check if the GCN has collectionFlag set to "true"
      const collectionFlag = data[gcnKey]?.collectionFlag === "true";

      // Condition to display markers only if totalQuota is 3 or above
      if (location && totalQuota >= 3) {
        const latitude = location.Latitude;
        const longitude = location.Longitude;

        // Check if marker already exists
        let existingMarker = markers.find((marker) => marker.title === gcnKey);

        // Determine the marker icon based on collectionFlag
        const icon = collectionFlag ? greenIcon : defaultIcon;

        if (existingMarker) {
          // If marker exists, update its position, icon, and info window content
          existingMarker.setPosition({ lat: latitude, lng: longitude });
          existingMarker.setIcon(icon); // Set the icon
          existingMarker.infoWindow.setContent(
            `<div>
              <h2>GCN: ${gcnKey}</h2>
              <p>District: ${districtNumeric}</p>
              <p>Barangay: ${barangayNumeric}</p>
              <p>Total Quota: ${totalQuota}</p>
              <p>Recyclables: ${
                gb1QuotaCount !== 0 ? gb1QuotaCount : "none"
              }</p>
              <p>Biodegradable: ${
                gb2QuotaCount !== 0 ? gb2QuotaCount : "none"
              }</p>
              <p>Special: ${gb3QuotaCount !== 0 ? gb3QuotaCount : "none"}</p>
              <p>Non-Biodegradable: ${
                gb4QuotaCount !== 0 ? gb4QuotaCount : "none"
              }</p>
            </div>`
          );
        } else {
          // Create a new marker if it doesn't exist
          const marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: gcnKey,
            icon: icon, // Set the icon
          });

          // Create info window for the new marker
          marker.infoWindow = new google.maps.InfoWindow({
            content: `<div>
                        <h2>GCN: ${gcnKey}</h2>
                        <p>District: ${districtNumeric}</p>
                        <p>Barangay: ${barangayNumeric}</p>
                        <p>Total Quota: ${totalQuota}</p>
                        <p>Recyclables: ${
                          gb1QuotaCount !== 0 ? gb1QuotaCount : "none"
                        }</p>
                        <p>Biodegradable: ${
                          gb2QuotaCount !== 0 ? gb2QuotaCount : "none"
                        }</p>
                        <p>Special: ${
                          gb3QuotaCount !== 0 ? gb3QuotaCount : "none"
                        }</p>
                        <p>Non-Biodegradable: ${
                          gb4QuotaCount !== 0 ? gb4QuotaCount : "none"
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
    const greenIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"; // Green marker icon

    // Get the GCN key associated with the marker
    const gcnKey = marker.title;

    // Reference to the corresponding node in the database
    const garbageBinRef = ref(db, `GarbageBinControlNumber/${gcnKey}`);

    // Fetch data from Firebase for the specific GCN
    get(garbageBinRef)
      .then((snapshot) => {
        const data = snapshot.val();

        // Check if collectionFlag is "true" for the GCN
        const collectionFlag = data?.collectionFlag === "true";

        // Determine the marker icon based on collectionFlag
        const icon = collectionFlag ? greenIcon : defaultIcon;

        marker.setIcon(icon);
        marker.setMap(map);
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  });
}

// Function to enable/disable barangay dropdown based on district dropdown selection
function toggleBarangayDropdown() {
  const districtDropdown = document.getElementById("district");
  const barangayDropdown = document.getElementById("barangay");

  // Define the barangay options based on the selected district
  const barangayOptions = {
    1: [
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
      "177",
    ],
    2: [
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
      "77",
      "78",
      "79",
      "80",
      "81",
      "82",
      "",
      "83",
      "84",
      "85",
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
      "122",
      "123",
      "124",
      "125",
      "126",
      "127",
      "128",
      "129",
      "130",
      "131",
      "131",
    ],
    3: [
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
      "188",
    ],
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

function populateCollectorDropdown(selectedDistrict, selectedBarangay) {
  const dropdownCollector = document.getElementById("dropdownCollector");

  // Clear existing options in the dropdown
  dropdownCollector.innerHTML = "";

  // Create a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = ""; // Set value to empty string
  defaultOption.textContent = "Select Collector";
  dropdownCollector.appendChild(defaultOption);

  // Query Firebase Database for collectors with matching assigned area
  const collectorsRef = ref(db, "Accounts/Collectors");
  get(collectorsRef)
    .then((snapshot) => {
      const collectors = snapshot.val();

      // Iterate over collectors to find matching ones and update the dropdown
      for (const userId in collectors) {
        const collector = collectors[userId];
        const assignedArea = collector.AssignedArea;
        const gcl = collector.GCL;

        // Check if assigned district and barangay match selected values
        if (
          assignedArea &&
          assignedArea.district === selectedDistrict &&
          assignedArea.barangay === selectedBarangay
        ) {
          // Create new option element for the dropdown
          const option = document.createElement("option");
          option.value = gcl;
          option.textContent = gcl;

          // Append option to dropdown
          dropdownCollector.appendChild(option);
        }
      }

      // Disable "Select Collector" option
      defaultOption.disabled = true;
    })
    .catch((error) => {
      console.error("Error fetching collectors data:", error);
    });

  // Add event listener to prevent default behavior when "Select Collector" is clicked
  dropdownCollector.addEventListener("mousedown", function (event) {
    if (event.target === defaultOption) {
      event.preventDefault();
    }
  });
}

// Function to check if all required fields are filled
function checkInputsAndEnableButton() {
  const dateInputField = document.getElementById("dateInputField");
  const timeInputField = document.getElementById("timeInputField");
  const dropdownCollector = document.getElementById("dropdownCollector");
  const deployBtn = document.getElementById("deployBtn");

  // Check if all fields have valid input
  const isDateValid = dateInputField.value !== "";
  const isTimeValid =
    timeInputField.value !== "" && timeInputField.value !== "Select Time";
  const isCollectorSelected =
    dropdownCollector.value !== "" &&
    dropdownCollector.value !== "Select Collector";

  // Enable the deploy button only if all conditions are met
  deployBtn.disabled = !(isDateValid && isTimeValid && isCollectorSelected);
}

function resetMapAndUI(map) {
  resetMapSelection();

  showAllMarkers(map);

  const selectedMarkersDiv = document.getElementById("selectedMarkers");
  selectedMarkersDiv.innerHTML = "";

  const additionalFieldsDiv = document.getElementById("additionalFields");
  additionalFieldsDiv.style.display = "none";

  const dateInputField = document.getElementById("dateInputField");
  dateInputField.value = "";

  const timeInputField = document.getElementById("timeInputField");
  timeInputField.value = "";

  const dropdownCollector = document.getElementById("dropdownCollector");
  dropdownCollector.selectedIndex = 0;

  const deployBtn = document.getElementById("deployBtn");
  deployBtn.disabled = true;

  const newLat = 14.766794722678402;
  const newLng = 121.03637727931373;
  moveMapToCoordinates(map, newLat, newLng);
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
    dateInputField.value = "";
    dateInputField.disabled = true;

    const timeInputField = document.getElementById("timeInputField");
    timeInputField.value = "Select Time";
    timeInputField.disabled = true;

    const dropdownCollector = document.getElementById("dropdownCollector");
    dropdownCollector.selectedIndex = 0;

    const deployBtn = document.getElementById("deployBtn");
    deployBtn.disabled = true;

    const newLat = 14.766794722678402;
    const newLng = 121.03637727931373;
    moveMapToCoordinates(map, newLat, newLng);
  });

  // Event listeners to check inputs and enable/disable the Deploy button
  document
    .getElementById("dateInputField")
    .addEventListener("input", checkInputsAndEnableButton);
  document
    .getElementById("timeInputField")
    .addEventListener("input", checkInputsAndEnableButton);
  document
    .getElementById("dropdownCollector")
    .addEventListener("change", checkInputsAndEnableButton);

  let highLatitude;
  let highLongitude;

  function validateGCNCollectionFlag(gcn) {
    // Reference to the GCN node in the database
    const gcnRef = ref(db, `GarbageBinControlNumber/${gcn}`);

    // Fetch the data for the specified GCN
    return get(gcnRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          return data.collectionFlag === "true";
        } else {
          console.log(`GCN ${gcn} not found in the database.`);
          return false;
        }
      })
      .catch((error) => {
        console.error("Error fetching data for GCN:", error);
        return false;
      });
  }

  async function updateSelectedMarkers(
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

    if (selectedGCNs.length === 0) {
      // If no GCNs are selected, display the message
      selectedMarkersDiv.innerHTML = `
      <p class="text-center fw-bold text-muted fs-3">No markers are available or already been selected for collecting.</p>
    `;
      return; // Exit the function since there are no selected GCNs
    }

    let message = "";

    if (totalQuotaSum <= 89) {
      message = "Not enough to meet the requirements";
    } else if (totalQuotaSum >= 90 && totalQuotaSum <= 96) {
      const additionalFieldsDiv = document.getElementById("additionalFields");
      additionalFieldsDiv.style.display = "block";
      // Show the deploy button
    } else {
      message = "Too much, invalid requirement";
    }

    selectedMarkersDiv.innerHTML = `
    <div class="container mt-2">
    <div class="row">
        <div class="col-md-6">
          <div class="form-outline mb-4">
                <label class="form-label" for="garbageBags">Garbage Bags:</label>
                <p id="garbageBags" class="form-control total-quota fs-1 fw-bolder text-success">${totalQuotaSum}</p>
            </div>
          <div class="form-outline mb-4">
              <label class="form-label" for="controlNumbers">Control Numbers:</label>
                  <div class="d-flex align-items-center">
                      <p id="controlNumbers" class="form-control selected-gcn">${selectedGCNs
                        .slice(0, 10)
                        .join(", ")}</p>
                        ${
                          selectedGCNs.length > 10
                            ? `<button class="btn shadow-none bg-transparent btn-sm" data-toggle="modal" data-target="#additionalGCNsModal">
                                    <i class="fas fa-chevron-right fa-1x"></i>
                                  </button>`
                            : ""
                        }
                  </div>
          </div>
            
          
        </div>
        <div class="col-md-6">
        <p class="fs-4 fw-bold text-muted"> Waste Composition </p>
            <div class="container top-0">
                <div class="card rounded-5 border-0 p-3 shadow-none position-relative">
                    <div class="d-flex align-items-center">
                        <div class="bg-primary rounded-4 p-3 me-3">
                            <i class="fas fa-recycle fa-1x text-light"></i>
                        </div>
                        <div>
                            <p class="fw-bold fs-6 mb-0">Recyclables</p>
                            <p class="fw-light text-muted mb-0 recyclables">${gb1QuotaSum}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container top-0">
                <div class="card rounded-5 border-0 p-3 shadow-none position-relative">
                    <div class="d-flex align-items-center">
                        <div class="bg-success rounded-4 p-3 me-3">
                            <i class="fas fa-seedling fa-1x text-light"></i>
                        </div>
                        <div>
                            <p class="fw-bold fs-6 mb-0">Biodegradable</p>
                            <p class="fw-light text-muted mb-0 biodegradable">${gb2QuotaSum}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container top-0">
                <div class="card rounded-5 border-0 p-3 shadow-none position-relative">
                    <div class="d-flex align-items-center">
                        <div class="bg-warning rounded-4 p-3 me-3">
                            <i class="fas fa-flask fa-1x text-light"></i>
                        </div>
                        <div>
                            <p class="fw-bold fs-6 mb-0">Special</p>
                            <p class="fw-light text-muted mb-0 special">${gb3QuotaSum}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container top-0">
                <div class="card rounded-5 border-0 p-3 shadow-none position-relative">
                    <div class="d-flex align-items-center">
                        <div class="bg-dark rounded-4 p-3 me-3">
                            <i class="fas fa-trash fa-1x text-light"></i>
                        </div>
                        <div>
                            <p class="fw-bold fs-6 mb-0">Non-Biodegradable</p>
                            <p class="fw-light text-muted mb-0 non-biodegradable">${gb4QuotaSum}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-12 text-center">
            <p class="fs-3 text-muted fw-bold">${message}</p>
        </div>
    </div>
</div>
           <!-- Modal -->
            <div
              class="modal fade"
              id="additionalGCNsModal"
              tabindex="-1"
              aria-labelledby="additionalGCNsModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="additionalGCNsModalLabel">
                      Control Numbers
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <p>${selectedGCNs.slice(10).join(", ")}</p>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
`;
  }

  async function toggleSelectButton() {
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
      selectButton.addEventListener("click", async () => {
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

        // Calculate totalQuota by summing up gb1QuotaCount, gb2QuotaCount, gb3QuotaCount, and gb4QuotaCount
        for (const marker of filteredMarkers) {
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

          const totalQuota =
            gb1QuotaCount + gb2QuotaCount + gb3QuotaCount + gb4QuotaCount;

          marker.totalQuota = totalQuota; // Store the totalQuota on the marker object
        }

        // Sort filtered markers by highest total quota
        filteredMarkers.sort((a, b) => {
          const totalQuotaA = a.totalQuota;
          const totalQuotaB = b.totalQuota;
          return totalQuotaB - totalQuotaA;
        });

        // Accumulate details of matching markers while considering the limit
        let selectedGCNs = [];
        let totalQuotaSum = 0;
        let gb1QuotaSum = 0;
        let gb2QuotaSum = 0;
        let gb3QuotaSum = 0;
        let gb4QuotaSum = 0;

        for (const marker of filteredMarkers) {
          const gcn = marker.infoWindow.content.match(/GCN: (.+?)</)[1];

          // Validate the GCN's collectionFlag
          const collectionFlag = await validateGCNCollectionFlag(gcn);

          if (collectionFlag) {
            // If collectionFlag is true, skip this GCN
            continue;
          }

          const totalQuota = marker.totalQuota;
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
          if (totalQuotaSum + totalQuota <= 96) {
            selectedGCNs.push(gcn); // Add GCN to the selectedGCNs array
            totalQuotaSum += totalQuota;
            gb1QuotaSum += gb1QuotaCount; // Accumulate gb1QuotaCount
            gb2QuotaSum += gb2QuotaCount; // Accumulate gb2QuotaCount
            gb3QuotaSum += gb3QuotaCount; // Accumulate gb3QuotaCount
            gb4QuotaSum += gb4QuotaCount; // Accumulate gb4QuotaCount

            // If the total quota exceeds 96, break the loop
            if (totalQuotaSum > 96) break;
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

  document.addEventListener("DOMContentLoaded", function () {
    // Fetch HTML elements
    const selectedMarkers = document.getElementById("selectedMarkers");
    const dateInputField = document.getElementById("dateInputField");
    const timeInputField = document.getElementById("timeInputField");
    const dropdownCollector = document.getElementById("dropdownCollector");
    const deployBtn = document.getElementById("deployBtn");

    // Create a new Date object adjusted for Philippine Standard Time (UTC+8:00)
    const now = new Date();
    const philippineNow = new Date(now.getTime() + 8 * 60 * 60 * 1000); // Adding 8 hours for UTC+8:00

    const year = philippineNow.getFullYear();
    const month = String(philippineNow.getMonth() + 1).padStart(2, "0"); // January is 0
    const day = String(philippineNow.getDate()).padStart(2, "0");

    // Construct the date string in YYYY-MM-DD format
    const today = `${year}-${month}-${day}`;

    // Set the 'min' attribute of the date input field to today's date in Philippine Standard Time
    dateInputField.setAttribute("min", today);

    // Disable dateInputField and timeInputField initially
    dateInputField.disabled = true;
    timeInputField.disabled = true;

    // Create and populate the time slot dropdown when DOM content is loaded
    const timeSlots = [
      "Select Time",
      "8:00 AM - 9:00 AM",
      "9:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 1:00 PM",
      "1:00 PM - 2:00 PM",
      "2:00 PM - 3:00 PM",
      "3:00 PM - 4:00 PM",
      "4:00 PM - 5:00 PM",
      "5:00 PM - 6:00 PM",
    ];
    createTimeSlotOptions();

    function createTimeSlotOptions() {
      // Clear existing options
      timeInputField.innerHTML = "";

      // Create and add new options
      timeSlots.forEach((timeSlot) => {
        const option = document.createElement("option");
        option.value = timeSlot;
        option.textContent = timeSlot;
        timeInputField.appendChild(option);
      });

      // Set the default selected option to "Select Time" and disable it
      timeInputField.value = "Select Time";
      timeInputField.options[0].disabled = true;
    }

    function displayAssignedSchedule() {
      // Get the selected collector value from dropdown
      const selectedCollectorValue = dropdownCollector.value;
      // Function to format date from yyyy-mm-dd to mm-dd-yyyy
      function formatDate(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${month}-${day}-${year}`;
      }

      // Get the value of the dateInputField
      const selectedDate = formatDate(dateInputField.value);

      // Enable/disable timeInputField based on dateInputField validity
      if (selectedDate) {
        timeInputField.disabled = false;
      } else {
        timeInputField.disabled = true;
      }

      // Reference to the collectors node in Firebase
      const collectorsRef = ref(db, "Accounts/Collectors");

      // Retrieve all collectors
      get(collectorsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Array to collect assigned times for the selected date and collector
            const assignedTimes = [];

            // Loop through each collector
            snapshot.forEach((childSnapshot) => {
              const collectorData = childSnapshot.val();
              if (collectorData.GCL === selectedCollectorValue) {
                const collectorUID = childSnapshot.key;

                // Reference to the assigned schedule node for this collector
                const assignedScheduleRef = ref(
                  db,
                  `Accounts/Collectors/${collectorUID}/AssignedSchedule`
                );

                // Retrieve the assigned schedules for this collector
                get(assignedScheduleRef)
                  .then((scheduleSnapshot) => {
                    if (scheduleSnapshot.exists()) {
                      scheduleSnapshot.forEach((scheduleChildSnapshot) => {
                        const scheduleData = scheduleChildSnapshot.val();

                        // Check if the schedule matches the selected date
                        if (scheduleData.DateInput === selectedDate) {
                          assignedTimes.push(scheduleData.TimeInput);
                        }
                      });

                      // Filter out assigned times from timeSlots array
                      const updatedTimeSlots = timeSlots.filter(
                        (slot) => !assignedTimes.includes(slot)
                      );

                      // Update timeInputField options
                      updateTimeOptions(updatedTimeSlots);
                    } else {
                      console.log(
                        "No assigned schedules found for this collector."
                      );
                    }
                  })
                  .catch((error) => {
                    console.error(
                      "Error retrieving assigned schedules:",
                      error
                    );
                  });
              }
            });
          } else {
            console.error("No collectors found in the database.");
          }
        })
        .catch((error) => {
          console.error("Error retrieving collectors:", error);
        });
    }

    function updateTimeOptions(updatedTimeSlots) {
      // Clear existing options
      timeInputField.innerHTML = "";

      // Create and add updated options
      updatedTimeSlots.forEach((timeSlot) => {
        const option = document.createElement("option");
        option.value = timeSlot;
        option.textContent = timeSlot;
        timeInputField.appendChild(option);
      });

      // Set the default selected option to "Select Time" and disable it
      timeInputField.value = "Select Time";
      timeInputField.options[0].disabled = true;
    }

    // Event listener for dropdownCollector change
    dropdownCollector.addEventListener("change", () => {
      // Enable dateInputField only if a valid collector is selected
      if (
        dropdownCollector.value &&
        dropdownCollector.value !== "Select Collector"
      ) {
        dateInputField.disabled = false;
      } else {
        dateInputField.disabled = true;
      }
    });

    // Event listener for dateInputField change
    dateInputField.addEventListener("change", displayAssignedSchedule);

    deployBtn.addEventListener("click", () => {
      // Fetch outputs from HTML elements
      const selectedGCNOutput =
        selectedMarkers.querySelector(".selected-gcn").textContent;

      // Split the selected GCNs into an array
      const selectedGCNs = selectedGCNOutput
        .replace("Selected GCN: ", "")
        .split(", ");

      // Function to update GCN nodes in the database
      async function updateGCNNode(gcn) {
        // Reference to the GCN node in the database
        const gcnRef = ref(db, `GarbageBinControlNumber/${gcn}`);

        try {
          // Get the current snapshot of the node
          const snapshot = await get(gcnRef);

          if (!snapshot.exists() || snapshot.val().collectionFlag === "false") {
            // If the node does not exist or collectionFlag is "false", update it
            await update(gcnRef, { collectionFlag: "true" });
            console.log(`collectionFlag updated to "true" for GCN ${gcn}.`);
          } else if (snapshot.val().collectionFlag === "true") {
            // If collectionFlag is already "true", log a message
            console.log(`collectionFlag already set to "true" for GCN ${gcn}.`);
          }
        } catch (error) {
          console.error(`Error updating collectionFlag for GCN ${gcn}:`, error);
        }
      }

      // Iterate through each selected GCN and update its node in the database
      selectedGCNs.forEach((gcn) => {
        updateGCNNode(gcn);
      });

      function formatTimeSent(timestamp) {
        const date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (0 hours)
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const formattedTime = hours + ":" + minutes + " " + ampm;
        return formattedTime;
      }

      // Fetch other outputs from HTML elements
      const districtOutput =
        selectedMarkers.querySelector(".district").textContent;
      const barangayOutput =
        selectedMarkers.querySelector(".barangay").textContent;
      const totalQuotaOutput =
        selectedMarkers.querySelector(".total-quota").textContent;
      const recyclablesOutput =
        selectedMarkers.querySelector(".recyclables").textContent;
      const biodegradableOutput =
        selectedMarkers.querySelector(".biodegradable").textContent;
      const specialOutput =
        selectedMarkers.querySelector(".special").textContent;
      const nonBiodegradableOutput =
        selectedMarkers.querySelector(".non-biodegradable").textContent;

      // Fetch additional values
      const dateInputValue = dateInputField.value;
      const timeInputValue = timeInputField.value;
      const dropdownCollectorValue = dropdownCollector.value;

      // Function to format date as MMDDYYYY
      function formatDate(date) {
        const [year, month, day] = date.split("-");
        return `${month}${day}${year}`;
      }

      // Add the formatDateMMddYYYY function to your code
      function formatDateMMddYYYY(date) {
        const [year, month, day] = date.split("-");
        return `${month}-${day}-${year}`;
      }

      // Function to generate random alphanumeric characters
      function generateRandomChars(length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

      // Generate UID
      const randomChars = generateRandomChars(4); // Generate 4 random characters
      const uid = `${dropdownCollectorValue}${formatDate(
        dateInputValue
      )}${randomChars}`;

      // Prepare deployment data object
      const deploymentData = {
        SelectedGCN: selectedGCNOutput.replace("Selected GCN: ", ""),
        District: districtOutput.replace("District: ", ""),
        Barangay: barangayOutput.replace("Barangay: ", ""),
        TotalQuota: parseInt(totalQuotaOutput.replace("Total Quota: ", "")),
        Recyclables: parseInt(recyclablesOutput.replace("Recyclables: ", "")),
        Biodegradable: parseInt(
          biodegradableOutput.replace("Biodegradable: ", "")
        ),
        Special: parseInt(specialOutput.replace("Special: ", "")),
        NonBiodegradable: parseInt(
          nonBiodegradableOutput.replace("Non-Biodegradable: ", "")
        ),
        DateInput: formatDateMMddYYYY(dateInputValue),
        TimeInput: timeInputValue,
        SelectedGCL: dropdownCollectorValue,
        timeSent: formatTimeSent(new Date()),
      };

      // Store deployment data in Firebase under DeploymentHistory with UID
      const deploymentRef = ref(db, `DeploymentHistory/${uid}`);
      set(deploymentRef, deploymentData)
        .then(() => {
          console.log(
            "Deployment data successfully stored in the database under UID:",
            uid
          );
          resetMapAndUI(map);
        })
        .catch((error) => {
          console.error("Error storing deployment data:", error);
        });

      // Prepare deployment data object
      const AssignedSchedule = {
        SelectedGCN: selectedGCNOutput.replace("Selected GCN: ", ""),
        District: districtOutput.replace("District: ", ""),
        Barangay: barangayOutput.replace("Barangay: ", ""),
        TotalQuota: parseInt(totalQuotaOutput.replace("Total Quota: ", "")),
        DateInput: formatDateMMddYYYY(dateInputValue),
        TimeInput: timeInputValue,
        SelectedGCL: dropdownCollectorValue,
        timeSent: formatTimeSent(new Date()),
      };

      // Reference to the collectors node
      const collectorsRef = ref(db, `Accounts/Collectors`);

      // Retrieve all collectors
      get(collectorsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const collectorData = childSnapshot.val();
              if (collectorData.GCL === dropdownCollectorValue) {
                const collectorUID = childSnapshot.key;

                // Reference to the collector's node
                const collectorNodeRef = ref(
                  db,
                  `Accounts/Collectors/${collectorUID}`
                );

                // Set the collectionFlag for the collector
                update(collectorNodeRef, {
                  collectionFlag: true,
                })
                  .then(() => {
                    console.log(
                      "collectionFlag set to true for collector with UID:",
                      collectorUID
                    );

                    // Reference to the collector's AssignedSchedule
                    const assignedScheduleRef = ref(
                      db,
                      `Accounts/Collectors/${collectorUID}/AssignedSchedule/${uid}`
                    );

                    // Set the deployment data under AssignedSchedule for the collector
                    set(assignedScheduleRef, AssignedSchedule)
                      .then(() => {
                        console.log(
                          "Deployment data successfully stored in the AssignedSchedule node under collector UID:",
                          collectorUID
                        );
                      })
                      .catch((error) => {
                        console.error(
                          "Error storing deployment data in AssignedSchedule:",
                          error
                        );
                      });
                  })
                  .catch((error) => {
                    console.error("Error setting collectionFlag:", error);
                  });
              }
            });
          } else {
            console.error("No collectors found in the database.");
          }
        })
        .catch((error) => {
          console.error("Error retrieving collectors:", error);
        });

      emailjs.init("tQkpQMaGNn8vjfM3D");

      // Code to retrieve and log emails based on the selected GCN
      selectedGCNs.forEach((selectedGCN) => {
        // Reference to the Users node under the selected GCN
        const gcnUsersRef = ref(
          db,
          `GarbageBinControlNumber/${selectedGCN}/Users`
        );

        // Retrieve and log emails for the selected GCN
        get(gcnUsersRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              // Iterate through each user under the selected GCN and send emails
              snapshot.forEach((userSnapshot) => {
                // Retrieve the user email from the snapshot
                const userEmail = userSnapshot.val().email;

                // Check if the userEmail exists
                if (userEmail) {
                  // Construct the email data object
                  const emailData = {
                    to_email: userEmail,
                    message: `Dear Resident,

                This email serves as a notification for the upcoming garbage collection in your area.Our designated garbage collector with ID: ${dropdownCollectorValue} will be collecting your bins on ${formatDateMMddYYYY(
                      dateInputValue
                    )} at ${timeInputValue}.

                We kindly request your cooperation in ensuring your bins are properly placed at the designated collection point.This will allow for efficient collection and minimize disruption.

                Should you have any inquiries regarding waste disposal guidelines, collection schedules, or require further assistance, please do not hesitate to contact the City Environmental Management Department through the following channels:
                Hotline: 53106537
                Facebook: City Environmental Management Department


                Best regards,
                GABO-CATALYST`,
                  };
                  // Send email using EmailJS
                  emailjs
                    .send("service_6z6sj8l", "template_ug7hrug", emailData)
                    .then(() => {
                      console.log(
                        `Email sent to ${userEmail} for GCN ${selectedGCN}.`
                      );
                    })
                    .catch((error) => {
                      console.error(
                        `Error sending email to ${userEmail}:`,
                        error
                      );
                    });

                  resetMapAndUI(map);
                } else {
                  // Log a message if the email doesn't exist
                  console.log(
                    `Skipping user with no email under GCN ${selectedGCN}.`
                  );
                }
              });
            } else {
              console.log(`No users found under GCN ${selectedGCN}.`);
            }
          })
          .catch((error) => {
            console.error(
              `Error retrieving emails for GCN ${selectedGCN}:`,
              error
            );
          });
      });
    });
  });
}

// Make initMap accessible in the global scope
window.initMap = initMap;
