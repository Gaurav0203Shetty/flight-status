// lib/leafletIcons.js
import L from "leaflet";

// Example icon size & anchor; adjust as needed
export const airplaneIcon = L.icon({
  iconUrl: "/icons/airplane.png",  // Make sure /public/icons/airplane.png exists
  iconRetinaUrl: "/icons/airplane.png",
  iconSize: [32, 32],        // size of the icon in pixels
  iconAnchor: [16, 16],      // point of the icon which will correspond to marker's location
  popupAnchor: [0, -16],     // point from which the popup should open relative to the iconAnchor
  className: "leaflet-airplane-icon", // optional class for styling
});
