# React + Firestore Migration Plan

## Architecture: Client-side Firebase app

This is a **pure client-side application** with no backend server:

- React frontend queries Firestore directly
- Firebase Auth handles user authentication
- Firestore security rules enforce user data isolation (read/write only own data)
- Static deployment (GitHub Pages, Vercel, Netlify, etc.)

No Fastify, no PostgreSQL, no backend repositories needed.

## Firestore data model

Collections are scoped under the authenticated user's UID:

```
/users/{uid}/ingredients/{id}
/users/{uid}/recipes/{id}
/users/{uid}/days/{id}         ← meals are subcollections or embedded
```

Firestore security rules: allow read/write only if `request.auth.uid == userId`.

## Phase 0: Setup

### Bundling (via Vite)

- [x] Add Vite + @vitejs/plugin-react for JSX compilation
- [x] Create `src/client/index.html` with `<script type="module" src="/main.tsx">`
- [x] Create `src/client/main.tsx` entry point: imports React, ReactDOM, App, mounts to `#root`
- [x] Configure `vite.config.ts`:
  - Root: `src/client/`
  - Output: `dist/client/`
  - Base path: configurable (prod: `/diet-diary/` or custom domain, dev: `/`)
  - Public assets: `public/`
- [x] Update `.gitignore` to include `dist/` and `node_modules/`

### Dependencies & Config

- [x] Add React 19, React DOM, React Router
- [x] Add `firebase` npm package for client
- [x] Configure TypeScript for React JSX
- [x] Add `.env.example` with `VITE_FIREBASE_API_KEY`

### Services

- [x] Create `src/client/services/firebase.ts` — initialize Firebase app + Firestore
- [x] Create `src/client/services/auth.ts` — `useAuth` hook, `signIn`, `signOut` (Google popup)
- [x] Create `src/client/App.tsx` and placeholder components (Login, Dashboard)

### Cleanup

- [ ] Remove Fastify and related dependencies (`@fastify/*`, `@prisma/client`, `prisma`)
- [ ] Remove Prisma schema and migrations
- [ ] Remove backend-only files (controllers, routes, middleware, services)
- [ ] Delete `src/server.ts`

## Phase 1: Login Page

- [x] Refine React login page component (Google OAuth button, error handling)
- [x] Wire up `signIn()` / `signOut()` from `auth.ts`
- [x] Protect app routes: redirect to login if `useAuth()` returns `null`
- [x] Dev mode mock user (set when `import.meta.env.DEV`)
- [x] Add sign-out button to Dashboard
- [ ] Update E2E tests for login flow

## Phase 2: Ingredients Page

- [x] Build Firestore service: `createIngredient`, `fetchIngredients`, `updateIngredient`, `deleteIngredient`
- [x] Design Firestore queries for `/users/{uid}/ingredients`
- [x] Build React components: ingredient list, ingredient details, ingredient form
- [x] Implement search/filter with debounced Firestore queries
- [x] **[TODO: Replace dropdowns with autocomplete]** — Build autocomplete component, limit results to 10-20 items
- [ ] **[New: Ingredient substitutions]** — Add optional `substitutes` field (e.g., spinach → kale)
- [x] **[New: Ingredient availability]** — Add `inStock` boolean, filter by availability
- [ ] Update E2E tests

## Phase 3: Recipes Page

- [x] Build Firestore service: `createRecipe`, `fetchRecipes`, `updateRecipe`, `deleteRecipe`, ingredient management
- [x] Design Firestore queries for `/users/{uid}/recipes`
- [x] Build React components: recipe list, recipe details, recipe ingredient list, recipe form
- [x] Handle real-time updates via Firestore listeners (or re-fetch after mutations)
- [ ] **[TODO: Weight-aware nutrition calculation]** — Fix nutrition to support weight-based portions:
  - Calculate (dishAmount / recipe.amount) \* totalNutrition
  - Show units in UI: "100 g" vs "1.5 servings"
  - Fallback to multiplier if recipe.amount is null
- [ ] Update E2E tests

## Phase 4: Meals Page

