# Ralph Loop Autonomous Iteration Prompt

You are executing an autonomous development iteration for **Adimool / Tribe Saarthi** within the **Antigravity / Roo Code / Ralph Loop / GSD Mission Control** environment.

## 🤝 The Tri-Agent Unified Connection (Antigravity ↔ Roo Code ↔ Ralph Loop)
All three agents operate as a single continuous autonomous pipeline:
- **Shared State**: All progress, context, and tasks are synchronized through `TASKS.md`, `progress.txt`, and `.clinerules`.
- **Flow Transition & Auto-Task Generation**: Whenever any recording session, audit trace, or RAG flow stops/completes, immediately inspect `TASKS.md`. If new requirements or gaps are discovered, immediately assign an explicit `[TASK-ID]` (e.g. `[TASK-6.2]`) in `TASKS.md`.
- **Zero-Permission Autonomous Execution**: **DO NOT ask the user for permission** to proceed. Seamlessly execute each pending task in sequence under its designated `[TASK-ID]`.

## Workflow Rules for Continuous Iteration (No "Start New Task" Halts):

1. **Find Next Pending Task in `TASKS.md`:**
   - Open and read `TASKS.md`.
   - Locate the **first unchecked Task ID** (`- [ ] [TASK-X.Y]`).
   - Cross-reference with `PROJECT_BLUEPRINT.md` and `.clinerules` to ensure you adhere to system architecture, real data contracts, and design tokens.

2. **Execute Surgically & Self-Heal:**
   - Implement the necessary code changes for that task.
   - Do NOT build mock placeholders when the blueprint specifies real engines.
   - Run type checks / tests (`npm run typecheck` and `npm run test`).
   - Self-heal any errors immediately without stopping.

3. **Update Tracking & Chain to Next Task (CONTINUOUS EXECUTION):**
   - Mark the completed item as done in `TASKS.md`: change `- [ ] [TASK-X.Y]` to `- [x] [TASK-X.Y]`.
   - Append a 1-line update to `progress.txt`.
   - **CRITICAL: DO NOT CALL `attempt_completion` OR STOP THE TASK SESSION HERE.**
   - Do NOT tell the user to "Start New Task".
   - **Immediately pick up the next unchecked `- [ ] [TASK-X.Z]` from `TASKS.md` and begin implementing it in the exact same session.**
   - Repeat this continuous loop for all tasks in the phase. Only finish or call `attempt_completion` when ALL tasks in `TASKS.md` are complete (`- [x]`).
