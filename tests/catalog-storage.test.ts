import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'

import { readCatalogFile, writeCatalogFile } from '../lib/catalog/storage.ts'
import { products } from '../lib/products.ts'

test('writeCatalogFile writes formatted JSON after validating the full catalog', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-'))
  const target = join(dir, 'products.json')

  try {
    await writeCatalogFile(products, target)

    const content = await readFile(target, 'utf8')
    assert.equal(content.endsWith('\n'), true)
    assert.deepEqual(JSON.parse(content)[0].id, products[0].id)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('writeCatalogFile rejects invalid catalogs before writing', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-'))
  const target = join(dir, 'products.json')

  try {
    await assert.rejects(
      () => writeCatalogFile([{ ...products[0], name: '' }], target),
      /Catalog validation failed/,
    )
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('readCatalogFile reads and validates the current catalog file contents', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-'))
  const target = join(dir, 'products.json')
  const updatedProduct = {
    ...products[0],
    name: `${products[0].name} Updated`,
  }

  try {
    await writeCatalogFile(products, target)
    await writeCatalogFile([updatedProduct], target)

    const catalog = await readCatalogFile(target)

    assert.equal(catalog.length, 1)
    assert.equal(catalog[0].name, updatedProduct.name)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('readCatalogFile falls back to the bundled catalog when the runtime file is missing', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-missing-'))
  const target = join(dir, 'missing-products.json')

  try {
    const catalog = await readCatalogFile(target)

    assert.equal(catalog.length, products.length)
    assert.equal(catalog[0].id, products[0].id)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('DEFAULT_CATALOG_PATH resolves relative to the catalog storage module', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-'))
  const originalCwd = process.cwd()

  try {
    process.chdir(dir)

    const storageUrl = pathToFileURL(join(originalCwd, 'lib/catalog/storage.ts'))
    storageUrl.search = `?cwd-test=${Date.now()}`
    const storage = await import(storageUrl.href)

    assert.equal(storage.DEFAULT_CATALOG_PATH, join(originalCwd, 'data', 'products.json'))
  } finally {
    process.chdir(originalCwd)
    await rm(dir, { recursive: true, force: true })
  }
})
