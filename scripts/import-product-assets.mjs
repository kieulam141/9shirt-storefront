import { createHash, createHmac } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join, relative } from 'node:path'

const projectRoot = new URL('..', import.meta.url).pathname.replace(/\/scripts\/$/, '')
const catalogPath = join(projectRoot, 'data/products.json')
const sourceRoot = '/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9Fashion/Products_3D/Designs/POD_3D_VN/File Design ảnh sản phẩm'
const ignoredTopLevelDirectories = new Set(['In tuyển', '00_Source_of_Truth_By_Niche'])

const existingIdByDesign = new Map([
  ['ARS1', 'ars1-rice-burgundy'],
  ['ARS2', 'ars2-red-champions'],
  ['ARS3', 'ars3-cream-heritage'],
  ['ARS4', 'ars4-floral-crest'],
  ['CR71', 'cr71-legacy-gold'],
  ['CR72', 'cr72-champions-gold'],
])

const designTitleOverrides = new Map([
  ['Agentina', 'Argentina Sky Blue Matchday Resort Shirt'],
  ['Agentina Xanh Đen', 'Argentina Midnight Blue Resort Shirt'],
  ['Anh', 'England Crest White Resort Shirt'],
  ['Anh Số 2', 'England Red Heritage Resort Shirt'],
  ['BDN', 'Portugal Green Matchday Resort Shirt'],
  ['BDN Trắng', 'Portugal White Signature Resort Shirt'],
  ['BĐN Đỏ', 'Portugal Red Signature Resort Shirt'],
  ['Brazin', 'Brazil Yellow Carnival Resort Shirt'],
  ['Brazin xanh đen', 'Brazil Midnight Green Resort Shirt'],
  ['Croatia', 'Croatia Checkered Resort Shirt'],
  ['HA LAN', 'Netherlands Oranje Resort Shirt'],
  ['HanQuoc', 'South Korea Tiger Crest Resort Shirt'],
  ['Man City', 'Manchester City Sky Blue Resort Shirt'],
  ['MU BRUNO', 'Bruno Red Playmaker Resort Shirt'],
  ['MU BRUNO2', 'Bruno Black Playmaker Resort Shirt'],
  ['MU BRUNO3', 'Bruno White Playmaker Resort Shirt'],
  ['MUCR7', 'CR7 United Red Legacy Resort Shirt'],
  ['MUCUNHA', 'United Forward Statement Resort Shirt'],
  ['Nhật', 'Japan Blue Samurai Resort Shirt'],
  ['Pháp', 'France Blue Heritage Resort Shirt'],
  ['PSG', 'Paris Blue Crest Resort Shirt'],
  ['PSG BTB', 'Paris Black Gold Resort Shirt'],
  ['PSG3', 'Paris Midnight Crest Resort Shirt'],
  ['CR7 Legend', 'CR7 Legend Black Gold Resort Shirt'],
  ['CR73', 'CR7 White Gold Resort Shirt'],
  ['Cr74', 'CR7 Crimson Legacy Resort Shirt'],
  ['Đức', 'Germany Black Eagle Resort Shirt'],
  ['Đức Trắng', 'Germany White Eagle Resort Shirt'],
  ['Texas Beer', 'Texas Beer Americana Resort Shirt'],
  ['Boss', 'Boss Statement Resort Shirt'],
  ['Vip', 'VIP Monogram Resort Shirt'],
  ['Tem Tau', 'Vintage Train Ticket Resort Shirt'],
  ['Cat', 'Midnight Cat Graphic Resort Shirt'],
  ['Cat pink', 'Pink Cat Graphic Resort Shirt'],
  ['BullDog', 'Bulldog Street Resort Shirt'],
  ['Buttefly', 'Butterfly Garden Resort Shirt'],
  ['Rabbit', 'Rabbit Pop Graphic Resort Shirt'],
  ['Rabbit V2', 'Rabbit Pop V2 Resort Shirt'],
  ['Rabbit Playboys black', 'Black Bunny Resort Shirt'],
  ['Pink Playboys', 'Pink Bunny Resort Shirt'],
  ['Snake', 'Snake Pattern Resort Shirt'],
  ['Tiger', 'Tiger Graphic Resort Shirt'],
  ['Lion', 'Lion Pride Resort Shirt'],
  ['Medusa', 'Medusa Myth Resort Shirt'],
  ['Elma & Aterna', 'Elma & Aterna Romance Resort Shirt'],
  ['Erros Cupid', 'Eros Cupid Romance Resort Shirt'],
  ['Nauy', 'Norway Nordic Resort Shirt'],
  ['Phap 2 Olise', 'France Olise Blue Resort Shirt'],
  ['TBN', 'Spain Red Gold Resort Shirt'],
])

