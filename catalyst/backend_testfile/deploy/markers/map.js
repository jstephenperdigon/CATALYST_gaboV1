import { addMarkersFromFirebase } from "./mapFunction.js";

const centerMap = {
    lat: 14.772311100791017,
    lng: 121.05275209489858,
};
const mapOptions = {
    center: centerMap,
    zoom: 15,
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

// Export the initMap function
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    addMarkersFromFirebase(map);
}

// Make initMap accessible in the global scope
window.initMap = initMap;