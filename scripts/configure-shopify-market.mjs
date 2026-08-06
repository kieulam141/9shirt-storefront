import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const adminEnvPath = '/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9tech/00_Admin-Company/.env'
const args = new Set(process.argv.slice(2))
const apply = args.has('--apply')
const targetMarketName = process.env.SHOPIFY_MARKET_NAME || 'United States'
const targetCurrency = process.env.SHOPIFY_MARKET_CURRENCY || 'USD'

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

async function fetchMarkets() {
  return shopifyGraphql(`query Markets {
    shop { name currencyCode enabledPresentmentCurrencies }
    markets(first: 50) {
      nodes {
        id
        name
        handle
        status
        regions(first: 50) {
          nodes {
            name
            ... on MarketRegionCountry { code }
          }
        }
        currencySettings {
          baseCurrency { currencyCode currencyName enabled }
          localCurrencies
        }
        webPresence {
          domain { host }
          defaultLocale { locale name primary published }
        }
      }
    }
  }`)
}

async function updateMarketCurrency(marketId) {
  return shopifyGraphql(
    `mutation UpdateMarketCurrency($id: ID!, $input: MarketUpdateInput!) {
      marketUpdate(id: $id, input: $input) {
        market {
          id
          name
          status
          currencySettings {
            baseCurrency { currencyCode currencyName enabled }
            localCurrencies
          }
        }
        userErrors { field message }
      }
    }`,
    {
      id: marketId,
      input: {
        currencySettings: {
          baseCurrency: targetCurrency,
          localCurrencies: false,
          roundingEnabled: false,
        },
      },
    },
  )
}

function describeMarket(market) {
  const regions = market.regions.nodes.map((region) => region.code || region.name).join(', ')
  const currency = market.currencySettings?.baseCurrency?.currencyCode || 'inherited'
  const domain = market.webPresence?.domain?.host || 'store default'
  const locale = market.webPresence?.defaultLocale?.locale || 'store default'
  return `${market.name} [${market.status}] regions=${regions} currency=${currency} domain=${domain} locale=${locale}`
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

const snapshot = await fetchMarkets()
console.log(`Shopify market audit: ${snapshot.shop.name} -> ${storeDomain}`)
console.log(`Shop currency: ${snapshot.shop.currencyCode}. Enabled presentment currencies: ${snapshot.shop.enabledPresentmentCurrencies.join(', ') || 'none'}.`)
for (const market of snapshot.markets.nodes) console.log(`- ${describeMarket(market)}`)

const targetMarket = snapshot.markets.nodes.find((market) => market.name === targetMarketName)
if (!targetMarket) {
  console.error(`Could not find market named ${targetMarketName}.`)
  process.exit(1)
}

if (!apply) {
  console.log(`Dry run only. Use --apply to set ${targetMarketName} currency to ${targetCurrency}.`)
  process.exit(0)
}

const updated = await updateMarketCurrency(targetMarket.id)
const errors = updated.marketUpdate.userErrors || []
if (errors.length) {
  console.error(`Could not update ${targetMarketName} currency to ${targetCurrency}:`)
  for (const error of errors) console.error(`- ${(error.field || []).join('.') || 'market'}: ${error.message}`)
  process.exit(1)
}

const market = updated.marketUpdate.market
console.log(`Updated ${market.name}: currency=${market.currencySettings?.baseCurrency?.currencyCode || 'inherited'}.`)