const subjectByDesign = new Map([
  ['Agentina', 'Argentina football energy'],
  ['Agentina Xanh Đen', 'Argentina football energy in a darker palette'],
  ['Anh', 'England football heritage'],
  ['Anh Số 2', 'England football heritage with a red statement base'],
  ['BDN', 'Portugal football passion'],
  ['BDN Trắng', 'Portugal football passion in a clean white palette'],
  ['BĐN Đỏ', 'Portugal football passion in a red matchday palette'],
  ['Brazin', 'Brazil football color and carnival rhythm'],
  ['Brazin xanh đen', 'Brazil football color with midnight green contrast'],
  ['Croatia', 'Croatia checkered football identity'],
  ['HA LAN', 'Netherlands orange football spirit'],
  ['HanQuoc', 'South Korea football pride'],
  ['Man City', 'sky-blue football club energy'],
  ['MU BRUNO', 'red playmaker football attitude'],
  ['MU BRUNO2', 'playmaker football attitude'],
  ['MU BRUNO3', 'playmaker football attitude'],
  ['MUCR7', 'red football icon legacy'],
  ['MUCUNHA', 'modern United forward energy'],
  ['Nhật', 'Japan blue samurai football identity'],
  ['Pháp', 'France football heritage'],
  ['PSG', 'Paris football nightlife energy'],
  ['PSG BTB', 'Paris football nightlife energy with black-gold contrast'],
  ['PSG3', 'Paris football nightlife energy'],
  ['CR7 Legend', 'black-and-gold football legend energy'],
  ['CR73', 'white-and-gold football legend energy'],
  ['Cr74', 'crimson football legend energy'],
  ['Đức', 'Germany football heritage'],
  ['Đức Trắng', 'Germany football heritage in a white palette'],
  ['Texas Beer', 'retro Americana beer-garden attitude'],
  ['Boss', 'bold boss-energy typography'],
  ['Vip', 'luxury VIP statement graphics'],
  ['Tem Tau', 'vintage train ticket nostalgia'],
  ['Cat', 'cat-lover graphic attitude'],
  ['Cat pink', 'pink cat-lover graphic attitude'],
  ['BullDog', 'bulldog streetwear attitude'],
  ['Buttefly', 'butterfly garden color'],
  ['Rabbit', 'cute rabbit pop graphics'],
  ['Rabbit V2', 'cute rabbit pop graphics'],
  ['Rabbit Playboys black', 'black bunny club graphics'],
  ['Pink Playboys', 'pink bunny club graphics'],
  ['Snake', 'snake pattern energy'],
  ['Tiger', 'tiger graphic power'],
  ['Lion', 'lion pride energy'],
  ['Medusa', 'mythic Medusa artwork'],
  ['Elma & Aterna', 'romance fantasy artwork'],
  ['Erros Cupid', 'Cupid-inspired romance fantasy artwork'],
  ['Nauy', 'Norway football energy'],
  ['Phap 2 Olise', 'France football energy'],
  ['TBN', 'Spain football energy'],
])

function parseEnv(text) {
  const env = {}
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 0) continue
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1)
  }
  return env
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isPublishableProductImage(file) {
  const name = basename(file).toLowerCase()
  return !/(^|[-_\s])(in|tay|co|cổ|nen|nền|pattern|logo|text|tag|collar|sleeve|template|source|print|size)([-_\s.]|$)|^in\d|file-in|^a\d+\.(png|jpe?g|webp)$/i.test(name)
}

async function topLevelImageGroups(root) {
  const entries = await readdir(root, { withFileTypes: true })
  const groups = new Map()

  for (const entry of entries) {
    if (!entry.isDirectory() || ignoredTopLevelDirectories.has(entry.name)) continue

    const dir = join(root, entry.name)
    const files = (await readdir(dir, { withFileTypes: true }))
      .filter((file) => file.isFile() && /\.(png|jpe?g|webp)$/i.test(file.name) && isPublishableProductImage(file.name))
      .map((file) => join(dir, file.name))

    if (files.length > 0) {
      groups.set(dir, files)
    }
  }

  return groups
}

function mimeType(file) {
  const ext = extname(file).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  return 'image/png'
}

function hmac(key, value, encoding) {
  return createHmac('sha256', key).update(value).digest(encoding)
}

function sha256(value, encoding = 'hex') {
  return createHash('sha256').update(value).digest(encoding)
}

function encodeKey(key) {
  return key.split('/').map(encodeURIComponent).join('/')
}

