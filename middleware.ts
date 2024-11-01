import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/poap-api/')) {
    const apiUrl = new URL(request.url.replace('/poap-api/', ''), 'https://api.poap.tech/')

    const response = await fetch(apiUrl, {
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_POAP_API_KEY || '',
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/poap-api/:path*',
}
