import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const iata = searchParams.get('iata');
  if (!iata) {
    return NextResponse.json({ error: 'Missing iata' }, { status: 400 });
  }

  // Fetch airport info (including latitude & longitude)
  const apiUrl = `https://api.aviationstack.com/v1/airports?access_key=${process.env.AVIATIONSTACK_API_KEY}&iata_code=${iata}`;
  const res    = await fetch(apiUrl);
  const json   = await res.json();
  return NextResponse.json(json);
}
