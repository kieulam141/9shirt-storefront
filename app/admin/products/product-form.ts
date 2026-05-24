import type { Product } from '@/lib/catalog/types'

export type EditableProduct = Product

export function cloneProduct(product: Product): EditableProduct {
  return structuredClone(product)
}

export function updateProductField<K extends keyof EditableProduct>(
  product: EditableProduct,
  key: K,
  value: EditableProduct[K],
): EditableProduct {
  return { ...product, [key]: value }
}
