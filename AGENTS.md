# Project Rules & Guidelines

## 1. Project Overview
- **Purpose:** Windows Operating System Optimization Application.
- **Architecture:** React + TypeScript for web preview. Electron + Node.js will be used for the final build.
- **Data Flow:** All data will strictly be fetched from the Electron environment (via IPC to native Windows APIs or PowerShell). Mock data will NOT be used in the web environment; if data cannot be fetched, the UI must gracefully indicate a passive/error state. ABSOLUTELY NO MOCK DATA in production (except when the `VITE_USE_MOCKS` flag is active in development).

## 2. Design Language (Design & UI)
- **Concept:** Confident, elite, smooth, and premium. A sleek identity that brings the precision of Apple/macOS interfaces to the Windows environment with highly fluid transitions. Dark mode focus, utilizing elegant anthracite/dark gray tones instead of pure black.
- **Materials & Textures:** Soft curves (`rounded-2xl`, `rounded-3xl`), smooth dark backgrounds (`#1c1c1e`, `#121214`), ultra-thin elegant borders (`border-white/5` or `border-white/10`), and solid card designs.
- **Animations:** Spring-based, ultra-smooth, fluid, and natural micro-interactions using Framer Motion. Heavy animations and blur effects must have a fallback design to be isolated/disabled for low-end devices.
- **Color Palette:** Rich dark tones (Anthracite / Charcoal). Primary text colors are light gray/white (`#f5f5f7`) and secondary text is (`#86868b`). Avoid excessive RGB/colorful icons; accents must be subtle and measured.
- **Typography:** Use `Helvetica Neue`, `Helvetica`, or the OS's native sans-serif fonts for flawless readability and a sharp, grounded look. Hierarchy will be maintained through varying weights, color tones, and modern spacing.

## 3. Coding Standards
- **Language:** TypeScript + React (Functional components and hooks).
- **Type Safety:** TypeScript must strictly follow `strict: true` standards. The use of `any` is strictly prohibited; use explicit typing or `unknown` with type narrowing instead.
- **Style:** Tailwind CSS. Instead of hardcoding theme colors (e.g., `#1a5efd`), they must be converted into centralized variables within the Tailwind v4 `@theme` block (e.g., `bg-brand-primary`).
- **Modularity & File Structure:** Every module and category (e.g., Dashboard, Optimization, Network, etc.) must reside in its own separate file and operate in isolation.
- **Clean Code:** 
  - Unused imports, unused React hooks, or unused variables are strictly forbidden in production code.
  - Debugging `console.log` statements and commented-out (dead) code blocks must be deleted.
  - Temporary script files like `fix_*.js` or `update_*.js` left in the root directory **must be deleted** immediately after their job is done.
- **Icons:** Only the `lucide-react` library will be used. Unless denoting specific meanings like warnings or success, icons will be colorless/blue-accented by default to avoid an unnecessary jumble of colors.

## 4. Performance & Cohesion
- **Minimum Resource Consumption:** The program must run exceptionally smooth, fast, and stable. CPU, GPU, and RAM consumption will be kept to an absolute minimum. Avoid unnecessary animation loops or unoptimized re-renders.
- **React Optimization:**
  - Purely presentational components (cards, badges, icons) MUST be wrapped in `React.memo()` to prevent unnecessary re-renders.
  - Inline functions or complex derived states passed as props MUST be wrapped and protected using `useCallback` and `useMemo`.
  - Rarely used heavy components (e.g., ChangelogModal, secondary pages) must be lazy-loaded using `React.lazy()` and `<Suspense>`.
- **Error Boundaries:** The main component tree must be wrapped in a global Error Boundary. If a module crashes, a "white-screen of death" must not occur; instead, an elite-designed "Something went wrong" fallback card should be displayed.
- **Sense of Cohesion:** Even though categories, pages, fonts, icons, and components live in independent files, they must blend seamlessly in design, maintaining the feel of a "singular, professional Windows application."

## 5. Service Architecture (Data Flow)
- **Interface Layer:** UI components do not generate data directly. All system read/write operations must go through a dedicated service layer (e.g., `src/services/SystemEngine.ts`).
- **Real Data Requirement:** 
  - Mock data can ONLY run from an isolated folder (`src/mocks`) when the `VITE_USE_MOCKS=true` flag is active in the `.env` file. Mock data must NEVER pollute the production service logic (`SystemEngine.ts`).
  - Temporary delays (Promise/setTimeout) or non-functional (dummy) buttons are strictly prohibited. Every button or card must trigger a real function or Windows API call.
- **Strict Addition Constraint:** Unless explicitly requested by the user, NO new categories, cards, background processes, functions, or UI elements will be added. The development process advances step-by-step strictly according to the user's directives.
- **Silent Background Execution:** All optimization and system operations will run silently in the background via Node.js/Electron. No non-UI screens like Command Prompt (CMD), PowerShell windows, or system notifications will be shown to the user. Furthermore, technical codes, scripts, or terminal logs will NEVER be displayed on the app interface; results will only be communicated via user-friendly messages and UI elements.
- **IPC Architectural Standards:**
  - All Electron `ipcRenderer.invoke` calls MUST be wrapped with a Promise Timeout mechanism (e.g., 5000ms) and include try/catch error handling to prevent the React frontend from hanging indefinitely.
  - IPC channel names must be strictly typed as TypeScript enums or strict string literal unions (e.g., `type IpcChannel = 'window-minimize'`) to prevent errors.
- **User-Friendly Explanations (Zero Code Visibility):** Optimization cards or details will absolutely NOT contain registry paths (e.g., `HKEY_LOCAL_MACHINE\...`), PowerShell commands, or technical script contents. Only brief, concise, and functional explanations in a language the user can easily understand will be used.

## 6. Deployment & Auto-Update
- **CI/CD:** The project is planned to be automatically built via GitHub Actions (Workflows) and published to GitHub Releases whenever code is pushed.
- **Auto-Update:** An infrastructure aiming to silently download and install newly published GitHub Releases in the background using `electron-updater` in the Electron environment is targeted. This feature will be integrated in later stages when the Electron project is bootstrapped.

*(Note: This file will be updated by AI as new rules are added. If a conflicting rule is detected, the user will be notified.)*
