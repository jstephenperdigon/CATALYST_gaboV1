let map;
let marker;
let latitudeInput = document.getElementById("latitude");
let longitudeInput = document.getElementById("longitude");

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.7101668, lng: 120.9473325 },
    zoom: 15,
    disableDefaultUI: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text",
        stylers: [
          {
            color: "#878787",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          {
            color: "#f9f5ed",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          {
            color: "#f5f5f5",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#c9c9c9",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#aee0f4",
          },
        ],
      },
    ],
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        latitudeInput.value = latitude;
        longitudeInput.value = longitude;

        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(20);

        // Set marker position
        marker.setPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
