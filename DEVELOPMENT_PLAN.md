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

## Infrastructure

### GitHub Actions CI/CD
- Trigger: push to main
- Steps: checkout → setup Node 20 → npm ci → npm run build (with VITE_FIREBASE_API_KEY secret) → deploy
- Deploy target TBD (GitHub Pages, Vercel, Netlify, or S3 + CloudFront)

### Firestore security rules
- Deploy rules enforcing `request.auth.uid == userId` for all user-scoped collections
- Test rules with Firebase emulator
