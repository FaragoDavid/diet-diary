import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';
import type { Day } from '../types/day';

export const MOCK_INGREDIENTS: Ingredient[] = [
  {
    id: 'ing-1',
    name: 'Csirkemell',
    caloriesPer100: 165,
    carbsPer100: 0,
    fatPer100: 3.6,
    isVegetable: false,
    carbLimit: 0,
  },
  {
    id: 'ing-2',
    name: 'Brokkoli',
    caloriesPer100: 34,
    carbsPer100: 7,
    fatPer100: 0.4,
    isVegetable: true,
    carbLimit: 0,
  },
  {
    id: 'ing-3',
    name: 'Rizs',
    caloriesPer100: 130,
    carbsPer100: 28,
    fatPer100: 0.3,
    isVegetable: false,
    carbLimit: 10,
  },
  {
    id: 'ing-4',
    name: 'Olivaolaj',
    caloriesPer100: 884,
    carbsPer100: 0,
    fatPer100: 100,
    isVegetable: false,
    carbLimit: null,
  },
  {
    id: 'ing-5',
    name: 'Spenót',
    caloriesPer100: 23,
    carbsPer100: 3.6,
    fatPer100: 0.4,
    isVegetable: true,
    carbLimit: 0,
  },
  {
    id: 'ing-6',
    name: 'Tojás',
    caloriesPer100: 155,
    carbsPer100: 1.1,
    fatPer100: 11,
    isVegetable: false,
    carbLimit: 0,
  },
  {
    id: 'ing-7',
    name: 'Paradicsom',
    caloriesPer100: 18,
    carbsPer100: 3.9,
    fatPer100: 0.2,
    isVegetable: true,
    carbLimit: 0,
  },
  {
    id: 'ing-8',
    name: 'Túró',
    caloriesPer100: 98,
    carbsPer100: 3.4,
    fatPer100: 4.3,
    isVegetable: false,
    carbLimit: 0,
  },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Csirkemell brokkolival',
    calories: 299,
    carbs: 7,
    fat: 8,
    amount: 400,
    servings: 2,
    baseRecipeId: null,
    ingredients: [
      { ingredientId: 'ing-1', name: 'Csirkemell', amount: 200 },
      { ingredientId: 'ing-2', name: 'Brokkoli', amount: 150 },
      { ingredientId: 'ing-4', name: 'Olivaolaj', amount: 10 },
    ],
  },
  {
    id: 'rec-2',
    name: 'Túrós tészta',
    calories: 420,
    carbs: 45,
    fat: 12,
    amount: 350,
    servings: 1,
    baseRecipeId: null,
    ingredients: [
      { ingredientId: 'ing-8', name: 'Túró', amount: 200 },
      { ingredientId: 'ing-6', name: 'Tojás', amount: 50 },
    ],
  },
  {
    id: 'rec-3',
    name: 'Spenótos rizs',
    calories: 310,
    carbs: 58,
    fat: 2,
    amount: 300,
    servings: 1,
    baseRecipeId: null,
    ingredients: [
      { ingredientId: 'ing-3', name: 'Rizs', amount: 200 },
      { ingredientId: 'ing-5', name: 'Spenót', amount: 100 },
    ],
  },
  {
    id: 'rec-4',
    name: 'Csirkés rizstál',
    calories: 609,
    carbs: 65,
    fat: 10,
    amount: 700,
    servings: 2,
    baseRecipeId: null,
    ingredients: [
      { ingredientId: 'rec-3', name: 'Spenótos rizs', amount: 300 },
      { ingredientId: 'ing-1', name: 'Csirkemell', amount: 400 },
    ],
  },
];

