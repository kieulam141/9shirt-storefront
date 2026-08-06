import fs from 'node:fs'
import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const adminEnvPath = '/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9tech/00_Admin-Company/.env'
const args = new Set(process.argv.slice(2))
const apply = args.has('--apply')
const resync = args.has('--resync')
const hashMode = args.has('--hash')
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined

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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
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
  if (normalized === 'hiwaii.store' || normalized === 'www.hiwaii.store' || normalized === 'admin') return 'kpmtve-x0.myshopify.com'

  return normalized
}

function adminToken() {
  return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    || process.env.SHOPIFY_ACCESS_TOKEN
    || process.env.shopify_admin_access_token
    || process.env.token
}

function filenameFromUrl(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() || '')
  } catch {
    return ''
  }
}

function productFolderFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean).map(decodeURIComponent)
    const productsIndex = parts.findIndex((part) => part === 'products')
    if (productsIndex >= 0) return parts[productsIndex + 1] || ''
    const stockIndex = parts.findIndex((part) => part === 'Stock')
    if (stockIndex >= 0) return parts.at(-2) || ''
    return ''
  } catch {
    return ''
  }
}

function normalizedBasename(url) {
  return filenameFromUrl(url)
    .toLowerCase()
    .replace(/\.(png|jpe?g|webp)$/i, '')
    .replace(/\s+/g, '-')
}

function originalMediaBasename(handle, filename) {
  return filename
    .replace(new RegExp(`^${handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+-`, 'i'), '')
    .toLowerCase()
    .replace(/\.(png|jpe?g|webp)$/i, '')
    .replace(/\s+/g, '-')
}

function isPublishableImageUrl(url) {
  const filename = filenameFromUrl(url)
  const basename = filename.replace(/\.[^.]+$/, '')
  return filename && allowedMockupFilenamePattern.test(basename) && !badMediaFilenamePattern.test(filename.toLowerCase())
}

function expectedImages(product) {
  return [...new Set([...(product.images || []), ...product.media.filter((item) => item.type === 'image').map((item) => item.url)])]
    .filter(isPublishableImageUrl)
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
            media(first: 100) {
              nodes {
                id
                alt
                mediaContentType
                preview { image { url } }
              }
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
  if (errors.length) throw new Error(`${product.handle}: ${errors.map((error) => error.message).join('; ')}`)
  return data.productDeleteMedia.deletedMediaIds.length
}

async function hashUrl(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) })
    if (!response.ok) return undefined
    const buffer = Buffer.from(await response.arrayBuffer())
    return crypto.createHash('sha256').update(buffer).digest('hex')
  } catch {
    return undefined
  }
}

async function buildExpectedHashes(products) {
  const expectedByHandle = new Map()
  const ownerByHash = new Map()

  for (const product of products) {
    const images = expectedImages(product)
    const hashes = new Map()
    for (const url of images) {
      const hash = await hashUrl(url)
      if (!hash) continue
      hashes.set(hash, url)
      const owners = ownerByHash.get(hash) || []
      owners.push({ handle: product.slug, url })
      ownerByHash.set(hash, owners)
    }
    expectedByHandle.set(product.slug, hashes)
  }

  return { expectedByHandle, ownerByHash }
}

async function auditProductByHash(shopifyProduct, localProduct, expectedHashes, ownerByHash) {
  const unexpected = []
  const matched = new Set()
  const media = shopifyProduct.media.nodes
    .filter((item) => item.mediaContentType === 'IMAGE' && item.preview?.image?.url)

  for (const item of media) {
    const url = item.preview.image.url
    const hash = await hashUrl(url)
    if (!hash) continue

    if (expectedHashes.has(hash)) {
      matched.add(hash)
      continue
    }

    unexpected.push({
      id: item.id,
      url,
      filename: filenameFromUrl(url),
      owners: (ownerByHash.get(hash) || []).map((owner) => owner.handle),
    })
  }

  const missing = [...expectedHashes.entries()]
    .filter(([hash]) => !matched.has(hash))
    .map(([, url]) => url)

  return {
    expectedCount: expectedHashes.size,
    actualCount: media.length,
    unexpected,
    duplicates: [],
    deletable: unexpected,
    missing,
  }
}

