import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { CUSTOMER_COOKIE, createCustomerCookieValue, registerCustomerMembership } from '@/lib/customer-auth'

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; name?: unknown; phone?: unknown } | null

  try {
    const membership = await registerCustomerMembership({
      email: typeof body?.email === 'string' ? body.email : '',
      name: typeof body?.name === 'string' ? body.name : '',
      phone: typeof body?.phone === 'string' ? body.phone : undefined,
    })

    const cookieStore = await cookies()
    cookieStore.set({
      name: CUSTOMER_COOKIE,
      value: createCustomerCookieValue(membership.email, {
        name: membership.name,
        phone: membership.phone,
      }),
      ...cookieOptions(),
    })

    return NextResponse.json({ authenticated: true, membership })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: error instanceof Error ? error.message : 'Không đăng ký được.' },
      { status: 400 },
    )
  }
}
