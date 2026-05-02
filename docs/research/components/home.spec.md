# Home Specification

## Overview
- Target route: `/`
- Interaction model: static + link-driven conversion flow
- Design intent: Nike-like hierarchy with Hiwaii branding

## Structure
1. Sticky header
2. Hero split (content + media)
3. Trust strip (4 cards)
4. Featured product cards
5. Lifestyle category cards
6. Conversion footer

## Style tokens
- Background: `--hiwaii-bg`
- Surface: `--hiwaii-surface`
- Accent: `--hiwaii-accent`
- Text primary/secondary from semantic tokens

## Key behaviors
- CTA primary (`Shop Best Sellers`) routes to collections.
- Secondary CTA (`Browse Collections`) routes to same funnel with weaker visual weight.
- Product cards are full-card clickable.
- Lifestyle cards pre-seed `niche` filter in collections route.
