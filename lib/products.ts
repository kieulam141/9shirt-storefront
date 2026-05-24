import productCatalog from '@/data/products.json' with { type: 'json' }
import { normalizeCatalog } from '@/lib/catalog/validation'

import type { BundleOffer, BundleTypeGroup, Niche, Product, SubNiche } from '@/lib/catalog/types'

export type {
  BundleOffer,
  BundleTypeGroup,
  MaterialCode,
  Niche,
  Product,
  ProductMaterial,
  ProductMedia,
  ProductSpecification,
  ProductType,
  ProductVariant,
  StockStatus,
  SubNiche,
} from '@/lib/catalog/types'

export const products: Product[] = normalizeCatalog(productCatalog)

export const niches: { label: Niche; subNiches: SubNiche[] }[] = [
  { label: 'Sports', subNiches: ['Football'] },
  { label: 'Animal', subNiches: ['Cat', 'Dog', 'Lion', 'Tiger'] },
  { label: 'Art & Music', subNiches: ['Piano', 'Photography'] },
  { label: 'Vintage', subNiches: ['Train'] },
]

export const bundleTypeGroups: BundleTypeGroup[] = [
  {
    type: 'Hawaiian Shirt',
    label: 'Hawaiian Shirt',
    description: 'Core statement print item',
    fromPrice: 19.9,
    bundleHint: 'Mix with shorts + cap for full summer look',
  },
  {
    type: 'Polo Shirt',
    label: 'Polo Shirt',
    description: 'Smart casual option for daily wear',
    fromPrice: 24.9,
    bundleHint: 'Great for office-casual + weekend transition',
  },
  {
    type: 'T-Shirt',
    label: 'T-Shirt',
    description: 'Lightweight everyday essential',
    fromPrice: 16.9,
    bundleHint: 'Add-on item for multi-piece bundle',
  },
  {
    type: 'Baseball Cap',
    label: 'Baseball Cap',
    description: 'Style accent and sun protection',
    fromPrice: 12.9,
    bundleHint: 'Best add-on for outdoor travel sets',
  },
  {
    type: 'Shorts',
    label: 'Shorts',
    description: 'Comfort-first warm-weather bottom',
    fromPrice: 18.9,
    bundleHint: 'Pair with Hawaiian shirt for complete outfit',
  },
]

export const bundleOffers: BundleOffer[] = [
  {
    id: 'summer-core-2',
    title: 'Summer Core Set (2 items)',
    types: ['Hawaiian Shirt', 'Shorts'],
    bundlePrice: 34.9,
    compareAtPrice: 43.8,
  },
  {
    id: 'weekend-style-3',
    title: 'Weekend Style Set (3 items)',
    types: ['Hawaiian Shirt', 'Baseball Cap', 'Shorts'],
    bundlePrice: 46.9,
    compareAtPrice: 56.7,
  },
  {
    id: 'mix-and-match-4',
    title: 'Mix & Match Bundle (4 items)',
    types: ['Hawaiian Shirt', 'Polo Shirt', 'T-Shirt', 'Baseball Cap'],
    bundlePrice: 62.9,
    compareAtPrice: 74.6,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