function auditProduct(shopifyProduct, localProduct) {
  const expected = expectedImages(localProduct)
  const expectedNames = new Set(expected.map(normalizedBasename))
  const expectedFolders = new Set(expected.map(productFolderFromUrl).filter(Boolean))
  const expectedPrimaryFolder = productFolderFromUrl(expected[0])
  const media = shopifyProduct.media.nodes
    .filter((item) => item.mediaContentType === 'IMAGE' && item.preview?.image?.url)
    .map((item) => ({
      id: item.id,
      url: item.preview.image.url,
      filename: filenameFromUrl(item.preview.image.url),
      folder: productFolderFromUrl(item.preview.image.url),
      basename: normalizedBasename(item.preview.image.url),
    }))
    .map((item) => ({
      ...item,
      originalBasename: originalMediaBasename(shopifyProduct.handle, item.filename),
    }))

  const unexpected = media.filter((item) => {
    if (!allowedMockupFilenamePattern.test(item.originalBasename)) return true
    if (badMediaFilenamePattern.test(item.filename.toLowerCase())) return true
    if (expectedNames.has(item.basename)) return false
    if (expectedNames.has(item.originalBasename)) return false
    if (item.folder && expectedFolders.has(item.folder)) return false
    return true
  })

  const duplicateGroups = new Map()
  for (const item of media) {
    const key = item.basename
    const group = duplicateGroups.get(key) || []
    group.push(item)
    duplicateGroups.set(key, group)
  }
  const duplicates = [...duplicateGroups.values()].filter((group) => group.length > 1).flatMap((group) => group.slice(1))
  const deletable = [...new Map([...unexpected, ...duplicates].map((item) => [item.id, item])).values()]
  const missing = expected.filter((url) => !media.some((item) => item.basename === normalizedBasename(url) || item.originalBasename === normalizedBasename(url) || item.folder === productFolderFromUrl(url)))

  return {
    expectedCount: expected.length,
    actualCount: media.length,
    expectedPrimaryFolder,
    unexpected,
    duplicates,
    deletable,
    missing,
  }
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

const localProducts = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/products.json'), 'utf8'))
const localByHandle = new Map(localProducts.map((product) => [product.slug, product]))
const shopifyProducts = await fetchProducts()
const selectedProducts = Number.isFinite(limit) && limit > 0 ? shopifyProducts.slice(0, limit) : shopifyProducts

console.log(`Shopify media audit: ${selectedProducts.length}/${shopifyProducts.length} products -> ${storeDomain}${apply ? ' [apply]' : ' [dry-run]'}`)
if (hashMode) console.log('Hash mode: comparing actual image bytes against local catalog image bytes.')

const hashContext = hashMode ? await buildExpectedHashes(localProducts) : undefined

let productsWithIssues = 0
let mediaToDelete = 0
let mediaDeleted = 0
let missingImages = 0

for (const shopifyProduct of selectedProducts) {
  const localProduct = localByHandle.get(shopifyProduct.handle)
  if (!localProduct) {
    console.log(`- ${shopifyProduct.handle}: no local catalog record`)
    productsWithIssues += 1
    continue
  }

  const result = hashContext
    ? await auditProductByHash(shopifyProduct, localProduct, hashContext.expectedByHandle.get(shopifyProduct.handle) || new Map(), hashContext.ownerByHash)
    : auditProduct(shopifyProduct, localProduct)
  if (!result.deletable.length && !result.missing.length) continue

  productsWithIssues += 1
  mediaToDelete += result.deletable.length
  missingImages += result.missing.length

  console.log(`- ${shopifyProduct.handle}: expected=${result.expectedCount}, actual=${result.actualCount}, delete=${result.deletable.length}, missing=${result.missing.length}`)
  for (const item of result.deletable.slice(0, 10)) {
    const ownerNote = item.owners?.length ? ` owned by ${item.owners.join(', ')}` : item.folder || 'unknown folder'
    console.log(`  delete: ${item.filename} (${ownerNote})`)
  }
  for (const url of result.missing.slice(0, 10)) console.log(`  missing: ${filenameFromUrl(url)} (${productFolderFromUrl(url) || 'unknown folder'})`)

  if (apply && result.deletable.length) {
    mediaDeleted += await deleteProductMedia(shopifyProduct, result.deletable.map((item) => item.id))
  }
}

console.log(`Done. Products with issues: ${productsWithIssues}. Media to delete: ${mediaToDelete}. Media deleted: ${mediaDeleted}. Missing expected images: ${missingImages}.`)
if (!apply) console.log('Dry run only. Use --apply to delete unexpected/duplicate media.')
if (resync) console.log('Resync is not automatic in this audit script. Run pnpm shopify:sync after cleanup if missing expected images remain.')
