import assert from 'node:assert/strict'
import test from 'node:test'

import { formatPrice } from '../lib/pricing'
import { products } from '../lib/products'

const latinSilkPrices: Record<string, number> = {
  S: 350,
  M: 350,
  L: 350,
  XL: 350,
  '2XL': 395,
  '3XL': 395,
  '4XL': 445,
  '5XL': 445,
}

test('sports products use Latin silk size price tiers', () => {
  const sportsProducts = products.filter((product) => product.niche === 'Sports')

  assert.equal(sportsProducts.length, 6)

  for (const product of sportsProducts) {
    assert.deepEqual(product.sizes, Object.keys(latinSilkPrices))
    assert.equal(product.price, 350)
    assert.deepEqual(product.materials.map((material) => material.label), ['Chất lụa latin'])

    const pricesBySize = Object.fromEntries(
      product.variants.map((variant) => [variant.size, variant.price]),
    )

    assert.deepEqual(pricesBySize, latinSilkPrices)
  }
})

test('formats VND thousand prices without USD symbols', () => {
  assert.equal(formatPrice(350), '350k')
  assert.equal(formatPrice(395), '395k')
  assert.equal(formatPrice(445), '445k')
  assert.equal(formatPrice(24.9), '$24.90')
})
