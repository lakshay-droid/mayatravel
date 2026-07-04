# Handoff Report - Milestone 4 Bundle & Chunk Optimization

## 1. Observation
- In `src/pages/Home/Home.tsx`, the `InteractiveMap` component was statically imported at line 8:
  ```typescript
  import { InteractiveMap } from '../../components/map/InteractiveMap';
  ```
- Before optimization, the production build output (`npm run build`) produced a large `Home` bundle:
  ```
  dist/assets/Home-DFUz0oov.js              197.23 kB │ gzip: 60.46 kB
  ```
- The config file `vite.config.ts` was utilizing the `rolldownOptions.output.codeSplitting.groups` configuration block for manual vendor splits:
  ```typescript
  export default defineConfig({
    plugins: [react()],
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](?:react|react-dom|react-router-dom)/,
                priority: 40,
              },
              ...
            ]
          }
        }
      }
    }
  })
  ```
- After optimization, running `npm run build` showed that the `leaflet` package was successfully split out and the `Home` and `InteractiveMap` bundles were minimized:
  ```
  dist/assets/leaflet-CcXJxNtP.css           14.80 kB │ gzip:  6.31 kB
  dist/assets/InteractiveMap-Dve3DD91.js      3.39 kB │ gzip:  1.65 kB
  dist/assets/Home-Crgk0Gql.js               39.66 kB │ gzip: 10.54 kB
  dist/assets/leaflet-C6IhnJyz.js           154.99 kB │ gzip: 48.79 kB
  ```
- Running `npm run lint` and `npm test` succeeded without warnings or errors.

## 2. Logic Chain
- Statically importing `InteractiveMap` in `Home.tsx` caused the bundler to include the heavy `leaflet` package directly in the primary `Home` bundle.
- Refactoring `Home.tsx` to use `React.lazy()` with a Named Export dynamic import `import('../../components/map/InteractiveMap').then(m => ({ default: m.InteractiveMap }))` deferentially loads the component on demand.
- Wrapping the rendering of `InteractiveMap` inside a `<Suspense>` block with the requested fallback UI ensures React handles the loading transition state cleanly.
- Adding a code-splitting group mapping `node_modules[\\/]leaflet` under `rolldownOptions.output.codeSplitting.groups` in `vite.config.ts` ensures that `leaflet` goes into its own dedicated chunk (`leaflet-[hash].js`) instead of being bundled with other lazy component chunks.
- This results in `Home.js` reducing in size from `197.23 kB` to `39.66 kB`, and the lazy-loaded `InteractiveMap.js` file being only `3.39 kB`, drawing the `154.99 kB` `leaflet` dependency only when the map is toggled open.

## 3. Caveats
- The codebase uses Vite 8 with Rolldown as the bundler instead of standard Rollup. The configuration group uses `rolldownOptions` rather than `rollupOptions`.
- Leaflet requires its CSS files to render properly. Lazy loading the component dynamically loads the compiled `leaflet-[hash].css` stylesheet block synchronously with the JS chunk.

## 4. Conclusion
- Milestone 4 optimization has been fully implemented.
- `Home.tsx` lazy loads `InteractiveMap` inside a `<Suspense>` block.
- `leaflet` is successfully split into its own chunk, achieving an initial bundle size reduction of ~80% for the Home page module.
- The build, tests, and linter pass with zero regressions.

## 5. Verification Method
1. **Build Verification**:
   - Run: `npm run build`
   - Inspect build outputs in the console. You should see a dedicated `dist/assets/leaflet-[hash].js` bundle chunk with a size of ~155 kB, and `dist/assets/Home-[hash].js` should be ~39.6 kB.
2. **Lint and Test Verification**:
   - Run: `npm run lint` (uses oxlint, should return 0 warnings/errors)
   - Run: `npm test` (uses vitest, all 32 tests should pass)
