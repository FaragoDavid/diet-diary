import { ingredients } from './ingredient.js';

export type RecipeIngredient = { id: string; amount: number };

export type RecipeIngredientWithName = RecipeIngredient & { name: string };

export type RecipeType = {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  amount?: number;
};
export type RecipeWithIngredientName = Omit<RecipeType, 'ingredients'> & {
  ingredients: RecipeIngredientWithName[];
};

const recipes: RecipeType[] = [
  {
    id: '1',
    name: 'Banana smoothie',
    ingredients: [
      { id: '1', amount: 1 },
      { id: '3', amount: 1 },
    ],
    amount: 12,
  },
  {
    id: '2',
    name: 'Chicken with rice',
    ingredients: [
      { id: '5', amount: 1 },
      { id: '6', amount: 1 },
      { id: '7', amount: 1 },
    ],
  },
  {
    id: '3',
    name: 'Salmon with potato',
    ingredients: [
      { id: '9', amount: 1 },
      { id: '10', amount: 1 },
      { id: '11', amount: 1 },
    ],
  },
  {
    id: '4',
    name: 'Cottage cheese with kale',
    ingredients: [
      { id: '12', amount: 1 },
      { id: '13', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '5',
    name: 'Oatmeal with apple',
    ingredients: [
      { id: '2', amount: 1 },
      { id: '4', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '6',
    name: 'Yogurt with banana',
    ingredients: [
      { id: '1', amount: 1 },
      { id: '8', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '7',
    name: 'Chicken with broccoli',
    ingredients: [
      { id: '5', amount: 1 },
      { id: '7', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '8',
    name: 'Salmon with asparagus',
    ingredients: [
      { id: '9', amount: 1 },
      { id: '11', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '9',
    name: 'Oatmeal with milk',
    ingredients: [
      { id: '2', amount: 1 },
      { id: '3', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '10',
    name: 'Chicken with potato',
    ingredients: [
      { id: '5', amount: 1 },
      { id: '10', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '11',
    name: 'Salmon with rice',
    ingredients: [
      { id: '9', amount: 1 },
      { id: '6', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '12',
    name: 'Cottage cheese with apple',
    ingredients: [
      { id: '12', amount: 1 },
      { id: '4', amount: 1 },
    ],
    amount: 1,
  },
  {
    id: '13',
    name: 'Yogurt with oatmeal',
    ingredients: [
      { id: '8', amount: 1 },
      { id: '2', amount: 1 },
    ],
    amount: 1,
  },
];

export async function fetchRecipes(query: string): Promise<RecipeType[]> {
  return recipes.filter((recipe) => recipe.name.toLowerCase().includes(query.toLowerCase()));
}

export async function fetchRecipe(id: string): Promise<RecipeWithIngredientName | undefined> {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) return;

  return {
    ...recipe,
    ingredients: recipe.ingredients.map(
      (ingredient) =>
        ({
          ...ingredient,
          name: ingredients.find((ingr) => ingr.id === ingredient.id)!.name,
        } as RecipeIngredientWithName),
    ),
  };
}

export async function addRecipe(name: string, ingredient: RecipeIngredient) {
  const id = String(Math.max(...recipes.map((recipe) => Number(recipe.id))) + 1);
  recipes.push({ id, name, ingredients: [ingredient] });
  return id;
}

export async function updateRecipe(id: string, ingredients: RecipeIngredient[]) {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) return;
  recipe.ingredients = ingredients;
}

export async function addRecipeIngredient(recipeId: string, ingredientId: string, amount: number) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) return;

  recipe.ingredients.push({ id: ingredientId, amount });
}

export async function updateRecipeIngredientAmount(recipeId: string, ingredientId: string, amount: number) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) return;

  recipe.ingredients.forEach((ingredient) => {
    if (ingredient.id === ingredientId) {
      ingredient.amount = amount;
    }
  });
}

export async function deleteRecipeIngredient(recipeId: string, ingredientId: string) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) throw new Error('Recipe not found');

  recipe.ingredients = recipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId);
}

export async function updateRecipeAmount(recipeId: string, amount: number) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) return;

  recipe.amount = amount;
}
