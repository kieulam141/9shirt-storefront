# Hiwaii R2 Media Audit

Updated: 2026-07-28T04:25:19.356Z

## Summary
- R2 product objects listed: 648
- R2 suspicious objects still present in bucket by filename rule: 118
- Catalog media references scanned after cleanup: 488
- Catalog suspicious references used by web after cleanup: 0
- Products with suspicious catalog references after cleanup: 0

## Result
- Web catalog references are clean now: no URL matching the file-in/helper filename rule remains in `data/products.json`.
- R2 bucket itself still contains suspicious legacy/helper objects. They are not referenced by the current catalog, but can be deleted in a separate destructive cleanup step after owner approval.

## Suspicious R2 Objects Still Present
- products/01-soccer-football-club-manchester-city-man-city/lg.png
- products/01-soccer-football-club-psg-psg3/logo-lung.png
- products/01-soccer-football-club-psg-psg3/nen-mt.png
- products/01-soccer-football-club-psg-psg3/typo.png
- products/01-soccer-national-team-argentina-agentina-xanh-den/logo-2.png
- products/01-soccer-national-team-argentina-agentina-xanh-den/logo.png
- products/01-soccer-national-team-argentina-agentina-xanh-den/nen-quan.png
- products/01-soccer-national-team-argentina-agentina/cup.png
- products/01-soccer-national-team-argentina-agentina/logo-quan-2.png
- products/01-soccer-national-team-argentina-agentina/logo-quan.png
- products/01-soccer-national-team-argentina-agentina/update-nen-bo-cup.png
- products/01-soccer-national-team-argentina-agentina/update-nen.png
- products/01-soccer-national-team-brazil-brazin-xanh-den/logo.png
- products/01-soccer-national-team-brazil-brazin/cup.png
- products/01-soccer-national-team-brazil-brazin/logo-nguc.png
- products/01-soccer-national-team-brazil-brazin/logo.png
- products/01-soccer-national-team-brazil-brazin/nen-000000.png
- products/01-soccer-national-team-croatia-croatia/logo-sau-lung.png
- products/01-soccer-national-team-croatia-croatia/logo.png
- products/01-soccer-national-team-england-anh-so-2/lg.png
- products/01-soccer-national-team-england-anh-so-2/logo-chua-tach-nen-trang.png
- products/01-soccer-national-team-england-anh/lg.png
- products/01-soccer-national-team-england-anh/logo-ao.png
- products/01-soccer-national-team-england-anh/logo-chua-tach-nen-trang.png
- products/01-soccer-national-team-england-anh/nen-to.png
- products/01-soccer-national-team-france-phap/lg.png
- products/01-soccer-national-team-france-phap/logo-quan.png
- products/01-soccer-national-team-france-phap/nen-mo-rong.png
- products/01-soccer-national-team-germany-duc/logo-quan.png
- products/01-soccer-national-team-germany-duc/ten-quan.png
- products/01-soccer-national-team-netherlands-ha-lan/logo-nguc.png
- products/01-soccer-national-team-portugal-bdn-trang/logo-q.png
- products/01-soccer-national-team-portugal-bdn-trang/logo.png
- products/01-soccer-national-team-portugal-bdn-trang/nen-ao.png
- products/01-soccer-national-team-portugal-bdn/file-in-quan.jpg
- products/01-soccer-national-team-portugal-bdn/logo-quan.png
- products/01-soccer-national-team-portugal-bdn/tach-logo-roi.jpg
- products/01-soccer-national-team-portugal-bdn/tag-ao.png
- products/01-soccer-national-team-portugal-bdn/text-quan.png
- products/01-soccer-national-team-south-korea-hanquoc/logo-nguc-sau.png
- products/01-soccer-national-team-spain-tbn/copy-of-co-ao.png
- products/01-soccer-national-team-spain-tbn/copy-of-logo-ao-mat-truoc.png
- products/01-soccer-national-team-spain-tbn/copy-of-ms-in.png
- products/01-soccer-national-team-spain-tbn/copy-of-ms.png
- products/01-soccer-national-team-spain-tbn/copy-of-mt.png
- products/01-soccer-national-team-spain-tbn/copy-of-nen.png
- products/01-soccer-national-team-spain-tbn/copy-of-quan-tbn-in.png
- products/01-soccer-national-team-spain-tbn/copy-of-quan-tbn.png
- products/01-soccer-national-team-spain-tbn/copy-of-tay.png
- products/01-soccer-national-team-spain-tbn/copy-of-tbn.png
- products/01-soccer-national-team-spain-tbn/copy-of-text-msau.png
- products/01-soccer-national-team-spain-tbn/logo-ao-mat-truoc.png
- products/01-soccer-national-team-spain-tbn/nen.png
- products/01-soccer-national-team-spain-tbn/text-msau.png
- products/01-soccer-player-legend-cr7-cr73/file-in.png
- products/01-soccer-player-legend-cr7-manchester-united-mucr7/file-in.png
- products/01-soccer-player-legend-manchester-united-player-mucunha/file-in.png
- products/01-soccer-player-legend-manchester-united-player-mucunha/hoa.png
- products/01-soccer-player-legend-manchester-united-player-mucunha/logo.png
- products/03-lifestyle-statement-novelty-texas-beer-texas-beer/hoa-tiet-co-ao.png
- products/agentina-xanh-den/logo-2.png
- products/agentina-xanh-den/logo.png
- products/agentina-xanh-den/nen-quan.png
- products/agentina/cup.png
- products/agentina/logo-quan-2.png
- products/agentina/logo-quan.png
- products/agentina/update-nen-bo-cup.png
- products/agentina/update-nen.png
- products/anh-so-2/lg.png
- products/anh-so-2/logo-chua-tach-nen-trang.png
- products/anh/lg.png
- products/anh/logo-ao.png
- products/anh/logo-chua-tach-nen-trang.png
- products/anh/nen-to.png
- products/bdn-do/logo.png
- products/bdn-trang/logo-q.png
- products/bdn-trang/logo.png
- products/bdn-trang/nen-ao.png
- products/bdn/file-in-quan.jpg
- products/bdn/logo-quan.png
- products/bdn/tach-logo-roi.jpg
- products/bdn/tag-ao.png
- products/bdn/text-quan.png
- products/brazin-xanh-den/logo.png
- products/brazin/cup.png
- products/brazin/logo-nguc.png
- products/brazin/logo.png
- products/brazin/nen-000000.png
- products/croatia/logo-sau-lung.png
- products/croatia/logo.png
- products/duc-trang/file-in-quan.png
- products/duc/logo-quan.png
- products/duc/ten-quan.png
- products/ha-lan/logo-nguc.png
- products/hanquoc/logo-nguc-sau.png
- products/man-city/lg.png
- products/mucunha/hoa.png
- products/mucunha/logo.png
- products/phap/lg.png
- products/phap/logo-quan.png
- products/phap/nen-mo-rong.png
- products/psg3/logo-lung.png
- products/psg3/nen-mt.png
- products/psg3/typo.png
- products/tbn/copy-of-co-ao.png
- products/tbn/copy-of-logo-ao-mat-truoc.png
- products/tbn/copy-of-ms.png
- products/tbn/copy-of-mt.png
- products/tbn/copy-of-nen.png
- products/tbn/copy-of-quan-tbn.png
- products/tbn/copy-of-tay.png
- products/tbn/copy-of-tbn.png
- products/tbn/copy-of-text-msau.png
- products/tbn/logo-ao-mat-truoc.png
- products/tbn/nen.png
- products/tbn/text-msau.png
- products/tem-tau/than-truoc-than-sau-giong-nhau.png
- products/texas-beer/hoa-tiet-co-ao.png

