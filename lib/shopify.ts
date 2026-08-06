import { priceUnitFor } from '@/lib/pricing'

type ShopifyDraftOrderItem = {
  id: string
  name: string
  size: string
  quantity: number
  price: number
}

type ShopifyDraftOrderInput = {
  orderId: string
  customer: {
    fullName: string
    email?: string
    phone: string
    address: string
  }
  items: ShopifyDraftOrderItem[]
  total: number
}

type ShopifyGraphQLError = {
  message: string
}

type ShopifyUserError = {
  field?: string[]
  message: string
}

type ShopifyDraftOrderResponse = {
  data?: {
    draftOrderCreate?: {
      draftOrder?: {
        id: string
        invoiceUrl?: string
      }
      userErrors: ShopifyUserError[]
    }
  }
  errors?: ShopifyGraphQLError[]
}

function getShopifyStoreDomain(): string | undefined {
  const raw = process.env.SHOPIFY_STORE || process.env.shopify_store
  if (!raw) return undefined
  return raw
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
}

function getShopifyAdminToken(): string | undefined {
  return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    || process.env.SHOPIFY_ACCESS_TOKEN
    || process.env.shopify_admin_access_token
    || process.env.token
}

function moneyAmount(value: number): string {
  const multiplier = Number(process.env.SHOPIFY_PRICE_MULTIPLIER || '')
  const normalized = Number.isFinite(multiplier) && multiplier > 0
    ? value * multiplier
    : priceUnitFor(value) === 'vndK'
      ? value * 1000
      : value

  return String(Math.round(normalized * 100) / 100)
}

function parseProductId(itemId: string): string {
  return itemId
    .replace(/-standard_poly-(hawaiian_shirt|shorts)$/, '')
    .replace(/-premium_silk-(hawaiian_shirt|shorts)$/, '')
}

function splitAddress(address: string) {
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean)
  return {
    address1: parts[0] || address,
    city: parts.at(-1) || '',
  }
}

export function isShopifyConfigured(): boolean {
  return Boolean(getShopifyStoreDomain() && getShopifyAdminToken())
}

export async function createShopifyDraftOrder(input: ShopifyDraftOrderInput) {
  const storeDomain = getShopifyStoreDomain()
  const token = getShopifyAdminToken()
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2026-07'

  if (!storeDomain || !token) {
    throw new Error('Shopify environment is not configured.')
  }

  const names = input.customer.fullName.trim().split(/\s+/)
  const firstName = names.slice(0, -1).join(' ') || names[0] || ''
  const lastName = names.length > 1 ? names.at(-1) || '' : ''
  const { address1, city } = splitAddress(input.customer.address)

  const lineItems = input.items.map((item) => ({
    title: item.name,
    quantity: item.quantity,
    originalUnitPrice: moneyAmount(item.price),
    requiresShipping: true,
    taxable: false,
    sku: parseProductId(item.id),
    customAttributes: [
      { key: 'Size', value: item.size },
      { key: 'Source item id', value: item.id },
    ],
  }))

  const mutation = `
    mutation CreateDraftOrder($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          invoiceUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await fetch(`https://${storeDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          email: input.customer.email || undefined,
          phone: input.customer.phone,
          note: `Website order ${input.orderId}`,
          tags: ['9fashion', 'hiwaii-website', input.orderId],
          shippingAddress: {
            firstName,
            lastName,
            phone: input.customer.phone,
            address1,
            city,
            country: 'Vietnam',
          },
          customAttributes: [
            { key: 'Website order ID', value: input.orderId },
            { key: 'Customer address raw', value: input.customer.address },
            { key: 'Website total raw', value: String(input.total) },
          ],
          lineItems,
        },
      },
    }),
    signal: AbortSignal.timeout(12_000),
    cache: 'no-store',
  })

  const result = await response.json().catch(() => null) as ShopifyDraftOrderResponse | null

  if (!response.ok) {
    throw new Error(`Shopify returned ${response.status}.`)
  }

  const graphQLError = result?.errors?.[0]?.message
  if (graphQLError) throw new Error(graphQLError)

  const payload = result?.data?.draftOrderCreate
  const userError = payload?.userErrors?.[0]?.message
  if (userError) throw new Error(userError)

  const invoiceUrl = payload?.draftOrder?.invoiceUrl
  if (!invoiceUrl) throw new Error('Shopify did not return a checkout URL.')

  return {
    draftOrderId: payload?.draftOrder?.id,
    checkoutUrl: invoiceUrl,
  }
}
