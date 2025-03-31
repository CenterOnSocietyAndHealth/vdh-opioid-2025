import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const indicator = searchParams.get('indicator');

    if (!indicator) {
      return NextResponse.json(
        { error: 'Missing indicator parameter' },
        { status: 400 }
      );
    }

    const query = `*[_type == "locality"] | order(counties asc) {
      _id,
      counties,
      fips,
      "${indicator}": coalesce(${indicator}, 0)
    }`;

    const localities = await client.fetch<Array<{
      _id: string;
      counties: string;
      fips: string;
      [key: string]: any;
    }>>(query);

    // Transform the data into a format suitable for the map
    const data = localities.reduce((acc: Record<string, number>, locality) => {
      acc[locality.counties] = locality[indicator];
      return acc;
    }, {});

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching costs data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch costs data' },
      { status: 500 }
    );
  }
} 