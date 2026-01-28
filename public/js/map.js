const [lng,lat] = coordinates;
const latlng = [lat ,lng];
var map = L.map('map').setView(latlng, 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// for map marking 
L.marker(latlng).addTo(map);
var popup = L.popup(latlng, {content:'<h6>Exact location providing after booking</h6>'}).openOn(map);
