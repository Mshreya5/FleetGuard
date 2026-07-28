# FleetGuard – Design System Documentation
## FG-CM-01 | Landing Page

---

## 1. PROJECT OVERVIEW

**Application:** FleetGuard – Fleet Maintenance & Compliance Management System
**Page:** Landing Page (FG-CM-01)
**Tech Stack:** React (CRA), React Router DOM, Lucide React Icons
**Styling Method:** Pure JavaScript inline styles + injected CSS keyframes (no CSS files)
**Design Tokens File:** `src/tokens.js`

---

## 2. COLOR PALETTE

### 2.1 Brand Blues (Primary Palette)

| Token          | Hex Value   | Usage                                      |
|----------------|-------------|--------------------------------------------|
| `primary`      | `#4A90E2`   | CTA buttons, icons, borders, accents       |
| `primaryDark`  | `#2563EB`   | Button hover state, deep blue elements     |
| `primaryLight` | `#60A5FA`   | Accent text, nav hover, highlights         |
| `blueSoft`     | `#93C5FD`   | Subtitle text, soft secondary accents      |
| `blueMid`      | `#1D4ED8`   | Deep button hover, glow layers             |
| `blueDeep`     | `#1E3A5F`   | Background overlay tint on images          |
| `blueGlow`     | `#3B82F6`   | Glow effects, radial blur circles          |

### 2.2 Backgrounds

| Token      | Hex Value   | Usage                                      |
|------------|-------------|--------------------------------------------|
| `bg`       | `#050810`   | Main page background (near black)          |
| `bgAlt`    | `#080D18`   | Alternate section background (footer)      |
| `card`     | `#0D1526`   | Card surface color                         |
| `cardHover`| `#111D35`   | Card surface on hover                      |

### 2.3 Borders

| Token        | Hex Value   | Usage                                      |
|--------------|-------------|--------------------------------------------|
| `border`     | `#1E2D4A`   | Default card and section borders           |
| `borderBlue` | `#2563EB`   | Active, focused, or highlighted borders    |

### 2.4 Typography Colors

| Token           | Hex Value   | Usage                                      |
|-----------------|-------------|--------------------------------------------|
| `textPrimary`   | `#F0F6FF`   | Headings, titles, primary content          |
| `textSecondary` | `#94A3B8`   | Body text, descriptions, labels            |

### 2.5 Status Colors (Dashboard Use Only)

| Token     | Hex Value   | Usage                                      |
|-----------|-------------|--------------------------------------------|
| `success` | `#22C55E`   | Valid compliance status indicators         |
| `warning` | `#F59E0B`   | Expiring compliance status indicators      |
| `danger`  | `#EF4444`   | Expired compliance status indicators       |

> ⚠️ Status colors are reserved for dashboard compliance indicators only.
> They are NOT used on the landing page.

---

## 3. TYPOGRAPHY

### Font Family
- **Primary:** Inter (Google Fonts)
- **Fallback:** Segoe UI, sans-serif
- **Loading:** Injected via JavaScript `document.createElement('link')`

### Font Sizes

| Token  | Value  | Usage                              |
|--------|--------|------------------------------------|
| `xs`   | `11px` | Labels, badges, captions           |
| `sm`   | `13px` | Body text, descriptions, nav links |
| `base` | `15px` | Standard body content              |
| `lg`   | `18px` | Card titles, metric values         |
| `xl`   | `22px` | Section subtitles                  |
| `2xl`  | `28px` | Stat numbers, sub-headings         |
| `3xl`  | `36px` | Section headings (h2)              |
| `4xl`  | `48px` | Large headings                     |
| `5xl`  | `60px` | Hero heading (h1)                  |

Hero h1 uses `clamp(48px, 7vw, 72px)` for fluid responsive scaling.

### Font Weights

