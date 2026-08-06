# Hiwaii Storefront Handoff Context

Last updated: 2026-07-28, Asia/Ho_Chi_Minh.

## Repo

- Active repo path: `/Users/crossianllc/LAB/9fashion/hiwaii-storefront`
- This repo was split out from `/Users/crossianllc/LAB/9fashion/Website-Ecommerce` so Hiwaii can continue separately from 9shirt.
- Current branch: `review/9shirt-storefront-membership-v2`
- Remotes:
  - `origin`: `git@github.com:9tech-cloud/hiwaii-store.git`
  - `hieu`: `git@github.com:hieutv199x/website-hawaii-shirt-design.git`
- Latest pushed source commit before split: `a7596c0 fix: clean hiwaii shopify catalog media`

## Product/Brand Direction

- Store: Hiwaii / `www.hiwaii.store`
- Language target: English for Hiwaii.
- User does not like the live Shopify Horizon UX. Desired direction is to keep the richer 9shirt/3D-product storefront UX and move it into Shopify without sharing the 9shirt codebase.
- Recommended next direction:
  - Short term: keep this Next.js storefront as the source of UX truth.
  - Shopify-native route: convert current Next sections/pages into a custom Shopify Liquid theme under `shopify-theme/`, avoiding Horizon structure.
  - Alternative route: Hydrogen/headless storefront if the team wants full React UX while using Shopify checkout/admin.

## Shopify Store

- Shopify Admin API must use myshopify domain: `kpmtve-x0.myshopify.com`
- Primary customer domain: `https://www.hiwaii.store`
- `hiwaii.store` / `www.hiwaii.store` are custom domains and should not be used for Admin API requests.
- Env source used during setup:
  - `/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9tech/00_Admin-Company/.env`
  - Do not print or commit secrets.
- Current shop base currency returned by Shopify Admin API: `VND`.
- Important: Shopify variant prices do not carry a currency field. With base currency still `VND`, setting product price to `39.99` through Admin API is interpreted/rounded by Shopify as VND, not USD. To show `$39.99` correctly on live Shopify, change store/market currency to USD in Shopify Admin, then rerun the product price maintenance script.

## Shopify Status Already Done

- Domain:
  - User confirmed `www.hiwaii.store` is connected.
  - DNS/TLS was shown as connected in Shopify.
- Shipping rates were set and verified via Admin API:
  - Domestic / `Tiêu chuẩn`: `7.0 USD`
  - Domestic / `Nhanh`: `5.0 USD`
  - International / `International`: `15.0 USD`
- Product catalog:
  - 62 products.
  - 528 variants.
  - All products were active/published previously.
- Media cleanup:
  - Removed 49 bad Shopify product media items, including file-in/layout/no-preview assets.
  - Follow-up dry run returned `Media deleted: 0`, meaning no currently-detected bad media remained by the maintenance rule.
- Product media reset on 2026-07-28 after the new theme was activated:
  - Added `--reset-media` support to `scripts/sync-shopify-catalog.mjs`.
  - Ran `pnpm shopify:sync -- --reset-media`, which deleted old Shopify media per product and re-synced 62/62 products from `data/products.json`.
  - Ran `pnpm shopify:maintenance -- --clean-media` afterward and deleted 26 `NO_PREVIEW`/bad media entries produced by rejected oversized source files.
  - Final cleanup dry run returned `Media deleted: 0`.
  - Final Shopify check: 186 image media items total and no product with zero images.
  - Two oversized source products were repaired via optimized Shopify CDN images:
    - `hands-of-harmony-shirt`: source image was about 22 MB and Shopify import created no preview; optimized staged upload now used in catalog.
    - `neon-jungle-shirt`: large source images were optimized and staged; catalog now uses 3 optimized Shopify CDN images and intentionally excludes `image (2)` because cleanup rules treat `image_2` as bad media.
  - Root cause of “mixed product images” found and fixed:
    - Many source files were generically named `mt.png`, `ms.png`, `quan.png`, etc.
    - `productSet.files` used `duplicateResolutionMode: REPLACE`, so Shopify reused/replaced same-named files across different products.
    - `scripts/sync-shopify-catalog.mjs` now prefixes upload filenames with product slug and image index, e.g. `rabbit-playboys-black-shirt-1-mt.png`.
    - Re-ran `pnpm shopify:sync -- --reset-media`, cleaned bad media, and re-attached optimized staged images for the two oversized products.
    - Final audit: 62 products, 186 image media items, no products with zero images, no duplicated first-image URL groups, all sampled variant prices at `39.99`, cleanup dry run `Media deleted: 0`.
