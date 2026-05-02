import { NextResponse, type NextRequest } from 'next/server'
import { PRIMARY_HOST } from '@/lib/seo'

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Skip host enforcement in local development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  let changed = false

  if (url.hostname !== PRIMARY_HOST) {
    url.hostname = PRIMARY_HOST
    changed = true
  }

  if (changed) {
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
