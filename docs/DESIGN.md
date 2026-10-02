# Design System & UI Specifications — Obsidian Arcade Edition

## 1. Brand & Design Philosophy
**Theme:** "Obsidian Arcade / Tactile Esports Edition"

The visual design language creates an austere, competitive arcade atmosphere engineered for high-precision play. It blends the tactile industrial presence of high-end retro-futuristic arcade cabinetry with the razor-sharp functional clarity of a modern esports HUD.

- **Atmosphere:** Surgical, intentional, disciplined, focused. Low-profile hardware utility.
- **Visual Depth:** Tonal stacking, precision chiseled edge-lines, localized glow boundaries. No blurry corporate gradients or gratuitous neon bloom.
- **Micro-Interactions:** Subtle bevel highlights, active state glows, and low-latency audio feedback.

---

## 2. Color Palette & Token Hierarchy

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

### Typography & Readout Tiers
| Token | Hex / Value | Usage |
|---|---|---|
| `--text-readout` | `#F8FAFC` | High-contrast values, titles, scores, modal headers |
| `--text-secondary` | `#94A3B8` | Labels, metadata, control specs |
| `--text-inactive` | `#475569` | Zero states, disabled toggles, subtle shortcuts |

---

## 3. Typography Specifications

| Role | Font Family | Size | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| **Headline Display** | `Space Grotesk`, sans-serif | `32px` - `48px` | `700` | `-0.03em` | Game Over / Victory / Dialog Headers |
| **Section & Titles** | `Space Grotesk`, sans-serif | `16px` - `24px` | `600` | `-0.02em` | Card Titles, Navigation Headers |
| **Telemetry & Counters**| `JetBrains Mono`, monospace | `20px` - `36px` | `700` | `-0.04em` | Score, High Score, Speed Tier, Coordinates |
| **Labels & Metas** | `JetBrains Mono` / `Space Grotesk`| `9px` - `12px` | `600` | `+0.08em` | Uppercase HUD badges, system tags, telemetry keys |
| **Body & Specs** | `Inter`, sans-serif | `13px` - `14px` | `400` / `500` | `0` | Dialog body, settings descriptions |

---

## 4. Canvas & Game Board Rendering Specifications

- **Aspect Ratio:** Fixed 1:1 square coordinate matrix (16x16 cells).
- **Background:** Rich `#090A0C` obsidian playfield.
- **Grid Treatment:** Crisp 1px sub-grid lines in `#141820` / `rgba(255, 255, 255, 0.035)`.
- **Snake Presentation:**
  - **Head:** High-visibility Laser Emerald `#34D399` / `#10B981` with rounded leading corners and directional gaze indicators.
  - **Body:** Gradient phosphor emerald segments (`#10B981` down to `#059669`) with 1px top highlight bevel.
- **Food Pellet:** Terracotta `#C45643` with subtle pulsating core ring, guaranteeing 100% color distinction from both the green snake and the dark void.
- **Frame & Chassis:** Double-edge border with `#232934` hairline on an outer `#12151A` hardware bezel.

---

## 5. UI Component Hierarchy

### Buttons & Interactive Controls
- **Primary Action (Play, Start, Save):** Emerald `#10B981` background, `#090A0C` bold text, slight phosphor glow on hover.
- **Secondary / Ghost (Pause, Settings):** Surface high `#181C23` background with `#232934` 1px border and `#F8FAFC` text.
- **Destructive / Reset:** Surface low with `#EF4444` hover border and text.

### Telemetry Pods (GameHUD)
- **Score Readout:** Monospace numbers with zero-padded formatting (e.g. `00420`).
- **High Score Display:** Amber trophy icon with high-contrast personal best counter.
- **Speed Metric:** Dynamic gauge indicator displaying current step delay (ms) or speed tier level.

### Mobile Virtual D-Pad
- **Layout:** Tactile cross arrangement positioned ergonomically in the bottom third of mobile touch screens.
- **Feedback:** Immediate active highlight (`#1F242D`) and Web Audio haptic click upon touch start.

---

## 6. Procedural Audio Feedback (Web Audio API)

All audio is procedurally synthesized on the client to eliminate HTTP latency and asset load failures:
1. **Food Eaten:** High-pitched sine wave blip ramping from 440Hz to 880Hz over 60ms.
2. **Speed Tier Up:** Quick two-tone arpeggio (523Hz -> 659Hz) indicating acceleration.
3. **Collision / Game Over:** Low saw-tooth pitch drop from 220Hz down to 55Hz with white noise burst over 250ms.
4. **Button Click / D-Pad Tap:** Ultra-short 15ms pulse at 800Hz.

---

## 7. Responsive Breakpoint Layouts

```
┌────────────────────────────────────────────────────────────────────────┐
│ Desktop (≥ 1024px): Dual-Column Esports Cockpit                        │
│ ┌───────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │                               │ │ HUD Telemetry Pods               │ │
│ │                               │ ├──────────────────────────────────┤ │
│ │   1:1 HTML5 Canvas Board      │ │ Live Global Leaderboard          │ │
│ │   (Centered Arcade View)      │ ├──────────────────────────────────┤ │
│ │                               │ │ Audio / Key Controls Guide       │ │
│ └───────────────────────────────┘ └──────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ Mobile (< 768px): Single-Column Thumb-First Cockpit                    │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Top Compact Telemetry Bar (Score | High Score | Speed Tier)        │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Full-Width Responsive Square Canvas Arena                          │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Ergonomic Virtual Touch D-Pad Controls                             │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```
