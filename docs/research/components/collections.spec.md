# Collections Specification

## Overview
- Target route: `/collections`
- Interaction model: filter-driven, no page reload
- Design intent: Nike listing architecture with Hiwaii taxonomy

## Structure
1. Intro header (title/subtitle)
2. Left sticky filter rail:
   - all niches
   - niche groups
   - sub-niche children
3. Right content area:
   - sort control
   - reset action
   - trending block
   - product card grid
   - empty state

## Key behaviors
- Filtering applies client-side from typed seed.
- Sorting modes: popular, price asc, price desc.
- Trending block reflects current filtered list.
- Reset button clears both niche and sub-niche selection.