- Shopify product price maintenance:
  - Ran price update to `39.99`, but because store base currency is still VND, Shopify reported sample variant price as `40`.
  - Local catalog has been updated to `39.99` for all products and variants.
- Shopify Markets checked on 2026-07-28:
  - Shop currency: `VND`.
  - Enabled presentment currencies: `VND`.
  - `United States` market is active and includes `US`.
  - Attempted to set United States market currency to `USD` via Admin API. Shopify rejected it with: `The shop's payment gateway does not support enabling more than one currency.`
  - Owner must enable/activate a payment gateway or Shopify Payments/multi-currency support that allows USD presentment before this can be completed.

## Shopify Theme Work Already Done

- Added Shopify theme files under `shopify-theme/`:
  - `layout/theme.liquid`
  - `assets/hiwaii-9shirt.css`
  - `assets/hiwaii-horizon-overrides.css`
  - `sections/hiwaii-home.liquid`
  - `sections/hiwaii-collection.liquid`
  - `sections/hiwaii-product.liquid`
  - `snippets/hiwaii-product-card.liquid`
  - `templates/index.json`
  - `templates/collection.json`
  - `templates/list-collections.json`
  - `templates/product.json`
  - `config/settings_schema.json`
- Renamed the custom theme asset from `assets/hiwaii-9shirt.css` to `assets/hiwaii-storefront.css` and updated theme labels from `Hiwaii 9Shirt UX` to `Hiwaii Storefront UX`.
- Added deploy script:
  - `scripts/deploy-shopify-theme.mjs`
  - npm script: `pnpm shopify:theme -- --publish`
- Added market audit/apply script:
  - `scripts/configure-shopify-market.mjs`
  - npm script: `pnpm shopify:market`
  - Dry run reports shop/market currency state.
  - `pnpm shopify:market -- --apply` attempts to set the United States market currency to `USD`.
- Published theme name observed earlier:
  - `Hiwaii 9Shirt UX 2026-07-28`
  - theme id observed: `gid://shopify/OnlineStoreTheme/162743320815`
- Uploaded but not published on 2026-07-28:
  - `Hiwaii Storefront UX 2026-07-28`
  - theme id: `gid://shopify/OnlineStoreTheme/162744369391`
  - Publish attempt failed with Shopify error: `You can't publish this theme until the installation is complete.`
  - Current MAIN theme after that attempt is still `Hiwaii 9Shirt UX 2026-07-28`.
- Later on 2026-07-28 the owner activated `Hiwaii Storefront UX 2026-07-28` in Shopify Admin.
  - MAIN theme is now `gid://shopify/OnlineStoreTheme/162744369391`.
  - Initially homepage still rendered Horizon sections until current `shopify-theme/` files were uploaded directly into the active MAIN theme.
  - Live verification now shows homepage, collection, and product pages loading `assets/hiwaii-storefront.css` and custom Liquid sections (`site-header`, `hero-title`, `product-shell`, custom product cards).
  - UX polish applied: corrected homepage price copy to `$39.99`, changed “Four style worlds” to “Three style worlds”, cleaned nav labels/links, added collection empty state, reduced card radius, improved small-screen header/button/card CSS, and made product variant changes update price/add-to-cart state.
