# Development Plan

## Features

### Ingredient substitutions

- Add optional `substitutes` field to ingredients (e.g., spinach → kale)
- Support weight adjustments between substitutes
- Integrate with meal planning: suggest alternatives when an ingredient is out of stock

### Weight-aware nutrition calculation

- Calculate `(dishAmount / recipe.amount) * totalNutrition` for accurate per-serving nutrition
- Show units in UI: "100 g" vs "1.5 servings"
- Fallback to multiplier if `recipe.amount` is null

### Per-meal ingredient weight recording

- Store `actualWeight` per ingredient per dish
- Recalculate nutrition based on actual vs. recipe weights
- Support ingredient substitutions in recorded meals

## Testing

### E2E tests

- Login flow
- Ingredients page (CRUD, search, filtering)
- Recipes page (CRUD, ingredient management, nutrition calculation)
- Meals page (day/meal/dish management)
- Dashboard (stats, ingredient aggregation, shopping list)

## Performance

### localStorage cache for Firestore queries

Replace `onSnapshot` real-time listeners with `getDocs` + localStorage cache to avoid redundant Firestore reads. Single-user app where data rarely changes between sessions — most page loads can be served entirely from cache.

**New file: `src/client/services/cache.ts`**

- Generic utility: `readCache<T>(key)`, `writeCache<T>(key, data)`, `clearCache(key)`
- Cache keys: `diet_diary_{collection}_{uid}` (e.g., `diet_diary_ingredients_abc123`)
- Silent try/catch on all localStorage operations (quota errors, etc.)

**Hook changes (all 3 services):**

- Replace `onSnapshot` with `getDocs`
- On mount: try localStorage first → if hit, return immediately; if miss, fetch from Firestore and populate cache
- Return existing `{ items, loading, error }` plus a new `refresh()` function for manual re-fetch
- No consumer component changes required — hook signatures stay compatible

**Write-through on mutations:**

- `create`: Firestore write → append to cache
- `update`: Firestore write → splice in cache
- `delete`: Firestore write → filter from cache

**Implementation order:** `cache.ts` → `ingredients.ts` → `recipes.ts` → `days.ts`

## Infrastructure

### GitHub Actions CI/CD

- Trigger: push to main
- Steps: checkout → setup Node 20 → npm ci → npm run build (with VITE_FIREBASE_API_KEY secret) → deploy
- Deploy target TBD (GitHub Pages, Vercel, Netlify, or S3 + CloudFront)

### Firestore security rules

- Deploy rules enforcing `request.auth.uid == userId` for all user-scoped collections
- Test rules with Firebase emulator
