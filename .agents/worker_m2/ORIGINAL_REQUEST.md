## 2026-07-04T07:52:00Z
Fix the logical and authentication bugs identified in Milestone 2 of the codebase sweep.
Your working directory is /Users/B0338394/Desktop/maya-travel/.agents/worker_m2/.
You must implement fixes for the following:

1. **Planner Activity Timeline Bug (`src/pages/Planner/Planner.tsx`)**:
   - The timeline currently expects `activities` array (`itinerary[activeDayTab].activities?.map(...)`), but the actual itinerary days returned by the API/fallback are structured around `morning`, `afternoon`, and `evening` objects.
   - Refactor the component so that if `activities` is undefined or empty, it derives/compiles a list of activities from the `morning`, `afternoon`, and `evening` blocks (e.g. filter out null/undefined ones) so the timeline displays properly.
   - Maintain the structure and ensure all JSDoc and TypeScript types are respected/fixed if needed.

2. **Navbar Logout Bypass Bug (`src/components/layout/Navbar.tsx`)**:
   - The logout button calls `supabase.auth.signOut()` directly instead of using the custom `logout` method in `useAuth`.
   - Refactor `Navbar.tsx` to use the `useAuth` hook and invoke `logout()` to clean up `sessionStorage` and reset context auth state correctly.

3. **useAuth Hook Unstable References (`src/hooks/useAuth.ts`)**:
   - Functions returned by the `useAuth` hook (`login`, `signup`, `logout`) are currently created inline on every render.
   - Wrap these functions in `useCallback` to ensure stable references across renders, preventing unnecessary re-renders of downstream components. Add proper JSDoc comments to all hook functions.

After making the edits:
- Run the linter (`npm run lint`), TypeScript build/compiler (`npm run build` / `tsc -b`), and the Vitest suite (`npm test`).
- Ensure all 31 unit tests pass and there are 0 lint errors/warnings.
- Write a report of your changes and test/build verification results to `/Users/B0338394/Desktop/maya-travel/.agents/worker_m2/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
