# Atlas Visual System and Remotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a consistent Atlas visual system across chat, dashboard, and sign-in, add a Figma-ready handoff reference, and scaffold a Remotion workspace for Atlas video outputs.

**Architecture:** Use `frontend/styles.css` as the shared token source, keep existing HTML/JS pages intact where possible, introduce only small markup changes that improve structure, and scaffold a separate `remotion/` workspace so video generation stays isolated from the main web app.

**Tech Stack:** Static frontend HTML/CSS/JS, Node.js/Express backend, isolated Remotion React workspace

---

### Task 1: Write the design artifacts to the repo

**Files:**
- Create: `docs/superpowers/specs/2026-04-16-atlas-visual-system-design.md`
- Create: `docs/superpowers/plans/2026-04-16-atlas-visual-system-and-remotion.md`
- Create: `docs/design/atlas-figma-reference.md`

- [ ] **Step 1: Save the approved visual-system design**

Write the approved direction into the spec file with sections for product direction, token system, screen hierarchy, Figma handoff, and Remotion scope.

- [ ] **Step 2: Create a Figma-ready handoff file**

Document the exact token roles, component inventory, and target frames for:

- chat
- dashboard
- sign in

- [ ] **Step 3: Review both documents for placeholders or ambiguity**

Verify there are no placeholder markers or contradictory sections.

### Task 2: Normalize shared UI tokens in the frontend

**Files:**
- Modify: `frontend/styles.css`

- [ ] **Step 1: Introduce clearer reusable tokens**

Add or normalize variables for:

- radius
- control heights
- spacing rhythm
- panel shadows
- text scales

- [ ] **Step 2: Align shared components to those tokens**

Update shared button, badge, input, card, and pill styles so the same visual logic is reused across screens.

- [ ] **Step 3: Check CSS syntax**

Run: `node -e "new Function(require('fs').readFileSync('frontend/styles.css','utf8'))" 2>$null`
Expected: this command is not suitable for CSS parsing, so skip this and verify by loading the pages instead.

### Task 3: Make chat the clear master workspace

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/styles.css`
- Modify: `frontend/app.js` if copy or state labels need alignment

- [ ] **Step 1: Refine chat/hero balance**

Increase the visual weight of the chat workspace and reduce the hero panel's scale and visual competition.

- [ ] **Step 2: Compact secondary content**

Reduce helper text, chip density, and header weight so the message surface remains dominant.

- [ ] **Step 3: Verify home page rendering**

Run: `Invoke-WebRequest http://localhost:3000/ -UseBasicParsing | Select-Object -ExpandProperty StatusCode`
Expected: `200`

### Task 4: Derive the dashboard from the chat system

**Files:**
- Modify: `frontend/dashboard.html`
- Modify: `frontend/dashboard.js`
- Modify: `frontend/styles.css`

- [ ] **Step 1: Align dashboard containers and controls to shared tokens**

Reuse the same density, card rhythm, and control sizing used by chat.

- [ ] **Step 2: Tighten hierarchy**

Keep the operational overview clear while making labels, notes, and metrics feel part of the same system.

- [ ] **Step 3: Verify dashboard rendering and script validity**

Run: `node --check frontend/dashboard.js`
Expected: no syntax errors

Run: `Invoke-WebRequest http://localhost:3000/dashboard.html -UseBasicParsing | Select-Object -ExpandProperty StatusCode`
Expected: `200`

### Task 5: Compact sign-in without changing the product identity

**Files:**
- Modify: `frontend/signin.html`
- Modify: `frontend/styles.css`
- Modify: `frontend/signin.js` only if labels or statuses need alignment

- [ ] **Step 1: Reduce visual footprint**

Tighten width, padding, title scale, subtitle length, and button rhythm.

- [ ] **Step 2: Preserve flow clarity**

Keep sign-in, create account, and guest paths clear and readable.

- [ ] **Step 3: Verify sign-in rendering**

Run: `Invoke-WebRequest http://localhost:3000/signin.html -UseBasicParsing | Select-Object -ExpandProperty StatusCode`
Expected: `200`

### Task 6: Scaffold a minimal Remotion workspace

**Files:**
- Create: `remotion/` workspace files
- Modify: root `README.md` only if a short usage section is helpful

- [ ] **Step 1: Create the isolated video workspace**

Use a dedicated `remotion/` folder so the video pipeline stays separate from the main app runtime.

- [ ] **Step 2: Add shared Atlas theme tokens**

Mirror key Atlas colors, radii, type choices, and spacing for video compositions.

- [ ] **Step 3: Add initial compositions**

Include at least:

- Weekly Atlas Summary
- Atlas Product Demo
- Atlas Progress Clip

- [ ] **Step 4: Verify the Remotion workspace installs and compiles**

Run the appropriate install command and a render or still check for one composition.

### Task 7: Verify critical flows end to end

**Files:**
- No new files required

- [ ] **Step 1: Re-run script syntax checks**

Run:

- `node --check frontend/app.js`
- `node --check frontend/signin.js`
- `node --check frontend/dashboard.js`
- `node --check frontend/profile.js`
- `node --check frontend/admin.js`

- [ ] **Step 2: Re-check core pages**

Run:

- `Invoke-WebRequest http://localhost:3000/ -UseBasicParsing | Select-Object -ExpandProperty StatusCode`
- `Invoke-WebRequest http://localhost:3000/signin.html -UseBasicParsing | Select-Object -ExpandProperty StatusCode`
- `Invoke-WebRequest http://localhost:3000/dashboard.html -UseBasicParsing | Select-Object -ExpandProperty StatusCode`

- [ ] **Step 3: Re-run the main frontend smoke flows**

Confirm:

- sign in
- guest access
- chat
- history
- reset
- check-in
- dashboard
- notifications

### Task 8: Summarize what is ready and what is staged for later

**Files:**
- No new files required

- [ ] **Step 1: Record actual verification results**

Only report flows or renders that were truly verified in this session.

- [ ] **Step 2: Call out any deferred items honestly**

If Figma sync was documented but not pushed to a live file, say that clearly.
