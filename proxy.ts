import { NextResponse, type NextRequest } from 'next/server'
import { getLangFromSearchParams, isVietnameseDefaultHost, normalizeHost, PRIMARY_HOST } from '@/lib/seo'

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const requestHost = request.headers.get('host') || url.hostname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(
    'x-hiwaii-lang',
    getLangFromSearchParams({ lang: url.searchParams.get('lang') ?? undefined }, requestHost),
  )

  // Skip host enforcement in local development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  let changed = false

  if (normalizeHost(requestHost) !== PRIMARY_HOST && !isVietnameseDefaultHost(requestHost)) {
    url.hostname = PRIMARY_HOST
    changed = true
  }

  if (changed) {
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
