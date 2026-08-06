# 9SHIRT STOREFRONT - CONSOLIDATED PROJECT CONTEXT & DOCUMENTATION

## 1. Environment & Repository Configuration
- **Local Directory**: `/Users/crossianllc/LAB/9fashion/9shirt-storefront`
- **GitHub Repository**: `git@github.com:kieulam141/9shirt-storefront.git`
- **SSH Key**: `/Users/crossianllc/.ssh/LAMKIEU`
- **Production Domain**: `https://9shirt.com.vn` (Vercel)
- **Vercel Owner Account**: `kieutunglam-5101`
- **Git User Identity**:
  - `user.name`: `kieulam141`
  - `user.email`: `kieutunglam@gmail.com`

---

## 2. Technology Stack & Frameworks
- **Framework**: Next.js 16.2.4 (App Router with Turbopack)
- **Runtime**: Node.js (>= 22.18.0)
- **Package Manager**: `pnpm` (v10 / v11)
- **Design System**: Dark mode glassmorphism (`#050d22` background, `#b3f038` / `lime-300` accent, custom CSS variables)
- **Testing**: Node.js native test runner (`pnpm test` -> `node --import ./tests/alias-loader.mjs --test tests/*.test.ts`)
- **Data Layer**: Local JSON file storage at `data/products.json` with strict Zod validation (`lib/catalog/validation.ts`)

---

## 3. Architecture & Core Systems

### A. Localization & Domain Detection (`lib/i18n.ts`, `hooks/use-brand.ts`, `hooks/use-lang.ts`)
- `useIsViHost()` auto-detects `9shirt.com.vn` or `9shirt` hostnames and defaults the language to Vietnamese (`vi`).
- Language switcher toggles URL query param `?lang=en` or `?lang=vi`.

### B. Catalog Schema (`lib/catalog/types.ts`)
- `Product`:
  - `id`: string
  - `slug`: string
  - `name`: string
  - `price`: number (e.g. 295 = 295.000đ)
  - `compareAtPrice`: optional number
  - `hook`: string
  - `description`: string
  - `productType`: `'Hawaiian Shirt' | 'Polo Shirt' | 'T-Shirt' | 'Baseball Cap' | 'Shorts'`
  - `niche`: `'Sports' | 'Animal' | 'Art & Music' | 'Vintage'`
  - `subNiche`: `'Football' | 'Cat' | 'Dog' | 'Lion' | 'Tiger' | 'Piano' | 'Photography' | 'Train'`
  - `thumbnail`: string
  - `images`: string[]
  - `media`: ProductMedia[]
  - `sizes`: string[]
  - `materials`: ProductMaterial[]
  - `variants`: ProductVariant[]
  - `specifications`: ProductSpecification[]
  - `matchingShortsId`: optional string
  - `matchingShirtId`: optional string

### C. Pricing Engine (`lib/pricing.ts`)
- Prices >= 100 in VND mode are formatted as `Xk` (e.g., 295 -> `295k`, 380 -> `380k`).

### D. Pages & Components Hierarchy
- `app/page.tsx` & `app/HomeClient.tsx`: Storefront landing page, hero banners, curated collections.
- `app/collections/page.tsx` & `app/collections/CollectionsClient.tsx`: Product catalog with Niche/SubNiche/ProductType filters and sort options.
- `app/product/[id]/page.tsx` & `app/product/[id]/ProductClient.tsx`: Product detail view, size selectors, 2D art & 3D mockup previews.
- `app/cart/page.tsx` & `app/cart/CartClient.tsx`: Cart management, item quantity updates.
- `app/checkout/page.tsx`: Techcombank VietQR payment integration.
- `app/blog/` & `app/blog/[slug]/`: SEO content & blog articles.
- `app/admin/products/`: Secure catalog administration suite.
- `components/Header.tsx` & `components/Footer.tsx`: Global navigation header and footer.

---

## 4. Git Operational Rules & Workflows

### A. Git Commit Identity
Always verify `git config` before making commits to avoid using legacy or unauthorized author emails:
```bash
git config user.name "kieulam141"
git config user.email "kieutunglam@gmail.com"
```

### B. Remote Push & Deploy Commands
```bash
# Push to GitHub
GIT_SSH_COMMAND="ssh -i /Users/crossianllc/.ssh/LAMKIEU -o StrictHostKeyChecking=no" git push origin main

# Deploy to Vercel Production
npx -y vercel deploy --prod --yes
```

### C. Baseline Commit
- Clean working baseline commit: `4311a97` (`feat: add blog system, Techcombank VietQR checkout, legal pages and 9shirt branding`).
