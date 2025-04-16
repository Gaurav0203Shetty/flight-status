// app/page.js

export default async function Page() {
  const apiUrl = `https://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&flight_status=active&limit=100`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  if (!data || !data.data) {
    return <div>No flight data available</div>;
  }

  // Filter flights with known aircraft registration and type
  const filteredFlights = data.data.filter((flight) => {
    const aircraft = flight.aircraft;
    return (
      aircraft &&
      aircraft.registration &&
      aircraft.iata &&
      aircraft.icao
    );
  });

  if (filteredFlights.length === 0) {
    return <div>No active flights with complete aircraft information available.</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Active Flights with Known Aircraft Details</h1>
      {filteredFlights.slice(0, 10).map((flight, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            margin: '1rem 0',
            padding: '1rem',
          }}
        >
          <h2>
            {flight.airline?.name || 'Unknown Airline'} Flight {flight.flight?.iata || 'N/A'}
          </h2>
          <p>
            <strong>Departure:</strong> {flight.departure?.airport || 'N/A'} ({flight.departure?.iata || 'N/A'}) at{' '}
            {flight.departure?.scheduled
              ? new Date(flight.departure.scheduled).toLocaleString()
              : 'N/A'}
          </p>
          <p>
            <strong>Arrival:</strong> {flight.arrival?.airport || 'N/A'} ({flight.arrival?.iata || 'N/A'}) at{' '}
            {flight.arrival?.scheduled
              ? new Date(flight.arrival.scheduled).toLocaleString()
              : 'N/A'}
          </p>
          <p>
            <strong>Status:</strong> {flight.flight_status || 'N/A'}
          </p>
          <p>
            <strong>Aircraft:</strong> IATA: {flight.aircraft.iata}, ICAO: {flight.aircraft.icao}
            <br />
            <strong>Registration:</strong> {flight.aircraft.registration}
          </p>
          {flight.live && (
            <p>
              <strong>Live Location:</strong> {flight.live.latitude}, {flight.live.longitude}
            </p>
          )}
          {flight.live && flight.live.is_ground && (
            <p style={{ color: 'blue' }}>Flight is currently on the ground.</p>
          )}
          {flight.live && !flight.live.is_ground && (
            <p style={{ color: 'green' }}>Flight is currently in the air.</p>
          )}
        </div>
      ))}
    </div>
  );
}
