'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function FlightSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFlights([]);
    setLoading(true);

    try {
      const res = await fetch(`/api/flights?searchTerm=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) {
        throw new Error('Unable to fetch flight data');
      }
      const data = await res.json();

      if (data?.data?.length) {
        setFlights(data.data);
      } else {
        setError('No flights found for that query.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Flight Search</CardTitle>
          <CardDescription>
            Enter a flight number (e.g. "2402"), airline name (e.g. "delta"), or a combined code (e.g. "AI506").
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              placeholder="e.g. AI506 or delta"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" disabled={!searchTerm || loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {flights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {flights.map((flight, idx) => {
            const airlineName = flight.airline?.name || 'Unknown Airline';
            const flightNum = flight.flight?.iata || flight.flight?.number || '---';
            const depAirport = flight.departure?.airport || 'N/A';
            const depIata = flight.departure?.iata || '---';
            const depTerminal = flight.departure?.terminal || 'N/A';
            const depGate = flight.departure?.gate || 'N/A';
            const depTime = flight.departure?.scheduled
              ? new Date(flight.departure.scheduled).toLocaleString()
              : '---';

            const arrAirport = flight.arrival?.airport || 'N/A';
            const arrIata = flight.arrival?.iata || '---';
            const arrTerminal = flight.arrival?.terminal || 'N/A';
            const arrGate = flight.arrival?.gate || 'N/A';
            const baggage = flight.arrival?.baggage || 'N/A';
            const arrTime = flight.arrival?.scheduled
              ? new Date(flight.arrival.scheduled).toLocaleString()
              : '---';

            const status = flight.flight_status || 'N/A';

            const isActive = flight.live && !flight.live.is_ground;
            const flightId = flight.flight?.iata || idx;

            const CardContentComponent = (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>
                    {airlineName} — Flight {flightNum}
                  </CardTitle>
                  <CardDescription>Status: {status}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">Departure</p>
                    <p>
                      {depAirport} ({depIata})<br />
                      Terminal: {depTerminal} | Gate: {depGate}<br />
                      Scheduled: {depTime}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">Arrival</p>
                    <p>
                      {arrAirport} ({arrIata})<br />
                      Terminal: {arrTerminal} | Gate: {arrGate}<br />
                      Baggage: {baggage}<br />
                      Scheduled: {arrTime}
                    </p>
                    <br />
                    <p>
                      <strong>Aircraft:</strong> {flight.aircraft?.model} ({flight.aircraft?.icao})
                      <br />
                      <strong>Registration:</strong> {flight.aircraft?.registration}
                    </p>
                    {flight.live && (
                      <p>
                        <strong>Live Location:</strong> {flight.live.latitude}, {flight.live.longitude}
                      </p>
                    )}
                    {flight.live && flight.live.is_ground && (
                      <p className="text-blue-500">Flight is currently on the ground.</p>
                    )}
                    {flight.live && !flight.live.is_ground && (
                      <p className="text-green-500">Flight is currently in the air.</p>
                    )}
                    <br />
                    <p>Click card to view location on map</p>
                  </div>
                </CardContent>
              </Card>
            );

            return isActive ? (
              <Link key={idx} href={`/flight/${flightId}`}>
                {CardContentComponent}
              </Link>
            ) : (
              <div key={idx}>{CardContentComponent}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
