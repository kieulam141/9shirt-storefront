import { createHmac, timingSafeEqual } from 'node:crypto'

export const CUSTOMER_COOKIE = 'hiwaii_customer'

export type CustomerMembership = {
  email: string
  name: string
  phone?: string
  tier: string
  points: number
  odooCustomerCode?: string
  syncedFromOdoo: boolean
}

const COOKIE_VERSION = 'v1'

function getCustomerSecret(): string {
  return process.env.CUSTOMER_AUTH_SECRET || process.env.HIWAII_ADMIN_PASSWORD || 'hiwaii-local-customer-secret'
}

export type CustomerSession = {
  email: string
  name?: string
  phone?: string
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function sign(value: string): string {
  return createHmac('sha256', getCustomerSecret()).update(value).digest('hex')
}

function safeCompareHex(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export function createCustomerCookieValue(email: string, profile?: { name?: string; phone?: string }): string {
  const normalizedEmail = normalizeEmail(email)
  const payload = Buffer.from(JSON.stringify({
    v: COOKIE_VERSION,
    email: normalizedEmail,
    name: profile?.name?.trim() || undefined,
    phone: profile?.phone?.trim() || undefined,
  }), 'utf8').toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function readCustomerSession(cookieValue?: string): CustomerSession | null {
  if (!cookieValue) return null
  const [payload, signature] = cookieValue.split('.')
  if (!payload || !signature || !safeCompareHex(signature, sign(payload))) return null

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { v?: string; email?: string; name?: string; phone?: string }
    if (parsed.v !== COOKIE_VERSION || typeof parsed.email !== 'string') return null
    const email = normalizeEmail(parsed.email)
    return isEmail(email)
      ? {
        email,
        name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : undefined,
        phone: typeof parsed.phone === 'string' && parsed.phone.trim() ? parsed.phone.trim() : undefined,
      }
      : null
  } catch {
    return null
  }
}

export function readCustomerEmail(cookieValue?: string): string | null {
  return readCustomerSession(cookieValue)?.email || null
}

function fallbackName(email: string): string {
  return email.split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() || ''}${part.slice(1)}`)
    .join(' ') || '9Shirt Member'
}

function fallbackMembership(email: string, nameInput?: string, phoneInput?: string): CustomerMembership {
  return {
    email,
    name: nameInput?.trim() || fallbackName(email),
    phone: phoneInput?.trim() || undefined,
    tier: 'Member',
    points: 0,
    syncedFromOdoo: false,
  }
}

function normalizeMembership(email: string, raw: unknown, fallback?: { name?: string; phone?: string }): CustomerMembership {
  if (!raw || typeof raw !== 'object') return fallbackMembership(email, fallback?.name, fallback?.phone)
  const source = raw as Record<string, unknown>
  const name = typeof source.name === 'string' && source.name.trim() ? source.name.trim() : fallbackMembership(email, fallback?.name).name
  const phone = typeof source.phone === 'string' && source.phone.trim()
    ? source.phone.trim()
    : typeof source.mobile === 'string' && source.mobile.trim()
      ? source.mobile.trim()
      : fallback?.phone
  const tier = typeof source.tier === 'string' && source.tier.trim()
    ? source.tier.trim()
    : typeof source.membership === 'string' && source.membership.trim()
      ? source.membership.trim()
      : 'Member'
  const points = typeof source.points === 'number'
    ? source.points
    : typeof source.loyalty_points === 'number'
      ? source.loyalty_points
      : 0
  const odooCustomerCode = typeof source.odooCustomerCode === 'string'
    ? source.odooCustomerCode
    : typeof source.default_code === 'string'
      ? source.default_code
      : typeof source.ref === 'string'
        ? source.ref
        : undefined

  return {
    email,
    name,
    phone,
    tier,
    points,
    odooCustomerCode,
    syncedFromOdoo: true,
  }
}

export async function getCustomerMembership(emailInput: string, fallback?: { name?: string; phone?: string }): Promise<CustomerMembership> {
  const email = normalizeEmail(emailInput)
  if (!isEmail(email)) {
    throw new Error('Email không hợp lệ.')
  }

  const endpoint = process.env.ODOO_CUSTOMER_MEMBERSHIP_URL
  if (!endpoint) return fallbackMembership(email, fallback?.name, fallback?.phone)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.ODOO_API_KEY ? { Authorization: `Bearer ${process.env.ODOO_API_KEY}` } : {}),
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })

    if (!response.ok) return fallbackMembership(email, fallback?.name, fallback?.phone)
    return normalizeMembership(email, await response.json(), fallback)
  } catch {
    return fallbackMembership(email, fallback?.name, fallback?.phone)
  }
}

export function assertValidCustomerEmail(emailInput: string): string {
  const email = normalizeEmail(emailInput)
  if (!isEmail(email)) throw new Error('Email không hợp lệ.')
  return email
}

export async function registerCustomerMembership(input: { email: string; name: string; phone?: string }): Promise<CustomerMembership> {
  const email = assertValidCustomerEmail(input.email)
  const name = input.name.trim()
  const phone = input.phone?.trim()

  if (!name) {
    throw new Error('Bạn nhập tên giúp shop nhé.')
  }

  const endpoint = process.env.ODOO_CUSTOMER_REGISTER_URL || process.env.ODOO_CUSTOMER_MEMBERSHIP_URL
  if (!endpoint) return fallbackMembership(email, name, phone)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.ODOO_API_KEY ? { Authorization: `Bearer ${process.env.ODOO_API_KEY}` } : {}),
      },
      body: JSON.stringify({ email, name, phone, source: '9shirt-website' }),
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })

    if (!response.ok) return fallbackMembership(email, name, phone)
    return normalizeMembership(email, await response.json(), { name, phone })
  } catch {
    return fallbackMembership(email, name, phone)
  }
}
