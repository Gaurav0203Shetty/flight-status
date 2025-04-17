
# Flight Status App

A modern web application built with Next.js 14, designed to help users track real-time flight statuses, view flight routes on a map, and search for flights by number or airline.




## Features

- **Flight Search:** Search for flights using flight number or airline name.
- **Live Flight Tracking:** View real-time flight location with aircraft type and registration.
- **Interactive Map:** Visualize live flights and routes on a Leaflet-powered map.
- **Flight Details:** Get detailed info including terminals, gates, schedules, status, and aircraft info.


## Tech Stack

**Framework:** Next.js 14 (App Router)

**Language:** TypeScript / JavaScript

**Styling:** Tailwind CSS

**UI Components:** ShadCN UI

**Mapping:** Leaflet.js + React-Leaflet

**Flight Data:** AviationStack API

**Icons:** Custom Leaflet icons for live flights


## Installation

1. Clone the Repository

```bash
  git clone https://github.com/Gaurav0203Shetty/flight-status
  cd flight-status-app
```

2. Install Dependencies

```bash
  npm install
```

3. Set Up Environment Variables

- Create a .env.local file in the root directory:

```bash
  AVIATIONSTACK_API_KEY=your_api_key_here
```

4. Run the App

```bash
  npm run dev
```

5. Open http://localhost:3000 in your browser.


## Notes

- The AviationStack free plan has limitations (delay, limited endpoints).

- Some aircraft data may be missing depending on flight data availability.

- Leaflet map and icon rendering happens only on the client ('use client').


## Future Enhancements

- Add filters (airline, status, origin/destination)

- Better map interaction (hover to highlight flights)

- Save & track specific flights

- Auto-refresh live flights

