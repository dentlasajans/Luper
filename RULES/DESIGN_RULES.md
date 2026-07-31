# LUPER Permanent Visual Design System (`RULES/design_rules.md`)

This document defines the permanent visual design system, UI tokens, color palettes, typography, and component styling rules for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer working on LUPER must strictly follow these rules.

---

# Purpose

Define a single, unified, and non-negotiable visual design language for the entire LUPER product.

LUPER is a commercial Windows desktop optimization platform. The user interface must project executive dark-mode elegance, exceptional clarity, high performance, and absolute visual consistency across every screen, dialog, tooltip, and component.

---

# Design Philosophy

The visual design system of LUPER is built upon 6 core tenets:

- **Executive Polish:** Dark anthracite aesthetics (`#121214`) inspired by Apple/macOS Sequoia and Linear.app.
- **Precision:** Fine 1px border lines (`border-white/[0.08]`), sub-pixel alignment, and clear visual hierarchy.
- **Speed:** Instant sub-200ms visual interaction feedback; zero visual latency.
- **Focus:** Luper Sapphire Blue (`#1a5efd`) reserved strictly for primary interactive focus and active states.
- **Restraint:** Zero RGB gaming rainbow noise, neon glows, or visual competition.
- **Reliable:** Stable, predictable component rendering locked at 60 FPS.

> 🛑 **VISUAL CONSISTENCY RULE:**
> Never introduce ad-hoc color codes, custom fonts, or arbitrary border radii outside this design specification.

---

# Design System Scope

This design specification applies to:

- Presentational React 19 components (`src/components/`)
- User Interface screens, modals, cards, and navigation bars
- CSS utility classes and Tailwind CSS v4 design tokens
- Desktop application (Electron + React 19) window framing and borderspecs.
- **Elegant:** Smooth 150-250ms `easeOut` micro-interactions without distracting bounce.

*The interface should feel calm, deliberate, executive, and intentional.*

---

# Design Philosophy

Every visual element in LUPER must have a transparent functional purpose.

- Avoid decorative elements, rainbow gauges, or flashy RGB effects that do not improve usability.
- **Less is better:** Prefer clean whitespace and subtle borders over heavy visual noise.
- **Consistency over creativity:** Uniformity across components is far more valuable than ad-hoc visual novelty.

---

# Visual Identity

Maintain a single, unified visual identity across:

- Desktop application (Electron + React 19 views)
- Official Website & Landing Pages
- Developer & User Documentation (`RULES/`, tooltips)
- Marketing materials & Release notes
- Application icons, System Tray icons & Vector badges
- Screenshots & Promotional materials
- Presentations & Demo media

*Everything should feel like the exact same premium commercial product.*

---

# Color System

Colors in LUPER must communicate meaning, reinforce hierarchy, and remain strictly consistent:

### Primary Accent
- **Luper Sapphire Blue (`#1a5efd`):** Primary action buttons, active toggles, focus rings, selected sidebar items, and score meters.

### Background Surfaces
- **App Background:** Deep Anthracite (`#121214`) instead of pure black.
- **Card Surfaces:** Koyu Antrasit (`#18181c`) slightly lighter than the background.
- **Hover Surfaces:** Subtle white highlight overlay (`#ffffff` at 4% to 8% opacity: `hover:bg-white/[0.08]`).

### Status Colors
- **Maximum Performance / Applied State:** Sapphire Blue (`#1a5efd`) / Emerald Green (`#81c784`).
- **Warning / Neutral State:** Amber Yellow (`#ffb74d`).
- **Critical / Action Required State:** Rose Red (`#ff5f56`).

*Primary colors represent actions; secondary grays (`#86868b`) support information. Status colors must remain strictly consistent.*

---

# Typography

Typography must guide user attention naturally while maintaining executive legibility:

- **Font Family:** Clean sans-serif font stack (`Helvetica Neue`, `Helvetica`, native system sans-serif).
- **Title 1 / Headers:** `text-xl` or `text-2xl` (`font-semibold`, `tracking-tight`, `#f5f5f7`).
- **Card Titles:** `text-lg` or `text-base` (`font-medium`, `#ffffff`).
- **Body Text:** `text-sm` (`font-normal`, `#e1e1e6`).
- **Subtext / Labels:** `text-xs` (`font-medium`, `#86868b`).

*Avoid excessive font weights, custom font overhead, or unnecessary text size variations.*

---

# Spacing System

Spacing across all layouts must follow a strict, standardized scale:

- **Spacing Scale:** `4px` (`space-1`), `8px` (`space-2`), `12px` (`space-3`), `16px` (`space-4`), `24px` (`space-6`), `32px` (`space-8`).
- **Card Internal Padding:** Standardized `16px` or `24px` (`p-4` or `p-6`).
- **Grid Gaps:** Standardized `16px` or `24px` (`gap-4` or `gap-6`).

*Random or arbitrary pixel spacing (e.g. `p-[13px]`, `mt-[7px]`) is never acceptable.*

---

# Grid System

Layouts across LUPER must follow a predictable, balanced grid:

