import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const themeRoot = path.join(repoRoot, 'shopify-theme')
const horizonOverridePath = path.join(themeRoot, 'assets/hiwaii-horizon-overrides.css')
const adminEnvPath = '/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9tech/00_Admin-Company/.env'
const args = new Set(process.argv.slice(2))
const shouldPublish = args.has('--publish')
const overrideStart = '/* HIWAII_STOREFRONT_OVERRIDE_START */'
const overrideEnd = '/* HIWAII_STOREFRONT_OVERRIDE_END */'
const legacyOverrideStart = '/* HIWAII_9SHIRT_OVERRIDE_START */'
const legacyOverrideEnd = '/* HIWAII_9SHIRT_OVERRIDE_END */'

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

function getShopifyStoreDomain() {
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

function getShopifyAdminToken() {
  return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    || process.env.SHOPIFY_ACCESS_TOKEN
    || process.env.shopify_admin_access_token
    || process.env.token
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(absolute)
    return absolute
  })
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
  if (!response.ok) throw new Error(`Shopify HTTP ${response.status}`)
  if (body?.errors?.length) throw new Error(body.errors.map((error) => error.message).join('; '))
  return body.data
}

function toThemeNumericId(gid) {
  return gid.split('/').at(-1)
}

function toAssetKey(filename) {
  return filename
}

async function shopifyRest(pathname, options = {}) {
  const response = await fetch(`https://${storeDomain}/admin/api/${apiVersion}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(`Shopify REST ${response.status}: ${body?.errors ? JSON.stringify(body.errors) : response.statusText}`)
  }
  return body
}

async function putAsset(themeId, key, value) {
  const numericThemeId = toThemeNumericId(themeId)
  return shopifyRest(`/themes/${numericThemeId}/assets.json`, {
    method: 'PUT',
    body: JSON.stringify({ asset: { key, value } }),
  })
}

async function getAsset(themeId, key) {
  const numericThemeId = toThemeNumericId(themeId)
  const assetKey = encodeURIComponent(key)
  return shopifyRest(`/themes/${numericThemeId}/assets.json?asset[key]=${assetKey}`, { method: 'GET' })
}

async function applyHorizonOverride(themeId) {
  if (!fs.existsSync(horizonOverridePath)) return
  const baseAsset = await getAsset(themeId, 'assets/base.css')
  const current = baseAsset.asset?.value || ''
  const override = fs.readFileSync(horizonOverridePath, 'utf8').trim()
  let cleaned = current
  if (cleaned.includes(legacyOverrideStart)) {
    cleaned = cleaned.replace(new RegExp(`${legacyOverrideStart}[\\s\\S]*?${legacyOverrideEnd}`), '').trimEnd()
  }

  const next = cleaned.includes(overrideStart)
    ? cleaned.replace(new RegExp(`${overrideStart}[\\s\\S]*?${overrideEnd}`), `${overrideStart}\n${override}\n${overrideEnd}`)
    : `${cleaned.trimEnd()}\n\n${overrideStart}\n${override}\n${overrideEnd}\n`

  await putAsset(themeId, 'assets/base.css', next)
  console.log('Applied Hiwaii storefront Horizon override to assets/base.css.')
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

const themes = await shopifyGraphql(`query { themes(first: 20) { nodes { id name role } } }`)
const mainTheme = themes.themes.nodes.find((theme) => theme.role === 'MAIN')
if (!mainTheme) throw new Error('Could not find Shopify main theme to duplicate.')

console.log(`Duplicating ${mainTheme.name} -> Hiwaii Storefront UX`)
const duplicated = await shopifyGraphql(
  `mutation DuplicateTheme($id: ID!, $name: String) {
    themeDuplicate(id: $id, name: $name) {
      newTheme { id name role }
      userErrors { field message }
    }
  }`,
  { id: mainTheme.id, name: `Hiwaii Storefront UX ${new Date().toISOString().slice(0, 10)}` },
)
const duplicateErrors = duplicated.themeDuplicate.userErrors || []
if (duplicateErrors.length) throw new Error(duplicateErrors.map((error) => error.message).join('; '))
const theme = duplicated.themeDuplicate.newTheme

const files = walkFiles(themeRoot).map((absolute) => ({
  filename: path.relative(themeRoot, absolute).replaceAll(path.sep, '/'),
  body: {
    type: 'TEXT',
    value: fs.readFileSync(absolute, 'utf8'),
  },
}))

console.log(`Uploading ${files.length} files to ${theme.name}`)
const uploaded = await shopifyGraphql(
  `mutation UpsertThemeFiles($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
    themeFilesUpsert(themeId: $themeId, files: $files) {
      upsertedThemeFiles { filename }
      userErrors { field message }
    }
  }`,
  { themeId: theme.id, files },
)
const uploadErrors = uploaded.themeFilesUpsert.userErrors || []
if (uploadErrors.length) throw new Error(uploadErrors.map((error) => `${error.field?.join('.') || 'file'}: ${error.message}`).join('; '))
console.log(`Uploaded ${uploaded.themeFilesUpsert.upsertedThemeFiles.length} files.`)

console.log('Mirroring files through REST assets API for live theme compatibility.')
for (const file of files) {
  await putAsset(theme.id, toAssetKey(file.filename), file.body.value)
}
await applyHorizonOverride(theme.id)

if (shouldPublish) {
  const published = await shopifyGraphql(
    `mutation PublishTheme($id: ID!) {
      themePublish(id: $id) {
        theme { id name role }
        userErrors { field message }
      }
    }`,
    { id: theme.id },
  )
  const publishErrors = published.themePublish.userErrors || []
  if (publishErrors.length) throw new Error(publishErrors.map((error) => error.message).join('; '))
  console.log(`Published ${published.themePublish.theme.name} as ${published.themePublish.theme.role}.`)
} else {
  console.log(`Theme uploaded but not published: ${theme.id}`)
}