function signingKey(secret, date, region, service) {
  const kDate = hmac(`AWS4${secret}`, date)
  const kRegion = hmac(kDate, region)
  const kService = hmac(kRegion, service)
  return hmac(kService, 'aws4_request')
}

async function putR2Object({ accountId, accessKeyId, secretAccessKey, bucket, key, body, contentType }) {
  const encodedKey = encodeKey(key)
  const url = new URL(`https://${accountId}.r2.cloudflarestorage.com/${bucket}/${encodedKey}`)
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = sha256(body)
  const canonicalHeaders = [
    `host:${url.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join('\n') + '\n'
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = [
    'PUT',
    url.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join('\n')
  const signature = hmac(signingKey(secretAccessKey, dateStamp, 'auto', 's3'), stringToSign, 'hex')

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
    },
    body,
    signal: AbortSignal.timeout(120_000),
  })

  if (!response.ok) {
    throw new Error(`R2 upload failed for ${key}: ${response.status} ${await response.text()}`)
  }
}

function scoreImage(file, designName) {
  const name = basename(file).toLowerCase()
  const designSlug = slugify(designName)
  let score = 0
  if (/\.(jpg|jpeg)$/i.test(name)) score += 5
  if (slugify(name).includes(designSlug)) score += 8
  if (/(^|[-_\s])(mt|mtruoc|mat-truoc|truoc|front|ao|shirt)([-_\s.]|$)|template|tong quan|overall|hero|brazil|phap|anh|crotia|halan|nhat|bdn|cr7/.test(name)) score += 14
  if (/(^|[-_\s])(ms|sau|back)([-_\s.]|$)/.test(name)) score -= 8
  if (/(^|[-_\s])(quan|short|shorts|qmt)([-_\s.]|$)|file| in |in quan|tay|cổ|cổ|co ao|logo|nen|nền|text|tag|cup/.test(name)) score -= 12
  return score
}

function sortImages(files, designName) {
  return [...files].sort((a, b) => scoreImage(b, designName) - scoreImage(a, designName) || basename(a).localeCompare(basename(b)))
}

function productMeta(relativeDir) {
  const designName = basename(relativeDir)
  const subject = subjectByDesign.get(designName) || designName

  if ([
    'Agentina', 'Agentina Xanh Đen', 'Anh', 'Anh Số 2', 'ARS1', 'ARS2', 'ARS3', 'ARS4', 'BDN', 'BĐN Đỏ',
    'BDN Trắng', 'Brazin', 'Brazin xanh đen', 'CR7 Legend', 'CR71', 'CR72', 'CR73', 'Cr74', 'Croatia',
    'Đức', 'Đức Trắng', 'HA LAN', 'HanQuoc', 'Man City', 'MU BRUNO', 'MU BRUNO2', 'MU BRUNO3', 'MUCR7',
    'MUCUNHA', 'Nauy', 'Nhật', 'Pháp', 'Phap 2 Olise', 'PSG', 'PSG BTB', 'PSG3', 'TBN',
  ].includes(designName)) {
    return {
      niche: 'Sports',
      subNiche: 'Football',
      designName,
      subject,
      collection: 'Football',
    }
  }

  if (['Cat', 'Cat pink'].includes(designName)) {
    return { niche: 'Animal', subNiche: 'Cat', designName, subject, collection: 'Cat' }
  }

  if (['Rabbit', 'Rabbit V2', 'Rabbit Playboys black', 'Pink Playboys'].includes(designName)) {
    return { niche: 'Animal', subNiche: 'Rabbit Playboy', designName, subject, collection: 'Rabbit Playboy' }
  }

  if (['BullDog'].includes(designName)) {
    return { niche: 'Animal', subNiche: 'Dog', designName, subject, collection: 'Animal Graphic' }
  }

  if (['Lion'].includes(designName)) {
    return { niche: 'Animal', subNiche: 'Lion', designName, subject, collection: 'Big Cat' }
  }

  if (['Tiger'].includes(designName)) {
    return { niche: 'Animal', subNiche: 'Tiger', designName, subject, collection: 'Big Cat' }
  }

  if (['Buttefly', 'Snake'].includes(designName)) {
    return { niche: 'Animal', subNiche: 'Animal Graphic', designName, subject, collection: 'Animal Graphic' }
  }

  if (['Medusa', 'Elma & Aterna', 'Erros Cupid'].includes(designName)) {
    return { niche: 'Fantasy', subNiche: 'Mythology Romance', designName, subject, collection: 'Fantasy' }
  }

  return {
    niche: 'Lifestyle',
    subNiche: 'Statement / Novelty',
    designName,
    subject,
    collection: 'Statement Novelty',
  }
}

function makeVariants() {
  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  return sizes.map((size) => ({
    size,
    material: 'standard_poly',
    available: true,
    stockStatus: 'in_stock',
    price: ['4XL', '5XL'].includes(size) ? 295 : 450,
  }))
}

function makeProduct({ id, urls, relativeDir }) {
  const meta = productMeta(relativeDir)
  const name = designTitleOverrides.get(meta.designName) || `${meta.designName} Resort Shirt`
  const price = 295
  const hook = `${meta.subject[0].toUpperCase()}${meta.subject.slice(1)} translated into a bold all-over resort shirt.`
  const description = `A statement Hawaiian shirt built from the ${meta.designName} artwork, balancing matchday graphics, tropical rhythm, and clean contrast for travel, watch parties, and weekend streetwear.`

  return {
    id,
    slug: `${id}-shirt`,
    name,
    price,
    compareAtPrice: 450,
    hook,
    description,
    productType: 'Hawaiian Shirt',
    niche: meta.niche,
    subNiche: meta.subNiche,
    badge: meta.niche === 'Sports' ? 'Trending' : 'Premium Edition',
    thumbnail: urls[0],
    images: urls,
    media: urls.map((url) => ({ type: 'image', url })),
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    materials: [
      {
        code: 'standard_poly',
        label: 'Latin silk',
        uplift: 0,
        benefit: 'Soft drape • lightweight feel • crisp color print',
      },
    ],
    variants: makeVariants(),
    specifications: [
      { label: 'Material', value: 'Latin silk' },
      { label: 'Fit', value: 'Relaxed resort fit' },
      { label: 'Care', value: 'Machine wash cold, hang dry' },
      { label: 'Shipping', value: 'Ships from Hanoi in 3-7 days' },
      { label: 'Print', value: `${meta.collection} all-over sublimation artwork` },
      { label: 'SKU / Type code', value: id },
    ],
  }
}

async function main() {
  const env = parseEnv(await readFile(join(projectRoot, '.env'), 'utf8'))
  const required = ['CF_ACCOUNT_ID', 'CF_R2_ACCESS_KEY_ID', 'CF_R2_SECRET_ACCESS_KEY', 'CF_R2_BUCKET_HIWAII', 'CF_R2_PUBLIC_URL_HIWAII']
  for (const key of required) {
    if (!env[key]) throw new Error(`Missing ${key} in .env`)
  }

  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  const existingIds = new Set(catalog.map((product) => product.id))
  const groups = await topLevelImageGroups(sourceRoot)

  const productsToAdd = []
  const nextCatalog = [...catalog]
  let uploaded = 0

  for (const [dir, files] of [...groups.entries()].sort((a, b) => relative(sourceRoot, a[0]).localeCompare(relative(sourceRoot, b[0])))) {
    const relativeDir = relative(sourceRoot, dir)
    const designName = basename(dir)
    const id = existingIdByDesign.get(designName) || slugify(`${relativeDir}`)
    if (existingIds.has(id)) continue

    const sorted = sortImages(files, designName)
    const urls = []
    console.log(`Uploading ${id} (${sorted.length} images)`)
    for (const file of sorted) {
      const body = await readFile(file)
      const safeName = `${slugify(basename(file, extname(file))) || 'image'}${extname(file).toLowerCase()}`
      const key = `products/${id}/${safeName}`
      try {
        await putR2Object({
          accountId: env.CF_ACCOUNT_ID,
          accessKeyId: env.CF_R2_ACCESS_KEY_ID,
          secretAccessKey: env.CF_R2_SECRET_ACCESS_KEY,
          bucket: env.CF_R2_BUCKET_HIWAII,
          key,
          body,
          contentType: mimeType(file),
        })
      } catch (error) {
        throw new Error(`Failed while uploading ${file}: ${error instanceof Error ? error.message : String(error)}`)
      }
      urls.push(`${env.CF_R2_PUBLIC_URL_HIWAII.replace(/\/$/, '')}/${encodeKey(key)}`)
      uploaded += 1
    }

    const product = makeProduct({ id, urls, relativeDir })
    productsToAdd.push(product)
    nextCatalog.push(product)
    await writeFile(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`, 'utf8')
    console.log(`Added ${id}`)
    existingIds.add(id)
  }

  console.log(JSON.stringify({
    sourceGroups: groups.size,
    addedProducts: productsToAdd.length,
    uploadedImages: uploaded,
    totalProducts: nextCatalog.length,
    addedIds: productsToAdd.map((product) => product.id),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
