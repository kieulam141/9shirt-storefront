import assert from 'node:assert/strict'
import test from 'node:test'

import { buildSocialImageUrl, socialImage, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '../lib/seo.ts'

test('builds absolute social image URLs for ad platform scrapers', () => {
  const url = buildSocialImageUrl({
    title: 'Áo Hawaii bóng đá nổi bật',
    subtitle: 'Latin silk, size S-5XL',
    image: 'https://cdn.9tech.cloud/example.png',
    price: '350k',
    lang: 'vi',
  })
  const parsed = new URL(url)

  assert.equal(parsed.pathname, '/api/og')
  assert.equal(parsed.searchParams.get('title'), 'Áo Hawaii bóng đá nổi bật')
  assert.equal(parsed.searchParams.get('subtitle'), 'Latin silk, size S-5XL')
  assert.equal(parsed.searchParams.get('image'), 'https://cdn.9tech.cloud/example.png')
  assert.equal(parsed.searchParams.get('price'), '350k')
  assert.equal(parsed.searchParams.get('lang'), 'vi')
})

test('social image metadata uses 1200x630 preview dimensions', () => {
  assert.deepEqual(socialImage('https://www.hiwaii.store/api/og', 'Preview'), {
    url: 'https://www.hiwaii.store/api/og',
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    alt: 'Preview',
  })
})
