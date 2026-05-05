# Atlas Visual System Design

**Date:** 2026-04-16

**Goal**

Create a tighter, more product-like visual system for Atlas by using the chat experience as the master screen, deriving the dashboard from that system, compacting sign-in, and producing a Figma-ready reference plus a Remotion-friendly design foundation.

## Product Direction

Atlas should feel calm, operational, and trustworthy.

- Calm: warm surfaces, soft depth, measured contrast, no visual noise
- Operational: the primary workspace must always be obvious
- Trustworthy: consistent hierarchy, clear actions, restrained copy, stable layouts

The app should feel more like a focused wellness workspace than a landing page.

## Primary Screen Hierarchy

### 1. Chat as the Master Workspace

The chat is the main product surface and should receive:

- the greatest width allocation on desktop
- the strongest local contrast
- the most prominent interaction affordance
- the most generous readable space for messages

The left panel remains useful but clearly secondary.

### 2. Dashboard as a Derived Operational View

The dashboard should inherit the same visual language as chat:

- same surfaces and radii
- same label and caption scale
- same action treatment
- similar density and spacing rhythm

It should feel like an extension of the workspace, not a different product.

### 3. Sign In as a Compact Access Point

Sign-in should be:

- short
- direct
- centered
- low-friction

It should not compete with the app shell or try to act like a marketing page.

## Visual Tokens

### Color System

Keep the current warm Atlas palette and enforce a stricter role system.

- Background wash: atmospheric but quiet
- Surface base: shared shell/card surface
- Surface primary: the highest-clarity workspace surface
- Surface soft: supportive inner cards and blocks
- Accent: only for primary action, active state, and emphasis
- Sage: only for support states and wellness cues
- Danger: only for destructive or logout actions

### Typography

Shared size ranges:

- Screen title: 1.6rem to 1.9rem
- Panel title: 0.98rem to 1.06rem
- Body text: 0.9rem to 0.96rem
- Secondary text: 0.82rem to 0.88rem
- Caption / label: 0.72rem to 0.78rem
- Metric emphasis: 1.65rem to 1.9rem

Typography should prioritize scan speed over theatrical scale.

### Radius System

- Shell panels: 24px to 28px
- Main cards: 18px to 20px
- Controls: 14px to 16px
- Pills / toggles / badges: fully rounded or near-pill

The system should look intentionally rounded, with no harsh corners.

### Spacing System

- Major section gap: 20px to 24px
- Card interior gap: 12px to 16px
- Dense control rhythm: 10px to 12px
- Control height: 42px to 44px

The app should feel compact, not cramped.

## Screen-Specific Rules

### Chat

- The chat column remains dominant on desktop
- The hero panel uses smaller type and softer contrast than chat
- The message area gets the cleanest surface and strongest focus
- Quick prompts become support elements, not competing content
- The input shell and send button must feel like the core action

### Dashboard

- Replace any remaining hero energy with operational clarity
- Keep the top band informative but compact
- Use balanced cards with consistent heights
- Preserve strong readability for trends, values, and toggles
- Notifications remain secondary to metrics

### Sign In

- Keep the card narrow and visually centered
- Reduce title and helper copy size
- Use compact, even controls
- Primary action is visually clearer than the secondary action
- Guest path remains available but understated

## Cross-Screen Component Rules

### Shared Components

The following should use one visual language:

- brand marks
- badges
- ghost buttons
- primary buttons
- input shells
- metric cards
- notification toggles
- status banners

### Circular or Rounded Containers

Rounded treatments should be consistent across:

- role badges
- hero indexes
- range switches
- metric deltas
- toggles
- brand marks

## Figma Handoff Direction

The design system should be captured in Figma as:

- Foundations: color roles, typography, spacing, radius, shadows
- Components: button, ghost button, input shell, pill, card, badge, toggle, top bar, metric block
- Screens: chat, dashboard, sign in

If a live Figma connection is unavailable in the current session, the repo should still include a reusable Figma-ready reference file so implementation and design stay aligned.

## Remotion Direction

Remotion should not replace the app UI.

It should be added as a separate, isolated video workspace that reuses Atlas design tokens for:

- weekly user summary videos
- product demo videos
- shareable progress clips
- onboarding clips

The first production-worthy composition should be a weekly user summary driven by existing dashboard data.

## Success Criteria

- Chat reads as the clear primary workspace
- Dashboard feels derived from chat, not disconnected
- Sign-in feels compact and professional
- Shared components use the same token system
- A Figma-ready reference exists in the repo
- A Remotion workspace exists with Atlas-branded compositions
- Core app flows still function after the visual changes
