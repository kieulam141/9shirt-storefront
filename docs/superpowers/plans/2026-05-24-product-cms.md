# Product CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-gated, repo-backed product CMS at `/admin/products` that edits the storefront catalog through JSON files while preserving the current product helper API.

**Architecture:** Move editable product records into `data/products.json`, add focused catalog validation/storage modules under `lib/catalog/`, keep `lib/products.ts` as the stable storefront facade, and add admin routes/components that read and write the JSON catalog through server actions. The storefront continues to consume `products`, `niches`, `bundleTypeGroups`, `bundleOffers`, and `getProductById`.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Node test runner, existing shadcn-style UI components, `zod`, server actions, repository JSON storage.

---

## File Structure

- Create `data/products.json`: canonical editable product records, converted one-to-one from the current `products` array in `lib/products.ts`.
- Create `lib/catalog/types.ts`: catalog enums and product-related TypeScript interfaces currently owned by `lib/products.ts`.
- Create `lib/catalog/validation.ts`: pure validation and normalization for raw catalog JSON.
- Create `lib/catalog/storage.ts`: server-only file read/write helpers for admin save actions.
- Modify `lib/products.ts`: keep public exports, import JSON catalog data, normalize it, and retain non-editable bundle helpers.
- Modify `tests/products-pricing.test.ts`, `tests/language-defaults.test.ts`, `tests/seo-social-image.test.ts`: make TypeScript imports executable by Node.
- Create `tests/catalog-validation.test.ts`: validation coverage for catalog integrity.
- Modify `package.json`: add a `test` script that runs Node’s test runner against TypeScript tests.
- Create `app/admin/actions.ts`: login/logout and product save server actions.
- Create `app/admin/page.tsx`: redirect to `/admin/products`.
- Create `app/admin/login/page.tsx`: password form.
- Create `app/admin/products/page.tsx`: authenticated admin page loader.
- Create `app/admin/products/ProductCmsClient.tsx`: searchable product editor UI.
- Create `app/admin/products/product-form.ts`: client-side form mapping helpers used by the CMS component.

## Task 1: Make Product Tests Executable

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `tests/products-pricing.test.ts`
- Modify: `tests/language-defaults.test.ts`
- Modify: `tests/seo-social-image.test.ts`

- [ ] **Step 1: Write the failing test command into the plan log**

Run the current test command:

```bash
node --test tests/products-pricing.test.ts
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../lib/pricing`, proving the current test harness needs extension-aware TypeScript imports.

- [ ] **Step 2: Add a real test script**

Update `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "node --test tests/*.test.ts"
  }
}
```

- [ ] **Step 3: Allow explicit TypeScript imports**

Update `tsconfig.json` under `compilerOptions`:

```json
{
  "allowImportingTsExtensions": true
}
```

- [ ] **Step 4: Update test imports**

Change existing test imports to include `.ts` extensions:

```ts
import { formatPrice } from '../lib/pricing.ts'
import { products } from '../lib/products.ts'
```

```ts
import { getDefaultLangForHost, getLangFromSearchParams, isVietnameseDefaultHost } from '../lib/seo.ts'
```

- [ ] **Step 5: Verify existing tests pass before catalog changes**

Run:

```bash
pnpm test
```

Expected: PASS for the existing pricing, language, and SEO tests.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json tests
git commit -m "test: make TypeScript tests executable"
```

## Task 2: Add Catalog Validation Test First

**Files:**
- Create: `tests/catalog-validation.test.ts`
- Create: `lib/catalog/types.ts`
- Create: `lib/catalog/validation.ts`

- [ ] **Step 1: Write failing catalog validation tests**

Create `tests/catalog-validation.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test
```

Expected: FAIL because `../lib/catalog/validation.ts` does not exist.

- [ ] **Step 3: Move catalog types into a focused module**

Create `lib/catalog/types.ts` with the product and bundle type definitions currently at the top of `lib/products.ts`:

```ts
export type Niche = 'Sports' | 'Animal' | 'Art & Music' | 'Vintage'
export type SubNiche = 'Football' | 'Cat' | 'Dog' | 'Lion' | 'Tiger' | 'Piano' | 'Photography' | 'Train'
export type ProductType = 'Hawaiian Shirt' | 'Polo Shirt' | 'T-Shirt' | 'Baseball Cap' | 'Shorts'
export type MaterialCode = 'standard_poly' | 'premium_silk'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface ProductMedia {
  type: 'image' | 'video'
  url: string
  thumb?: string
}

