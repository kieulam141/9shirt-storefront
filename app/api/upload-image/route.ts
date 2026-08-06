import { createHmac, createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/app/admin/actions'
import { isVietnameseDefaultHost } from '@/lib/seo'

// ─── R2 config ───────────────────────────────────────────────────────────────

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID!
const ACCESS_KEY = process.env.CF_R2_ACCESS_KEY_ID!
const SECRET_KEY = process.env.CF_R2_SECRET_ACCESS_KEY!

const BUCKET_HIWAII = process.env.CF_R2_BUCKET_HIWAII ?? 'hiwaii'
const BUCKET_9SHIRT = process.env.CF_R2_BUCKET_9SHIRT ?? '9shirt'
const PUBLIC_URL_HIWAII = process.env.CF_R2_PUBLIC_URL_HIWAII ?? `https://pub-157061fd1bef406882e9cab9827efcb4.r2.dev`
const PUBLIC_URL_9SHIRT = process.env.CF_R2_PUBLIC_URL_9SHIRT ?? `https://pub-6cb9086640c14631ac357e70e820f89a.r2.dev`

const ENDPOINT = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`
const REGION = 'auto'
const SERVICE = 's3'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

// ─── AWS4 Signature ───────────────────────────────────────────────────────────

function sha256Hex(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data, 'utf8').digest()
}

function getSigningKey(dateStamp: string): Buffer {
  const kDate = hmacSha256(`AWS4${SECRET_KEY}`, dateStamp)
  const kRegion = hmacSha256(kDate, REGION)
  const kService = hmacSha256(kRegion, SERVICE)
  return hmacSha256(kService, 'aws4_request')
}

function buildAuthHeader(params: {
  method: string
  bucket: string
  key: string
  contentType: string
  contentHash: string
  amzDate: string
  dateStamp: string
}): string {
  const { method, bucket, key, contentType, contentHash, amzDate, dateStamp } = params
  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`
  const uri = `/${bucket}/${key}`

  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${contentHash}`,
    `x-amz-date:${amzDate}`,
  ].join('\n') + '\n'

  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'

  const canonicalRequest = [
    method,
    uri,
    '', // no query string
    canonicalHeaders,
    signedHeaders,
    contentHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')

  const signingKey = getSigningKey(dateStamp)
  const signature = hmacSha256(signingKey, stringToSign).toString('hex')

  return `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth check
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse multipart form
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  const productId = (formData.get('productId') as string | null) ?? 'unknown'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
  }

  // Determine bucket based on host
  const requestHeaders = await headers()
  const host = requestHeaders.get('host') ?? ''
  const isViHost = isVietnameseDefaultHost(host)
  const bucket = isViHost ? BUCKET_9SHIRT : BUCKET_HIWAII
  const publicUrl = isViHost ? PUBLIC_URL_9SHIRT : PUBLIC_URL_HIWAII

  // Build object key
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/\.+/g, '.')
  const timestamp = Date.now()
  const objectKey = `products/${productId}/${timestamp}-${safeName}`

  // Read file bytes
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const contentHash = sha256Hex(fileBuffer)

  // Build date strings
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '')
  const dateStamp = amzDate.slice(0, 8)

  // Build auth
  const authHeader = buildAuthHeader({
    method: 'PUT',
    bucket,
    key: objectKey,
    contentType: file.type,
    contentHash,
    amzDate,
    dateStamp,
  })

  // Upload to R2
  try {
    const r2Res = await fetch(`${ENDPOINT}/${bucket}/${objectKey}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': file.type,
        'x-amz-content-sha256': contentHash,
        'x-amz-date': amzDate,
      },
      body: fileBuffer,
    })

    if (!r2Res.ok) {
      const errText = await r2Res.text()
      console.error('[upload-image] R2 error:', r2Res.status, errText)
      return NextResponse.json(
        { error: `R2 upload failed: ${r2Res.status}` },
        { status: 500 },
      )
    }
  } catch (err) {
    console.error('[upload-image] Fetch error:', err)
    return NextResponse.json({ error: 'Upload request failed' }, { status: 500 })
  }

  const cdnUrl = `${publicUrl}/${objectKey}`
  return NextResponse.json({ url: cdnUrl, bucket, key: objectKey })
}
