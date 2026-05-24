import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeCatalog, validateCatalog } from '../lib/catalog/validation.ts'
import { products } from '../lib/products.ts'

const sampleProduct = products[0]

test('catalog validation accepts the current products', () => {
  const result = validateCatalog(products)

  assert.equal(result.ok, true)
  assert.deepEqual(result.errors, [])
})

test('catalog validation rejects duplicate product ids', () => {
  const result = validateCatalog([sampleProduct, { ...sampleProduct, slug: `${sampleProduct.slug}-copy` }])

  assert.equal(result.ok, false)
  assert.match(result.errors.join('\n'), /Duplicate product id/)
})

test('catalog validation rejects duplicate product slugs', () => {
  const result = validateCatalog([sampleProduct, { ...sampleProduct, id: `${sampleProduct.id}-copy` }])

  assert.equal(result.ok, false)
  assert.match(result.errors.join('\n'), /Duplicate product slug/)
})

test('catalog validation rejects variants outside declared sizes and materials', () => {
  const broken = {
    ...sampleProduct,
    variants: [
      ...sampleProduct.variants,
      { size: '9XL', material: 'standard_poly', available: true, stockStatus: 'in_stock', price: sampleProduct.price },
      { size: sampleProduct.sizes[0], material: 'linen', available: true, stockStatus: 'in_stock', price: sampleProduct.price },
    ],
  }

  const result = validateCatalog([broken])

  assert.equal(result.ok, false)
  assert.match(result.errors.join('\n'), /unknown size/)
  assert.match(result.errors.join('\n'), /unknown material/)
})

test('normalizeCatalog returns typed products and throws on invalid input', () => {
  assert.equal(normalizeCatalog([sampleProduct])[0].id, sampleProduct.id)

  assert.throws(
    () => normalizeCatalog([{ ...sampleProduct, name: '' }]),
    /Catalog validation failed/,
  )
})