- Caveat:
  - The published theme still behaved like Horizon in live HTML, so a CSS override was appended into live `assets/base.css` as a stopgap.
  - User explicitly said they do not like Horizon UX. Next agent should not spend more time polishing Horizon. Build a clean custom Shopify Liquid theme or headless storefront instead.

## Scripts

- `pnpm dev`
  - Runs Next storefront locally.
- `pnpm lint`
  - Passes with 3 existing `no-img-element` warnings.
- `pnpm test`
  - 20/20 passing after USD fixed price update.
- `pnpm build`
  - Passing.
- `pnpm shopify:sync`
  - Syncs local catalog into Shopify with filtered media.
  - Script now maps custom Hiwaii domain to `kpmtve-x0.myshopify.com` for Admin API.
  - Script now supports `SHOPIFY_FIXED_PRICE` env.
  - Script filters media filenames that look like file-in/layout/helper assets.
  - Script now supports `--reset-media` to delete existing Shopify media for each product before syncing files from the local catalog.
- `pnpm shopify:maintenance -- --dry-run --clean-media`
  - Checks Shopify media and reports what would be deleted.
- `pnpm shopify:maintenance -- --clean-media`
  - Deletes bad Shopify product media.
- `pnpm shopify:maintenance -- --set-price=39.99`
  - Sets all Shopify variants to `39.99` in the store base currency.
  - Only run for USD display after Shopify Admin currency/market is fixed.

## Current Source Price State

- `data/products.json` has all product and variant prices set to `39.99`.
- Frontend copy was changed from `295k/450k` to `$39.99` in:
  - `lib/i18n.ts`
  - `app/collections/CollectionsClient.tsx`
  - `app/product/[id]/ProductClient.tsx`
  - `lib/products.ts`
- Tests updated in `tests/products-pricing.test.ts`.

## Media/File-In Rules

- User explicitly said only sync product image assets from the product design image folder, not the folder containing print files.
- Do not sync/copy/upload from any `File đầy đủ` folder because it contains print production files.
- Prior allowed source folder was:
  - `/Users/crossianllc/kieutunglam@gmail.com - Google Drive/Drive của tôi/9commerce/9Fashion/Products_3D/Designs/POD_3D_VN/File Design ảnh sản phẩm`
- Do not migrate/copy data between different Google Drive accounts.
- Global safety rule:
  - Never copy/sync/move/migrate data between:
    - `/Users/crossianllc/kieutunglam@gmail.com - Google Drive`
    - `/Users/crossianllc/lam.tungkieu@crossian.com - Google Drive`

## Payment Status

- PayPal credentials exist in the admin env file but key names were typo-like (`PayPay...` observed earlier).
- Live PayPal OAuth validation worked against PayPal live endpoint.
- Shopify `paymentWallets` was empty earlier.
- PayPal activation likely still needs the owner to activate it inside Shopify Admin. Do not assume API-only setup is complete.

## Known Caveats / Next Tasks

0. Collection nav/filter status from 2026-07-28.
   - Source fixed in `shopify-theme/layout/theme.liquid`, `sections/hiwaii-home.liquid`, and `sections/hiwaii-collection.liquid`.
   - Header/category links now target Shopify native tag routes:
     - `/collections/all/hawaiian-shirt`
     - `/collections/all/sports`
     - `/collections/all/rabbit-playboy`
     - `/collections/all/vintage`
   - Legacy query links like `/collections/all?style=sports` are redirected client-side in the updated collection section.
   - Shopify Admin API confirms both the MAIN theme `162744369391` and the newly uploaded unpublished theme `162745286895` contain the corrected assets.
   - Storefront HTML was still rendering an older compiled snapshot after API upload and republish attempt. A harmless marker `data-hiwaii-theme-revision="filter-routes-20260728"` was added to `layout/theme.liquid`; if it is absent from live HTML, Shopify has not rebuilt to the uploaded asset.
   - API publish of the newly duplicated theme `162745286895` was blocked with `You can't publish this theme until the installation is complete.` If live still shows old nav, activate/save the uploaded theme from Shopify Admin UI or open Edit theme and save to force Shopify to compile the latest assets.
