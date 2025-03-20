"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { notFound } from "next/navigation";
import { airplaneIcon } from "@/lib/leafletIcons"; // <-- Import your custom icon

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FlightMapPage() {
  const { flightId } = useParams();
  const { data, error } = useSWR(
    flightId ? `/api/flights?searchTerm=${encodeURIComponent(flightId)}` : null,
    fetcher,
    { refreshInterval: 30000 } // optional auto-refresh
  );

  if (error) return <p>Error loading flight data.</p>;
  if (!data) return <p>Loading flight data...</p>;

  // Assume your API returns flight data in data.data
  const flight = data.data && data.data.length > 0 ? data.data[0] : null;
  if (!flight || !flight.live || flight.live.is_ground) {
    notFound();
  }

  const { latitude, longitude } = flight.live;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {flight.airline?.name} — Flight {flight.flight?.iata || flight.flight?.number}
      </h1>
      <p className="mb-4">
        Departure: {flight.departure?.airport} at{" "}
        {new Date(flight.departure?.scheduled).toLocaleString()}
        <br />
        Arrival: {flight.arrival?.airport} at{" "}
        {new Date(flight.arrival?.scheduled).toLocaleString()}
      </p>

      <div className="h-[500px]">
        <MapContainer
          center={[latitude, longitude]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Pass the custom icon to the Marker */}
          <Marker position={[latitude, longitude]} icon={airplaneIcon}>
            <Popup>
              <div className="flex items-center gap-2">
                <span>{flight.airline?.name} Flight {flight.flight?.iata || flight.flight?.number}</span>
              </div>
              <div>
                Current Position: [{latitude.toFixed(2)}, {longitude.toFixed(2)}]
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