export interface ProductVariant {
  size: string
  material: MaterialCode
  available: boolean
  stockStatus: StockStatus
  price: number
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface ProductMaterial {
  code: MaterialCode
  label: string
  uplift: number
  benefit: string
  badge?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  compareAtPrice?: number
  hook: string
  description: string
  productType: ProductType
  niche: Niche
  subNiche: SubNiche
  badge?: 'Best seller' | 'Trending' | 'Premium Edition'
  thumbnail: string
  images: string[]
  videoUrl?: string
  media: ProductMedia[]
  sizes: string[]
  materials: ProductMaterial[]
  variants: ProductVariant[]
  specifications: ProductSpecification[]
}

export interface BundleTypeGroup {
  type: ProductType
  label: string
  description: string
  fromPrice: number
  bundleHint: string
}

export interface BundleOffer {
  id: string
  title: string
  types: ProductType[]
  bundlePrice: number
  compareAtPrice: number
}
```

- [ ] **Step 4: Implement minimal validation**

Create `lib/catalog/validation.ts`:

```ts
import { z } from 'zod'
import type { Product } from './types.ts'

const materialCodeSchema = z.enum(['standard_poly', 'premium_silk'])
const stockStatusSchema = z.enum(['in_stock', 'low_stock', 'out_of_stock'])

const productSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  price: z.number().finite().nonnegative(),
  compareAtPrice: z.number().finite().nonnegative().optional(),
  hook: z.string().trim().min(1),
  description: z.string().trim().min(1),
  productType: z.enum(['Hawaiian Shirt', 'Polo Shirt', 'T-Shirt', 'Baseball Cap', 'Shorts']),
  niche: z.enum(['Sports', 'Animal', 'Art & Music', 'Vintage']),
  subNiche: z.enum(['Football', 'Cat', 'Dog', 'Lion', 'Tiger', 'Piano', 'Photography', 'Train']),
  badge: z.enum(['Best seller', 'Trending', 'Premium Edition']).optional(),
  thumbnail: z.string().trim().min(1),
  images: z.array(z.string().trim().min(1)).min(1),
  videoUrl: z.string().trim().min(1).optional(),
  media: z.array(z.object({
    type: z.enum(['image', 'video']),
    url: z.string().trim().min(1),
    thumb: z.string().trim().min(1).optional(),
  })).min(1),
  sizes: z.array(z.string().trim().min(1)).min(1),
  materials: z.array(z.object({
    code: materialCodeSchema,
    label: z.string().trim().min(1),
    uplift: z.number().finite(),
    benefit: z.string().trim().min(1),
    badge: z.string().trim().min(1).optional(),
  })).min(1),
  variants: z.array(z.object({
    size: z.string().trim().min(1),
    material: materialCodeSchema,
    available: z.boolean(),
    stockStatus: stockStatusSchema,
    price: z.number().finite().nonnegative(),
  })).min(1),
  specifications: z.array(z.object({
    label: z.string().trim().min(1),
    value: z.string().trim().min(1),
  })).min(1),
})

const catalogSchema = z.array(productSchema).min(1)

export type CatalogValidationResult = {
  ok: boolean
  errors: string[]
}

