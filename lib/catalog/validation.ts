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
  const result = validateCatalog(input)

  if (!result.ok) {
    throw new Error(`Catalog validation failed:\n${result.errors.join('\n')}`)
  }

  return catalogSchema.parse(input) as Product[]
}