0.1. Product media whitelist status from 2026-07-28.
   - User requested Shopify product media to use only MT/MS mockup files and exclude print/source files.
   - `scripts/sync-shopify-catalog.mjs`, `scripts/maintenance-shopify-products.mjs`, and `scripts/audit-shopify-product-media.mjs` now enforce an MT/MS filename whitelist.
   - Re-synced all 62 Shopify products with `--reset-media`.
   - Final Shopify media audit: `Products with issues: 0. Media to delete: 0. Missing expected images: 0.`
   - Shopify product/variant text was normalized to English; Admin API check found no Vietnamese product/variant handles.
   - 11 products were set to `DRAFT` because no valid MT/MS mockups are currently available:
     - `timeless-tracks-shirt`
     - `cr72-champions-gold-shirt`
     - `ars2-red-champions-shirt`
     - `hands-of-harmony-shirt`
     - `cr74-shirt`
     - `ars1-rice-burgundy-shirt`
     - `ars3-cream-heritage-shirt`
     - `ars4-floral-crest-shirt`
     - `roar-of-the-jungle`
     - `neon-jungle-shirt`
     - `shutter-vibes-shirt`
0.2. Football product removal from 2026-07-28.
   - User requested removing all football-related products.
   - Removed all local catalog products with `niche === "Sports"` or `subNiche === "Football"`.
   - Deleted 37/37 matching Shopify products through Admin API.
   - Current Shopify product count after deletion: 25 total, 20 active, 5 draft.
   - Shopify Admin API query for `tag:Sports OR tag:Football` returns no products.
   - Product URLs such as `/products/agentina-shirt` now return HTTP 404.
   - The deleted product list is saved at `docs/removed-football-products-2026-07-28.json`.
   - Note: storefront collection HTML may temporarily show cached deleted products until Shopify refreshes its compiled/cache layer; Admin API and direct product routes confirm deletion.
1. Split Hiwaii fully away from 9shirt naming.
   - Some class names and theme names still contain `9shirt` because this was cloned from the 9shirt storefront.
   - Clean labels gradually, but do not break UX.
2. Replace Horizon UX.
   - Best path: convert current Next UI into a real custom Shopify Liquid theme, not just CSS overrides on Horizon.
   - Use `shopify-theme/` as the working folder.
   - Latest custom theme upload is present but unpublished because Shopify blocked API publishing until installation is complete. Owner should finish Shopify Online Store/theme installation in Admin, then publish `Hiwaii Storefront UX 2026-07-28` or rerun `pnpm shopify:theme -- --publish`.
3. Fix live USD pricing.
   - First unblock Shopify payment/multi-currency support. Current API error: `The shop's payment gateway does not support enabling more than one currency.`
   - Then run `pnpm shopify:market -- --apply` to set the United States market currency to USD.
   - Then run `NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm shopify:maintenance -- --set-price=39.99`.
   - Verify with Admin API and storefront.
4. Recheck live product media.
   - Run `NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm shopify:maintenance -- --dry-run --clean-media`.
   - Expected output after current cleanup: `Media deleted: 0`.
5. Decide deployment route.
   - Shopify Liquid native theme: best for Shopify admin/checkout with custom UX.
   - Hydrogen/headless: best for React/Next-like UX, but requires separate hosting and checkout integration.

## Verification From Last Session

- `pnpm lint`: pass, 3 warnings.
- `pnpm test`: pass, 20/20.
- `pnpm build`: pass.
- Shopify maintenance after cleanup:
  - `Shopify maintenance: 62 products -> kpmtve-x0.myshopify.com [dry-run]`
  - `Done. Media deleted: 0. Variants updated: 0.`
