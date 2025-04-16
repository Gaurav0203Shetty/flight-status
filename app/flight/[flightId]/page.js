"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { notFound } from "next/navigation";
import { airplaneIcon } from "@/lib/leafletIcons";
import { point, greatCircle } from "@turf/turf";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer   = dynamic(() => import("react-leaflet").then(m => m.TileLayer),   { ssr: false });
const Marker      = dynamic(() => import("react-leaflet").then(m => m.Marker),      { ssr: false });
const Popup       = dynamic(() => import("react-leaflet").then(m => m.Popup),       { ssr: false });
const Polyline    = dynamic(() => import("react-leaflet").then(m => m.Polyline),    { ssr: false });

const fetcher = url => fetch(url).then(r => r.json());

export default function FlightMapPage() {
  const { flightId } = useParams();

  // 1) Flight data
  const { data: flightData, error: flightError } = useSWR(
    flightId ? `/api/flights?searchTerm=${encodeURIComponent(flightId)}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  // Derive flight object
  const flight = flightData?.data?.[0] ?? null;

  // 2) Departure & Arrival IATA codes
  const depIata = flight?.departure?.iata ?? null;
  const arrIata = flight?.arrival?.iata ?? null;

  // 3) Fetch airport details (always call hooks in same order!)
  const { data: depInfo, error: depError } = useSWR(
    depIata ? `/api/airports?iata=${depIata}` : null,
    fetcher
  );
  const { data: arrInfo, error: arrError } = useSWR(
    arrIata ? `/api/airports?iata=${arrIata}` : null,
    fetcher
  );

  // 4) Loading / Error handling
  if (flightError || depError || arrError) {
    return <p className="text-red-500">Error loading data.</p>;
  }
  if (!flightData || !depInfo || !arrInfo) {
    return <p>Loading flight & airport data…</p>;
  }

  // 5) Validate flight & live data
  if (!flight || !flight.live || flight.live.is_ground) {
    notFound();
  }

  const { latitude, longitude } = flight.live;

  // 6) Extract true airport coordinates
  const depAirport = depInfo.data?.[0];
  const arrAirport = arrInfo.data?.[0];
  if (!depAirport || !arrAirport) {
    return <p>Could not retrieve airport coordinates.</p>;
  }

  const depLat = parseFloat(depAirport.latitude);
  const depLng = parseFloat(depAirport.longitude);
  const arrLat = parseFloat(arrAirport.latitude);
  const arrLng = parseFloat(arrAirport.longitude);

  // 7) Compute great-circle arc
  let arcCoords = [];
  if (![depLat, depLng, arrLat, arrLng].some(isNaN)) {
    const start = point([depLng, depLat]);
    const end   = point([arrLng, arrLat]);
    const line  = greatCircle(start, end, { npoints: 100 });
    arcCoords   = line.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {flight.airline?.name} — Flight {flight.flight?.iata || flight.flight?.number}
      </h1>
      <p className="mb-4">
        Departure: {flight.departure.airport} at{" "}
        {new Date(flight.departure.scheduled).toLocaleString()}
        <br />
        Arrival: {flight.arrival.airport} at{" "}
        {new Date(flight.arrival.scheduled).toLocaleString()}
      </p>

      <div className="h-[500px]">
        <MapContainer
          center={[latitude, longitude]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[latitude, longitude]} icon={airplaneIcon}>
            <Popup>
              <div className="flex items-center gap-2">
                {flight.airline.name} Flight {flight.flight.iata || flight.flight.number}
              </div>
              <div>
                Current Position: [{latitude.toFixed(2)}, {longitude.toFixed(2)}]
              </div>
            </Popup>
          </Marker>

          {arcCoords.length > 0 && (
            <Polyline positions={arcCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
