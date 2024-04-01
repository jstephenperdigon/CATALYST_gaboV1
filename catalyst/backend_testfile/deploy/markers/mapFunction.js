import { db, ref, onValue, off } from "./firebaseConfig.js";

//markers
const markers = {};

//markers
function addMarkersFromFirebase(map) {
  // Fetch garbage bin data from Firebase
  const binsRef = ref(db, "GarbageBinControlNumber");
  const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

  onValue(binsRef, (snapshot) => {
    const binsData = snapshot.val();
    for (const binUID in binsData) {
      const binData = binsData[binUID];
      if (
        binData &&
        binData.Location &&
        binData.Location.Latitude &&
        binData.Location.Longitude &&
        binData.TotalQuota >= 4
      ) {
        // Check if marker already exists
        if (!markers[binUID]) {
          // Create a marker for each garbage bin
          const marker = new google.maps.Marker({
            position: {
              lat: binData.Location.Latitude,
              lng: binData.Location.Longitude,
            },
            map: map,
            title: `GCN: ${binUID}`,
            icon: defaultIcon,
          });

          // Create info window content
          const contentDiv = document.createElement("div");

          // Update info window content
          const updateInfoWindow = () => {
            contentDiv.innerHTML = `
                            <div>
                                <p>${binUID}</p>
                                <p>District: ${binData.Users[
                                  Object.keys(binData.Users)[0]
                                ].district.replace("District ", "")}</p>
                                <p>Barangay: ${binData.Users[
                                  Object.keys(binData.Users)[0]
                                ].barangay.replace("Brgy ", "")}</p>
                                <p>Total Quota: ${binData.TotalQuota}</p>
                            </div>
                        `;
          };

          // Initial update
          updateInfoWindow();

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: contentDiv,
          });

          // Add click event listener to marker
          marker.addListener("click", () => {
            updateInfoWindow();
            infoWindow.open(map, marker);
          });

          // Listen for changes to TotalQuota and update the info window content
          const binRef = ref(
            db,
            `GarbageBinControlNumber/${binUID}/TotalQuota`
          );
          onValue(binRef, (snapshot) => {
            const totalQuotaElement = contentDiv.querySelector("#totalQuota");
            if (totalQuotaElement) {
              totalQuotaElement.textContent = `Total Quota: ${snapshot.val()}`;
            }
          });

          // Store marker
          markers[binUID] = marker;
        }
      } else {
        // Remove marker if it exists
        if (markers[binUID]) {
          markers[binUID].setMap(null);
          delete markers[binUID];
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const districtDropdown = document.getElementById("district");
  const barangayDropdown = document.getElementById("barangay");
  const selectButton = document.getElementById("selectButton");
  const cancelButton = document.getElementById("cancelButton");

  // Initially disable the Select and Cancel buttons
  selectButton.disabled = true;
  cancelButton.disabled = true;

  // Event listener for District dropdown change
  districtDropdown.addEventListener("change", () => {
    const selectedDistrict = districtDropdown.value;
    // Clear existing options
    barangayDropdown.innerHTML =
      '<option value="" selected disabled>Select Barangay</option>';

    // Populate barangay options based on selected district
    switch (selectedDistrict) {
      case "1":
        populateBarangay([1, 4, 7, 168]);
        break;
      case "2":
        populateBarangay([2, 5, 8]);
        break;
      case "3":
        populateBarangay([3, 6, 9]);
        break;
      default:
        // District not selected
        barangayDropdown.disabled = true;
        break;
    }
    // Enable/disable Select button based on District and Barangay selection
    validateSelection();
  });

  // Event listener for Barangay dropdown change
  barangayDropdown.addEventListener("change", () => {
    validateSelection();
  });

  // Define the filterMarkers function outside the addMarkersFromFirebase function
  function filterMarkers(binsData, selectedDistrict, selectedBarangay) {
    for (const binUID in markers) {
      const binData = binsData[binUID];
      if (
        binData &&
        binData.Users &&
        binData.Users[Object.keys(binData.Users)[0]]
      ) {
        // Extract numerical district and barangay values
        const districtMatch =
          binData.Users[Object.keys(binData.Users)[0]].district.match(/\d+/);
        const barangayMatch =
          binData.Users[Object.keys(binData.Users)[0]].barangay.match(/\d+/);
        // Check if matches are found and extract values
        const district = districtMatch ? districtMatch[0] : "";
        const barangay = barangayMatch ? barangayMatch[0] : "";
        // Check if the marker matches the selected district and barangay
        if (district !== selectedDistrict || barangay !== selectedBarangay) {
          // If not a match, remove marker
          markers[binUID].setMap(null);
          delete markers[binUID];
        }
      }
    }
  }

  // Event listener for Select button click
  selectButton.addEventListener("click", () => {
    // Get the selected values from the dropdowns
    const selectedDistrict = districtDropdown.value;
    const selectedBarangay = barangayDropdown.value;

    // Fetch all GCN entries from the database
    const binsRef = ref(db, "GarbageBinControlNumber");
    onValue(binsRef, (snapshot) => {
      const binsData = snapshot.val(); // Define binsData here

      // Filter markers based on selected district and barangay
      filterMarkers(binsData, selectedDistrict, selectedBarangay);

      // Disable the "Select" button and enable the "Cancel" button
      selectButton.disabled = true;
      cancelButton.disabled = false;
    });
  });

  // Event listener for Cancel button click
  cancelButton.addEventListener("click", () => {
    cancelButton.disabled = true;
    selectButton.disabled = false;
    // Reset dropdowns to initial state
    districtDropdown.value = "";
    barangayDropdown.innerHTML =
      '<option value="" selected disabled>Select Barangay</option>';
    barangayDropdown.disabled = true;
    // Disable Select button if both dropdowns are empty
    selectButton.disabled = true;
  });

  // Function to validate dropdown selection and enable/disable Select button
  function validateSelection() {
    if (districtDropdown.value !== "" && barangayDropdown.value !== "") {
      selectButton.disabled = false;
    } else {
      selectButton.disabled = true;
    }
  }

  // Function to populate Barangay dropdown
  function populateBarangay(barangayArray) {
    barangayArray.forEach((barangay) => {
      const option = document.createElement("option");
      option.value = barangay;
      option.textContent = barangay;
      barangayDropdown.appendChild(option);
    });
    // Enable the Barangay dropdown after populating options
    barangayDropdown.disabled = false;
  }
});

export { addMarkersFromFirebase };
