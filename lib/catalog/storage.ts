import 'server-only'

import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { normalizeCatalog } from './validation.ts'
import productCatalog from '../../data/products.json' with { type: 'json' }

import type { Product } from './types.ts'

const moduleDirectory = dirname(fileURLToPath(import.meta.url))

export const DEFAULT_CATALOG_PATH = join(moduleDirectory, '..', '..', 'data', 'products.json')

export async function readCatalogFile(path = DEFAULT_CATALOG_PATH): Promise<Product[]> {
  try {
    const content = await readFile(path, 'utf8')

    return normalizeCatalog(JSON.parse(content))
  } catch (error) {
    if (isMissingFileError(error)) {
      return normalizeCatalog(productCatalog)
    }

    throw error
  }
}

export async function writeCatalogFile(products: unknown, path = DEFAULT_CATALOG_PATH): Promise<Product[]> {
  const normalized = normalizeCatalog(products)
  const directory = dirname(path)
  const tempPath = join(directory, `.products-${randomUUID()}.tmp`)

  await mkdir(directory, { recursive: true })

  try {
    await writeFile(tempPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
    await rename(tempPath, path)
  } catch (error) {
    await rm(tempPath, { force: true })
    throw error
  }

  return normalized
}

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'ENOENT'
  )
}