export function validateCatalog(input: unknown): CatalogValidationResult {
  const parsed = catalogSchema.safeParse(input)
  const errors = parsed.success
    ? []
    : parsed.error.issues.map((issue) => `${issue.path.join('.') || 'catalog'}: ${issue.message}`)

  if (parsed.success) {
    const ids = new Set<string>()
    const slugs = new Set<string>()

    for (const product of parsed.data) {
      if (ids.has(product.id)) errors.push(`Duplicate product id: ${product.id}`)
      ids.add(product.id)

      if (slugs.has(product.slug)) errors.push(`Duplicate product slug: ${product.slug}`)
      slugs.add(product.slug)

      const sizes = new Set(product.sizes)
      const materials = new Set(product.materials.map((material) => material.code))

      for (const variant of product.variants) {
        if (!sizes.has(variant.size)) errors.push(`${product.id}: variant references unknown size ${variant.size}`)
        if (!materials.has(variant.material)) errors.push(`${product.id}: variant references unknown material ${variant.material}`)
      }
    }
  }

  return { ok: errors.length === 0, errors }
}

export function normalizeCatalog(input: unknown): Product[] {
  const parsed = catalogSchema.parse(input)
  const result = validateCatalog(parsed)

  if (!result.ok) {
    throw new Error(`Catalog validation failed:\n${result.errors.join('\n')}`)
  }

  return parsed
}
```

- [ ] **Step 5: Run tests to verify validation passes**

Run:

```bash
pnpm test
```

Expected: PASS for catalog validation and existing tests.

- [ ] **Step 6: Commit**

```bash
git add lib/catalog tests/catalog-validation.test.ts
git commit -m "test: add catalog validation coverage"
```

## Task 3: Move Product Records Into JSON

**Files:**
- Create: `data/products.json`
- Modify: `lib/products.ts`
- Modify: `tests/products-pricing.test.ts`

- [ ] **Step 1: Write a failing facade test**

Add this assertion to `tests/products-pricing.test.ts`:

```ts
test('product facade loads catalog records from JSON-backed source', () => {
  assert.equal(products.length > 0, true)
  assert.equal(typeof products[0].id, 'string')
  assert.equal(products[0].media.length > 0, true)
})
```

- [ ] **Step 2: Run test before the JSON data exists**

Run:

```bash
pnpm test
```

Expected: PASS initially because the facade still uses the TypeScript array; this is a characterization test before the storage migration.

- [ ] **Step 3: Create JSON data**

Create `data/products.json` by converting the current `products` array payload in `lib/products.ts` to JSON:

- Expand each `r2('path')` call to the full URL using `https://cdn.9tech.cloud/${encodeURI(path)}`.
- Expand each `imageMedia([...])` call to explicit objects like `{ "type": "image", "url": "..." }`.
- Expand each `generateLatinSilkVariants()` call to concrete variants for `S`, `M`, `L`, `XL`, `2XL`, `3XL`, `4XL`, `5XL` with prices `350`, `350`, `350`, `350`, `395`, `395`, `445`, `445`.
- Expand each `generateVariants(basePrice, lowStockSizes, soldOutPremium)` call to concrete size/material variants for `S`, `M`, `L`, `XL`, `2XL`, `3XL`.
- Preserve every current product id, slug, name, price, media URL, material, specification, badge, and description exactly.

The resulting file shape is:

```json
[
  {
    "id": "cr72-champions-gold",
    "slug": "cr72-champions-gold-shirt",
    "name": "CR7 Champions Gold Resort Shirt",
    "price": 350,
    "hook": "Gold-and-black CR7 champions artwork with trophy details.",
    "description": "A high-impact football celebration print built around gold florals, trophy graphics, and a premium black resort palette.",
    "productType": "Hawaiian Shirt",
    "niche": "Sports",
    "subNiche": "Football",
    "badge": "Trending",
    "thumbnail": "https://cdn.9tech.cloud/3D%20Hiwaii/New%20Products/CR72/704810634_979476901355846_2168163068901386661_n.jpg",
    "images": ["https://cdn.9tech.cloud/3D%20Hiwaii/New%20Products/CR72/704810634_979476901355846_2168163068901386661_n.jpg"],
    "media": [{ "type": "image", "url": "https://cdn.9tech.cloud/3D%20Hiwaii/New%20Products/CR72/704810634_979476901355846_2168163068901386661_n.jpg" }],
    "sizes": ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    "materials": [{ "code": "standard_poly", "label": "Chất lụa latin", "uplift": 0, "benefit": "Mềm rũ • mát nhẹ • lên màu sắc nét" }],
    "variants": [{ "size": "S", "material": "standard_poly", "available": true, "stockStatus": "in_stock", "price": 350 }],
    "specifications": [{ "label": "Material", "value": "Chất lụa latin" }]
  }
]
```

