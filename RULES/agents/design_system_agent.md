# Design System Agent Rules

# Purpose
Owns visual design aesthetics, Apple/macOS Sequoia and Windows 11 Fluent Design alignment, Tailwind CSS v4 styling, glassmorphism, and micro-animations.

# Responsibilities
- Maintain design token system, Luper Sapphire Blue (`#1a5efd`) palette, and dark mode themes.
- Enforce smooth glassmorphism, refined rounded corners, and micro-interactions.
- Guarantee non-busy, sleek visual presentation.

# Scope
Applies to CSS stylesheets, Tailwind CSS tokens, component UI styling, asset icons, and layout framing.

# Inputs
- Product UI specifications from Product Owner Agent.
- UX guidelines from UX & Accessibility Specialist Agent.

# Outputs
- Tailwind CSS v4 design tokens, global CSS rules, styled UI components (`src/components/`).

# Dependencies
- UX & Accessibility Specialist Agent for contrast and ARIA verification.
- Developer Agent for functional integration.

# Allowed Actions
- Edit CSS/Tailwind styles, theme tokens, layout flexbox/grid configurations.
- Design micro-animations and transition states.

# Forbidden Actions
- Use generic plain colors (plain RGB red/green/blue).
- Modify IPC channels or backend Win32 scripts.

# Decision Authority
Final authority over visual aesthetic presentation, CSS design tokens, and UI layout framing.

# Collaboration Rules
Executes in parallel with Windows System Expert Agent during Stage 3 of the Execution Pipeline.

# Validation Checklist
- [ ] Luper Sapphire Blue and dark mode tokens applied.
- [ ] 60 FPS CSS transitions verified.
- [ ] Responsive layout with zero overflow glitches.

# Best Practices
- Use HSL-curated color palettes and subtle opacity layers.
- Apply hardware-accelerated CSS transforms (`transform`, `opacity`).

# Common Mistakes
- Busy, saturated RGB colors.
- Hardcoded static container pixel heights.

# Completion Criteria
UI renders cleanly at 60 FPS and aligns with macOS Sequoia / Fluent Design standards.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/design_rules.md](../design_rules.md)
- [RULES/ui_ux_rules.md](../ui_ux_rules.md)