## Product Folder Naming Check

- Products using expected `products/<product-id>/...` folders: 48/62
- Products still using legacy/non-product-id folders: 14/62

### cr71-legacy-gold-shirt
- Expected: `products/cr71-legacy-gold`
- Found: `3D Hiwaii/New Products/CR71`

### cosmic-catmas-shirt
- Expected: `products/cosmic-catmas`
- Found: `3D Hiwaii/Stock/Animal/Cat/Cosmic Catmas Shirt`

### bulldog-forest-shirt
- Expected: `products/bulldog-forest`
- Found: `3D Hiwaii/Stock/Animal/Dog/Bulldog Forest Shirt`

### timeless-tracks-shirt
- Expected: `products/timeless-tracks`
- Found: `3D Hiwaii/Stock/Vintage/Timeless Tracks Hiwaii Shirt`

### cr72-champions-gold-shirt
- Expected: `products/cr72-champions-gold`
- Found: `3D Hiwaii/New Products/CR72`

### ars2-red-champions-shirt
- Expected: `products/ars2-red-champions`
- Found: `3D Hiwaii/New Products/ARS2`

### shadow-whiskers-shirt
- Expected: `products/shadow-whiskers`
- Found: `3D Hiwaii/Stock/Animal/Cat/Shadow Whiskers Hiwaii Shirt`

### hands-of-harmony-shirt
- Expected: `products/hands-harmony`
- Found: `3D Hiwaii/Stock/Music & Art/Piano/Hands of Harmony Hiwaii Shirt`

### ars1-rice-burgundy-shirt
- Expected: `products/ars1-rice-burgundy`
- Found: `3D Hiwaii/New Products/ARS1`

### ars3-cream-heritage-shirt
- Expected: `products/ars3-cream-heritage`
- Found: `3D Hiwaii/New Products/ARS3`

### ars4-floral-crest-shirt
- Expected: `products/ars4-floral-crest`
- Found: `3D Hiwaii/New Products/ARS4`

### roar-of-the-jungle
- Expected: `products/roar-jungle`
- Found: `3D Hiwaii/Stock/Animal/Tiger/Roar of the Jungle Hiwaii Shirt`

### neon-jungle-shirt
- Expected: `products/neon-jungle`
- Found: `3D Hiwaii/Stock/Animal/Lion/Neon Jungle Shirt Hiwaii Shirt`

### shutter-vibes-shirt
- Expected: `products/shutter-vibes`
- Found: `3D Hiwaii/Stock/Music & Art/camera/Shutter Vibes Hiwaii Shirt`

