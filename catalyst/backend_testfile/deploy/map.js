
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

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Marker positions, descriptions, and barangay
    const markers = [
        { position: { lat: 14.769617915353559, lng: 121.07431904782344 }, description: "GCN001", barangay: "1" },
        { position: { lat: 14.769826984613763, lng: 121.07434180712067 }, description: "GCN002", barangay: "1" },
        { position: { lat: 14.7695188824759, lng: 121.07366282142037 }, description: "GCN003", barangay: "1" },
        { position: { lat: 14.769214447791597, lng: 121.07394351941939 }, description: "GCN004", barangay: "1" },
        { position: { lat: 14.7693244844737, lng: 121.07458836617384 }, description: "GCN005", barangay: "1" },
        // Add more markers with positions, descriptions, and barangay as needed
    ];

    // Loop through markers and add markers with descriptions
    markers.forEach(markerData => {
        const marker = new google.maps.Marker({
            position: markerData.position,
            map: map,
            title: markerData.description, // Use the description as the marker title
        });

        // Create info window content
        const infoContent = `<strong>Description:</strong> ${markerData.description}<br><strong>Barangay:</strong> ${markerData.barangay}`;

        // Create info window for each marker
        const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
        });

        // Add click event listener to marker to open info window and fetch marker details
        marker.addListener("click", () => {
            fetchMarkerDetails(markerData.description, markerData.barangay);
            infoWindow.open(map, marker);
        });
    });
}

function fetchMarkerDetails(description, barangay) {
    // Get the input field
    const selectField = document.getElementById("selectField");

    // Get the current value of the input field
    let currentValue = selectField.value;

    // Append marker details to the current value
    currentValue += `(Description:${description}, Barangay:${barangay}) - `;

    // Update the input field with the new value
    selectField.value = currentValue;
}