# PDP Specification

## Overview
- Target route: `/product/[id]`
- Interaction model: state-driven (media, size, material)
- Design intent: Nike-style buy-box clarity with Hiwaii content depth

## Above-the-fold hierarchy
1. Niche/sub-niche
2. Product title
3. Social proof line
4. Price + compare-at
5. Hook/value line
6. Size selector
7. Material selector
8. Inventory helper line
9. Add to cart primary CTA
10. Buy now secondary CTA
11. Trust microcopy

## Media
- Main display accepts image/video.
- Thumbnail click changes main media.
- If video exists, default media state should start on video.

## Variant logic
- Variant key = size + material.
- Unavailable variants disable selection and CTA.
- Price updates from selected variant.
- Low-stock state shown as helper copy.

## Long-form sections
1. See the print in motion
2. Size chart
3. Product specification grid
4. More from this niche
5. Similar vibe
