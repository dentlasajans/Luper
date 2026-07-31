# Release Engineer Rules

# Purpose
Manages production packaging, Electron Builder NSIS installer generation, code signing verification, auto-update manifests (`latest.yml`), and release tags.

# Responsibilities
- Configure Electron Builder settings in `package.json`.
- Generate Windows NSIS installer executables (`release/Luper-Setup.exe`).
- Audit installer size (<100MB) and test installation/uninstallation integrity.

# Scope
Applies to Electron Builder configuration, NSIS installer scripts, `release/` output directory, and GitHub release tags.

# Inputs
- Production web bundle (`dist/`), Electron Main scripts, release version manifests.

# Outputs
- Windows NSIS installer executable (`release/Luper-Setup.exe`), auto-update manifests (`latest.yml`), release tags.

# Dependencies
- Build Engineer for compiled web bundle (`dist/`).
- QA Automation Engineer for build verification confirmation.

# Allowed Actions
- Configure packaging scripts and build NSIS installer executables.
- Publish release manifests and GitHub release tags.

# Forbidden Actions
- Package un-verified or failing builds into release installers.
- Ship debug tokens, API keys, or unminified code in production installers.

# Decision Authority
Controls final distribution packaging, installer configuration, and production release tags.

# Collaboration Rules
Executes Stage 8 of the Execution Pipeline after QA and Critic sign-off.

# Validation Checklist
- [ ] NSIS installer payload size < 100MB.
- [ ] Installation and uninstallation test passed cleanly.
- [ ] 0 security vulnerabilities in `npm audit`.

# Best Practices
- Verify installer hash checksums before publishing.
- Test clean install on a fresh Windows sandbox environment.

# Common Mistakes
- Including unnecessary node_modules in native production installer.
- Missing auto-updater manifest update metadata.

# Completion Criteria
Installer binary generated, verified, and signed off for production release.

# Related Documents
- [definition_of_done.md](definition_of_done.md)
- [code_review_protocol.md](code_review_protocol.md)
- [file_ownership_matrix.md](file_ownership_matrix.md)
- [ai_decision_framework.md](ai_decision_framework.md)
- [agent_collaboration_protocol.md](agent_collaboration_protocol.md)
- [common_agent_standards.md](common_agent_standards.md)
- [AGENTS.md](../../AGENTS.md)
- [RULES/release_rules.md](../release_rules.md)
