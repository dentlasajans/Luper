# LUPER Permanent Localization & Internationalization Standards (`RULES/localization_rules.md`)

This document defines the permanent localization (l10n) and internationalization (i18n) standards for the **LUPER** project.

Every AI agent and software engineer working on LUPER must follow these rules.

---

## Technology Stack

- **Windows** (Target OS Platform)
- **Electron** (Application Framework & Native IPC Bridge)
- **Node.js** (Native Main Process & System Locale Detection)
- **React 19** (TypeScript Frontend UI Framework)
- **TypeScript** (Strongly Typed Translation Keys & Schemas)

---

## Purpose

Define a scalable, maintainable, and consistent localization architecture for the LUPER project.

Localization must be considered a core architectural concern rather than a post-development feature.

---

## Localization Philosophy

- **Multi-Language Architecture:** The application should be capable of supporting multiple languages seamlessly without requiring structural or architectural changes.
- **Localization-Ready UI:** All user-facing content, messages, and labels must be localization-ready from day one.
- **Zero Impact on Performance:** Localization mechanisms must never compromise application startup times, memory usage, or UI rendering performance.

---

## Core Principles

Localization in LUPER must be:

- **Scalable:** Easy addition of new languages without code refactoring.
- **Consistent:** Uniform terminology and phrasing across all screens.
- **Maintainable:** Centralized translation keys and strict type definitions.
- **Versioned:** Language resources versioned alongside application releases.
- **Testable:** Automated missing key detection and layout overflow testing.
- **Easy to Extend:** Simple workflow for adding or updating locale files.

---

## Internationalization

- Separate language resources and translation files entirely from business and UI rendering logic.
- User interface code (React components, Node.js system dialogs) must **never** contain hardcoded user-facing strings.
- Internationalization (i18n infrastructure) must be implemented before localization (l10n translation content).

---

## Language Resources

Language resources must:

- Be centralized in structured JSON/i18n resource directories (e.g., `src/locales/`).
- Be version-controlled alongside the primary codebase.
- Use consistent dot-notation key hierarchy (e.g., `settings.performance.title`).
- Avoid duplicate string definitions across modules.
- Support future language additions seamlessly.

*Every translation key should have a single, clearly defined technical responsibility.*

---

## Translation Keys

Translation keys must:

- Be descriptive and reflect technical context (e.g., `common.buttons.save`, `errors.system.access_denied`).
- Be stable and remain unchanged even if translated text is rephrased.
- Follow project naming conventions (`camelCase` sub-keys under `snake_case` namespaces).
- Never depend on or derive logic from translated values.

> 🛑 **KEY DESIGN RULE:**
> Translation keys must remain 100% language-independent technical identifiers.

---

## User Interface

Every visible interface element must support localization, including:

- Buttons and interactive controls
- Menus and navigation bars
- Dialogs and modal popups
- Toast notifications and alerts
- Tooltips and contextual help
- Error messages and status badges
- Settings descriptions and options
- Onboarding screens and walkthroughs
- Application update notifications

---

## Formatting

Localization logic must handle locale-specific formatting for:

- **Date formats:** Relative time, short/long date strings according to active locale.
- **Time formats:** 12-hour vs 24-hour clock preferences.
- **Number formats:** Decimal separators, thousands grouping (e.g., `1,000.00` vs `1.000,00`).
- **Currency formats:** Localized pricing and currency symbols.
- **Measurement units:** Metric vs Imperial system representations.

*Formatting rules must automatically adapt to the user's active locale.*

---

## Right-to-Left Support

- The application architecture and styling system (CSS Flexbox/Grid logical properties e.g., `margin-inline-start`) must be compatible with Right-to-Left (RTL) languages where technically feasible.
- Layout assumptions (e.g., hardcoded `left: 10px` or fixed pixel offsets) must not prevent future RTL language support.

---

## Fallback Strategy

If a translation key is unavailable or missing in the target language:

- Automatically fall back to the primary default language (Turkish `tr` for LUPER user-facing defaults, or English `en`).
- **Never display raw translation keys** (e.g., `settings.title.missing`) to end-users in production.
- Log missing translation keys as development warnings for immediate developer resolution.

---

## Performance

Localization mechanisms must:

- Load language resource bundles efficiently.
- Minimize main thread startup impact (startup target <100ms).
- Avoid loading unused language resources simultaneously.
- Cache loaded language resources in memory for instant switching.

---

## Accessibility

Localized content must remain:

- Clear, readable, and non-ambiguous in all supported languages.
- Visually consistent across different font rendering metrics.
- Accessible to screen readers and assistive technologies (proper `aria-label` localization).

---

## Testing

Automated and manual localization testing must verify:

- **Missing Translations:** Automated CI checks ensuring all keys exist in all locale files.
- **Broken Layouts & Text Overflow:** Ensuring long translated strings do not clip or break UI containers.
- **Placeholder Substitution:** Correct injection of dynamic variables (e.g., `{{count}}`).
- **Locale Switching:** Seamless runtime language toggling without component state corruption.
- **Formatting Correctness:** Verifying locale-aware dates, numbers, and units.

---

## Documentation

LUPER technical documentation must maintain:

- List of currently supported and planned languages.
- Complete translation key naming convention guidelines.
- Translation update workflow for contributors.
- Fallback strategy behavior specifications.
- Architecture guide for frontend and backend i18n hooks.

---

## Things Never Allowed

**NEVER:**

- ❌ Hardcode user-facing strings directly in React JSX or Node.js main process code.
- ❌ Duplicate translation keys or create ambiguous string aliases.
- ❌ Use translated text as conditional logic identifiers in code.
- ❌ Display raw, untranslated keys (e.g., `FIXME_KEY`) to end users.
- ❌ Mix business logic with localization formatting logic.
- ❌ Allow long translated text strings to break or overflow UI layouts.

---

## Definition of Done

A localization implementation is considered **DONE** only if it is:

- ✅ **Fully Internationalized:** 0% hardcoded user strings in codebase.
- ✅ **Scalable:** Easily extensible to new locales via resource files.
- ✅ **Maintainable:** Strongly typed key mappings (`TypeScript` schema checking).
- ✅ **Consistent:** Uniform terminology across all screens.
- ✅ **Testable:** Verified against text overflow and missing keys in CI.
- ✅ **Accessible:** Screen-reader friendly with proper ARIA attributes.
- ✅ **Fully Aligned with LUPER Standards:** Compliant with `AGENTS.md` and `RULES/localization_rules.md`.

*This document defines the permanent localization and internationalization standards for the LUPER project.*
