# LUPER AI Design Operating System & Intelligence Architecture

This document defines the **AI Design Operating System (AI-DOS)** for the LUPER platform. It serves as the authoritative, self-governing intelligence manual for all current and future AI agents operating within the LUPER codebase.

---

## 🤖 1. AI Decision Framework & Flowchart

When any AI agent is tasked with building or extending a feature in LUPER, it MUST follow this evaluation tree:

```
                  ┌───────────────────────────────┐
                  │   User Feature Requirement    │
                  └───────────────┬───────────────┘
                                  │
                   Is there a matching primitive in
                   `src/components/ui/` or `info/`?
                       ┌──────────┴──────────┐
                      YES                    NO
                       │                     │
           ┌───────────▼───────────┐ ┌───────▼────────────────┐
           │ Reuse existing UI     │ │ Create modular primitive│
           │ component directly    │ │ in `src/components/ui/` │
           └───────────┬───────────┘ └───────┬────────────────┘
                       │                     │
                       └───────────┬─────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │ Apply LUPER Design Tokens   │
                    │ from `src/index.css`        │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │ Verify `npm run build`      │
                    │ Passes 100% Cleanly         │
                    └─────────────────────────────┘
```

---

## 📚 2. AI Design Knowledge Base Summary

### Color & Styling Rules
- **Brand Accent:** Use `var(--luper-brand)` (`#1a5efd`) for primary buttons, active tabs, and interactive accents.
- **Glassmorphism:** Use class `.luper-glass` for popovers, titlebars, and modal backdrops.
- **Card Surfaces:** Use class `.luper-card` (`#161619` base, `1px solid rgba(255,255,255,0.06)` border).

### Motion & Micro-Interactions
- **Fast Interactions (180ms):** Hover effects, focus rings, status badges.
- **Normal Transitions (220ms):** Tab changes, dropdowns, list filter updates.
- **Slow Motion (280ms):** Page transitions, modal openings.
- **GPU Acceleration:** Always include `will-change: transform, opacity` on heavy animated elements.

### Accessibility Safeguards
- Always provide `aria-label` or `aria-labelledby` for screen readers.
- Never remove `focus-visible` ring styles.
- Support `@media (prefers-reduced-motion: reduce)` for motion reduction.

---

## 🔄 3. Self-Improvement & Evolution Rules

1. **Zero Breaking Changes:** New components must be drop-in backwards compatible.
2. **Deprecation Strategy:** If a component is replaced, mark with `@deprecated` docstring and keep fallback export for 2 minor versions.
3. **Build Validation:** Every single subagent contribution must be verified via `npm run build`.

---

## 🏁 Final Status
Phase 25 (Design Intelligence & AI Design Operating System) is fully integrated into `RULES/ai_design_operating_system.md`.
All 25 LUPER UI/UX Design Phases are 100% completed and production ready!
