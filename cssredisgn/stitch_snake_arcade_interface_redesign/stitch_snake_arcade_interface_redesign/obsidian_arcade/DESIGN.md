---
name: Obsidian Arcade
colors:
  surface: '#101418'
  surface-dim: '#101418'
  surface-bright: '#36393f'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#191c21'
  surface-container: '#1d2025'
  surface-container-high: '#272a2f'
  surface-container-highest: '#32353a'
  on-surface: '#e1e2e9'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e1e2e9'
  inverse-on-surface: '#2e3036'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#68dba9'
  on-secondary: '#003825'
  secondary-container: '#25a475'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#101418'
  on-background: '#e1e2e9'
  surface-variant: '#32353a'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.04em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  title-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  hud-counter-lg:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.05em
  hud-counter-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.04em
  hud-counter-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.03em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-mono-xs:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  gutter-desktop: 1.25rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
This design system crafts an austere, competitive arcade atmosphere engineered for high-precision play. It blends the tactile industrial presence of high-end retro-futuristic arcade cabinetry with the razor-sharp functional clarity of a modern esports HUD.

- **Tone & Demeanor:** Surgical, intentional, disciplined, focused. It avoids decorative noise, gratuitous neon bloom, generic corporate gradients, and consumer-software tropes in favor of low-profile hardware utility.
- **Visual Aesthetic:** Technical Brutalism tempered by industrial precision. Rich obsidian backgrounds anchor dense graphite modular panels bound by micro-hairline framing and high-contrast phosphorus emerald cues.
- **User Reaction:** Operators and players should feel hyper-attuned to state changes, experiencing zero distraction during sub-frame twitch reactions while enjoying absolute tactile feedback during tactical navigation.

## Colors
The palette relies on deep value separation to enforce strict hierarchy under low-ambient conditions.

- **Obsidian Canvas (`#090A0C`):** Base root layer for non-interactive void space and primary playfield matrix.
- **Graphite Surfaces:**
  - Surface Low: `#12151A` (HUD pods, inactive modules, drawer backings)
  - Surface High: `#181C23` (Interactive cards, elevated readouts, control blocks)
  - Surface Active: `#1F242D` (Pressed states, active module headers)
- **Structural Lines:** Micro-borders use `#232934` for hairline definition; active frames jump to `#364152`.
- **Emerald Accent Matrix:**
  - Primary Laser: `#10B981` (High-priority indicators, living snake core, active counters, primary focus borders)
  - Deep Phosphor: `#059669` (Static interactive nodes, toggle track fills, baseline achievements)
  - Emerald Muted: `rgba(16, 185, 129, 0.12)` (Selection states, subtle HUD fills)
- **Diagnostic Tertiaries:**
  - Warning/Bonus Amber: `#F59E0B` (Special power pellets, critical speed thresholds, warning telemetry)
  - Fault Crimson: `#EF4444` (Collision alert, self-destruct, penalty indicators)
- **Text & Signal Tiers:**
  - Crisp Readout: `#F8FAFC` (Values, titles, scores)
  - Monitored Secondary: `#94A3B8` (Labels, metadata, specs)
  - Inactive Signal: `#475569` (Zero states, disabled toggles)

## Typography
Typography creates a deliberate contrast between structured machine telemetry and clean user interface copy.

- **Headline System (`Space Grotesk`):** Industrial, geometric, slightly flattened shapes that evoke telemetry terminals without looking novelty retro. Reserved for modal dialog headers, game stage alerts, and main interface sections.
- **Interface Body (`Geist`):** Hyper-focused, clean neutral geometric sans. Provides high legibility at micro sizes in setup dialogs, settings sidebars, and control mapping charts.
- **Telemetry & HUD (`JetBrains Mono`):** Strictly monospaced with enabled tabular lining figures (`tnum`). Applied across all real-time counters, score registers, framerate stats, coordinates, and system status tags. Prevents layout jitter during high-frequency score cascades.

## Layout & Spacing
The layout follows a modular cockpit architecture centered strictly around the game viewports.

- **Desktop Cockpit (Min 1024px):** Fixed aspect-ratio game arena (1:1 or 4:3) flanked by docked vertical modular utility strips (Left: Player loadout, current modifiers, speed gauges. Right: Leaderboards, active run statistics, event ledger). Modules span within an anchored outer chassis using `gutter-desktop` (20px) separation.
- **Tablet / Split View (768px - 1023px):** Game arena pinned to upper bounds; twin HUD sub-strips collapse into an organized lower telemetry bar.
- **Mobile Viewport (<768px):** Arena locks edge-to-edge with 16px screen safe-margins. Secondary telemetry abstracts into a compact top status ribbon (height: 44px). The lower quadrant reserves fixed space for tactile thumbpad clusters.
- **Spacing Principle:** Compact, structural, dense. Internal component padding favors high efficiency (`space-xs` to `space-md`) over airy empty space, prioritizing information density and zero-scroll gameplay viewports.