- **Grid Alignment:** Align elements along clear vertical and horizontal grid lines.
- **Responsive Columns:** Utilize 1-column on compact views, 2-columns on medium windows, and 3-columns on maximized views (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **Natural Scaling:** Containers scale smoothly without horizontal scrollbars or clipping.

---

# Iconography

Icons across LUPER must:

- Be strictly sourced from **`lucide-react`**.
- Maintain uniform 18px-20px sizing with `strokeWidth={1.75}` or `2`.
- Match the visual language (Sapphire Blue for active states, secondary gray `#86868b` for inactive states).

*Never mix unrelated icon styles, filled 3D icons, or non-standard vector sets.*

---

# Cards

Presentational cards across LUPER must:

- Group related optimization controls cleanly within Koyu Antrasit (`#18181c`) container surfaces.
- Maintain consistent internal padding (`p-5` or `p-6`).
- Use standardized rounded corners (`rounded-xl` or `rounded-2xl`).
- Feature subtle, low-contrast borders (`border border-white/[0.06]`).

*Avoid overcrowded cards or heavy, opaque container borders.*

---

# Buttons

Buttons must follow a unified visual hierarchy:

- **Primary Button:** Luper Sapphire Blue background (`bg-[#1a5efd]`), white text, subtle hover highlight (`hover:bg-[#1552e0]`), 150ms `easeOut` transition.
- **Secondary Button:** Soft dark background (`bg-white/[0.06]`), subtle border (`border border-white/[0.08]`), text (`#e1e1e6`), hover highlight (`hover:bg-white/[0.1]`).
- **Ghost Button:** Transparent background, muted text (`#86868b`), hover text (`#ffffff`), hover background (`hover:bg-white/[0.06]`).
- **Toggle Switch:** Active state: `#1a5efd` background with white thumb (`bg-white`). Inactive state: `bg-white/[0.12]` background with mat gray thumb (`bg-[#98989d]`).

---

# Input Components

Form text fields, select boxes, and sliders must:

- Feature subtle dark input surfaces (`bg-white/[0.04] border border-white/[0.08]`).
- Display clear focus outlines (`focus:border-[#1a5efd] focus:ring-1 focus:ring-[#1a5efd]`).
- Provide explicit inline validation indicators for errors or success states.
- Maintain readable contrast for entered text (`text-white font-medium`).

---

# Shadows & Elevation

Use elevation sparingly to maintain a clean, flat dark-mode aesthetic:

- **Elevation Layering:** Floating sidebar and active modal dialogs use subtle dark shadows (`shadow-2xl shadow-black/50`).
- **Background Cards:** Use zero heavy drop shadows; rely on subtle background contrast (`#18181c`) and fine borders (`border-white/[0.06]`).

*Avoid heavy, dark glowing halos or excessive drop shadows.*

---

# Borders

Borders across LUPER must:

- Be subtle and refined (`border border-white/[0.06]` or `border-white/[0.08]`).
- Provide clean structural separation between cards and navigation.
- Never dominate the interface visually.

---

# Corner Radius

Corner radii must remain strictly consistent across all UI elements:

- **Modal Windows & Main Containers:** `rounded-2xl` (16px).
- **Cards & Category Containers:** `rounded-xl` (12px).
- **Buttons, Inputs & Badges:** `rounded-lg` (8px).
- **Toggle Switches & Tags:** `rounded-full`.

*Avoid mixing unrelated corner radius values.*

---

# Visual Consistency

Maintain 100% visual consistency across:

- Colors, Typography, Spacing, Iconography, Cards, Buttons, Inputs, Navigation, Panels, and Modal Dialogs.

*Users should immediately recognize the LUPER design language on any screen.*

---

# Motion Consistency

Visual motion across LUPER must:

- Feel natural, crisp, and fast (150ms - 250ms duration).
- Use clean `easeOut` timing curves.
- Reinforce hierarchy and explain view transitions cleanly.

*Never use motion purely for decorative showmanship.*

---

# Dark Theme

Anthracite Dark Mode is the primary and permanent visual experience:

- Deep Anthracite (`#121214`) base background to reduce eye fatigue.
- Excellent text contrast (`#f5f5f7` primary, `#86868b` secondary).
- Preserved visual hierarchy with Sapphire Blue (`#1a5efd`) highlights.

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Random or unapproved accent colors outside the color system.
- ❌ Arbitrary pixel spacing values outside the 4px grid scale.
- ❌ Mixed icon sets or non-Lucide vector icons.
- ❌ Inconsistent typography sizes, font weights, or custom webfonts.
- ❌ Gaming RGB rainbows, circular rainbow score gauges, or cluttered visual noise.
- ❌ **STRICTLY FORBIDDEN**: Glassmorphism, `backdrop-blur`, or highly transparent background surfaces. All cards must be Solid (`bg-[#18181c]`, etc).
- ❌ Decorative gradients that do not improve usability.
- ❌ Unbalanced, overcrowded card layouts.
- ❌ Heavy borders or dark drop shadow overload.

---

# Definition of Done

A visual design implementation is considered **DONE** and ready for release only if it is:

- ✅ **Consistent:** Fully aligned with LUPER design system tokens.
- ✅ **Professional:** Executive dark-mode polish with zero visual glitches.
- ✅ **Accessible:** High text contrast, visible focus rings, keyboard support.
- ✅ **Scalable:** Built with reusable presentational components.
- ✅ **Reusable:** Modular Tailwind CSS structure without arbitrary overrides.
- ✅ **Premium:** Aligned with Apple/macOS Sequoia and Linear.app standards.
- ✅ **Aligned with LUPER Visual Identity:** Fully compliant with `AGENTS.md` and `RULES/design_rules.md`.
