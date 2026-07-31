# LUPER Permanent Application Performance Standards (`RULES/performance_rules.md`)

This document defines the permanent application performance standards and optimization guidelines for **LUPER** (Commercial Windows Desktop Optimization & Performance Platform built with Electron, Node.js, React 19, TypeScript, and Tailwind CSS v4).

Every AI agent and software engineer must strictly follow these rules. Performance is considered a core product feature across every implementation.

---

# Purpose

Define the permanent performance engineering standards for the entire LUPER desktop application.

In LUPER, performance is not an afterthought—it is treated as a core product feature. Every code implementation must preserve or improve application responsiveness, memory efficiency, rendering speed, and scalability.

---

# Performance Philosophy

LUPER should always feel:

- **Fast:** Sub-100ms startup times and sub-200ms user interaction responses.
- **Responsive:** Instant visual feedback across all UI controls and toggle switches.
- **Smooth:** Locked 60 FPS visual transitions and route changes without micro-stutters.
- **Lightweight:** Stable RAM footprint (under 50MB baseline) and CPU usage near 0% when idle.
- **Predictable:** Execution timing remains consistent without unpredictable latency spikes.
- **Stable:** Zero memory leaks, zero unhandled worker panics over multi-day sessions.

*Never sacrifice performance unnecessarily. Always optimize for user experience, not arbitrary micro-benchmarks.*

---

# General Principles

Always prefer:

- **Efficient Algorithms:** Select optimal algorithmic complexity (`O(1)` or `O(n)` lookups) for state and data processing.
- **Efficient Rendering:** Isolate React rendering trees with `React.memo` and memoized selector hooks.
- **Efficient Resource Usage:** Release unneeded handles, timers, and closures promptly.
- **Predictable Execution:** Non-blocking async execution models across frontend and native Node.js backend layers.
- **Small Memory Footprint:** Keep heap allocations minimal and garbage collection overhead low.
- **Low CPU Usage:** Pause background metric polling when the window is minimized or hidden in the system tray.

> 🛑 **MEASUREMENT RULE:**
> Avoid premature optimization. Always optimize based on measurable profiler impact and empirical benchmark evidence.

---

# Frontend Performance

The React 19 / TypeScript frontend must:

- **Minimize Re-renders:** Wrap presentational components in `React.memo()`, state values in `useMemo`, callbacks in `useCallback`.
- **Lazy Load Large Modules:** Use `React.lazy()` and `<Suspense>` boundaries for dynamic route loading.
- **Keep Components Lightweight:** Atomic presentational components driven strictly by explicit props.
- **Reuse Existing Components:** Check `src/components/` before writing duplicate visual components.
- **Minimize State Updates:** Batch state updates locally to avoid triggering root-level re-renders.
- **Avoid Unnecessary Effects:** Audit `useEffect` dependency arrays to prevent accidental effect loops.

*Rendering must remain locked at 60 FPS even under heavy system telemetry updates.*

---

# Main Process Performance

The Node.js main process must:

- **Minimize Heap Allocations:** Avoid unnecessary object instantiations and array duplications in critical paths.
- **Avoid Blocking Operations:** Execute heavy Win32 or WMI queries in asynchronous Node worker threads or non-blocking child processes.
- **Reuse Resources:** Maintain reusable process handles, regex instances, and Win32 pointers.
- **Prefer Efficient Data Structures:** Select optimal data collections (`Map`, `Set`, `Array`) based on read/write patterns.
- **Minimize Unnecessary Cloning:** Avoid deep data structure cloning in critical execution paths.
- **Handle Concurrency Safely:** Ensure main process event loop ticks are never blocked by heavy execution.

---

# IPC Performance

IPC communication between frontend and backend must be:

- **Minimal:** Keep the frequency of IPC calls low to avoid serialization overhead.
- **Efficient:** Use concise, strongly typed JSON payloads without redundant parameters.
- **Typed:** Strongly typed TypeScript interfaces for IPC handlers and payloads.
- **Batched When Appropriate:** Combine multi-item query requests into single IPC command invocations.

*Avoid unnecessary or redundant IPC polling traffic.*

---

# Memory Management

Always strictly enforce memory lifecycle management:

