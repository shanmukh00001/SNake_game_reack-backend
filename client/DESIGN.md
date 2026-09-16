# Snake Arcade — Design System Reference (Stitch Edition)

Extracted directly from Google Stitch export artifacts (`obsidian_arcade` & `snake_arcade_tactile_editorial_edition_1`).

---

## 1. Brand & Design Philosophy: "Obsidian Arcade / Tactile Edition"

This design system crafts an austere, competitive arcade atmosphere engineered for high-precision play. It blends the tactile industrial presence of high-end retro-futuristic arcade cabinetry with the razor-sharp functional clarity of a modern esports HUD.

- **Tone & Demeanor:** Surgical, intentional, disciplined, focused. Low-profile hardware utility.
- **Visual Depth:** Tonal stacking, precision chiseled edge-lines, localized glow boundaries. No blurry corporate gradients or gratuitous neon bloom.

---

## 2. Color Palette Tokens

### Surface & Canvas Architecture
| Token | Hex / Value | Usage |
|---|---|---|
| `--background` / Canvas Void | `#090A0C` | Base non-interactive void space & outer shell |
| `--surface-low` | `#12151A` | HUD pods, inactive modules, card backings |
| `--surface-high` | `#181C23` | Elevated readouts, interactive cards, control blocks |
| `--surface-active` | `#1F242D` | Pressed states, active module headers |
| `--border` | `#232934` | Micro-hairline structural borders (1px) |
| `--border-active` | `#364152` | Active frames, elevated card perimeter |

### Emerald Accent Matrix (Signal & Player Entity)
| Token | Hex / Value | Usage |
|---|---|---|
| `--primary` / Laser Emerald | `#10B981` | Snake head/accent, living core, active counters, status lights |
| `--primary-deep` / Phosphor | `#059669` | Snake body segments, static interactive nodes, toggle fills |
| `--primary-muted` | `rgba(16, 185, 129, 0.12)` | Selection state pills, subtle HUD fills |

### Diagnostic & Target Tiers
| Token | Hex / Value | Usage |
|---|---|---|
| `--food` / Terracotta Clay | `#C45643` / `#34D399` | Food pellets (high contrast against emerald snake and dark canvas) |
| `--bonus` / Amber Gold | `#F59E0B` | High score star, speed thresholds, multiplier gauges |
| `--fault` / Crimson | `#EF4444` | Collisions, self-destruct, penalty alerts |

### Text & Signal Tiers
| Token | Hex / Value | Usage |
|---|---|---|
| `--text-readout` | `#F8FAFC` | High-contrast values, titles, scores, modal headers |
| `--text-secondary` | `#94A3B8` | Labels, metadata, control specs |
| `--text-inactive` | `#475569` | Zero states, disabled toggles, subtle shortcuts |

---

## 3. Typography Hierarchy

| Role | Font Family | Size | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| **Headline Display** | `Space Grotesk` | `32px` - `48px` | `700` | `-0.03em` | Game Over / Victory / Dialog Headers |
| **Section & Titles** | `Space Grotesk` | `16px` - `24px` | `600` | `-0.02em` | Card Titles, Navigation Headers |
| **Telemetry & Counters** | `JetBrains Mono` / `Space Grotesk (tnum)` | `20px` - `36px` | `700` | `-0.04em` | Score, High Score, Speed Tier, Coordinates |
| **Labels & Metas** | `JetBrains Mono` / `Space Grotesk` | `9px` - `12px` | `600` | `+0.08em` | Uppercase HUD badges, system tags, telemetry keys |
| **Body & Specs** | `Inter` / `Geist` / `DM Sans` | `13px` - `14px` | `400` / `500` | `0` | Dialog body, settings descriptions |

---

## 4. Game Board Specifications

- **Aspect Ratio:** Fixed 1:1 square.
- **Background:** `#090A0C` (rich obsidian playfield).
- **Grid Treatment:** Crisp 1px grid lines in `#141820` / `rgba(255, 255, 255, 0.035)`.
- **Snake Presentation:**
  - Head: `#34D399` / `#10B981` (Crisp rounded tile with directional gaze indicators).
  - Body: Gradient emerald segments `#10B981` down to `#059669` with 1px top highlight bevel.
- **Food Pellet:** Terracotta `#C45643` / `#34D399` with subtle pulse/bevel highlight, distinct from grid and snake.
- **Frame & Chassis:** Double-edge border with `#232934` hairline on an outer `#12151A` chassis.

---

## 5. Responsive Composition

- **Desktop (≥ 1024px):**
  - Cockpit layout: Center 7-col game arena flanked by 5-col telemetry/leaderboard dock.
  - Anchored chassis with `24px` gutter separation.
- **Tablet (768px - 1023px):**
  - Centered game arena with stacked telemetry bar and full-width leaderboard below.
- **Mobile (< 768px):**
  - Single-column priority.
  - Edge-to-edge arena with safe padding.
  - Compact top telemetry HUD ribbon.
  - Dedicated tactile virtual D-pad at bottom.
