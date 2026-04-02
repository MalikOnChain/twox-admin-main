import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { API_URL } from '@/lib/api'

import { CheckResult } from '@/types/site-settings'

export const checkIP = async (ip: string): Promise<CheckResult> => {
  try {
    const res = await fetch(`${API_URL}/public/check-geo?ip=${ip}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    const data = await res.json()
    return data.result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow requests to Next.js internal paths or the blocked page
  if (pathname.startsWith('/_next') || pathname === '/blocked') {
    return NextResponse.next()
  }

  // GEO-BLOCKING DISABLED - Comment out the following code to remove country restrictions
  // // Determine viewer's IP
  // const hdrs = await headers()
  // const xfwd = hdrs.get('x-forwarded-for') || ''
  // const ip = xfwd.split(',')[0] || ''

  // // Lookup GeoIP
  // const lookup = await checkIP(ip)

  // if (!lookup || lookup?.blocked) {
  //   return NextResponse.rewrite(new URL('/blocked', request.url))
  // }

  return NextResponse.next()
}

// Apply to all paths
export const config = {
  matcher: '/:path*',
}
