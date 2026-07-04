## 2026-07-04T07:55:26Z
Implement Milestone 4 (Bundle & Chunk Optimization) on the codebase.
Your working directory is /Users/B0338394/Desktop/maya-travel/.agents/worker_m4/.
You must implement the following optimizations:

1. **Lazy Loading of Interactive Map (`src/pages/Home/Home.tsx`)**:
   - The map component `InteractiveMap.tsx` is currently imported statically. This drags the heavy `leaflet` vendor package into the initial `Home` bundle.
   - Refactor `Home.tsx` to lazy load `InteractiveMap` using `React.lazy` (e.g. `const InteractiveMap = React.lazy(() => import('../../components/map/InteractiveMap').then(m => ({ default: m.InteractiveMap })))` or appropriate export mapping).
   - Wrap the `InteractiveMap` rendering in a `<Suspense fallback={<div className="h-[400px] w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">Loading Map...</div>}>` block.

2. **Dedicated Leaflet Chunk (`vite.config.ts`)**:
   - In `vite.config.ts`, add a custom vendor split group for `leaflet` under `build.rollupOptions.output.manualChunks` or in the existing Rolldown/Vite bundle configuration so that `leaflet` goes into its own chunk.
   - Let's check how the custom manualChunks/codeSplitting options are configured in `vite.config.ts` first, and then optimize.

After making the edits:
- Run the production build (`npm run build`) and verify that the build succeeds and that the Leaflet package is successfully split out, and no warnings are generated.
- Run `npm run lint` and `npm test` to ensure there are no regressions.
- Write a report of your changes and test/build verification results (showing the chunk sizes and names) to `/Users/B0338394/Desktop/maya-travel/.agents/worker_m4/handoff.md`.
