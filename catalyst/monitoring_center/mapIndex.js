function createMap2() {
  var mapDiv = document.getElementById("roadmap");
  var map = new google.maps.Map(mapDiv, {
    center: { lat: 14.766794722678402, lng: 121.03637727931373 },
    zoom: 19,
    disableDefaultUI: true,
    styles: [
      [
        {
          featureType: "administrative",
          elementType: "all",
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
              visibility: "simplified",
            },
            {
              hue: "#0066ff",
            },
            {
              saturation: 74,
            },
            {
              lightness: 100,
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
            {
              weight: 0.6,
            },
            {
              saturation: -85,
            },
            {
              lightness: 61,
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {
              visibility: "on",
            },
          ],
        },
        {
          featureType: "road.arterial",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "road.local",
          elementType: "all",
          stylers: [
            {
              visibility: "on",
            },
          ],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
          ],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified",
            },
            {
              color: "#5f94ff",
            },
            {
              lightness: 26,
            },
            {
              gamma: 5.86,
            },
          ],
        },
      ],
    ],
  });
  var kmlLayer = new google.maps.KmlLayer({
    url: "https://drive.google.com/uc?export=download&id=1PA1BBO1-1J9s9wdD09DelC2eWPGh4F_8",
    map: map,
  });

  // Add the marker to the map
  var marker = new google.maps.Marker({
    position: { lat: 14.777348, lng: 121.044475 }, // Use the latitude and longitude where you want to display the circle
    map: map,
    icon: {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="red" stroke="white" stroke-width="2" /></svg>'
        ),
      scaledSize: new google.maps.Size(35, 35), // Set the size of the marker
      origin: new google.maps.Point(0, 0), // Set the origin point
      anchor: new google.maps.Point(10, 10), // Set the anchor point
      scale: 1, // Set the scale of the marker
    },
  });
}

function initMaps() {
  createMap2();
  initMap();
}
