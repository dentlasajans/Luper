# LUPER Global UI & UX Standards (`RULES/ui_ux_rules.md`)

This document defines the permanent User Interface (UI) and User Experience (UX) standards for the entire **LUPER** project (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and UI designer working on LUPER must strictly follow these rules. These standards override personal design preferences.

---

# Purpose

Define a unified, non-negotiable UI and UX standard for LUPER.

Every screen, interaction, animation, modal, and presentation component must feel like it belongs to the exact same premium commercial product. The user experience must be 100% consistent across every view and tool.

---

# Design Philosophy

LUPER must feel:

- **Premium:** Executive dark-mode elegance inspired by Apple/macOS Sequoia and Linear.app.
- **Modern:** Contemporary UI aesthetics leveraging subtle glassmorphism and fine border lines.
- **Professional:** Clean engineering precision built for power users, gamers, and IT professionals.
- **Fast:** Instant sub-200ms visual response to user inputs; zero interface lag.
- **Clean:** Crisp typography and intentional whitespace; zero visual clutter or RGB gaming noise.
- **Confident:** Clear visual contrasts, distinct focus outlines, and transparent state indicators.
- **Minimal:** Streamlined layouts where every visual element justifies its existence.
- **Elegant:** Smooth, non-intrusive 150-250ms `easeOut` micro-interactions.
- **Predictable:** Uniform visual patterns across cards, toggles, modals, and navigation routes.

> 🛑 **CORE DESIGN RULE:**
> Never sacrifice usability, contrast, or speed for flashy visual aesthetics.

---

# Core UX Principles

Always prioritize:

- **Simplicity:** Eliminate unnecessary configuration options, cluttered metrics, or decorative elements.
- **Clarity:** Ensure every label, status badge, and subtext is self-explanatory in clean Turkish.
- **Predictability:** Guarantee UI components behave identically across all screens.
- **Consistency:** Enforce exact spacing metrics, color tokens, and font weights.
- **Discoverability:** Keep core optimization actions and tools easily accessible within 1-2 clicks.
- **Accessibility:** High visual contrast, visible focus rings, keyboard navigation, and reduce motion support.
- **Efficiency:** Streamline workflows so users can perform actions with minimal clicks.
- **User Confidence:** Instill trust through clear progress indicators and flawless backup/restore fallbacks.

*Every interaction in LUPER must serve a transparent, functional purpose.*

---

# Visual Hierarchy

Every screen across LUPER must clearly communicate visual hierarchy without visual competition:

1. **Primary Action:** Highlight main calls-to-action (e.g. active toggles, primary optimize buttons) using Luper Sapphire Blue (`#1a5efd`).
2. **Secondary Action:** Style secondary options with soft border outlines (`border-white/[0.08]`) and neutral backgrounds.
3. **Current State:** Show dynamic badges and status scores (`80-100` Maksimum Performans `#1a5efd`, `0` Optimizasyon Yapılmadı `#ff5f56`).
4. **Important Information:** Format card subtext in crisp, readable secondary gray (`#86868b`).
5. **Warnings:** Display system alerts with clean Amber callouts (`#ffb74d`).
6. **Success Messages:** Confirm completed optimizations with subtle Emerald Green notices (`#81c784`).

*Avoid visual competition. Never display multiple competing primary accent buttons on the same view.*

---

# Layout Rules

All view layouts across LUPER must follow strict grid metrics:

- **Consistent Spacing:** Utilize strict spacing scales (4px, 8px, 12px, 16px, 24px, 32px) for gaps and padding.
- **Predictable Alignment:** Align visual elements cleanly along vertical and horizontal grid lines.
- **Balanced Layouts:** Distribute cards and panels evenly across 1, 2, or 3 grid columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **Logical Grouping:** Group related optimization toggles logically within dedicated category cards.
- **Comfortable Whitespace:** Provide breathing room around text blocks and action buttons.

*Avoid cluttered, cramped, or overcrowded interface layouts.*

---

# Component Rules

Every presentational component across LUPER must be:

- **Reusable:** Engineered as a modular block driven strictly by explicit React props.
- **Consistent:** Styled strictly with LUPER design tokens, never ad-hoc arbitrary Tailwind class overrides.
- **Modular:** Atomic, self-contained visual elements decoupled from business logic.
- **Predictable:** Identical visual styling and interaction states across all views.
- **Accessible:** Built with proper contrast ratios and keyboard focus indicators.

*Do not create multiple visual styles or parallel variants for the same component type.*

---

# Interaction Rules

Every interactive element MUST provide immediate visual feedback across all interaction states:

- **Hover:** Subtle background highlight transition (`hover:bg-white/[0.08]`, 150ms `easeOut`).
- **Focus:** Visible focus ring outline (`focus:ring-2 focus:ring-[#1a5efd]`) for keyboard tab navigation.
- **Press / Active:** Subtle scale transition (`active:scale-[0.98]`).
- **Loading:** Non-intrusive spinner or pulse animation with disabled click events.
- **Success:** Sapphire Blue or Emerald Green status indicator update with checkmark icon.
- **Error:** Subtle Rose Red warning indicator with actionable retry button.
- **Disabled:** Reduced opacity (`opacity-40 cursor-not-allowed`) with pointer events disabled.
- **Selected:** Active background highlight (`bg-[#1a5efd]`) with pure white thumb indicator.

*Users should never wonder whether an interaction worked or is processing.*

---

# Navigation

Navigation across LUPER must always be:

- **Simple:** Floating left sidebar with clear category icons and concise Turkish labels.
- **Predictable:** Clicking a navigation item switches views instantly with sub-200ms transitions.
- **Consistent:** Active view item is always highlighted with Luper Sapphire Blue icon and text.
- **Easy to Understand:** Clear visual hierarchy separating main categories (Dashboard, System Info, Optimizations) from Tools and Settings.

Users should ALWAYS understand:
- **Where they are:** Active sidebar item highlighted and view title clearly displayed.
- **Where they came from:** Easy 1-click navigation back to Dashboard.
- **Where they can go:** All available optimization views visible in the floating sidebar.

---

# Animation Rules

Animations and visual transitions across LUPER must:

- **Improve Usability:** Help users understand state transitions and route changes.
- **Guide Attention:** Direct attention naturally to dynamic score changes or applied state updates.
- **Explain Transitions:** Smoothly fade or slide views (`motion/react` 150-250ms `easeOut`).
- **Feel Smooth:** Render locked at 60 FPS using GPU-accelerated CSS properties (`opacity`, `transform`).
- **Never Distract:** Subtle, non-intrusive, and professional.

*Avoid flashy, slow, 3D, or exaggerated spring-bounce decorative animations.*

---

# Loading Experience

Never leave users staring at an unresponsive screen or un-indicated process:

- **Immediate Feedback:** Display smooth loading indicators for any operation taking longer than 100ms.
- **Progress Tracking:** Show percentage or item counters during multi-step optimization actions.
- **Success Confirmation:** Display clear, brief confirmation notifications upon completion.
- **Failure Handling:** Show explicit Turkish error notices if an IPC operation rejects.
- **Retry Opportunities:** Offer straightforward 1-click retry buttons on failed operations.

---

# Error Experience

When an error or unexpected failure occurs:

- **Explain What Happened:** State the failure in clear, simple language (e.g. *"Yönetici yetkisi alınamadı"*).
- **Explain What Users Can Do:** Provide explicit next steps (e.g. *"Lütfen uygulamayı yönetici olarak çalıştırın"*).
- **Avoid Technical Jargon:** Never expose raw stack traces, HRESULT codes, or registry path syntax in error dialogs.
- **Be Reassuring:** Confirm that system backups remain intact and original Windows settings are safe.
- **Never Blame the User:** Maintain a respectful, helpful tone.

---

# Empty States

When a view or search result contains no data:

- **Explain Why:** Clear Turkish message (e.g. *"Henüz hiçbir optimizasyon uygulanmadı"*).
- **Explain Next Steps:** Guide the user on how to populate the view.
- **Encourage Action:** Provide a direct button to start optimizing or exploring categories.

*Never leave blank, un-formatted empty screens.*

---

# Forms

Input controls and toggle forms across LUPER must:

- **Minimize Required Input:** Keep configurations simple with single-click toggle switches (`#1a5efd`).
- **Validate Early:** Perform regex validation immediately on text inputs.
- **Explain Errors Clearly:** Display inline warning text below invalid input fields.
- **Preserve Entered Data:** Retain user inputs across view transitions.

---

# Dialogs

Modal dialogs and alert overlays must:

- **Have One Clear Purpose:** Focus strictly on a single decision (e.g. *"Tüm Optimizasyonları Sıfırla"*).
- **Be Concise:** Short, clear Turkish title and 1-2 sentence descriptive subtext.
- **Communicate Consequences:** Explicitly state what will happen before confirming destructive actions.
- **Avoid Unnecessary Confirmations:** Reserve modal dialogs for high-impact actions (e.g. System Restore).

---

# Notifications

Notification Toasts must be:

- **Helpful:** Confirm applied optimizations, backups, or system setting changes.
- **Timely:** Appear instantly upon action completion in the lower right or top right corner.
- **Relevant:** Display information directly related to the user's explicit action.
- **Short:** Single-line or two-line concise Turkish notice.
- **Actionable:** Include optional action buttons (e.g. *"Geri Al"* / *"Detaylar"*).

*Avoid notification fatigue. Do not trigger repetitive popups for routine background metric updates.*

---

# Accessibility

Accessibility across LUPER is a core requirement, not an optional feature:

- **Keyboard Navigation:** Full tab order navigation across all buttons, toggles, and sidebar items.
- **Focus Visibility:** High-contrast focus rings (`focus:ring-2 focus:ring-[#1a5efd]`) for active elements.
- **Color Contrast:** High contrast text ratio against dark anthracite backgrounds (`#121214`).
- **Readability:** Clean sans-serif typography with comfortable letter-spacing.
- **Screen Scaling:** Fluid container scaling that adapts cleanly to 100%, 125%, and 150% Windows DPI scaling.
- **Motion Sensitivity:** Respect "Düşük Kalite Modu" (Reduce Motion) by disabling heavy backdrop blurs and motion effects.

---

# Responsiveness

The user interface must adapt naturally across:

- **Different Window Sizes:** Smooth transitions between default windowed mode (`1200x800`) and custom window dimensions.
- **High DPI Displays:** Crisp vector rendering on 1080p, 1440p, and 4K displays.
- **Multiple Monitor Setups:** Flawless window dragging, snapping, and maximizing without layout breaking.

*Grid columns must collapse smoothly (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) without horizontal overflow.*

---

# Performance Perception

Users must always perceive LUPER as lightning-fast, smooth, and stable:

- **Instant Visual Response:** Optimistic toggle updates on UI click backed by async IPC resolution.
- **Sub-200ms Navigation:** View route changes execute instantly without loading stutters.
- **60 FPS Animations:** Smooth CSS transitions using GPU-accelerated properties (`opacity`, `transform`).
- **Stable UI Layouts:** Layout elements retain fixed bounds to prevent visual Cumulative Layout Shift (CLS).

*Perceived performance is as critical as actual backend performance.*

---

# Consistency Rules

Always maintain 100% uniformity across the entire application:

- **Same Terminology:** Use standardized Turkish product terms (e.g. *Sistem Optimizasyon Puanı*, *Yedekleme*, *Safir Mavi*).
- **Same Icons:** Exclusively use `lucide-react` vector icons with uniform 18px-20px stroke sizing.
- **Same Spacing:** Standardized 4px, 8px, 12px, 16px, 24px, 32px padding and gap scales.
- **Same Typography:** Standard font weights and sizes across all card headers and body text.
- **Same Button Behavior:** Uniform hover, active, focus, and disabled interaction states.
- **Same Interaction Patterns:** Identical toggle switches, modal dialogs, and toast notifications.

*Consistency builds user confidence and commercial trust.*

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Inconsistent UI styling or unapproved color variations.
- ❌ Random, non-standard padding or margin values outside the design system grid.
- ❌ Multiple competing visual styles for the same component type.
- ❌ Unexpected layout shifts or un-indicated navigation changes.
- ❌ Confusing, multi-level nested navigation structures.
- ❌ Flashy, slow, 3D, or exaggerated spring-bounce decorative animations.
- ❌ Visual clutter, rainbow circular gauges, or gaming RGB noise.
- ❌ Hidden interactive actions without hover/focus indicators.
- ❌ Unclear, ambiguous, or technical jargon labels in the user interface.

---

# Definition of Done

A UI/UX implementation is considered **DONE** and ready for release only if it is:

- ✅ **Consistent:** Strictly matched with LUPER design tokens and `RULES/design_rules.md`.
- ✅ **Accessible:** High-contrast text, visible focus rings, keyboard tab support.
- ✅ **Responsive:** Fluid layout scaling without horizontal scrollbars or clipping.
- ✅ **Predictable:** Instant 200ms visual interaction feedback across all states.
- ✅ **Premium:** Commercial-grade, executive Anthracite dark-mode polish.
- ✅ **Easy to Understand:** Clear Turkish copy, intuitive visual hierarchy.
- ✅ **Easy to Use:** Minimal clicks required to complete key optimization tasks.
- ✅ **Aligned with LUPER Design System:** Fully compliant with `AGENTS.md` and all files inside `RULES/`.
