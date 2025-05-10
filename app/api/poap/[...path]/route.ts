import { NextResponse } from 'next/server';

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { path: ['actions', 'scan', ':address'] },
    { path: ['token', ':tokenId'] },
    { path: ['actions', 'scan', ':address', 'layer2'] }
  ];
}

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const apiUrl = new URL(path, 'https://api.poap.tech/');

    const response = await fetch(apiUrl, {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_POAP_API_KEY || '',
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from POAP API: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POAP API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
