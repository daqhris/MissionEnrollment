```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  const apiUrl = new URL(path, 'https://api.poap.tech/');

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_POAP_API_KEY || '',
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch POAP data' }, { status: 500 });
  }
}
```