export const MOCK_DAYS: Day[] = [
  {
    id: '2026-05-22',
    date: '2026-05-22',
    meals: [
      {
        type: 'morningSnack',
        dishes: [{ id: 'd-0', name: 'Túró', amount: 150, calories: 147, carbs: 5.1, fat: 6.5, recipeId: null, ingredientId: 'ing-8' }],
      },
      {
        type: 'breakfast',
        dishes: [
          { id: 'd-1', name: 'Tojás', amount: 150, calories: 232, carbs: 1.7, fat: 16.5, recipeId: null, ingredientId: 'ing-6' },
          { id: 'd-2', name: 'Rizs', amount: 80, calories: 104, carbs: 22.4, fat: 0.2, recipeId: null, ingredientId: 'ing-3' },
        ],
      },
      {
        type: 'lunch',
        dishes: [
          {
            id: 'd-3',
            name: 'Csirkemell brokkolival',
            amount: 400,
            calories: 299,
            carbs: 7,
            fat: 8,
            recipeId: 'rec-1',
            ingredientId: null,
          },
          { id: 'd-4', name: 'Rizs', amount: 150, calories: 195, carbs: 42, fat: 0.5, recipeId: null, ingredientId: 'ing-3' },
        ],
      },
      {
        type: 'afternoonSnack',
        dishes: [{ id: 'd-5a', name: 'Túró', amount: 200, calories: 196, carbs: 6.8, fat: 8.6, recipeId: null, ingredientId: 'ing-8' }],
      },
      {
        type: 'dinner',
        dishes: [
          { id: 'd-5', name: 'Csirkemell', amount: 200, calories: 330, carbs: 0, fat: 7.2, recipeId: null, ingredientId: 'ing-1' },
          { id: 'd-6', name: 'Spenótos rizs', amount: 300, calories: 310, carbs: 58, fat: 2, recipeId: 'rec-3', ingredientId: null },
        ],
      },
      {
        type: 'lateNightSnack',
        dishes: [{ id: 'd-6a', name: 'Túró', amount: 100, calories: 98, carbs: 23, fat: 4.3, recipeId: null, ingredientId: 'ing-8' }],
      },
    ],
  },
  {
    id: '2026-05-21',
    date: '2026-05-21',
    meals: [
      {
        type: 'breakfast',
        dishes: [
          { id: 'd-7', name: 'Tojás', amount: 200, calories: 310, carbs: 2.2, fat: 22, recipeId: null, ingredientId: 'ing-6' },
          { id: 'd-7a', name: 'Rizs', amount: 100, calories: 130, carbs: 28, fat: 0.3, recipeId: null, ingredientId: 'ing-3' },
        ],
      },
      {
        type: 'lunch',
        dishes: [
          { id: 'd-8', name: 'Spenótos rizs', amount: 300, calories: 310, carbs: 58, fat: 2, recipeId: 'rec-3', ingredientId: null },
          { id: 'd-9', name: 'Csirkemell', amount: 150, calories: 248, carbs: 0, fat: 5.4, recipeId: null, ingredientId: 'ing-1' },
        ],
      },
      {
        type: 'dinner',
        dishes: [
          { id: 'd-9a', name: 'Túrós tészta', amount: 350, calories: 420, carbs: 45, fat: 12, recipeId: 'rec-2', ingredientId: null },
        ],
      },
    ],
  },
  {
    id: '2026-05-20',
    date: '2026-05-20',
    meals: [
      {
        type: 'lunch',
        dishes: [
          {
            id: 'd-10',
            name: 'Csirkemell brokkolival',
            amount: 400,
            calories: 299,
            carbs: 7,
            fat: 8,
            recipeId: 'rec-1',
            ingredientId: null,
          },
          { id: 'd-11', name: 'Rizs', amount: 100, calories: 130, carbs: 28, fat: 0.3, recipeId: null, ingredientId: 'ing-3' },
        ],
      },
      {
        type: 'dinner',
        dishes: [
          { id: 'd-12', name: 'Csirkemell', amount: 200, calories: 330, carbs: 0, fat: 7.2, recipeId: null, ingredientId: 'ing-1' },
          { id: 'd-13', name: 'Brokkoli', amount: 200, calories: 68, carbs: 14, fat: 0.8, recipeId: null, ingredientId: 'ing-2' },
        ],
      },
    ],
  },
];
