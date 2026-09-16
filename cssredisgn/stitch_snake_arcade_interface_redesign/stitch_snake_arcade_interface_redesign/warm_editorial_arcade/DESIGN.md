---
name: Warm Editorial Arcade
colors:
  surface: '#f6fbf1'
  surface-dim: '#d7dcd2'
  surface-bright: '#f6fbf1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5eb'
  surface-container: '#ebefe6'
  surface-container-high: '#e5eae0'
  surface-container-highest: '#dfe4da'
  on-surface: '#181d17'
  on-surface-variant: '#424842'
  inverse-surface: '#2d322b'
  inverse-on-surface: '#eef2e8'
  outline: '#727971'
  outline-variant: '#c2c8c0'
  surface-tint: '#43664b'
  primary: '#1a3d25'
  on-primary: '#ffffff'
  primary-container: '#31543a'
  on-primary-container: '#a0c7a6'
  inverse-primary: '#a9d0af'
  secondary: '#a23d2c'
  on-secondary: '#ffffff'
  secondary-container: '#fe826c'
  on-secondary-container: '#731b0e'
  tertiary: '#1c3d23'
  on-tertiary: '#ffffff'
  tertiary-container: '#335439'
  on-tertiary-container: '#a2c7a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4edca'
  primary-fixed-dim: '#a9d0af'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#2b4e35'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a6'
  on-secondary-fixed: '#3f0300'
  on-secondary-fixed-variant: '#822618'
  tertiary-fixed: '#c6ecc8'
  tertiary-fixed-dim: '#aad0ad'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#2d4e33'
  background: '#f6fbf1'
  on-background: '#181d17'
  surface-variant: '#dfe4da'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 3.5rem
    fontWeight: '600'
    lineHeight: 4rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '500'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
  title-md:
    fontFamily: DM Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
  body-lg:
    fontFamily: DM Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: DM Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: DM Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.06em
  tabular-stat:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system reimagines classic arcade and digital tabletop mechanics through the refined lens of tactile editorial craft and physical board game design. Moving decisively away from 80s phosphor glow, hyperactive pixel fonts, and high-saturation neon gaming cliches, it creates an environment that feels deliberate, bookish, and physically grounded. The visual language evokes heavyweight unbleached card stock, pressed game boards, matte linen tokens, and mid-century architectural diagrams.

The brand personality is contemplative, enduring, and meticulously ordered. It addresses users who appreciate craft, deliberate mechanical pace, and typography-first interfaces where interactive surfaces invite tactile focus rather than synthetic sensory overload. The experience should feel like playing a classic game crafted from natural materials on an architectural drafting table under soft north-facing light.

## Colors

The palette operates on earthy, pigment-based mineral values rather than emissive digital lights:

- **Primary (`#31543A`, `#486A4D`, `#365E40`):** Deep botanical greens that provide calm, focused contrast for controlled tokens, key actions, and dominant path states.
- **Secondary (`#C45643`, `#A84434`):** Warm terracotta and baked iron red used purposefully for targets, food nodes, urgent alerts, and destructive confirmations.
- **Surfaces & Grounds:** A multi-layered ivory hierarchy consisting of `#EEE9DE` (canvas base), `#F4F1E8` (board container), and `#F7F3EA` (recessed tiles and elevated cards).
- **Linework & Dividers (`#D6D0C3`, `#BEB7A8`):** Gentle structural borders that feel like debossed cardboard channels or screen-printed matrix boundaries.
- **Ink & Typography (`#20251F`, `#6D7168`):** Charcoal with an earthy olive undertone for primary copy, accompanied by muted mossy graphite for secondary metrics and meta counters.

## Typography

Typography relies on a pairing of structured geometric poise and editorial neutrality:

- **Headlines & Structural Displays (`Space Grotesk`):** Delivers clean geometry reminiscent of technical manuals and board game score sheets. Numbers and counters must strictly enforce `font-feature-settings: "tnum" 1` to ensure tabular stability during dynamic score updates and tick timers.
- **Reading Body (`DM Sans`):** Warm, humanist geometry ensures extended rules, settings copy, and instructional tooltips read with natural fluidity.
- **Labels & Metas:** Presented in uppercase with generous tracking (`0.04em` to `0.06em`) to establish crisp section demarcation without heavy graphic separators.

## Layout & Spacing

Layouts follow a modular, framed composition modeled after gameboards centered within a calm workspace.

