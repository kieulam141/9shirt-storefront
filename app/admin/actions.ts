import { createHmac, timingSafeEqual } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { writeCatalogFile } from '@/lib/catalog/storage'
import { normalizeCatalog } from '@/lib/catalog/validation'
import { products } from '@/lib/products'

import type { Product } from '@/lib/catalog/types'

export const ADMIN_COOKIE = 'hiwaii_admin'

const ADMIN_COOKIE_MESSAGE = 'hiwaii-admin-authenticated'

function getAdminPassword(): string | undefined {
  return process.env.HIWAII_ADMIN_PASSWORD ?? process.env.HIWAIi_ADMIN_PASSWORD
}

function getAdminCookieValue(adminPassword: string): string {
  return createHmac('sha256', adminPassword).update(ADMIN_COOKIE_MESSAGE).digest('hex')
}

function isValidAdminCookie(value: string | undefined, adminPassword: string): boolean {
  if (!value) return false

  const expected = Buffer.from(getAdminCookieValue(adminPassword), 'hex')
  const actual = Buffer.from(value, 'hex')

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(getAdminPassword())
}

export async function isAdminAuthenticated(): Promise<boolean> {
  'use server'

  const adminPassword = getAdminPassword()
  const cookieStore = await cookies()

  return Boolean(adminPassword && isValidAdminCookie(cookieStore.get(ADMIN_COOKIE)?.value, adminPassword))
}

export async function loginAdmin(formData: FormData): Promise<void> {
  'use server'

  const adminPassword = getAdminPassword()
  const password = formData.get('password')

  if (!adminPassword || typeof password !== 'string' || password !== adminPassword) {
    redirect('/admin/login?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set({
    name: ADMIN_COOKIE,
    value: getAdminCookieValue(adminPassword),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
  })

  redirect('/admin/products')
}

export async function logoutAdmin(): Promise<void> {
  'use server'

  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)

  redirect('/admin/login')
}

export type SaveProductResult = {
  ok: boolean
  errors: string[]
}

export async function saveProduct(product: Product): Promise<SaveProductResult> {
  'use server'

  if (!await isAdminAuthenticated()) {
    return { ok: false, errors: ['Admin authentication is required.'] }
  }

  const existingProductIndex = products.findIndex((item) => item.id === product.id)
  const nextProducts = existingProductIndex >= 0
    ? products.map((item, index) => (index === existingProductIndex ? product : item))
    : [...products, product]

  try {
    const normalizedProducts = normalizeCatalog(nextProducts)
    await writeCatalogFile(normalizedProducts)
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : 'Unable to save product.'],
    }
  }

  revalidatePath('/')
  revalidatePath('/collections')
  revalidatePath(`/product/${product.id}`)
  revalidatePath('/admin/products')

  return { ok: true, errors: [] }
}
