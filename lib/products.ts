export type Niche = 'Animal' | 'Art & Music' | 'Vintage'
export type SubNiche = 'Cat' | 'Dog' | 'Lion' | 'Tiger' | 'Piano' | 'Photography' | 'Train'
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
  materials: { code: MaterialCode; label: string; uplift: number; benefit: string; badge?: string }[]
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

const SIZE_ORDER = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const
const R2_PUBLIC_BASE = 'https://cdn.9tech.cloud'

function r2(path: string): string {
  return `${R2_PUBLIC_BASE}/${encodeURI(path)}`
}

function generateVariants(basePrice: number, lowStockSizes: string[] = [], soldOutPremium: string[] = []): ProductVariant[] {
  const variants: ProductVariant[] = []
  for (const size of SIZE_ORDER) {
    variants.push({
      size,
      material: 'standard_poly',
      available: true,
      stockStatus: lowStockSizes.includes(size) ? 'low_stock' : 'in_stock',
      price: basePrice,
    })
    const premiumOut = soldOutPremium.includes(size)
    variants.push({
      size,
      material: 'premium_silk',
      available: !premiumOut,
      stockStatus: premiumOut ? 'out_of_stock' : lowStockSizes.includes(size) ? 'low_stock' : 'in_stock',
      price: basePrice + 20,
    })
  }
  return variants
}

