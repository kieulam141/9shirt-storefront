import { NextResponse } from 'next/server'
import { isShopifyConfigured, createShopifyDraftOrder } from '@/lib/shopify'
import { isVietnameseDefaultHost } from '@/lib/seo'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const host = request.headers.get('host')
    console.log('--- Received Checkout Order ---')
    console.log(JSON.stringify(body, null, 2))

    if (!isVietnameseDefaultHost(host)) {
      if (!isShopifyConfigured()) {
        return NextResponse.json(
          { success: false, error: 'Shopify is not configured for Hiwaii checkout.' },
          { status: 503 },
        )
      }

      const shopifyOrder = await createShopifyDraftOrder(body)
      return NextResponse.json({
        success: true,
        orderId: body.orderId,
        provider: 'shopify',
        ...shopifyOrder,
      })
    }

    // Determine n8n webhook URL from environment variables or use a default path
    const n8nWebhookUrl =
      process.env.N8N_CHECKOUT_WEBHOOK_URL ||
      'https://automation.9tech.cloud/webhook/checkout'

    console.log(`Forwarding order to n8n webhook: ${n8nWebhookUrl}`)

    let webhookSuccess = false
    let webhookError = null

    // We fetch with a timeout so that if n8n is offline, checkout doesn't hang
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000) // 6 second timeout

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        webhookSuccess = true
        console.log('Successfully forwarded order to n8n webhook')
      } else {
        webhookError = `n8n returned status code: ${response.status}`
        console.error(`Failed to forward order to n8n: ${webhookError}`)
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId)
      const errorObj = err as Error
      if (errorObj.name === 'AbortError') {
        webhookError = 'Timeout forwarding order to n8n'
      } else {
        webhookError = errorObj.message || String(err)
      }
      console.error(`Error forwarding order to n8n: ${webhookError}`)
    }

    // Return success to the client even if forwarding to Odoo/n8n fails,
    // so that the customer is not blocked, but include the webhook status in log.
    return NextResponse.json({
      success: true,
      orderId: body.orderId,
      webhookSynced: webhookSuccess,
      error: webhookError,
    })
  } catch (error: unknown) {
    const errorObj = error as Error
    console.error('Checkout API error:', errorObj)
    return NextResponse.json(
      { success: false, error: errorObj.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
