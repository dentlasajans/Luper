# LUPER Design Governance & Future Scalability Framework

This document outlines the mandatory **Design Governance Architecture** for the LUPER Desktop Application platform. Every human developer and AI agent working on LUPER must strictly adhere to these rules.

---

## 🏛️ 1. Governance Principles

1. **Token Supremacy:** Hardcoded pixel values, hex color strings, or manual CSS box-shadows are strictly forbidden. All visual properties MUST consume centralized tokens in `src/index.css`.
2. **Component Reuse First:** Before creating any new UI element, agents MUST inspect `src/components/ui/` for existing primitive components (`Dialog.tsx`, `Chart.tsx`, `FeedbackState.tsx`, `Icons.tsx`).
3. **Dual-Layer Theme Compliance:** Every component must support both standard dark mode and light / high-contrast modes dynamically via CSS custom properties.
4. **Accessible by Default:** All interactive elements must specify `aria-label`, support full keyboard navigation (`Tab`, `Escape`, `Enter`), and render a visible focus ring (`*:focus-visible`).

---

## 🧩 2. Component Taxonomy & Structure

- **Primitives (`src/components/ui/`):** Generic, un-opinionated UI primitives (e.g., `Dialog`, `MetricCard`, `EmptyState`, `SkeletonLoader`).
- **Domain Modules (`src/components/` & `src/components/tools/`, `src/components/info/`):** Contextual business features (e.g., `Optimization.tsx`, `GamesTools.tsx`, `BenchmarkTools.tsx`).
- **Overlays & Modals (`src/components/`):** Global floating windows (e.g., `CommandPaletteModal.tsx`, `OnboardingModal.tsx`, `ChangelogModal.tsx`).

---

## ⚡ 3. Quality Gate Checklist (Definition of Done)

Before marking any UI task as completed, the following checks MUST be satisfied:

1. [ ] Code compiles 100% cleanly (`npm run build` succeeds in `< 3.0s`).
2. [ ] Zero hardcoded hex colors or arbitrary px gaps.
3. [ ] All animations use motion tokens (`180ms` - `280ms` GPU accelerated).
4. [ ] Reduced motion prefers media query is respected.
5. [ ] Accessibility keyboard navigation (`Tab`, `Enter`, `Escape`) is fully tested.

---

## 🔮 4. Future Module Boilerplate Template

When adding a new feature view to LUPER:

```tsx
import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { EmptyState } from '../ui/FeedbackState';

export const NewFeatureModule = memo(function NewFeatureModule() {
  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Sparkles className="text-[#1a5efd]" size={24} />
            <span>Yeni Özellik Modülü</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Modül açıklaması buraya yazılır.</p>
        </div>
      </div>

      <EmptyState
        title="Modül İçeriği Hazırlanıyor"
        description="Bu modül LUPER tasarım sistemine tam uyumlu olarak yapılandırılmıştır."
      />
    </div>
  );
});
```
