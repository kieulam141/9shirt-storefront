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
