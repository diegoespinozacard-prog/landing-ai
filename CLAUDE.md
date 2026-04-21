# MultIA Landing Page — Project Guide

## Stack
- **Node.js + Express** server (`server.js`) with **EJS** templating
- Static assets in `public/` served at root
- Entry point: `views/index.ejs` → includes all partials

## Start server
```bash
node server.js   # http://localhost:3000
```

## File map

### Data (server.js)
All page data lives as arrays in `server.js` and is passed to the view:
- `models` — LLM model cards (nav dropdown)
- `features` — 12 feature cards
- `userProfiles` — 4 audience profiles
- `benefits` — 5 stat cards with `stat`, `count`, `countFrom`, `title`, `desc`, `impact`
- `storySteps` — 5 scroll-story steps
- `pricingPlans` — 3 pricing tiers

### Views / Partials
| File | Section |
|------|---------|
| `partials/nav.ejs` | Top navigation |
| `partials/hero.ejs` | Full-screen video hero + `#hero-text` section below |
| `partials/sell-strip.ejs` | Marquee strip |
| `partials/features.ejs` | 12 feature cards grid |
| `partials/scroll-story.ejs` | Sticky scroll story (5 steps) |
| `partials/benefits.ejs` | 5 stat cards (Impacto Real) |
| `partials/world-real.ejs` | 4 diagram cards (MultIA en el mundo real) |
| `partials/profiles.ejs` | 4 audience profile cards |
| `partials/pricing.ejs` | 3 pricing plan cards |
| `partials/footer.ejs` | Footer |
| `partials/modal.ejs` | Pricing modal |
| `partials/enterprise-modal.ejs` | Enterprise contact modal |

### CSS files
| File | Covers |
|------|--------|
| `variables.css` | CSS vars, reset, typography, buttons, chips, scroll-reveal classes, keyframes, light mode |
| `nav.css` | Navigation styles |
| `hero.css` | Hero video section + `#hero-text` section |
| `sections.css` | features, benefits, profiles, sell-strip |
| `story.css` | Scroll-story section |
| `pricing.css` | Pricing cards |
| `world-real.css` | World-real 4 diagram cards |
| `modal.css` | Modal overlay |
| `footer.css` | Footer |
| `responsive.css` | Breakpoints |

### JS files
| File | Purpose |
|------|---------|
| `utils.js` | All scroll animations (IntersectionObserver, counters, word-reveal, parallax, stagger) |
| `nav.js` | Nav dropdown + mobile menu |
| `story.js` | Scroll-story sticky logic |
| `modal.js` | Pricing modal open/close |
| `gsap-init.js` | **NOT loaded** — kept but excluded from index.ejs |

## Animation system (utils.js)

### Scroll reveal classes (CSS in variables.css)
- `.rv` — fade up from below
- `.rv-l` — slide from left
- `.rv-r` — slide from right
- `.rv-u` — slide from above
- Add to any element; JS toggles `.on` on enter, removes on exit → **fully reversible**
- Delay classes: `.d1` `.d2` `.d3` `.d4`

### Stagger grid
Wrap children in `.stagger-grid`; children with `.rv/.rv-l/.rv-r` stagger in 70ms apart.

### Word-by-word reveal
Add `data-word-reveal="ltr|rtl|up|down"` to any element. JS wraps each word in `.word-span`.

### Animated counters (reversible)
Add `data-count="<value>"` and optionally `data-count-from="<start>"` to a `<span>`.
- Supports prefix/suffix: `x10`, `+60%`, `<30s`
- Replays every time element enters viewport; resets to `data-count-from` on exit
- Parse format: `^([^0-9]*)([0-9]+)([^0-9]*)$`

### Section entrance
Add `.sec-enter` to a `<section>`; JS toggles `.sec-visible`.

## Hero section (hero.ejs)
Two elements:
1. `#hero-video` — full-screen looping video (`/img/video multia.mp4`), no text overlay
2. `#hero-text` — separate section below with title/subtitle/CTA using `.rv` animations

## World-real diagrams (world-real.ejs + world-real.css)

### Card 2 — Fragmentación vs Solución
- **Left (chaos)**: `.wr-orbit-node` boxes at angles `0,60,120,180,240,300deg` via `--oa` CSS var
  - Uses CSS `sin()`/`cos()`: `top: calc(50% + 80px * sin(var(--oa)))`
  - SVG dashed red lines from center to node edges
- **Right (hub)**: same `.wr-hub-node` box style (amber tint) at `0,72,144,216,288deg`
  - SVG solid amber lines from MultIA circle edge to box face
  - Line coords calculated: start = center ± 24px (circle radius), end = box center ∓ (18/max(|cos|,|sin|))px

## Key CSS variables (variables.css :root)
```
--bg:#0B0B0B  --bg2:#141414  --bg3:#1C1C1C
--ink:#F0EEE8  --ink2:#C8C4BB  --ink3:#78746E  --ink4:#464340
--amber:#F5A623  --amber-d:#D4890E
--amber-light:rgba(245,166,35,0.10)  --amber-mid:rgba(245,166,35,0.20)
--border:rgba(255,255,255,0.07)  --border2:rgba(255,255,255,0.13)
--f-display:'Sora'  --f-body:'DM Sans'
--r:10px  --r2:16px  --r3:24px  --r-full:9999px  --nav-h:66px
```

## Light mode
Toggle class `html.light-mode`. All overrides in `variables.css` bottom section.

## Modal system
- `openModal(planId)` / `closeModal()` in `modal.js`
- `openEnterpriseModal()` / `closeEnterpriseModal()` inline in `index.ejs`

## Lucide icons
Loaded via CDN. Call `lucide.createIcons()` after DOM ready (done in `index.ejs`).
Use: `<i data-lucide="icon-name"></i>`