- **Prevent Memory Leaks:** Clean up closures, subscribers, and state references upon component unmounting.
- **Dispose Unused Resources:** Close native Win32 handles, file descriptors, and COM interfaces immediately after use.
- **Clean Event Listeners:** Remove window resize, tray event, and IPC event listeners on unmount.
- **Release File Handles:** Ensure read/write streams close promptly.
- **Cancel Unused Async Operations:** Abort background polling tasks when view routes change or windows hide.

*Memory footprint must remain flat and stable over extended 24/7 sessions.*

---

# Startup Performance

Application startup path must:

- **Load Only Required Resources:** Load only essential cold-boot dependencies.
- **Delay Non-Essential Work:** Defer non-critical background checks (e.g., auto-updates) until after UI render.
- **Initialize Lazily:** Initialize secondary modules dynamically on first user access.
- **Avoid Unnecessary Blocking:** Keep the main UI thread free of synchronous file I/O or Win32 calls.

*Users must reach the interactive interface as quickly as possible (target sub-100ms cold boot).*

---

# Resource Usage

Continuously audit resource usage across:

- **CPU Usage:** Near 0% when idle or minimized to tray; zero CPU spikes during background polling.
- **Memory Usage:** Baseline RAM footprint under 50MB.
- **Disk Operations:** Asynchronous non-blocking file access for backups and JSON config persistence.
- **IPC Communication:** Low-frequency, compact serialization payloads.
- **Background Work:** Pause background metrics polling when window state is hidden (`window.hide()`).

---

# Scalability

Every codebase implementation must remain performant as:

- The number of optimization categories and system tools expands.
- The volume of system telemetry metrics increases.
- Internal codebase modules grow over time.
- Users operate the application over long, continuous multi-day sessions.

*Avoid brittle architectures that suffer performance degradation as data volume scales.*

---

# Performance Review Checklist

Audit every new feature or refactor against these 8 performance criteria:

- [ ] **Rendering Efficiency:** Are React components memoized with zero unnecessary re-renders?
- [ ] **Memory Usage:** Is baseline RAM footprint kept under 50MB with zero memory leaks?
- [ ] **CPU Usage:** Is idle CPU utilization near 0% when minimized or backgrounded?
- [ ] **Startup Impact:** Does cold boot complete in sub-100ms without blocking synchronous calls?
- [ ] **Bundle Impact:** Is bundle size growth minimized with proper dynamic route splitting?
- [ ] **IPC Efficiency:** Are IPC payloads compact, typed, and non-repetitive?
- [ ] **Resource Cleanup:** Are all event listeners, timers, and native handles cleanly disposed of?
- [ ] **Scalability:** Does the module maintain fast execution under 10x higher data volume?

---

# Things Never Allowed

The following practices are **STRICTLY FORBIDDEN** across LUPER:

- ❌ Blocking the main React UI thread with synchronous calculations or heavy file I/O.
- ❌ Introducing unnecessary background polling intervals (e.g. 100ms timers) without user intent.
- ❌ Duplicating expensive derived calculations in multiple components instead of `useMemo`.
- ❌ Leaking memory, event listeners, or un-closed native Win32 handles.
- ❌ Leaving background metric polling tasks active when the application is minimized to tray.
- ❌ Performing un-memoized rendering on large data collections.
- ❌ Optimizing code blindly without profiler measurements or empirical evidence.

---

# Definition of Done

A feature is considered **PERFORMANCE-COMPLIANT** and ready for release only if it:

- ✅ **Maintains Responsiveness:** Sub-200ms interaction feedback and 60 FPS rendering.
- ✅ **Uses Resources Efficiently:** Baseline RAM under 50MB, near 0% idle CPU.
- ✅ **Introduces No Bottlenecks:** Zero main thread blocking or heavy IPC traffic.
- ✅ **Cleans Up Resources:** 100% leak-free listener, handle, and timer disposal.
- ✅ **Preserves Startup Performance:** Sub-100ms application boot speed maintained.
- ✅ **Scales Predictably:** Handles data volume growth without architectural degradation.
- ✅ **Aligns with LUPER Performance Standards:** Fully compliant with `AGENTS.md` and `RULES/performance_rules.md`.
