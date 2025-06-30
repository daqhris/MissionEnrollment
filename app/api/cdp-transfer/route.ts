import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'CDP SDK approach deprecated', 
      details: 'This endpoint has been replaced with OnchainKit Transaction component for gasless donations.',
      timestamp: new Date().toISOString()
    },
    { status: 410 }
  );
}
