Original prompt: Look through the three-infinite-grid and check what can be wrong with XY and ZY planes. XZ plane works just fine

## 2026-03-03

- Investigated plane rendering path in `lib/three-infinite-grid.ts` and `lib/utils.ts`.
- Implemented a shader-space fix for non-`XZ` planes:
  - Replaced axis/grid coordinate dependency on `positionWorld`.
  - Introduced deterministic plane coordinate mapping from `positionLocal` and `modelWorldMatrix` origin.
  - Kept existing `mesh2Plane` rotations unchanged.
- Updated axis derivative sampling to use 2D plane coordinates directly.

## Validation

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts` passes.
- `npm run build` passes (run with escalated permissions due sandbox EPERM on esbuild spawn).

## Remaining TODO / Follow-up

- Visually verify in browser that:
  - `XY` no longer fills with axis color.
  - `ZY` shows both expected axes (Z and Y).
  - `XZ` remains unchanged.
- Playwright client from skill could not be run in this environment because `playwright` package is not installed.

## 2026-03-03 (follow-up)

- Replaced the previous local-space remap with world-coordinate filtering per plane:
  - `XZ`: `(x, 0, z)`
  - `XY`: `(x, y, 0)`
  - `ZY`: `(0, y, z)`
- Updated grid UV and axis mask sources to use these filtered world coordinates.
- Reused world-coordinate derivatives for axis antialiasing component picks.

## Validation (follow-up)

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts` passes.
- `npm run build` passes (again using escalated permissions due sandbox EPERM on esbuild spawn).

## 2026-03-03 (follow-up 2)

- Removed `cameraAB`-based UV snapping from shader grid sampling.
- `minorUv` now uses `worldAB / scale` directly.
- `majorUv` now uses `worldAB / majorScale` directly.
- Kept world-coordinate plane filtering (`x,0,z` / `x,y,0` / `0,y,z`) and axis logic unchanged.

## Validation (follow-up 2)

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts` passes.
- `npm run build` passes (using escalated permissions due sandbox EPERM on esbuild spawn).

## 2026-03-03 (follow-up 3)

- Added `debugWorldAB` option/property to the grid API.
- Added shader debug branch that renders tiled RG from `fract(worldAB)`.
- Added lil-gui toggle in demo (`Debug worldAB`).
- Updated README usage snippet and debug note.

## Validation (follow-up 3)

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts src/main.ts` passes.
- `npm run build` passes (using escalated permissions due sandbox EPERM on esbuild spawn).

## 2026-03-03 (follow-up 4)

- Added small axis gaps for **minor grid only**.
- Gap size is derived from axis width (`axisHalfWidth * 1.35`) with AA edges.
- Major grid and axis lines remain continuous.

## Validation (follow-up 4)

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts` passes.
- `npm run build` passes (using escalated permissions due sandbox EPERM on esbuild spawn).

## 2026-03-03 (follow-up 5)

- Increased minor-grid axis gap size by 3x.
- Updated gap multiplier from `1.35` to `4.05` (derived from `axisHalfWidth`).

## Validation (follow-up 5)

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts` passes.

## 2026-03-03 (follow-up 6)

- Renamed public minor-line API to match screenshot:
  - `lineWidth` -> `minorLineWidth`
  - `lineColor` -> `minorLineColor`
- Updated demo GUI structure and labels to match screenshot:
  - `Controls`, `Size Settings`, `Color Settings`
  - Axis under `Controls`
  - Minor/major naming aligned with screenshot labels
- Updated README usage and wording for minor-line naming.

## Validation (follow-up 6)

- `npx tsc --noEmit` passes.
- `npx eslint lib/three-infinite-grid.ts src/main.ts` passes.
- `npm run build` passes (using escalated permissions due sandbox EPERM on esbuild spawn).
