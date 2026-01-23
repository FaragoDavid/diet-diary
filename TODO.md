# Technical Debt and Future Improvements

## High Priority

### Replace ingredient/recipe dropdowns with autocomplete

**Problem**: With thousands of ingredients and hundreds of recipes, dropdown lists load all options upfront causing:

- Large DOM size (thousands of `<option>` elements)
- High memory usage
- Poor UX (scrolling through huge lists)
- Database over-fetching (loading all ingredients/recipes even when only 1 is selected)

**Affected components**:

- `src/components/meals/new-dish.tsx` - Add dish form (loads all ingredients + recipes)
- `src/components/recipes/new-recipe-ingredient.tsx` - Add ingredient to recipe form (loads all ingredients)

**Solution**: Replace `<select>` with autocomplete input that:

- Fetches filtered results on user input (e.g., `/api/ingredients?query=tom` returns only matching)
- Limits results to 10-20 items
- Uses debouncing to reduce API calls
- Only loads data when user starts typing

**Controllers to update**:

- `src/controllers/meal/add-dish.ts` - Remove fetchIngredients/fetchRecipes, add search endpoint
- `src/controllers/recipe/add-ingredient.ts` - Remove fetchIngredients, add search endpoint

**Estimated impact**: With 2000 ingredients, reduces data transfer from ~200KB to ~2KB per page load
