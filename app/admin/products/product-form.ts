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

export function reconcileSavedProduct(products: Product[], savedProduct: Product): Product[] {
  const savedProductCopy = cloneProduct(savedProduct)
  const savedProductIndex = products.findIndex((product) => product.id === savedProduct.id)

  if (savedProductIndex === -1) {
    return [...products, savedProductCopy]
  }

  return products.map((product, index) => (index === savedProductIndex ? savedProductCopy : product))
}
