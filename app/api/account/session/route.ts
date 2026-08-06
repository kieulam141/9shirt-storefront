import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  CUSTOMER_COOKIE,
  assertValidCustomerEmail,
  createCustomerCookieValue,
  getCustomerMembership,
  readCustomerSession,
} from '@/lib/customer-auth'

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const session = readCustomerSession(cookieStore.get(CUSTOMER_COOKIE)?.value)
  const email = session?.email

  if (!email) {
    return NextResponse.json({ authenticated: false, membership: null })
  }

  return NextResponse.json({
    authenticated: true,
    membership: await getCustomerMembership(email, session),
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown } | null
  const rawEmail = typeof body?.email === 'string' ? body.email : ''

  try {
    const email = assertValidCustomerEmail(rawEmail)
    const membership = await getCustomerMembership(email)
    const cookieStore = await cookies()
    cookieStore.set({
      name: CUSTOMER_COOKIE,
      value: createCustomerCookieValue(email),
      ...cookieOptions(),
    })

    return NextResponse.json({ authenticated: true, membership })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: error instanceof Error ? error.message : 'Không đăng nhập được.' },
      { status: 400 },
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: CUSTOMER_COOKIE,
    value: '',
    ...cookieOptions(),
    maxAge: 0,
  })

  return NextResponse.json({ authenticated: false, membership: null })
}
