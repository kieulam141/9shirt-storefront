# Product CMS Design

## Scope

Build a repo-backed product CMS for the Hiwaii storefront. The first version manages products only: product copy, pricing, images and media, variants, stock status, specifications, and SEO-relevant product data. Site-wide content, homepage blocks, banners, footer copy, orders, and live database publishing are out of scope for this version.

Publishing is deployment-based. Admin edits update repository data files, then the storefront reflects those changes after the next deploy.

## Current Context

The storefront is a Next.js App Router app. Product data is currently embedded in `lib/products.ts` as a large typed array, and product consumers import `products`, `getProductById`, and related catalog helpers. The homepage, collections page, product detail page, structured data, social image metadata, and pricing tests all depend on that stable interface.

The CMS should preserve those consumer APIs while moving editable catalog content into structured data files.

## Recommended Approach

Use a built-in admin area at `/admin/products` backed by repository JSON files.

This keeps infrastructure small, matches the current static storefront model, and gives non-code product editing without requiring a database or third-party editorial provider. The design should leave a clear storage boundary so a database-backed implementation can replace file storage later without rewriting storefront consumers.

## Data Model

Move editable product records into JSON under a dedicated catalog data directory. Keep TypeScript types, derived defaults, data loading, and helper functions in `lib/products.ts` or nearby catalog modules.

Each product record should include:

- Identity: `id`, `slug`, `name`
- Commerce: `price`, optional `compareAtPrice`, optional `badge`
- Merchandising: `hook`, `description`, `productType`, `niche`, `subNiche`
- Media: `thumbnail`, `images`, optional `videoUrl`, `media`
- Options: `sizes`, `materials`, `variants`
- Details: `specifications`

The existing exported storefront API remains stable:

- `products`
- `getProductById(id)`
- `niches`
- `bundleTypeGroups`
- `bundleOffers`

## Admin UX

The admin route is `/admin/products`.

The primary layout has three zones:

- Product browser: searchable and filterable product list by niche, sub-niche, badge, and stock state.
- Product editor: form controls for required product fields, pricing, product taxonomy, variants, media URLs, and specifications.
- Preview and validation: product image preview, SEO snippet, missing-field warnings, duplicate ID/slug warnings, and a deploy-required publishing note.

Editing should be explicit. The admin should show unsaved changes and require a save action. Save failures should keep form data visible and show a specific error message.

## Persistence

Server-side admin actions write validated JSON back to the repository data files. This CMS is intended for local or trusted deployment environments where file writes are allowed. Production platforms with read-only filesystems can still render the admin, but saving must fail with a clear message explaining that edits need to run in a writable local/admin environment.

File writes must be atomic enough to avoid partially written JSON. The save path should validate the full catalog before replacing the stored file.

## Access Control

Protect `/admin` routes with a simple password gate in this version. The password comes from an environment variable. If the variable is missing, the admin should not allow writes and should show a setup error.

This is not a full user-management system. It is sufficient for a repo-backed internal product editor.

## Validation

Catalog validation should block:

- Duplicate product IDs or slugs
- Missing required text fields
- Invalid price values
- Invalid badge, product type, niche, sub-niche, material code, or stock status values
- Empty thumbnail or image lists
- Media entries without valid type and URL
- Variants that reference sizes or materials not declared on the product
- Products that cannot support existing storefront assumptions, including Latin silk pricing behavior for sports products

Validation should be shared by tests, product loading, and admin save actions.

## Data Flow

Storefront rendering:

1. JSON catalog data is loaded by catalog modules.
2. Validation and normalization produce typed product objects.
3. Existing storefront pages consume the same exported product helpers.

Admin editing:

1. `/admin/products` loads the catalog through the same catalog modules.
2. The editor submits product changes to server actions or route handlers.
3. The server validates the complete catalog.
4. On success, JSON files are written and the admin refreshes the catalog.
5. On failure, the admin shows field-level or catalog-level validation errors.

## Error Handling

The admin should distinguish validation errors, authentication/setup errors, and filesystem write errors. Storefront pages should fail fast during build or test if catalog data is invalid, rather than silently rendering broken products.

Image URLs are not downloaded or uploaded by this first version. The admin validates that required URL strings exist and previews them through the existing image loader behavior.

## Testing

Add focused tests for:

- Loading the JSON catalog into the existing `products` API
- Duplicate ID and duplicate slug rejection
- Required product fields
- Variant references to declared sizes and materials
- Existing pricing expectations, including sports product Latin silk tiers

Run the existing catalog, language, and SEO tests after implementation. Add a build or type-check verification step if the project scripts support it.

## Non-Goals

- Live product publishing without deploys
- Database storage
- Image upload/storage management
- Order management
- Multi-user editorial roles
- Site-wide content editing
- Third-party Git CMS integration
