# Showcase Animations Design

## Goal

Make the app showcase sections (Hero phone + Screenshots gallery) more interactive and visually engaging, with proper centering. All animations GSAP-driven for consistency and mobile performance.

## Hero Phone Showcase

### Auto-cycling screen transitions
- Cycle through all 6 screenshots with a 3-second interval
- Crossfade transition (opacity + subtle scale pulse) between screens, ~0.6s duration
- Tap/click pauses cycling; tap again resumes
- Small dot indicators below the phone show current screen
- `prefers-reduced-motion`: fall back to static first image, no cycling

### 3D tilt on desktop
- Mousemove listener on the phone container applies `rotateX`/`rotateY` (max +/-8deg)
- Perspective container set to ~1000px
- Disabled on mobile (no hover) — float animation stays instead

### Centering fix
- Change `lg:justify-end` to `lg:justify-center` on the phone column
- Rebalance the two-column layout so the phone sits more centrally

## Screenshots Gallery

### Desktop: 3D card fan
- Cards arranged in a slight arc: center card flat and forward, outer cards rotate outward (+/-3-8deg Y) and recede (smaller scale, lower z-index)
- Scroll entrance: cards start stacked/collapsed at center, fan out to positions with staggered timing (0.1s between each)
- Easing: `back.out(1.4)` for springy spread
- Hover: card lifts forward (translateZ + scale 1.05), green accent glow behind it, feature label appears
- Active card click locks the lift state

### Mobile: horizontal scroll carousel
- Keep existing horizontal scroll with snap
- Fix centering (remove complex spacer calculation, use proper flexbox/padding centering)
- Tap on a card lifts it with same glow effect as desktop hover
- Tap another card to switch focus

### Shared
- Feature label appears on active/hovered card
- Green accent glow (#4ade80) on active card
- ScrollTrigger entrance animation triggers at 75% viewport visibility
- `prefers-reduced-motion`: skip fan animation, show cards in final position immediately

## Tech approach
- All GSAP + ScrollTrigger — no Motion mixing on these elements
- Touch events handled natively by GSAP
- Modify existing `Hero.tsx` and `Screenshots.tsx` components
- Update `PhoneMockup.tsx` only if needed for the cycling logic
- Update `lib/content.ts` if screenshot data structure needs changes

## Files to modify
- `components/Hero.tsx` — auto-cycling, tilt, centering
- `components/Screenshots.tsx` — fan layout, hover/tap interactions, centering fix
- `app/globals.css` — any new utility classes for 3D transforms or glow effects
- `lib/content.ts` — if screenshot data needs label additions
