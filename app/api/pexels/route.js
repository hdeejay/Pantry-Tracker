import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching from Pexels' }, { status: 500 });
  }
}