import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const adminEnvPath = '/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9tech/00_Admin-Company/.env'

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const resetMedia = args.has('--reset-media')
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined
const handleArg = process.argv.find((arg) => arg.startsWith('--handle='))
const handleFilter = handleArg ? new Set(handleArg.split('=')[1].split(',').map((handle) => handle.trim()).filter(Boolean)) : undefined
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

function getShopifyStoreDomain() {
  const raw = process.env.SHOPIFY_ADMIN_STORE_DOMAIN
    || process.env.shopify_admin_store
    || process.env.SHOPIFY_MYSHOPIFY_DOMAIN
    || process.env.shopify_myshopify_domain
    || process.env.SHOPIFY_STORE
    || process.env.shopify_store
  const normalized = raw?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (normalized === 'hiwaii.store' || normalized === 'www.hiwaii.store') return 'kpmtve-x0.myshopify.com'
  return normalized
}

function getShopifyAdminToken() {
  return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    || process.env.SHOPIFY_ACCESS_TOKEN
    || process.env.shopify_admin_access_token
    || process.env.token
}

function toMoney(value) {
  const fixedPrice = Number(process.env.SHOPIFY_FIXED_PRICE || '')
  if (Number.isFinite(fixedPrice) && fixedPrice > 0) return fixedPrice.toFixed(2)

  const multiplier = Number(process.env.SHOPIFY_PRICE_MULTIPLIER || '')
  const normalized = Number.isFinite(multiplier) && multiplier > 0
    ? value * multiplier
    : value >= 100
      ? value * 1000
      : value

  return String(Math.round(normalized * 100) / 100)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function isPublishableImageUrl(url) {
  try {
    const filename = decodeURIComponent(new URL(url).pathname.split('/').pop() || '')
    const basename = filename.replace(/\.[^.]+$/, '')
    return allowedMockupFilenamePattern.test(basename) && !badMediaFilenamePattern.test(filename.toLowerCase())
  } catch {
    return false
  }
}

function mockupSideRank(url) {
  try {
    const filename = decodeURIComponent(new URL(url).pathname.split('/').pop() || '').replace(/\.[^.]+$/, '')
    if (/(^|[-_\s])mt[A-Za-z0-9_-]*$/i.test(filename)) return 0
    if (/(^|[-_\s])ms[A-Za-z0-9_-]*$/i.test(filename)) return 1
    return 2
  } catch {
    return 2
  }
}

function materialOptionLabel(materialCode, materialLabels, hasDuplicateMaterialLabels) {
  if (!hasDuplicateMaterialLabels) return materialLabels.get(materialCode) || materialCode
  if (materialCode === 'standard_poly') return 'Latin silk'
  if (materialCode === 'premium_silk') return 'Premium latin silk'
  return materialCode
}

function fileInputFromUrl(url, productSlug, productName, index) {
  const pathname = new URL(url).pathname
  const filename = decodeURIComponent(pathname.split('/').pop() || `${productName}-${index}.png`)
  const safeFilename = `${productSlug}-${index + 1}-${filename}`.replace(/[^A-Za-z0-9._-]+/g, '-')
  return {
    originalSource: url,
    filename: safeFilename,
    alt: `${productName} image ${index + 1}`,
    contentType: 'IMAGE',
    duplicateResolutionMode: 'REPLACE',
  }
}

function productToShopifyInput(product) {
  const materialLabels = new Map(product.materials.map((material) => [material.code, material.label]))
  const hasDuplicateMaterialLabels = new Set(product.materials.map((material) => material.label)).size < product.materials.length
  const sizeValues = unique(product.variants.map((variant) => variant.size))
  const materialValues = unique(product.variants.map((variant) => materialOptionLabel(variant.material, materialLabels, hasDuplicateMaterialLabels)))
  const images = unique([...(product.images || []), ...product.media.filter((item) => item.type === 'image').map((item) => item.url)])
    .filter(isPublishableImageUrl)
    .sort((a, b) => mockupSideRank(a) - mockupSideRank(b))

  return {
    identifier: { handle: product.slug },
    input: {
      title: product.name,
      handle: product.slug,
      vendor: 'Hiwaii',
      productType: product.productType,
      status: images.length ? 'ACTIVE' : 'DRAFT',
      tags: unique([
        'hiwaii',
        '9fashion',
        product.niche,
        product.subNiche,
        product.badge,
        product.productType,
      ]),
      descriptionHtml: [
        `<p>${escapeHtml(product.description)}</p>`,
        `<p><strong>Style:</strong> ${escapeHtml(product.niche)} / ${escapeHtml(product.subNiche)}</p>`,
        `<p><strong>Shipping:</strong> Ships from Hanoi in 3-7 days.</p>`,
      ].join(''),
      seo: {
        title: product.name,
        description: product.hook.slice(0, 320),
      },
      files: images.map((url, index) => fileInputFromUrl(url, product.slug, product.name, index)),
      productOptions: [
        {
          name: 'Size',
          position: 1,
          values: sizeValues.map((name) => ({ name })),
        },
        {
          name: 'Material',
          position: 2,
          values: materialValues.map((name) => ({ name })),
        },
      ],
      variants: product.variants.map((variant, index) => {
        const materialLabel = materialOptionLabel(variant.material, materialLabels, hasDuplicateMaterialLabels)
        return {
          sku: `${product.id}-${variant.material}-${variant.size}`.toUpperCase(),
          price: toMoney(variant.price),
          compareAtPrice: product.compareAtPrice ? toMoney(product.compareAtPrice) : undefined,
          taxable: false,
          published: variant.available,
          position: index + 1,
          inventoryItem: {
            sku: `${product.id}-${variant.material}-${variant.size}`.toUpperCase(),
            tracked: false,
            requiresShipping: true,
          },
          optionValues: [
            { optionName: 'Size', name: variant.size },
            { optionName: 'Material', name: materialLabel },
          ],
        }
      }),
      metafields: [
        { namespace: 'custom', key: 'source_product_id', type: 'single_line_text_field', value: product.id },
        { namespace: 'custom', key: 'niche', type: 'single_line_text_field', value: product.niche },
        { namespace: 'custom', key: 'sub_niche', type: 'single_line_text_field', value: product.subNiche },
      ],
    },
  }
}

async function shopifyGraphql(query, variables) {
  const response = await fetch(`https://${storeDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(`Shopify HTTP ${response.status}`)
  if (body?.errors?.length) throw new Error(body.errors.map((error) => error.message).join('; '))
  return body
}

async function fetchProductMediaByHandle(handle) {
  const result = await shopifyGraphql(
    `query ProductMedia($handle: String!) {
      productByHandle(handle: $handle) {
        id
        media(first: 100) {
          nodes { id }
        }
      }
    }`,
    { handle },
  )

  return result.data?.productByHandle
}

async function deleteProductMedia(productId, mediaIds) {
  if (!mediaIds.length) return 0

  const result = await shopifyGraphql(
    `mutation DeleteProductMedia($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        userErrors { field message }
      }
    }`,
    { productId, mediaIds },
  )

  const response = result.data?.productDeleteMedia
  const userErrors = response?.userErrors || []
  if (userErrors.length) {
    const messages = userErrors.map((error) => `${error.field?.join('.') || 'media'}: ${error.message}`).join('; ')
    throw new Error(messages)
  }

  return response.deletedMediaIds.length
}

loadEnvFile(path.join(repoRoot, '.env'))
loadEnvFile(adminEnvPath)

const storeDomain = getShopifyStoreDomain()
const token = getShopifyAdminToken()
const apiVersion = process.env.SHOPIFY_API_VERSION || '2026-07'

if (!storeDomain || !token) {
  console.error('Shopify env is missing SHOPIFY_STORE or admin access token.')
  process.exit(1)
}

const products = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/products.json'), 'utf8'))
const filteredProducts = handleFilter ? products.filter((product) => handleFilter.has(product.slug)) : products
const selectedProducts = Number.isFinite(limit) && limit > 0 ? filteredProducts.slice(0, limit) : filteredProducts

console.log(`Shopify catalog sync: ${selectedProducts.length}/${products.length} products -> ${storeDomain} (${apiVersion})${dryRun ? ' [dry-run]' : ''}${resetMedia ? ' [reset-media]' : ''}`)

if (dryRun) {
  for (const product of selectedProducts) {
    const payload = productToShopifyInput(product)
    console.log(`- ${product.slug}: ${payload.input.variants.length} variants, ${payload.input.files.length} images`)
  }
  process.exit(0)
}

const mutation = `
  mutation ProductSet($identifier: ProductSetIdentifiers, $input: ProductSetInput!, $synchronous: Boolean!) {
    productSet(identifier: $identifier, input: $input, synchronous: $synchronous) {
      product {
        id
        handle
        title
        totalVariants
      }
      userErrors {
        field
        message
      }
    }
  }
`

let synced = 0
for (const product of selectedProducts) {
  const payload = productToShopifyInput(product)
  if (!payload.input.files.length) console.log(`- ${product.slug}: no MT/MS mockups found; syncing as draft with zero images.`)

  if (resetMedia) {
    const existingProduct = await fetchProductMediaByHandle(product.slug)
    const mediaIds = existingProduct?.media?.nodes?.map((media) => media.id) || []
    if (existingProduct && mediaIds.length) {
      const deleted = await deleteProductMedia(existingProduct.id, mediaIds)
      console.log(`- ${product.slug}: deleted ${deleted} old media items`)
    }
  }

  const result = await shopifyGraphql(mutation, {
    identifier: payload.identifier,
    input: payload.input,
    synchronous: true,
  })

  const response = result.data?.productSet
  const userErrors = response?.userErrors || []
  if (userErrors.length) {
    const messages = userErrors.map((error) => `${error.field?.join('.') || 'product'}: ${error.message}`).join('; ')
    throw new Error(`${product.slug}: ${messages}`)
  }

  synced += 1
  console.log(`✓ ${synced}/${selectedProducts.length} ${response.product.handle} (${response.product.totalVariants} variants)`)
}

console.log(`Done. Synced ${synced} products to Shopify.`)
