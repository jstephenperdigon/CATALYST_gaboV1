import { db, ref, onValue, off } from "./firebaseConfig.js";

// Function to add markers from Firebase data
function addMarkersFromFirebase(map) {
    // Query Firebase to get garbage bin locations
    const binsRef = ref(db, 'GarbageBinControlNumber');

    // Object to store markers for later updates
    let markers = {};

    // Listen for changes in the bins data
    onValue(binsRef, (snapshot) => {
        const binsData = snapshot.val();

        // Update existing markers or add new ones for bins with TotalQuota >= 4
        for (const binUID in binsData) {
            const binData = binsData[binUID];
            if (binData && binData.Location && binData.Users && binData.TotalQuota >= 4) {
                if (!markers[binUID]) {
                    markers[binUID] = addMarker(binUID, binData);
                }
            } else {
                if (markers[binUID]) {
                    markers[binUID].marker.setMap(null);
                    markers[binUID].infoWindow.close();
                    delete markers[binUID];
                }
            }
        }
    });

    // Function to add marker for a bin
    function addMarker(binUID, binData) {
        const location = binData.Location;
        const binLatLng = { lat: location.Latitude, lng: location.Longitude };

        const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";


        // Iterate through Users object to retrieve barangay and district
        let barangay, district;
        for (const userID in binData.Users) {
            const user = binData.Users[userID];
            barangay = user.barangay;
            district = user.district;
            // Assuming only one user data is relevant here, you can break after the first iteration
            break;
        }

        // Create content for the info window
        const infoContent = `
            <div>
                <h3>Garbage Bin - ${binUID}</h3>
                <p>UID: ${binUID}</p>
                <p>Total Quota: ${binData.TotalQuota}</p>
                <p>Barangay: ${barangay}</p>
                <p>District: ${district}</p>
            </div>
        `;

        // Create marker for each garbage bin
        const marker = new google.maps.Marker({
            position: binLatLng,
            map: map,
            title: `Garbage Bin - ${binUID}`,
            icon: defaultIcon
        });

        // Create info window for the marker
        const infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });

        // Add click event listener to show info window when marker is clicked
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        // Return marker and infoWindow for later updates
        return { marker, infoWindow };
    }

    // Stop listening for changes when this function is called
    return function () {
        off(binsRef);
    };
}

export { addMarkersFromFirebase };