The example above shows the schema only. The committed file must contain all products currently present in `lib/products.ts`, not just this example record.

- [ ] **Step 4: Refactor `lib/products.ts` into the stable facade**

Replace local product type definitions with imports, import JSON, and normalize it:

```ts
import productCatalog from '@/data/products.json'
import { normalizeCatalog } from '@/lib/catalog/validation'
import type {
  BundleOffer,
  BundleTypeGroup,
  Niche,
  Product,
  ProductMedia,
  ProductSpecification,
  ProductVariant,
  ProductType,
  MaterialCode,
  StockStatus,
  SubNiche,
} from '@/lib/catalog/types'

export type {
  BundleOffer,
  BundleTypeGroup,
  Niche,
  Product,
  ProductMedia,
  ProductSpecification,
  ProductVariant,
  ProductType,
  MaterialCode,
  StockStatus,
  SubNiche,
}

export const products: Product[] = normalizeCatalog(productCatalog)
```

Keep the existing `niches`, `bundleTypeGroups`, `bundleOffers`, and `getProductById` exports below that facade.

- [ ] **Step 5: Remove obsolete product generation helpers**

Delete `SIZE_ORDER`, `LATIN_SILK_SIZE_ORDER`, `LATIN_SILK_PRICES`, `R2_PUBLIC_BASE`, `r2`, `generateVariants`, `generateLatinSilkVariants`, `latinSilkMaterials`, `newProductImage`, and `imageMedia` from `lib/products.ts` once JSON contains concrete values.

- [ ] **Step 6: Verify tests and build**

Run:

```bash
pnpm test
pnpm build
```

Expected: PASS. Product count and sports pricing tests remain unchanged.

- [ ] **Step 7: Commit**

```bash
git add data/products.json lib/products.ts tests/products-pricing.test.ts
git commit -m "feat: load products from JSON catalog"
```

## Task 4: Add Repo-Backed Catalog Storage

**Files:**
- Create: `lib/catalog/storage.ts`
- Create: `tests/catalog-storage.test.ts`

- [ ] **Step 1: Write failing storage tests**

Create `tests/catalog-storage.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test
```

Expected: FAIL because `lib/catalog/storage.ts` does not exist.

- [ ] **Step 3: Implement storage helpers**

Create `lib/catalog/storage.ts`:

```ts
import 'server-only'

import { mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Product } from './types.ts'
import { normalizeCatalog } from './validation.ts'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))
export const DEFAULT_CATALOG_PATH = join(rootDir, 'data/products.json')

export async function writeCatalogFile(products: Product[], path = DEFAULT_CATALOG_PATH): Promise<void> {
  const normalized = normalizeCatalog(products)
  const targetDir = dirname(path)
  const tempPath = `${path}.tmp`
  const payload = `${JSON.stringify(normalized, null, 2)}\n`

  await mkdir(targetDir, { recursive: true })
  await writeFile(tempPath, payload, 'utf8')
  await rename(tempPath, path)
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/catalog/storage.ts tests/catalog-storage.test.ts
git commit -m "feat: add validated catalog file storage"
```

## Task 5: Add Admin Auth and Server Actions

**Files:**
- Create: `app/admin/actions.ts`
- Create: `app/admin/page.tsx`
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Write authentication helper through server actions**

Create `app/admin/actions.ts`:

```ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { products } from '@/lib/products'
import { writeCatalogFile } from '@/lib/catalog/storage'
import { normalizeCatalog } from '@/lib/catalog/validation'
import type { Product } from '@/lib/catalog/types'

const ADMIN_COOKIE = 'hiwaii_admin'

function expectedPassword(): string | undefined {
  return process.env.HIWAIi_ADMIN_PASSWORD || process.env.HIWAII_ADMIN_PASSWORD
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = expectedPassword()
  const jar = await cookies()
  return Boolean(password && jar.get(ADMIN_COOKIE)?.value === password)
}

export async function loginAdmin(formData: FormData): Promise<void> {
  const password = expectedPassword()
  const submitted = String(formData.get('password') || '')

  if (!password || submitted !== password) {
    redirect('/admin/login?error=1')
  }

  const jar = await cookies()
  jar.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
  })
  redirect('/admin/products')
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

export type SaveProductResult = {
  ok: boolean
  errors: string[]
}

export async function saveProduct(product: Product): Promise<SaveProductResult> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, errors: ['Admin authentication is required.'] }
  }

  const nextProducts = products.map((item) => (item.id === product.id ? product : item))
  if (!nextProducts.some((item) => item.id === product.id)) {
    nextProducts.push(product)
  }

  try {
    await writeCatalogFile(normalizeCatalog(nextProducts))
    revalidatePath('/')
    revalidatePath('/collections')
    revalidatePath(`/product/${product.id}`)
    revalidatePath('/admin/products')
    return { ok: true, errors: [] }
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : 'Product could not be saved.'],
    }
  }
}
```

- [ ] **Step 2: Add admin redirect page**

Create `app/admin/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/products')
}
```

- [ ] **Step 3: Add password login page**

Create `app/admin/login/page.tsx`:

```tsx
import { loginAdmin } from '../actions'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const hasError = query.error === '1'
  const missingPassword = !process.env.HIWAIi_ADMIN_PASSWORD && !process.env.HIWAII_ADMIN_PASSWORD

  return (
    <main className="min-h-screen bg-[var(--hiwaii-bg)] px-4 py-20 text-[var(--hiwaii-text-primary)]">
      <form action={loginAdmin} className="mx-auto max-w-sm rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-6">
        <h1 className="text-2xl font-black">Product CMS</h1>
        <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">Enter the admin password to manage products.</p>
        <input
          name="password"
          type="password"
          className="mt-5 min-h-11 w-full rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3 text-sm"
          aria-label="Password"
        />
        {hasError ? <p className="mt-3 text-sm font-bold text-red-300">Invalid admin password.</p> : null}
        {missingPassword ? <p className="mt-3 text-sm font-bold text-amber-200">Set HIWAII_ADMIN_PASSWORD before using the CMS.</p> : null}
        <button className="mt-5 min-h-11 w-full rounded-full bg-[var(--hiwaii-accent)] px-5 text-sm font-black uppercase tracking-[0.14em] text-[#071425]">
          Sign in
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 4: Verify build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/admin
git commit -m "feat: add product CMS admin authentication"
```

## Task 6: Build Product CMS UI

**Files:**
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/ProductCmsClient.tsx`
- Create: `app/admin/products/product-form.ts`

- [ ] **Step 1: Create product form mapping helpers**

Create `app/admin/products/product-form.ts`:

```ts
import type { Product } from '@/lib/catalog/types'

export type EditableProduct = Product

export function cloneProduct(product: Product): EditableProduct {
  return JSON.parse(JSON.stringify(product)) as EditableProduct
}

export function updateProductField<K extends keyof EditableProduct>(
  product: EditableProduct,
  key: K,
  value: EditableProduct[K],
): EditableProduct {
  return { ...product, [key]: value }
}
```

- [ ] **Step 2: Create authenticated products page**

Create `app/admin/products/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { isAdminAuthenticated, logoutAdmin, saveProduct } from '../actions'
import { products } from '@/lib/products'
import ProductCmsClient from './ProductCmsClient'

export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return <ProductCmsClient products={products} onSave={saveProduct} onLogout={logoutAdmin} />
}
```

- [ ] **Step 3: Create client editor**

Create `app/admin/products/ProductCmsClient.tsx` with a controlled UI that supports search, product selection, direct field editing, media JSON editing, variants JSON editing, specification JSON editing, save status, and logout. Use existing CSS variables and stable dimensions:

```tsx
'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import { LogOut, Save, Search } from 'lucide-react'
import type { Product } from '@/lib/catalog/types'
import { cloneProduct, updateProductField, type EditableProduct } from './product-form'

