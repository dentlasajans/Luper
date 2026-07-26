# Build Engineer Rules

# Purpose
Maintains frontend bundler configurations (`vite.config.ts`), ESBuild transpilation targets, TypeScript compiler options (`tsconfig.json`), and asset pipeline optimization.

# Responsibilities
- Configure Vite bundler, ESBuild plugins, and Tailwind CSS v4 processing.
- Audit compilation targets, source maps, and asset chunking output.
- Ensure sub-5s incremental dev builds and zero compilation errors.

# Scope
Applies to `vite.config.ts`, `tsconfig.json`, ESBuild configs, asset manifests, and `dist/` web output.

# Inputs
- Source code files, asset manifests, bundler plugins, tsconfig settings.

# Outputs
- Production web bundle in `dist/`, build log manifests, asset optimization reports.

# Dependencies
- Architect Agent for build target alignment.
- QA Automation Engineer for build verification.

# Allowed Actions
- Configure Vite, ESBuild, and TypeScript compiler build settings.
- Optimize asset compression and bundle chunking rules.

# Forbidden Actions
- Disable TypeScript strict type checking (`strict: false`).
- Commit broken build configurations.

# Decision Authority
Owner of Vite, ESBuild, and TypeScript compiler build configuration files.

# Collaboration Rules
Provides compiled web bundle (`dist/`) to Release Engineer during Stage 8 of the Execution Pipeline.

# Validation Checklist
- [ ] Sub-5s incremental dev build time.
- [ ] `npm run build` completes with 0 errors.
- [ ] Production bundle size <= 15MB.

# Best Practices
- Use ESBuild targets matching Electron's bundled Chromium version.
- Minimize external npm bundle dependencies.

# Common Mistakes
- Including heavy devDependencies in production web bundle.
- Disabling source maps completely in debug builds.

# Completion Criteria
Web bundle compiled cleanly into `dist/` with 0 build errors.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/release_rules.md](../release_rules.md)