## Elevation & Depth
Elevation is achieved exclusively through **tonal stacking, precision chiseled edge-lines, and localized glow boundaries**. Ambient diffused drop-shadows are excluded.

- **Base Arena Ground (Level 0):** Background `#090A0C` overlaid with a sharp 1px grid (`#141820`, 24px step).
- **Chassis Level (Level 1):** Graphite module `#12151A` bordered with 1px solid `#232934`. Zero soft shadow.
- **Active Deck (Level 2):** Elevated telemetry pods and card states use `#181C23` surrounded by high-contrast hairline perimeter `#2E3646`.
- **Interactive Focus & Active State:** Physical 1px inward box-shadow coupled with an external crisp 1px highlight: `box-shadow: 0 0 0 1px #10B981, inset 0 1px 0 rgba(255, 255, 255, 0.08)`.
- **Tactile Depth Metaphor:** Depressed buttons translate downwards by 1px with inner inset darkening (`inset 0 2px 4px rgba(0, 0, 0, 0.6)`) to simulate machine key-travel on microswitch hardware.

## Shapes
The structural geometry is low-radius and mechanical.

- **Default Border Radius:** Microscopic 4px (`0.25rem`) corner rounding across standard buttons, telemetry cells, and modal pods. Retains the crisp geometry of physical monitor bezels.
- **Internal Micro Elements:** Badges, tags, pellet status icons, and segments use 2px micro-chamfers or strict 2px rounding.
- **Tactile Circular Exceptions:** Mobile virtual D-pad triggers and direction thumb keys selectively implement continuous circular geometry or faceted octagonal shapes to match thumb anatomy, while remaining framed within square graphite modules.

## Components

### Buttons & Arcade Triggers
- **Primary Arcade Action:** Background `#10B981`, foreground `#090A0C`, bold `JetBrains Mono` uppercase typography. Flat surface with a top 1px border highlight (`rgba(255, 255, 255, 0.25)`). On active click: shifts 1px down, background deepens to `#059669`.
- **Secondary Shell Action:** Background `#181C23`, border 1px solid `#232934`, text `#F8FAFC`. On hover: border promotes to `#364152`, background to `#1F242D`. Focus keyboard ring: 1px crisp outline in `#10B981` with 2px offset.
- **Destructive/Abort Button:** Background transparent, border 1px solid `#EF4444`, text `#EF4444`. On hover: background `rgba(239, 68, 68, 0.1)`.

### Telemetry Pods (Cards)
- Structural graphite container (`#12151A`) encased by 1px `#232934`.
- Header: Split container with label in `label-mono-xs` (`#94A3B8`), uppercase with tracking `0.1em`, accompanied by a green status indicator dot (`4x4px` solid `#10B981`).
- Content area houses `hud-counter` numbers with `JetBrains Mono` tabular lining.

### HUD Score Trackers & Stat Modules
- Numeric registers feature zero-padded digit readouts (`008,420`).
- Speed multiplier meters utilize a segmented stepped bar: 10 individual 3px blocks spaced by 2px gaps, filling from `#059669` through `#10B981` up to `#F59E0B` at maximum velocity.

### Selection Chips & Speed Toggles
- Monospaced horizontal selector groups bound inside an integrated frame (`#12151A`).
- Inactive segment: Text `#94A3B8`, background transparent.
- Active segment: Background `#1F242D`, text `#10B981`, hairline border `#10B981` with inset hairline top-glow.

### Touch D-Pad (Mobile Only)
- Anchored at bottom corners in landscape/portrait mobile viewports.
- Cross-layout container composed of four discrete graphite keys (`#181C23`, border `#232934`).
- Direction arrows rendered with razor-sharp geometric SVGs in `#94A3B8`. Active touch contact triggers instantaneous background fill `#10B981`, glyph fill `#090A0C`, and zero-latency haptic response.

### Input Fields (Key Binding & Call-Signs)
- Monospaced entry containers (`#090A0C`), inset hairline border `#232934`.
- On focus: border shifts immediately to `#10B981` without transition blur.
- Blinking rectangular terminal caret (`width: 7px, height: 14px, background: #10B981`).

### Overlay Modals (Game Over & Pause)
- Frosted dark shroud: `#090A0C` at 85% opacity with 4px backdrop blur (retaining field silhouette).
- Central chassis: `#12151A` bounded by a prominent perimeter line (`#364152`), containing performance metrics summary, high-score comparison bar, and immediate keyboard restart listener (`[SPACE] TO RETRY`).