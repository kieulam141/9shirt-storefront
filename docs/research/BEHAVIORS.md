# BEHAVIORS

## Global
- Header is sticky at top and persists across all routes.
- Language switch is query-param driven (`?lang=en|vi`) and kept through navigation links.
- Cart counter updates in real-time from client cart context.

## Homepage
- Hero primary CTA points to `/collections`.
- Secondary CTA visually weaker than primary CTA.
- Featured cards are fully clickable.
- Lifestyle cards are fully clickable and route with niche prefilter.

## Collections
- Filter state is local UI state:
  - Niche selection updates product list.
  - Sub-niche selection updates product list.
  - Reset button restores default filter state.
- Sort select updates visible order in-place.
- Trending block updates from filtered list top results.

## PDP
- Media thumbnail click switches hero media instantly.
- If video exists, it is set as default active media after mount.
- Size availability responds to selected material.
- Add-to-cart disabled when current size/material combo is unavailable.
- Price updates from selected variant.

## Accessibility + interaction
- Focusable controls use native button/link semantics.
- Touch targets follow minimum 44px target height for key actions.
- Reduced-motion users receive minimized animation/transition durations.
