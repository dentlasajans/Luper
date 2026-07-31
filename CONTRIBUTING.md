# Contributing to Luper

Thank you for your interest in contributing to Luper!

## Getting Started

1. **Prerequisites:**
   - Node.js v20 or higher is required.
   - Administrator privileges on Windows.

2. **Installation:**
   ```bash
   npm install
   ```

3. **Development Mode:**
   - To run the application in a mocked environment without making actual system changes:
     ```bash
     VITE_USE_MOCKS=true npm run dev
     ```

## AI Agent Ecosystem

This project relies heavily on a specialized AI agent ecosystem. Before making any changes, please refer to the `RULES` directory and `AGENTS.md` for our AI governance and standard practices.

## Guidelines

- All pull requests must pass standard code review protocols.
- Avoid using `.ps1` file drops; use our Named Pipe Native PowerShell engine.
- Write strict TypeScript code with zero `any` casting.
- For UI/UX changes, strictly follow our Apple/macOS Sequoia & Fluent Design standards.
