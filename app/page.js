export default async function Page() {
    const apiUrl = `https://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&limit=10`;

    const res = await fetch(apiUrl);
    const data = await res.json();
  
    if (!data || !data.data) {
      return <div>No flight data available</div>;
    }
  
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>Flight Status</h1>
        {data.data.map((flight, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              margin: '1rem 0',
              padding: '1rem'
            }}
          >
            <h2>
              {flight.airline.name} Flight {flight.flight.iata || 'N/A'}
            </h2>
            <p>
              <strong>Departure:</strong> {flight.departure.airport} ({flight.departure.iata}) at{' '}
              {new Date(flight.departure.scheduled).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong> {flight.arrival.airport} ({flight.arrival.iata}) at{' '}
              {new Date(flight.arrival.scheduled).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {flight.flight_status}
            </p>
          </div>
        ))}
      </div>
    );
  }
  