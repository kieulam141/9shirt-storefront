import 'next/dist/compiled/server-only/empty.js'

import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { normalizeCatalog } from './validation.ts'

import type { Product } from './types.ts'

export const DEFAULT_CATALOG_PATH = join(process.cwd(), 'data', 'products.json')

export async function writeCatalogFile(products: unknown, path = DEFAULT_CATALOG_PATH): Promise<Product[]> {
  const normalized = normalizeCatalog(products)
  const directory = dirname(path)
  const tempPath = join(directory, `.products-${process.pid}-${Date.now()}.tmp`)

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
