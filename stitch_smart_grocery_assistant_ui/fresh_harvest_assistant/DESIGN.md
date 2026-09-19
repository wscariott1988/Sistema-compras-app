---
name: Fresh Harvest Assistant
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#00685f'
  on-tertiary: '#ffffff'
  tertiary-container: '#008378'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  price-hero:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  price-unit:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an effortless, vibrant, and intelligent grocery planning and shopping experience. Designed primarily for mobile-first utility on fast-paced shopping trips and thoughtful home meal prep, the interface strikes a balance between clean culinary freshness and high-density financial clarity.

### Design Movement
The system pairs **Minimalism** with **Tactile Modern Utility**:
- **Pristine surfaces:** Pure white cards floating over faint neutral slate backdrops keep focus squarely on grocery photography, nutritional metadata, and price breakdowns.
- **Micro-tactile response:** Soft ambient elevation, crisp feedback states, and pill-shaped touch targets give tactile certainty when checking items off aisles on mobile screens.
- **Data delight:** Price badges, savings comparisons, and smart pantry alerts borrow from financial tooling ergonomics—crisp, high-contrast, and glanceable.

## Colors

The palette grounds the interface in agricultural vitality and monetary confidence.

- **Primary (`#059669` - Deep Emerald):** Applied to core interactive triggers, selected navigation items, primary checkout/add actions, and active aisle indicators.
- **Secondary (`#10B981` - Fresh Mint):** Used for savings callouts, "in-stock" status pills, discount tags, and active progress trackers.
- **Tertiary (`#0D9488` - Teal Accent):** Applied to smart nutritional highlights, recipe integrations, and comparison indices.
- **Neutral Palette:**
  - **Canvas Base:** `#F8FAFC` (Slate 50) creates a warm, daylight-bright staging ground without harsh eye strain.
  - **Surface Secondary:** `#F1F5F9` (Slate 100) separates table headers, chip backgrounds, and nested list items.
  - **Text Primary:** `#0F172A` (Slate 900) guarantees instant legibility for unit pricing under fluorescent supermarket lights.
  - **Text Muted:** `#64748B` (Slate 500) supports secondary brand info, weights, and quantity notes.

## Typography

The type system relies on `Inter` across all roles to ensure functional neutrality, crisp numerical rendering, and compact vertical spacing.

- **Tabular Numerics:** Enable `font-feature-settings: "tnum" 1` across all price tags, totals, weights, and comparative metric badges to avoid layout shifts during dynamic basket updates.
- **Price Hierarchy:** Prices use dedicated display styles with tight tracking (`-0.02em`) and bold weights to provide immediate clarity. Fractional currency superscripts sit aligned with upper baseline caps.
- **Responsive Scaling:** Section headers dynamically clamp between `headline-lg-mobile` (26px) on viewports under 640px and `headline-lg` (32px) on larger displays.

## Layout & Spacing

A mobile-first fluid layout that transitions into an ergonomic multi-column dashboard on desktop.

- **Mobile Viewports (< 640px):** Single-column stacked layout with `1rem` outer canvas margin and `0.75rem` vertical inter-card gap to maximize real estate while keeping items within the thumb-reach zone.
- **Tablet / Mid Viewports (640px – 1023px):** 6-column fluid grid, `1rem` gutter, `1.5rem` outer canvas margin. Used for 2-column grocery catalog rows and split cart preview overlays.
- **Desktop (1024px+):** Max width container capped at `1280px` with a 12-column grid (`1.5rem` gutters, `2.5rem` margins). The active list and cart comparison stick to a dedicated 4-column persistent right rail.

## Elevation & Depth

Depth is established through soft, multi-stop ambient shadows tinted with neutral slate tones, preventing harsh muddy edges.

- **Base Layer (Flat):** Pure background canvas (`#F8FAFC`). No elevation.
- **Card Surface Level 1:** Raised content tiles (grocery items, category headers, deal bundles) on `#FFFFFF`.
  - Shadow: `0px 1px 3px rgba(15, 23, 42, 0.04), 0px 6px 16px -4px rgba(15, 23, 42, 0.06)`.
- **Floating Controls Level 2:** Floating bottom checkout summary bars, active cart toggles, and filter chips on `#FFFFFF`.
  - Shadow: `0px 4px 6px -1px rgba(15, 23, 42, 0.05), 0px 12px 24px -4px rgba(5, 150, 105, 0.08)`. Subtle primary-tinted reflection emphasizes active purchase context.
- **Modal & Drawer Level 3:** Store selector and replacement recommendation drawers.
  - Shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.04)`. Accompanied by a 20% blur backdrop scrim.

## Shapes

The design system adopts a distinctly friendly, organic roundedness scale anchored around **16px (`1rem` / `rounded-lg`)** for core card surfaces and containers.

- **Grocery Cards & Modals:** Built with `rounded-lg` (16px) to match modern device viewports and provide a friendly, non-clinical presence.
- **Interactive Controls (Inputs, Buttons):** Standard interactive elements leverage `rounded` (8px) for structural reliability, while floating action pills and quick-increment counter controls use `rounded-full` (9999px).
- **Badges & Pill Tags:** Full circular pill radii (`rounded-full`) are reserved for price comparisons, organic/dietary tags, and discount calculations.

## Components

### Buttons
- **Primary:** Background `#059669`, foreground `#FFFFFF`, height `48px` on mobile for effortless touch targets, `rounded-xl` (12px), text style `label-lg`. Hover/active shifts to `#047857` with gentle scaling (`transform: scale(0.99)`).
- **Secondary / Soft:** Background `#ECFDF5`, text color `#059669`, border `1px solid rgba(16, 185, 129, 0.2)`.
- **Counter Action Controls:** Pill-shaped stepper (`rounded-full`) featuring a slate border (`#E2E8F0`), housing increment/decrement buttons with haptic visual cues on tap.

### Grocery Item Cards
- Surface: `#FFFFFF` with `rounded-lg` (16px) contour and Level 1 elevation.
- Internal padding: `space-md` (14px).
- Layout: Top thumbnail image (aspect-ratio 1:1, soft `#F1F5F9` background), middle product metadata with bold product titles and muted volume tags, bottom row integrating the price tag and immediate `+` or quantity stepper.

### Price Tags & Comparison Badges
- **Hero Price:** Slate 900 (`#0F172A`), `price-hero` font token, alongside `price-unit` in Slate 500 (`#64748B`).
- **Best Deal Badge:** Pill container with background `#ECFDF5`, text color `#047857`, font `label-sm`, tracking uppercase, with a 1px emerald border.
- **Store Comparison Pill:** Surface `#F1F5F9`, featuring small store icon, differential indicator (`-$1.40 vs Average`), text `#0F172A`.

### Lists & Aisle Trackers
- Checkable shopping list row: Horizontal flex layout with swipe-to-remove triggers.
- Tapped/Checked state: Strikethrough text with `#94A3B8`, icon switches to full emerald check, background shifts subtly to `#F8FAFC`.

### Input Fields & Search
- Search Bar: Height `52px`, `rounded-full` with prominent magnifying glass icon, base `#FFFFFF` with ambient shadow, placeholder `#94A3B8`.
- Voice & Barcode Trigger: Integrated persistent icons in the trailing end of the input field.

### Checkboxes & Radios
- Checkboxes: 20px x 20px, `rounded-md` (6px). In checked state, solid `#059669` fill with an interior white checkmark.
- Radio indicators: 20px x 20px, `#059669` inner dot with smooth 150ms spring transitions.