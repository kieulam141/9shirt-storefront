import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const adminEnvPath = '/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9tech/00_Admin-Company/.env'
const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const cleanMedia = args.has('--clean-media')
const setPriceArg = process.argv.find((arg) => arg.startsWith('--set-price='))
const fixedPrice = setPriceArg ? Number(setPriceArg.split('=')[1]) : undefined

const badMediaFilenamePattern = /(^|[-_\s])(copy-of|cup|file-in|gap|hoa|image[-_\s]*2|in\d+|lg|logo|nen|nền|pattern|print|source|tag|template|text|thoan|typo)([-_\s.]|$)|than-truoc-than-sau|ten-quan/i
const allowedMockupFilenamePattern = /(^|[-_\s])(mt|ms)[A-Za-z0-9_-]*$/i

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#') || line.startsWith('---')) continue

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue

    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] ??= value
  }
}

function adminStoreDomain() {
  const configured = process.env.SHOPIFY_ADMIN_STORE_DOMAIN
    || process.env.shopify_admin_store
    || process.env.SHOPIFY_MYSHOPIFY_DOMAIN
    || process.env.shopify_myshopify_domain
    || process.env.SHOPIFY_STORE
    || process.env.shopify_store
    || ''
  const normalized = configured.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')

  if (normalized.endsWith('.myshopify.com')) return normalized

  // Current Hiwaii store myshopify domain. Custom domains cannot be used for Admin API calls.
  if (normalized === 'hiwaii.store' || normalized === 'www.hiwaii.store') return 'kpmtve-x0.myshopify.com'

  return normalized
}

function adminToken() {
  return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    || process.env.SHOPIFY_ACCESS_TOKEN
    || process.env.shopify_admin_access_token
    || process.env.token
}

function mediaFilename(media) {
  const imageUrl = media.preview?.image?.url
  if (!imageUrl) return 'NO_PREVIEW'
  return decodeURIComponent(imageUrl.split('?')[0].split('/').pop() || '')
}

function shouldDeleteMedia(product, media) {
  const filename = mediaFilename(media)
  if (filename === 'NO_PREVIEW') return true
  const originalFilename = filename
    .replace(new RegExp(`^${product.handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+-`, 'i'), '')
    .replace(/\.[^.]+$/, '')
  return !allowedMockupFilenamePattern.test(originalFilename) || badMediaFilenamePattern.test(filename.toLowerCase())
}

async function shopifyGraphql(query, variables = {}) {
  const response = await fetch(`https://${storeDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(`Shopify HTTP ${response.status}: ${JSON.stringify(body)}`)
  if (body?.errors?.length) throw new Error(body.errors.map((error) => error.message).join('; '))
  return body.data
}

async function fetchProducts() {
  const products = []
  let cursor

  do {
    const data = await shopifyGraphql(
      `query Products($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            handle
            title
            media(first: 30) {
              nodes {
                id
                alt
                mediaContentType
                preview { image { url } }
              }
            }
            variants(first: 100) {
              nodes { id title price compareAtPrice }
            }
          }
        }
      }`,
      { cursor },
    )

    products.push(...data.products.nodes)
    cursor = data.products.pageInfo.endCursor
    if (!data.products.pageInfo.hasNextPage) break
  } while (cursor)

  return products
}

async function deleteProductMedia(product, mediaIds) {
  const data = await shopifyGraphql(
    `mutation DeleteProductMedia($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        userErrors { field message }
      }
    }`,
    { productId: product.id, mediaIds },
  )
  const errors = data.productDeleteMedia.userErrors || []
  if (errors.length) {
    throw new Error(`${product.handle}: ${errors.map((error) => error.message).join('; ')}`)
  }
  return data.productDeleteMedia.deletedMediaIds.length
}

async function updateVariantPrices(product, price) {
  const data = await shopifyGraphql(
    `mutation UpdateVariantPrices($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id price compareAtPrice }
        userErrors { field message }
      }
    }`,
    {
      productId: product.id,
      variants: product.variants.nodes.map((variant) => ({
        id: variant.id,
        price: price.toFixed(2),
        compareAtPrice: null,
      })),
    },
  )
  const errors = data.productVariantsBulkUpdate.userErrors || []
  if (errors.length) {
    throw new Error(`${product.handle}: ${errors.map((error) => error.message).join('; ')}`)
  }
  return data.productVariantsBulkUpdate.productVariants.length
}

loadEnvFile(path.join(repoRoot, '.env'))
loadEnvFile(adminEnvPath)

const storeDomain = adminStoreDomain()
const token = adminToken()
const apiVersion = process.env.SHOPIFY_API_VERSION || '2026-07'

if (!storeDomain || !token) {
  console.error('Shopify env is missing store domain or admin access token.')
  process.exit(1)
}

if (!cleanMedia && !Number.isFinite(fixedPrice)) {
  console.error('Nothing to do. Use --clean-media and/or --set-price=39.99.')
  process.exit(1)
}

const products = await fetchProducts()
console.log(`Shopify maintenance: ${products.length} products -> ${storeDomain}${dryRun ? ' [dry-run]' : ''}`)

let mediaDeleted = 0
let variantsUpdated = 0

for (const product of products) {
  if (cleanMedia) {
    const mediaToDelete = product.media.nodes.filter((media) => shouldDeleteMedia(product, media))
    const safeMediaToDelete = mediaToDelete

    if (safeMediaToDelete.length > 0) {
      console.log(`- ${product.handle}: delete media ${safeMediaToDelete.map(mediaFilename).join(', ')}`)
      if (!dryRun) mediaDeleted += await deleteProductMedia(product, safeMediaToDelete.map((media) => media.id))
      else mediaDeleted += safeMediaToDelete.length
    }
  }

  if (Number.isFinite(fixedPrice)) {
    const needsPriceUpdate = product.variants.nodes.some((variant) => Number(variant.price) !== fixedPrice || variant.compareAtPrice)
    if (needsPriceUpdate) {
      console.log(`- ${product.handle}: set ${product.variants.nodes.length} variants to ${fixedPrice.toFixed(2)}`)
      if (!dryRun) variantsUpdated += await updateVariantPrices(product, fixedPrice)
      else variantsUpdated += product.variants.nodes.length
    }
  }
}

console.log(`Done. Media deleted: ${mediaDeleted}. Variants updated: ${variantsUpdated}.`)
