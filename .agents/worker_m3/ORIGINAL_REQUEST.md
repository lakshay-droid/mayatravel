## 2026-07-04T07:54:00Z
Implement Milestone 3 (Efficiency & Performance Sweep) on the codebase.
Your working directory is /Users/B0338394/Desktop/maya-travel/.agents/worker_m3/.
You must implement the following optimizations:

1. **Attraction Rating Flicker Fix (`src/components/explore/AttractionCard.tsx`)**:
   - The rating is currently generated using `(Math.random() * 0.8 + 4.0).toFixed(1)` during render, which causes the rating to flicker on every render.
   - Replace this with a deterministic calculation. For example, compute a stable rating based on the attraction's name or ID (e.g. hash the name or use character codes modulo operations to generate a float between 4.0 and 4.9).
   - Move the static `categoryColors` map outside of the component's body.
   - Wrap the `AttractionCard` component in `React.memo` (and use appropriate type exports).

2. **LocalStayCard Performance Optimization (`src/components/cards/LocalStayCard.tsx`)**:
   - Wrap the `LocalStayCard` component in `React.memo` to optimize rendering inside lists and horizontal scroll components.

3. **Lifting Static Declarations Outside Render Blocks**:
   - In `src/components/ui/Button.tsx`: Move the static `variantStyles` and `sizeStyles` mappings outside of the component render function.
   - In `src/components/ui/Badge.tsx`: Move the static `variants` style mapping outside of the component render function.
   - In `src/components/ui/Modal.tsx`: Move the static `sizeWidths` mapping outside of the component render function.
   - In `src/components/stories/StoryModal.tsx`: Move the static `tabs` array outside of the component render function.

After making the edits:
- Run the linter (`npm run lint`), TypeScript build (`npm run build`), and the Vitest suite (`npm test`).
- Ensure everything compiles cleanly and all 32 unit tests pass.
- Write a report of your changes and test/build verification results to `/Users/B0338394/Desktop/maya-travel/.agents/worker_m3/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
