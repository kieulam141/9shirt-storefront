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
  { label: 'Animal', subNiches: ['Rabbit Playboy', 'Cat', 'Dog', 'Lion', 'Tiger', 'Animal Graphic'] },
  { label: 'Art & Music', subNiches: ['Piano', 'Photography'] },
  { label: 'Vintage', subNiches: ['Train'] },
  { label: 'Lifestyle', subNiches: ['Statement / Novelty'] },
  { label: 'Fantasy', subNiches: ['Mythology Romance'] },
]

export const bundleTypeGroups: BundleTypeGroup[] = [
  {
    type: 'Hawaiian Shirt',
    label: 'Hawaiian Shirt',
    description: 'Core statement print item',
    fromPrice: 495,
    bundleHint: 'Form áo chủ lực của 9shirt',
  },
  {
    type: 'Polo Shirt',
    label: 'Polo Shirt',
    description: 'Smart casual option for daily wear',
    fromPrice: 495,
    bundleHint: 'Great for office-casual + weekend transition',
  },
  {
    type: 'T-Shirt',
    label: 'T-Shirt',
    description: 'Lightweight everyday essential',
    fromPrice: 495,
    bundleHint: 'Add-on item for multi-piece bundle',
  },
  {
    type: 'Baseball Cap',
    label: 'Baseball Cap',
    description: 'Style accent and sun protection',
    fromPrice: 295,
    bundleHint: 'Best add-on for outdoor travel sets',
  },
  {
    type: 'Shorts',
    label: 'Shorts',
    description: 'Comfort-first warm-weather bottom',
    fromPrice: 295,
    bundleHint: 'Phối cùng áo Hawaii cho outfit hè',
  },
]

export const bundleOffers: BundleOffer[] = [
  {
    id: 'summer-core-2',
    title: 'Summer Core Set (2 items)',
    types: ['Hawaiian Shirt', 'Shorts'],
    bundlePrice: 790,
    compareAtPrice: 890,
  },
  {
    id: 'weekend-style-3',
    title: 'Weekend Style Set (3 items)',
    types: ['Hawaiian Shirt', 'Baseball Cap', 'Shorts'],
    bundlePrice: 990,
    compareAtPrice: 1085,
  },
  {
    id: 'mix-and-match-4',
    title: 'Mix & Match Bundle (4 items)',
    types: ['Hawaiian Shirt', 'Polo Shirt', 'T-Shirt', 'Baseball Cap'],
    bundlePrice: 1490,
    compareAtPrice: 1780,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