- [x] Build Firestore service: `createDay`, `fetchDays`, `addMeal`, `addDish`, etc.
- [x] Design Firestore queries for `/users/{uid}/days` (meals, dishes as embedded arrays)
- [x] Build React components: day list, day detail, meal section, dish items, new day form
- [ ] **[New: Per-meal ingredient weight recording]** — Record actual weights used per ingredient:
  - Store `actualWeight` per ingredient per dish
  - Recalculate nutrition based on actual vs. recipe weights
  - Support ingredient substitutions
- [ ] Update E2E tests

## Phase 5: Dashboard & Shopping

- [x] Build Firestore queries for aggregations (nutrition stats, weekly summaries)
- [x] Build React components: tab navigation, stats, tab content panels
- [x] Wire up client-side routing between tabs
- [x] **[New: Weekly ingredient aggregation]** — View for selected date range:
  - Sum ingredient quantities (e.g., 1500g chicken total)
  - Show breakdown by recipe/day
  - Support filtering by meal type
- [x] **[New: Shopping list generation]** — Exportable shopping list:
  - Aggregates ingredients for week/custom range
  - Marks in-stock vs. out-of-stock
  - Copy to clipboard export
- [ ] Update E2E tests

## Phase 6: Cleanup & Deployment

### Cleanup

- [x] Remove all backend code:
  - Delete `src/server.ts`, `src/controllers/`, `src/routes/`, `src/middleware/`
  - Delete old `src/services/`, `src/repository/` (replaced by inline Firestore services)
  - Delete old `src/utils/` (prisma-client, etc.)
- [x] Remove backend dependencies from package.json (Fastify, Prisma, OAuth, session, etc.)
- [x] Remove Prisma migrations directory
- [x] Remove old HTML templates, Alpine.js, HTMX, typed-html
- [x] Update `.gitignore` (remove dist/server references, keep dist/client)

### Deployment

- [x] Build script: `npm run build` outputs to `dist/client/`
- [ ] Set up GitHub Actions workflow:
  - Trigger: push to main
  - Steps: checkout → setup Node 20 → npm ci → npm run build (with VITE_FIREBASE_API_KEY secret) → deploy
  - Deploy options:
    - **GitHub Pages**: `docs/` directory or gh-pages branch (update vite.config.ts base path)
    - **Vercel**: `npm run build` → auto-deploy `dist/client/`
    - **Netlify**: `npm run build` → auto-deploy `dist/client/`
    - **S3 + CloudFront**: Static hosting with CDN
- [x] Asset hashing configured for cache busting (Vite default)
- [ ] Firestore security rules deployed and tested

## Notes

- Each phase is independently deployable (new React components are added incrementally)
- Component tests use React Testing Library (no server-rendered HTML assertions)
- Firebase API key: set in `.env.development` locally and as CI secret for deployment
- All data access is client-side via Firestore SDKRe-fetch after mutations OR use real-time listeners for live updates
- No CORS issues (Firestore client SDK handles auth)
- Scaling: Firestore handles concurrency, no backend bottleneck

## User Journey Support

This migration plan supports the complete weekly meal planning workflow:

1. **Find recipes** (Phase 3) — Browse existing recipes or create new ones
2. **Add missing ingredients** (Phase 2) — Create new ingredients, track availability
3. **Calculate total ingredients for week** (Phase 5) — Weekly aggregation view sums all ingredients across selected date range
4. **Make shopping list** (Phase 5) — Auto-generate and export shopping list from aggregated ingredients, mark unavailable items for substitution
5. **Alter recipes if unavailable** (Phase 2, 4) — Support ingredient substitutions (spinach → kale) and availability filtering
6. **Cook meals** (Phase 4) — Record actual ingredient weights used per meal (not just recipe default)
7. **Recalculate portions** (Phase 3, 4) — Weight-aware nutrition calculation adjusts for actual vs. recipe weights

## Technical Debt Integration

From `TODO.md` — address during relevant phases:

- **Autocomplete for ingredient/recipe selection** (Phase 2-3) — high priority, improves UX with large datasets
- **Weight-aware nutrition calculation** (Phase 3-4) — fundamental fix needed for accurate meal planning with portion sizes
- **Per-meal ingredient weight recording** (Phase 4) — track actual weights used, support substitutions
- **Ingredient substitutions** (Phase 2) — map alternatives (spinach ↔ kale) with weight adjustments
- **Shopping list generation** (Phase 5) — aggregated, exportable ingredient list with availability tracking