export const products: Product[] = [
  {
    id: 'cosmic-catmas',
    slug: 'cosmic-catmas-shirt',
    name: 'Cosmic Catmas Shirt',
    price: 24.9,
    compareAtPrice: 44.9,
    hook: 'Cosmic cat artwork with standout all-over depth.',
    description: 'A bold cat-themed summer statement shirt designed for vacation, weekends, and collectors of wearable art.',
    productType: 'Hawaiian Shirt',
    niche: 'Animal',
    subNiche: 'Cat',
    badge: 'Best seller',
    thumbnail: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/Cosmic Catmas Shirt.png'),
    images: [
      r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/Cosmic Catmas Shirt.png'),
      r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/MS.png'),
      r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/MC.png'),
      r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/KXj3K.jpg'),
    ],
    videoUrl: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/G34.mp4'),
    media: [
      { type: 'video', url: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/G34.mp4'), thumb: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/Cosmic Catmas Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/Cosmic Catmas Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/MS.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/MC.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt/KXj3K.jpg') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Lightweight • bold color impact' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Softer touch • better drape', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(24.9, ['2XL', '3XL'], ['3XL']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Regular relaxed fit' },
      { label: 'Care', value: 'Machine wash cold, hang dry' },
      { label: 'Shipping', value: 'US warehouse, 3-5 business days' },
      { label: 'Print', value: 'All-over sublimation print' },
      { label: 'SKU / Type code', value: 'HW01-CAT-COSMIC' },
    ],
  },
  {
    id: 'shadow-whiskers',
    slug: 'shadow-whiskers-shirt',
    name: 'Shadow Whiskers Shirt',
    price: 22.41,
    compareAtPrice: 24.9,
    hook: 'Vintage pilot-cat collage with rich tonal contrast.',
    description: 'Dark vintage cat collage built for expressive styling and collectible summer looks.',
    productType: 'Hawaiian Shirt',
    niche: 'Animal',
    subNiche: 'Cat',
    badge: 'Trending',
    thumbnail: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/Shadow Whiskers Hiwaii Shirt.jpg'),
    images: [
      r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/Shadow Whiskers Hiwaii Shirt.jpg'),
      r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/MS.png'),
      r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/2M.png'),
      r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/zoom.png'),
      r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/gap.png'),
    ],
    videoUrl: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/0421.mp4'),
    media: [
      { type: 'video', url: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/0421.mp4'), thumb: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/Shadow Whiskers Hiwaii Shirt.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/Shadow Whiskers Hiwaii Shirt.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/MS.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/2M.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/zoom.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt/gap.png') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Quick dry • lightweight wear' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Cleaner drape • elevated finish', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(22.41, ['XL', '2XL'], ['XL']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Relaxed resort fit' },
      { label: 'Care', value: 'Gentle cycle, low heat dry' },
      { label: 'Shipping', value: 'Ships from US in 3-5 days' },
      { label: 'Print', value: 'Fade-resistant all-over print' },
      { label: 'SKU / Type code', value: 'HW02-CAT-SHADOW' },
    ],
  },
  {
    id: 'bulldog-forest',
    slug: 'bulldog-forest-shirt',
    name: 'Bulldog Forest Shirt',
    price: 24.9,
    compareAtPrice: 39.9,
    hook: 'Dense bulldog portrait print with collector energy.',
    description: 'A conversation-starter shirt with layered bulldog artwork and deep black base.',
    productType: 'Hawaiian Shirt',
    niche: 'Animal',
    subNiche: 'Dog',
    badge: 'Best seller',
    thumbnail: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/Bulldog Forest Shirt.png'),
    images: [
      r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/Bulldog Forest Shirt.png'),
      r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/MS.png'),
      r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/Thoan 188.png'),
      r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/gd.jpg'),
      r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/image (2).jpg'),
    ],
    videoUrl: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/0421 (2).mp4'),
    media: [
      { type: 'video', url: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/0421 (2).mp4'), thumb: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/Bulldog Forest Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/Bulldog Forest Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/MS.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/Thoan 188.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/gd.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt/image (2).jpg') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Lightweight • easy care' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Smoother feel • premium drape', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(24.9, ['M', 'L']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Regular fit' },
      { label: 'Care', value: 'Machine wash cold' },
      { label: 'Shipping', value: 'US warehouse fulfillment' },
      { label: 'Print', value: 'HD sublimation print' },
      { label: 'SKU / Type code', value: 'HW01-DOG-BULL' },
    ],
  },
  {
    id: 'roar-jungle',
    slug: 'roar-of-the-jungle',
    name: 'Roar of the Jungle Shirt',
    price: 44.9,
    hook: 'Psychedelic lion palette for bold party fits.',
    description: 'High-saturation lion artwork made for festival, beach night, and statement gifting.',
    productType: 'Hawaiian Shirt',
    niche: 'Animal',
    subNiche: 'Lion',
    badge: 'Premium Edition',
    thumbnail: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/Roar of the Jungle Hiwaii Shirt.png'),
    images: [
      r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/Roar of the Jungle Hiwaii Shirt.png'),
      r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/2M.png'),
      r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/Ho van MS.jpg'),
      r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/ho van.jpg'),
      r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/gap.png'),
    ],
    videoUrl: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/0421 (1).mp4'),
    media: [
      { type: 'video', url: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/0421 (1).mp4'), thumb: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/Roar of the Jungle Hiwaii Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/Roar of the Jungle Hiwaii Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/2M.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/Ho van MS.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/ho van.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt/gap.png') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Strong print expression' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Luxury drape • upscale feel', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(44.9, ['S']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Relaxed fit' },
      { label: 'Care', value: 'Cold wash, no bleach' },
      { label: 'Shipping', value: '3-5 day US delivery' },
      { label: 'Print', value: 'Ultra vivid multi-color print' },
      { label: 'SKU / Type code', value: 'HW02-LION-ROAR' },
    ],
  },
  {
    id: 'neon-jungle',
    slug: 'neon-jungle-shirt',
    name: 'Neon Jungle Shirt',
    price: 44.9,
    hook: 'Tiger-driven neon collage with premium depth.',
    description: 'A standout tiger print designed for bold summer wardrobes and nightlife styling.',
    productType: 'Hawaiian Shirt',
    niche: 'Animal',
    subNiche: 'Tiger',
    badge: 'Premium Edition',
    thumbnail: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/Neon Jungle Shirt Hiwaii Shirt.png'),
    images: [
      r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/Neon Jungle Shirt Hiwaii Shirt.png'),
      r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/Thoan 198.png'),
      r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/image (2).jpg'),
      r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/su tu.jpg'),
      r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/gap.png'),
      r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/zoom.png'),
    ],
    videoUrl: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/t45.mp4'),
    media: [
      { type: 'video', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/t45.mp4'), thumb: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/Neon Jungle Shirt Hiwaii Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/Neon Jungle Shirt Hiwaii Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/Thoan 198.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/image (2).jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/su tu.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/gap.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt/zoom.png') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Lightweight and vibrant' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Smoother finish • premium look', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(44.9, ['M', '3XL']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Regular fit' },
      { label: 'Care', value: 'Machine wash cold' },
      { label: 'Shipping', value: 'US-based fulfillment' },
      { label: 'Print', value: 'Neon contrast full-print' },
      { label: 'SKU / Type code', value: 'HW02-TIGER-NEON' },
    ],
  },
  {
    id: 'hands-harmony',
    slug: 'hands-of-harmony-shirt',
    name: 'Hands of Harmony Shirt',
    price: 24.9,
    compareAtPrice: 44.9,
    hook: 'Piano-motion artwork for art & music lovers.',
    description: 'Expressive piano and floral collage made for artistic, creative summer looks.',
    productType: 'Hawaiian Shirt',
    niche: 'Art & Music',
    subNiche: 'Piano',
    badge: 'Trending',
    thumbnail: r2('3D Hiwaii/Stock/Music & Art/Piano/Hands of Harmony Hiwaii Shirt/Hands of Harmony Hiwaii Shirt.png'),
    images: [
      r2('3D Hiwaii/Stock/Music & Art/Piano/Hands of Harmony Hiwaii Shirt/Hands of Harmony Hiwaii Shirt.png'),
      r2('3D Hiwaii/Stock/Music & Art/Piano/Hands of Harmony Hiwaii Shirt/gap.png'),
    ],
    media: [
      { type: 'image', url: r2('3D Hiwaii/Stock/Music & Art/Piano/Hands of Harmony Hiwaii Shirt/Hands of Harmony Hiwaii Shirt.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Music & Art/Piano/Hands of Harmony Hiwaii Shirt/gap.png') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Breathable and lightweight' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Softer touch for elevated styling', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(24.9, ['L', 'XL']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Regular fit' },
      { label: 'Care', value: 'Delicate wash recommended' },
      { label: 'Shipping', value: 'Ships in 3-5 business days' },
      { label: 'Print', value: 'Art collage sublimation print' },
      { label: 'SKU / Type code', value: 'HW01-MUSIC-HARMONY' },
    ],
  },
  {
    id: 'shutter-vibes',
    slug: 'shutter-vibes-shirt',
    name: 'Shutter Vibes Shirt',
    price: 24.9,
    compareAtPrice: 39.9,
    hook: 'Photography collage print for creator energy.',
    description: 'Camera-and-collage inspired print for makers, creators, and visual storytellers.',
    productType: 'Hawaiian Shirt',
    niche: 'Art & Music',
    subNiche: 'Photography',
    thumbnail: r2('3D Hiwaii/Stock/Music & Art/camera/Shutter Vibes Hiwaii Shirt/Shutter Vibes Hiwaii Shirt.png'),
    images: [r2('3D Hiwaii/Stock/Music & Art/camera/Shutter Vibes Hiwaii Shirt/Shutter Vibes Hiwaii Shirt.png')],
    media: [{ type: 'image', url: r2('3D Hiwaii/Stock/Music & Art/camera/Shutter Vibes Hiwaii Shirt/Shutter Vibes Hiwaii Shirt.png') }],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Quick dry and easy wear' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Premium drape for dressed-up looks', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(24.9, ['2XL']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Regular fit' },
      { label: 'Care', value: 'Cold machine wash' },
      { label: 'Shipping', value: 'US shipping 3-5 days' },
      { label: 'Print', value: 'Camera collage all-over print' },
      { label: 'SKU / Type code', value: 'HW01-ART-SHUTTER' },
    ],
  },
  {
    id: 'timeless-tracks',
    slug: 'timeless-tracks-shirt',
    name: 'Timeless Tracks Shirt',
    price: 24.9,
    compareAtPrice: 39.9,
    hook: 'Classic train nostalgia with vintage ticket texture.',
    description: 'Train-era collage inspired by timeless rail tickets and old-world travel.',
    productType: 'Hawaiian Shirt',
    niche: 'Vintage',
    subNiche: 'Train',
    badge: 'Best seller',
    thumbnail: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Timeless Tracks Hiwaii Shirt.jpg'),
    images: [
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Timeless Tracks Hiwaii Shirt.jpg'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/2M (1).png'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Nghieng.png'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Mat Sau.png'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/gap.png'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/zoom.png'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/zoom2.png'),
      r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/OKY3z.jpg'),
    ],
    videoUrl: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/ayh).mp4'),
    media: [
      { type: 'video', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/ayh).mp4'), thumb: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Timeless Tracks Hiwaii Shirt.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Timeless Tracks Hiwaii Shirt.jpg') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/2M (1).png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Nghieng.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/Mat Sau.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/gap.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/zoom.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/zoom2.png') },
      { type: 'image', url: r2('3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt/OKY3z.jpg') },
    ],
    sizes: [...SIZE_ORDER],
    materials: [
      { code: 'standard_poly', label: 'Standard Poly', uplift: 0, benefit: 'Lightweight comfort' },
      { code: 'premium_silk', label: 'Premium Silk Blend', uplift: 20, benefit: 'Sharper drape for occasions', badge: 'Most loved upgrade' },
    ],
    variants: generateVariants(24.9, ['S', 'M'], ['S']),
    specifications: [
      { label: 'Material', value: 'Polyester / Silk blend option' },
      { label: 'Fit', value: 'Regular fit' },
      { label: 'Care', value: 'Machine wash cold, low tumble' },
      { label: 'Shipping', value: 'Fast US shipping' },
      { label: 'Print', value: 'Vintage train ticket collage' },
      { label: 'SKU / Type code', value: 'HW01-VINTAGE-TRACKS' },
    ],
  },
]

export const niches: { label: Niche; subNiches: SubNiche[] }[] = [
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