- **Gameboard & Matrix Canvas:** The interactive playing matrix maintains a square or 4:3 aspect ratio, framed by a continuous double-edge margin. Internal cell grids use a rigid 2px to 4px gap set against the ivory tray to create physical tile distinction.
- **Side Panels & Hud:** On desktop (breakpoint `1024px` and above), a 12-column grid houses the board within the central 8 columns, flank-framed by 2-column or 4-column sidebars for editorial stats, logs, and tactile controls.
- **Mobile & Narrow Viewports:** Below `768px`, the board spans full width within a single-column layout adhering to `margin: 1rem`. Stats stack neatly in a compact overhead scorecard.

## Elevation & Depth

Visual depth is achieved exclusively through physical paper and wood joinery metaphors rather than synthetic floating drop-shadows:

- **Board Tray Inset:** The main interactive arena sits within an embossed tray. This is created with a double border: an exterior `1.5px solid #BEB7A8` and a subtle inner shadow `inset 0 1px 3px rgba(32, 37, 31, 0.08)`.
- **Game Tokens & Moving Segments:** Pieces appear as cut game tiles. They sit slightly raised above the recessed matrix channels, accented by a hard 1px bottom bevel highlight (`box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 1px 2px rgba(32, 37, 31, 0.12)`).
- **Hud & Overlay Cards:** Surfaces utilize paper-layer stacking (`#F7F3EA` on `#EEE9DE`) with a crisp, low-contrast boundary (`1px solid #D6D0C3`). Shadows are limited to a diffuse, organic contact shadow: `0 2px 8px -2px rgba(32, 37, 31, 0.06)`.
- **Zero Phosphor Principle:** No element may possess glowing drop shadows, high-key inner glows, or luminous radial gradients.

## Shapes

The shape system adopts a soft, precision-die-cut aesthetic:

- **Tokens & Cells:** Matrix cells and individual snake segments feature subtle corner softening (0.25rem / 4px) to replicate tumbling wooden cubes or rounded composite tiles.
- **Main Frames & Trays:** The perimeter board housing uses `rounded-lg` (0.5rem / 8px) to suggest machine-beveled wood or heavy cardstock edges.
- **Interactive Badges:** Tags and tabular stat pills use either crisp square corners with 2px bevels or controlled `0.25rem` micro-radii to maintain an architectural, editorial rhythm.

## Components

### Buttons
- **Primary:** Filled with forest green (`#31543A`), white or pale ivory text (`#F7F3EA`), 0.25rem border radius, and a tactile 1px border (`#24402C`). On `:active`, apply an internal 1px shift downwards with a subtle pressed inner tint.
- **Secondary / Ghost:** Ivory background (`#F7F3EA`), hairline border (`1px solid #BEB7A8`), charcoal text (`#20251F`). Hover subtly warms to `#EEE9DE`.
- **Destructive:** Warm terracotta (`#C45643`) fill with white text, retaining identical button height and tactile click feedback.

### Scoreboards & Telemetry Cells
- Enclosed in card containers styled with `#F7F3EA` fill and `#D6D0C3` stroke.
- Header labels rendered in `Space Grotesk` uppercase, olive graphite color (`#6D7168`), tracked wide.
- Numbers displayed in tabular `Space Grotesk` medium or bold, preventing layout jitter during rapid incrementation.

### Grid Matrix & Playfield
- Outer surround: Pale parchment border (`#BEB7A8`, 2px solid).
- Matrix cells: Uniform rounded squares separated by 3px gaps exposing the underlying board tone (`#D6D0C3`).
- Inactive cells: `#F7F3EA` with a gentle `#E5E0D5` hover touch.
- Target / Food nodes: Solid `#C45643` with a soft 1px inset highlight.
- Snake / Entity body: Interlocking segments of `#31543A` and `#486A4D`, forming continuous physical links.

### Input Fields & Controls
- Form controls mirror recessed physical cutouts: `#F7F3EA` background, inset `1px solid #BEB7A8`.
- Focus state substitutes glowing halos with a sharp `1.5px solid #31543A` outline.

### Modal Overlays & Rules Dialogs
- Backdrop uses a warm, semi-opaque scrim (`rgba(32, 37, 31, 0.45)`) that dims the canvas like a low paper stencil.
- Dialog box is formatted as an editorial game pamphlet: thick margins, clean title line divider (`1px solid #D6D0C3`), and distinct action footers.