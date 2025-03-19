import { NextResponse } from 'next/server';

// Basic mapping for known airline names if needed
const airlineMap = {
    'delta': 'DL',
    'american': 'AA',
    'united': 'UA',
    'southwest': 'WN',
    'air canada': 'AC',
    'air india': 'AI',
    'air france': 'AF',
    'air china': 'CA',
    'air new zealand': 'NZ',
    'alaska airlines': 'AS',
    'all nippon airways': 'NH',
    'british airways': 'BA',
    'cathay pacific': 'CX',
    'emirates': 'EK',
    'etihad airways': 'EY',
    'hawaiian airlines': 'HA',
    'jetblue': 'B6',
    'korean air': 'KE',
    'lufthansa': 'LH',
    'qantas': 'QF',
    'qatar airways': 'QR',
    'singapore airlines': 'SQ',
    'virgin atlantic': 'VS',
    'virgin australia': 'VA',
    'allegiant air': 'G4',
    'frontier airlines': 'F9',
    'spirit airlines': 'NK',
    'scoot': 'TR',
    'volaris': 'Y4',
    'air india express': 'IX',
    'akasa air': 'QP',
    'air arabia': 'G9',
    'air astana': 'KC',
    'air austral': 'UU',
    'air baltic': 'BT',
    'air botswana': 'BP',
    'air canada rouge': 'RV',
    'air caraibes': 'TX',
    'air china': 'CA',
    'air corsica': 'XK',
    'indigo': '6E',
    'spicejet': 'SG',
    'goair': 'G8',
    'air asia': 'AK',
    'malaysia airlines': 'MH',
    'silkair': 'MI',
    'jetstar': 'JQ',
    'tigerair': 'TR',
    'cathay dragon': 'KA',
    'airasia x': 'D7',
    'scoot tigerair': 'TR',
    'airasia': 'AK',
    'jetstar asia': '3K',
    'jetstar pacific': 'BL',
    'scoot': 'TR',
    'tigerair': 'TR',
    'vietjet air': 'VJ',
    'vietnam airlines': 'VN',
    'bamboo airways': 'QH',
    'jetstar japan': 'GK',
    'peach aviation': 'MM',
    'vanilla air': 'JW',
    'air do': 'HD',
    'solaseed air': '6J',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm')?.trim() || '';

    let param = '';
    // Check if searchTerm is a combined flight search like "AI506"
    const combinedRegex = /^([A-Za-z]{2})(\d+)$/;
    const combinedMatch = searchTerm.match(combinedRegex);
    if (combinedMatch) {
      const airlineIata = combinedMatch[1].toUpperCase();
      const flightNum = combinedMatch[2];
      param = `airline_iata=${airlineIata}&flight_number=${flightNum}`;
    } else if (/^\d+$/.test(searchTerm)) {
      // If only digits, treat it as flight_number
      param = `flight_number=${searchTerm}`;
    } else {
      // Check if user typed a known airline name for mapping to IATA code
      const lower = searchTerm.toLowerCase();
      const knownIata = airlineMap[lower];
      if (knownIata) {
        param = `airline_iata=${knownIata}`;
      } else {
        // Fallback to searching by airline name
        param = `airline_name=${encodeURIComponent(searchTerm)}`;
      }
    }

    const apiUrl = `https://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&limit=5&${param}`;

    // Debug: Uncomment the next line to check your URL in development
    // console.log('DEBUG: API URL =>', apiUrl);

    const res = await fetch(apiUrl);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch flight data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight data.' },
      { status: 500 }
    );
  }
}