| Token       | Value | Usage                              |
|-------------|-------|------------------------------------|
| `regular`   | 400   | Body text, descriptions            |
| `medium`    | 500   | Nav links, secondary labels        |
| `semibold`  | 600   | Card titles, button text           |
| `bold`      | 700   | Section headings, stat numbers     |
| `extrabold` | 800   | Hero h1 heading                    |

---

## 4. SPACING SYSTEM (8px Base Grid)

| Token | Value  | Usage                              |
|-------|--------|------------------------------------|
| `1`   | `4px`  | Micro gaps (icon to text)          |
| `2`   | `8px`  | Small gaps (badge padding)         |
| `3`   | `12px` | Button padding vertical            |
| `4`   | `16px` | Card internal padding (small)      |
| `5`   | `20px` | Card gaps                          |
| `6`   | `24px` | Page horizontal padding            |
| `8`   | `32px` | Button horizontal padding          |
| `10`  | `40px` | Stat column gaps                   |
| `12`  | `48px` | Section header bottom margin       |
| `16`  | `64px` | Grid column gap                    |
| `20`  | `80px` | Section vertical padding           |
| `24`  | `96px` | Large section vertical padding     |

---

## 5. BORDER RADIUS

| Token  | Value    | Usage                              |
|--------|----------|------------------------------------|
| `btn`  | `10px`   | All buttons                        |
| `card` | `12px`   | Standard cards                     |
| `lg`   | `16px`   | Large cards, mockup card           |
| `xl`   | `20px`   | Extra large containers             |
| `full` | `9999px` | Pills, badges, rounded tags        |

---

## 6. SHADOWS

| Token       | Value                                    | Usage                              |
|-------------|------------------------------------------|------------------------------------|
| `card`      | `0 4px 24px rgba(0,0,0,0.5)`            | Default card shadow                |
| `cardHover` | `0 8px 40px rgba(74,144,226,0.25)`      | Card hover shadow (blue tint)      |
| `glowBlue`  | `0 0 20px rgba(74,144,226,0.4)`         | Button and logo glow               |
| `glowSm`    | `0 0 10px rgba(74,144,226,0.3)`         | Small icon and badge glow          |
| `navbar`    | `0 4px 30px rgba(37,99,235,0.1)`        | Scrolled navbar shadow             |

---

## 7. ANIMATIONS

All animations are defined as CSS keyframes injected via JavaScript in `index.js`.

### 7.1 Entrance Animations

| Class          | Keyframe      | Duration | Delay  | Usage                          |
|----------------|---------------|----------|--------|--------------------------------|
| `fg-fade-up`   | `fadeInUp`    | 0.7s     | 0s     | First visible element          |
| `fg-fade-up-1` | `fadeInUp`    | 0.7s     | 0.15s  | Second element (staggered)     |
| `fg-fade-up-2` | `fadeInUp`    | 0.7s     | 0.30s  | Third element (staggered)      |
| `fg-fade-up-3` | `fadeInUp`    | 0.7s     | 0.45s  | Fourth element (staggered)     |
| `fg-fade-left` | `fadeInLeft`  | 0.7s     | 0s     | Left column (About section)    |
| `fg-fade-right`| `fadeInRight` | 0.7s     | 0.2s   | Right column (Hero card, About)|

### 7.2 Continuous Animations

| Class          | Keyframe    | Duration | Usage                          |
|----------------|-------------|----------|--------------------------------|
| `fg-float`     | `float`     | 4s ∞     | Hero mockup card floating      |
| `fg-pulse-glow`| `pulseGlow` | 2.5s ∞   | Navbar login button glow       |
| `fg-shimmer-text`| `shimmer` | 3s ∞     | Hero "Fleet" text shimmer      |

### 7.3 Hover Animations (CSS class-based)

