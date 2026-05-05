# Atlas Figma Reference

**Purpose**

This file is the reusable handoff reference for rebuilding the current Atlas UI system in Figma when a live Figma sync is not available in-session.

## Foundations

### Color Roles

Use the existing CSS token names as the source of truth:

- `--bg-base`: background base
- `--bg-wash`: background gradient wash
- `--surface`: shared shell surface
- `--surface-strong`: elevated surface
- `--surface-soft`: supportive card surface
- `--surface-primary`: highest-clarity workspace surface
- `--text`: primary text
- `--muted`: secondary text
- `--border`: default border
- `--border-strong`: emphasized border
- `--accent`: primary action
- `--accent-deep`: accent dark text
- `--accent-soft`: accent soft fill
- `--sage`: wellness support state
- `--sage-soft`: support surface

### Type Roles

- Screen title: `--text-screen`
- Panel title: `--text-panel`
- Body: `--text-body`
- Secondary: `--text-secondary`
- Caption: `--text-caption`
- Metric emphasis: `--text-metric`

Primary type:

- Manrope

Display / accent type:

- Space Grotesk

### Radius Roles

- Shell: `--radius-shell`
- Card: `--radius-card`
- Control: `--radius-control`
- Pill: `--radius-pill`

### Layout Roles

- Main section gap: `--space-section`
- Card rhythm: `--space-card`
- Control height: `--control-height`

## Component Inventory

Build these components first in Figma:

- `Brand / Mark`
  - circular mark with gradient fill
- `Button / Primary`
  - compact height, strong accent fill
- `Button / Ghost`
  - pill shape, neutral surface
- `Button / Pill`
  - pill shape, accent fill
- `Badge / Role`
  - pill shape, sage tint
- `Input / Shell`
  - stacked label + field
- `Card / Surface`
  - base surface card
- `Card / Overview`
  - dashboard summary card
- `Card / Metric`
  - dashboard metric block
- `Toggle / Notification`
  - pill switch with circular thumb
- `Chip / Prompt`
  - compact quick-start chip
- `Message / User`
  - warm accent bubble
- `Message / Atlas`
  - neutral elevated bubble

## Target Frames

Build these frames in order:

### 1. Chat Workspace

Desktop frame:

- left support panel
- right dominant chat workspace
- topbar
- workspace header
- chat surface
- quick-start chips
- input row

Mobile frame:

- stacked hero then workspace
- full-width controls
- one-column input and actions

### 2. Dashboard

Desktop frame:

- compact top header
- toolbar
- overview strip
- 2-column metric grid
- wide notifications card

Mobile frame:

- stacked header
- stacked overview cards
- single-column metric list

### 3. Sign In

Desktop frame:

- centered compact card
- short title
- short subtitle
- stacked actions

Mobile frame:

- same card language
- full-width controls

## Screen Priorities

- `Chat` is the master screen and should drive the system
- `Dashboard` inherits from chat
- `Sign In` is intentionally compact

## Notes for Figma Assembly

- Keep rounded containers consistent across badges, toggles, cards, and button groups
- Do not add new colors without mapping them to an existing token role
- Do not enlarge titles beyond the ranges already defined in CSS
- Prefer component reuse over new one-off frames

## Remotion Alignment

The same foundations should be reused in the Remotion workspace for:

- Weekly Atlas Summary
- Atlas Product Demo
- Atlas Progress Clip

This keeps product UI and generated video outputs visually aligned.
