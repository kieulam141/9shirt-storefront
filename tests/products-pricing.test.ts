import assert from 'node:assert/strict'
import test from 'node:test'

import { formatPrice } from '../lib/pricing.ts'
import { products } from '../lib/products.ts'

test('product facade loads catalog records from JSON-backed source', () => {
  assert.equal(products.length > 0, true)
  assert.equal(typeof products[0].id, 'string')
  assert.equal(products[0].media.length > 0, true)
})

const fixedShirtPrice = 495
const fixedShortsPrice = 295

test('catalog products use 9shirt fixed VND prices', () => {
  for (const product of products) {
    const expectedPrice = product.productType === 'Shorts' ? fixedShortsPrice : fixedShirtPrice
    assert.equal(product.price, expectedPrice)
    assert.equal(product.materials.every((material) => material.label === 'Lụa Latin'), true)

    for (const variant of product.variants) {
      assert.equal(variant.price, expectedPrice)
    }
  }
})

test('formats VND thousand prices', () => {
  assert.equal(formatPrice(495), '495k')
  assert.equal(formatPrice(295), '295k')
})
