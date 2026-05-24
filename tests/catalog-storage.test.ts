import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { writeCatalogFile } from '../lib/catalog/storage.ts'
import { products } from '../lib/products.ts'

test('writeCatalogFile writes formatted JSON after validating the full catalog', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-'))
  const target = join(dir, 'products.json')

  await writeCatalogFile(products, target)

  const content = await readFile(target, 'utf8')
  assert.equal(content.endsWith('\n'), true)
  assert.deepEqual(JSON.parse(content)[0].id, products[0].id)

  await rm(dir, { recursive: true, force: true })
})

test('writeCatalogFile rejects invalid catalogs before writing', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hiwaii-catalog-'))
  const target = join(dir, 'products.json')

  await assert.rejects(
    () => writeCatalogFile([{ ...products[0], name: '' }], target),
    /Catalog validation failed/,
  )

  await rm(dir, { recursive: true, force: true })
})