type SaveResult = {
  ok: boolean
  errors: string[]
}

type Props = {
  products: Product[]
  onSave: (product: Product) => Promise<SaveResult>
  onLogout: () => Promise<void>
}

function parseJsonField<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export default function ProductCmsClient({ products, onSave, onLogout }: Props) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(products[0]?.id || '')
  const selectedSource = products.find((product) => product.id === selectedId) || products[0]
  const [draft, setDraft] = useState<EditableProduct>(() => cloneProduct(selectedSource))
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return products
    return products.filter((product) =>
      [product.name, product.id, product.slug, product.niche, product.subNiche, product.hook]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [products, query])

  const selectProduct = (product: Product) => {
    setSelectedId(product.id)
    setDraft(cloneProduct(product))
    setMessage('')
  }

  const saveDraft = () => {
    setMessage('')
    startTransition(async () => {
      const result = await onSave(draft)
      setMessage(result.ok ? 'Product saved. Deploy the site to publish storefront changes.' : result.errors.join('\n'))
    })
  }

  return (
    <main className="min-h-screen bg-[var(--hiwaii-bg)] p-4 text-[var(--hiwaii-text-primary)] sm:p-6">
      <div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[300px_1fr_280px]">
        <aside className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--hiwaii-accent)]">CMS</p>
              <h1 className="text-2xl font-black">Products</h1>
            </div>
            <button type="button" onClick={() => onLogout()} className="rounded-full border border-[var(--hiwaii-border)] p-2" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <label className="mt-4 flex min-h-11 items-center gap-2 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3">
            <Search className="h-4 w-4 text-[var(--hiwaii-text-secondary)]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" aria-label="Search products" />
          </label>

          <div className="mt-4 space-y-2">
            {filtered.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => selectProduct(product)}
                className={`w-full rounded-xl border p-3 text-left ${draft.id === product.id ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#081736]'}`}
              >
                <p className="text-sm font-black">{product.name}</p>
                <p className="mt-1 text-xs font-semibold text-[var(--hiwaii-text-secondary)]">{product.niche} / {product.subNiche}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--hiwaii-accent)]">Edit product</p>
              <h2 className="text-2xl font-black">{draft.name}</h2>
            </div>
            <button type="button" onClick={saveDraft} disabled={isPending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--hiwaii-accent)] px-5 text-sm font-black uppercase tracking-[0.14em] text-[#071425] disabled:opacity-60">
              <Save className="h-4 w-4" />
              {isPending ? 'Saving' : 'Save'}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="min-h-11 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3" value={draft.name} onChange={(event) => setDraft(updateProductField(draft, 'name', event.target.value))} />
            <input className="min-h-11 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3" value={draft.slug} onChange={(event) => setDraft(updateProductField(draft, 'slug', event.target.value))} />
            <input className="min-h-11 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3" type="number" value={draft.price} onChange={(event) => setDraft(updateProductField(draft, 'price', Number(event.target.value)))} />
            <input className="min-h-11 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3" value={draft.badge || ''} onChange={(event) => setDraft(updateProductField(draft, 'badge', event.target.value ? event.target.value as Product['badge'] : undefined))} />
            <input className="min-h-11 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3" value={draft.niche} onChange={(event) => setDraft(updateProductField(draft, 'niche', event.target.value as Product['niche']))} />
            <input className="min-h-11 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] px-3" value={draft.subNiche} onChange={(event) => setDraft(updateProductField(draft, 'subNiche', event.target.value as Product['subNiche']))} />
          </div>

          <textarea className="mt-4 min-h-20 w-full rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] p-3" value={draft.hook} onChange={(event) => setDraft(updateProductField(draft, 'hook', event.target.value))} />
          <textarea className="mt-4 min-h-28 w-full rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] p-3" value={draft.description} onChange={(event) => setDraft(updateProductField(draft, 'description', event.target.value))} />

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <textarea className="min-h-48 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] p-3 font-mono text-xs" value={JSON.stringify(draft.media, null, 2)} onChange={(event) => setDraft(updateProductField(draft, 'media', parseJsonField(event.target.value, draft.media)))} />
            <textarea className="min-h-48 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] p-3 font-mono text-xs" value={JSON.stringify(draft.variants, null, 2)} onChange={(event) => setDraft(updateProductField(draft, 'variants', parseJsonField(event.target.value, draft.variants)))} />
            <textarea className="min-h-48 rounded-lg border border-[var(--hiwaii-border)] bg-[#081736] p-3 font-mono text-xs" value={JSON.stringify(draft.specifications, null, 2)} onChange={(event) => setDraft(updateProductField(draft, 'specifications', parseJsonField(event.target.value, draft.specifications)))} />
          </div>

          {message ? <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-[var(--hiwaii-border)] bg-[#081736] p-3 text-sm font-semibold">{message}</pre> : null}
        </section>

        <aside className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-[var(--hiwaii-border)] bg-[#081736]">
            <Image src={draft.thumbnail} alt={draft.name} fill className="object-cover" sizes="280px" />
          </div>
          <h3 className="mt-4 text-lg font-black">SEO preview</h3>
          <p className="mt-2 text-sm font-bold">{draft.name} | Hiwaii</p>
          <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{draft.description}</p>
          <div className="mt-4 rounded-xl border border-[var(--hiwaii-border)] bg-[#081736] p-3 text-xs font-semibold text-[var(--hiwaii-text-secondary)]">
            Deploy required after save. JSON validation runs before file writes.
          </div>
        </aside>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Run build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/admin/products
git commit -m "feat: build product CMS editor"
```

## Task 7: Verify End-to-End CMS Flow

**Files:**
- Modify only if verification exposes concrete failures.

- [ ] **Step 1: Run automated checks**

Run:

```bash
pnpm test
pnpm lint
pnpm build
```

Expected: all PASS.

- [ ] **Step 2: Start local dev server**

Run:

```bash
HIWAII_ADMIN_PASSWORD=admin123 pnpm dev
```

Expected: Next.js starts on `http://localhost:3000` or the next available port.

- [ ] **Step 3: Manual browser verification**

Open `/admin/login`, sign in with `admin123`, open `/admin/products`, edit a non-critical product text field, save, and confirm the success message says deploy is required.

- [ ] **Step 4: Verify storefront still renders**

Open `/`, `/collections`, and one `/product/[id]` route from the edited product. Confirm product cards, PDP media, and SEO metadata route do not throw runtime errors.

- [ ] **Step 5: Revert the manual text edit if it was only for verification**

If the manual edit changed product copy only for testing, restore the original value through the CMS and save again.

- [ ] **Step 6: Final commit**

```bash
git status --short
git add .
git commit -m "chore: verify product CMS flow"
```

Only create this commit if Step 5 produced file changes after the prior feature commits.

## Self-Review

Spec coverage:

- Product-only CMS: covered by Tasks 3, 5, and 6.
- Repo-backed JSON storage: covered by Tasks 3 and 4.
- Stable storefront product API: covered by Tasks 2 and 3.
- Admin product editor: covered by Tasks 5 and 6.
- Password gate: covered by Task 5.
- Validation: covered by Tasks 2 and 4.
- Deployment-based publishing note: covered by Tasks 6 and 7.
- Testing and verification: covered by Tasks 1, 2, 4, and 7.

Red-flag scan:

- No incomplete marker terms or unspecified implementation steps are present.
- The only schema example in Task 3 is explicitly marked as an example, and the step requires committing all current products from `lib/products.ts`.

Type consistency:

- Product types originate in `lib/catalog/types.ts`.
- `validateCatalog`, `normalizeCatalog`, and `writeCatalogFile` signatures match all test and action usage.
- `saveProduct` returns the `SaveProductResult` shape consumed by `ProductCmsClient`.