| Class              | Effect                                              |
|--------------------|-----------------------------------------------------|
| `fg-feature-card`  | `translateY(-10px)` + blue shadow + border glow     |
| `fg-card-top-line` | Blue line slides from left to right on card top     |
| `fg-icon-box`      | Background brightens + glow shadow on card hover    |
| `fg-benefit-row`   | Blue left border appears + background tints blue    |
| `fg-metric-tile`   | Border turns blue + background tints + glow         |
| `fg-btn-primary`   | Background darkens + blue glow shadow               |
| `fg-btn-outline`   | Border turns blue + text turns light blue           |
| `fg-nav-link`      | Blue underline slides in from left (::after pseudo) |
| `fg-footer-link`   | Text color transitions to `primaryLight`            |
| `fg-logo`          | Logo icon scales up + glow intensifies              |

---

## 8. BACKGROUND IMAGES

All images are sourced from Unsplash (free, no attribution required for UI use).

| Section  | Image URL (Unsplash)                                                                 | Overlay                                      |
|----------|--------------------------------------------------------------------------------------|----------------------------------------------|
| Hero     | `photo-1601584115197` – Highway logistics trucks                                     | `rgba(0,0,0,0.72)` + `rgba(30,58,95,0.38)`  |
| Features | `photo-1586528116311` – Warehouse/logistics interior                                 | `rgba(0,0,0,0.82)` + `rgba(8,13,24,0.70)`   |
| About    | `photo-1519003722824` – Fleet vehicles on road                                       | `rgba(0,0,0,0.76)` + `rgba(5,8,16,0.60)`    |

**Dimming technique:** Two stacked `position: absolute` divs — first a pure black rgba overlay for brightness control, second a blue-tinted rgba overlay for brand color consistency.

---

## 9. DESIGN SYSTEM PRINCIPLES

### 9.1 Swiss Design Principles Applied

| Principle          | Implementation                                                        |
|--------------------|-----------------------------------------------------------------------|
| Grid-based layout  | CSS Grid with `auto-fit minmax()` for all sections                    |
| Typographic hierarchy | 5 distinct size levels: xs → sm → base → 2xl → 3xl → 5xl          |
| Whitespace         | 8px base spacing system, generous section padding (96px)              |
| Minimal decoration | No gradients on UI elements, no glassmorphism, flat cards             |
| Consistency        | Single `tokens.js` source of truth for all values                     |
| Alignment          | Max-width 1280px container, centered, 24px page padding               |

### 9.2 Component Architecture

```
src/
├── index.js          ← Entry point, global styles injected via JS
├── App.js            ← Router setup
├── tokens.js         ← Design tokens (colors, spacing, fonts, shadows)
├── pages/
│   └── Home.js       ← Page assembly
└── components/
    ├── Navbar.js     ← Sticky, scroll-aware, mobile-responsive
    ├── Hero.js       ← Full-viewport, background image, floating card
    ├── Features.js   ← 4-card grid, background image, hover animations
    ├── About.js      ← Two-column, background image, benefit list
    └── Footer.js     ← Dark footer, quick links, contact info
```

### 9.3 Styling Architecture

- **Zero CSS files** — all styles defined as JavaScript objects
- **Design tokens** — imported from `tokens.js` in every component
- **Global animations** — injected as a `<style>` tag via `document.createElement`
- **Hover effects** — CSS class-based (injected globally) for pseudo-element support
- **Responsive** — media queries injected globally, utility classes `fg-desktop-nav` / `fg-mobile-only`
- **Scroll behavior** — `document.documentElement.style.scrollBehavior = 'smooth'`

### 9.4 Responsive Breakpoints

| Breakpoint | Width     | Behavior                                      |
|------------|-----------|-----------------------------------------------|
| Mobile     | ≤ 768px   | Single column, hamburger menu, stacked layout |
| Desktop    | ≥ 769px   | Two-column grid, horizontal nav, side-by-side |

Grid uses `repeat(auto-fit, minmax(300px, 1fr))` for natural breakpoints without fixed media queries.

---

## 10. RUNNING THE PROJECT

```bash
# Navigate to project
cd fleetguard-cra

# Install dependencies (already done)
npm install

# Start development server
npm start

# Build for production
npm run build
```

Opens at: `http://localhost:3000`
