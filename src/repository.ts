import { endOfDay, isSameDay, isWithinInterval } from 'date-fns';
import config from './config.js';

export type Dish = {
  id: string;
  name: string;
  amount: number;
};
export type DishWithMacros = Dish & { calories: number; carbs: number; fat: number };

export type Meal = {
  id: string;
  type: keyof typeof config.mealTypes;
  date: Date;
  dishes: Dish[];
};
export type MealWithDishMacros = Omit<Meal, 'dishes'> & { dishes: DishWithMacros[] };

export type RecipeType = {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  amount?: number;
};

export type RecipeWithIngredientName = Omit<RecipeType, 'ingredients'> & {
  ingredients: RecipeIngredientWithName[];
};

export type RecipeIngredient = {
  id: string;
  amount: number;
};

export type RecipeIngredientWithName = RecipeIngredient & { name: string };

export type Ingredient = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
};

const ingredients: Ingredient[] = [
  { id: '1', name: 'Banana', calories: 89, carbs: 23, fat: 0.3 },
  { id: '2', name: 'Oatmeal', calories: 68, carbs: 12, fat: 1.4 },
  { id: '3', name: 'Milk', calories: 42, carbs: 5, fat: 2 },
  { id: '4', name: 'Apple', calories: 52, carbs: 14, fat: 0.2 },
  { id: '5', name: 'Chicken', calories: 165, carbs: 0, fat: 3.6 },
  { id: '6', name: 'Rice', calories: 130, carbs: 28, fat: 0.3 },
  { id: '7', name: 'Broccoli', calories: 34, carbs: 7, fat: 0.4 },
  { id: '8', name: 'Yogurt', calories: 59, carbs: 5, fat: 3.3 },
  { id: '9', name: 'Salmon', calories: 206, carbs: 0, fat: 13 },
  { id: '10', name: 'Potato', calories: 77, carbs: 17, fat: 0.1 },
  { id: '11', name: 'Asparagus', calories: 20, carbs: 3, fat: 0.2 },
  { id: '12', name: 'Cottage cheese', calories: 98, carbs: 3, fat: 4.3 },
  { id: '13', name: 'kale', calories: 49, carbs: 10, fat: 0.4 },
];

const meals: Meal[] = [
  {
    id: '1',
    type: 'breakfast',
    date: new Date('2024-02-01T08:00:00'),
    dishes: [
      { id: '1', amount: 1, name: 'Banana' },
      { id: '2', amount: 50, name: 'Oatmeal' },
      { id: '3', amount: 200, name: 'Milk' },
    ],
  },
  {
    id: '2',
    type: 'lunch',
    date: new Date('2024-02-01T12:00:00'),
    dishes: [
      { id: '5', amount: 100, name: 'Chicken' },
      { id: '6', amount: 50, name: 'Rice' },
      { id: '7', amount: 100, name: 'Broccoli' },
    ],
  },
  {
    id: '3',
    type: 'dinner',
    date: new Date('2024-02-01T18:00:00'),
    dishes: [
      { id: '9', amount: 100, name: 'Salmon' },
      { id: '10', amount: 100, name: 'Potato' },
      { id: '11', amount: 100, name: 'Asparagus' },
    ],
  },
  {
    id: '4',
    type: 'breakfast',
    date: new Date('2024-02-02T08:00:00'),
    dishes: [
      { id: '1', amount: 1, name: 'Banana' },
      { id: '2', amount: 50, name: 'Oatmeal' },
      { id: '3', amount: 200, name: 'Milk' },
    ],
  },
  {
    id: '5',
    type: 'lunch',
    date: new Date('2024-02-02T12:00:00'),
    dishes: [
      { id: '5', amount: 100, name: 'Chicken' },
      { id: '6', amount: 50, name: 'Rice' },
      { id: '7', amount: 100, name: 'Broccoli' },
    ],
  },
  {
    id: '6',
    type: 'dinner',
    date: new Date('2024-02-02T18:00:00'),
    dishes: [
      { id: '9', amount: 100, name: 'Salmon' },
      { id: '10', amount: 100, name: 'Potato' },
      { id: '11', amount: 100, name: 'Asparagus' },
    ],
  },
  {
    id: '7',
    type: 'breakfast',
    date: new Date('2024-02-03T08:00:00'),
    dishes: [
      { id: '1', amount: 1, name: 'Banana' },
      { id: '2', amount: 50, name: 'Oatmeal' },
      { id: '3', amount: 200, name: 'Milk' },
    ],
  },
  {
    id: '8',
    type: 'lunch',
    date: new Date('2024-02-03T12:00:00'),
    dishes: [
      { id: '5', amount: 100, name: 'Chicken' },
      { id: '6', amount: 50, name: 'Rice' },
      { id: '7', amount: 100, name: 'Broccoli' },
    ],
  },
  {
    id: '9',
    type: 'dinner',
    date: new Date('2024-02-03T18:00:00'),
    dishes: [
      { id: '9', amount: 100, name: 'Salmon' },
      { id: '10', amount: 100, name: 'Potato' },
      { id: '11', amount: 100, name: 'Asparagus' },
    ],
  },
  {
    id: '10',
    type: 'breakfast',
    date: new Date('2024-02-04T08:00:00'),
    dishes: [
      { id: '1', amount: 1, name: 'Banana' },
      { id: '2', amount: 50, name: 'Oatmeal' },
      { id: '3', amount: 200, name: 'Milk' },
    ],
  },
  {
    id: '11',
    type: 'lunch',
    date: new Date('2024-02-04T12:00:00'),
    dishes: [
      { id: '5', amount: 100, name: 'Chicken' },
      { id: '6', amount: 50, name: 'Rice' },
      { id: '7', amount: 100, name: 'Broccoli' },
    ],
  },
  {
    id: '12',
    type: 'dinner',
    date: new Date('2024-02-04T18:00:00'),
    dishes: [
      { id: '9', amount: 100, name: 'Salmon' },
      { id: '10', amount: 100, name: 'Potato' },
      { id: '11', amount: 100, name: 'Asparagus' },
    ],
  },
];

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

export default {
  fetchDayMeals: async (start: Date, end: Date) => {
    end = endOfDay(end);
    return meals.reduce((days, { date: nextMealDate, ...nextMeal }) => {
      if (isWithinInterval(nextMealDate, { start, end })) {
        const mealWithMacros = {
          ...nextMeal,
          dishes: nextMeal.dishes.map((dish) => ({
            ...dish,
            calories: Math.floor((ingredients.find(({ id }) => id === dish.id)!.calories / 100) * dish.amount),
            carbs: Math.floor((ingredients.find(({ id }) => id === dish.id)!.carbs / 100) * dish.amount),
            fat: Math.floor((ingredients.find(({ id }) => id === dish.id)!.fat / 100) * dish.amount),
          })),
        };

        const day = days.find(({ date }) => isSameDay(date, nextMealDate));
        if (!day) days.push({ date: nextMealDate, meals: [mealWithMacros] });
        else day.meals.push(mealWithMacros);
      }
      return days;
    }, [] as { date: Date; meals: Omit<MealWithDishMacros, 'date'>[] }[]);
  },

  fetchDay: async (date: Date): Promise<Meal[]> => {
    return meals.filter((meal) => meal.date.toDateString() === date.toDateString());
  },

  fetchRecipes: async (query: string): Promise<RecipeType[]> => {
    return recipes.filter((recipe) => recipe.name.toLowerCase().includes(query.toLowerCase()));
  },
  fetchRecipe: async (id: string): Promise<RecipeWithIngredientName | undefined> => {
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
  },
  addRecipe: async (name: string, ingredient: RecipeIngredient) => {
    const id = String(Math.max(...recipes.map((recipe) => Number(recipe.id))) + 1);
    recipes.push({ id, name, ingredients: [ingredient] });
    return id;
  },
  updateRecipe: async (id: string, ingredients: RecipeIngredient[]) => {
    const recipe = recipes.find((recipe) => recipe.id === id);
    if (!recipe) return;
    recipe.ingredients = ingredients;
  },
  addRecipeIngredient: async (recipeId: string, ingredientId: string, amount: number) => {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    if (!recipe) return;

    recipe.ingredients.push({ id: ingredientId, amount });
  },
  updateRecipeIngredientAmount: async (recipeId: string, ingredientId: string, amount: number) => {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    if (!recipe) return;

    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.id === ingredientId) {
        ingredient.amount = amount;
      }
    });
  },
  deleteRecipeIngredient: async (recipeId: string, ingredientId: string) => {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    if (!recipe) throw new Error('Recipe not found');

    recipe.ingredients = recipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId);
  },
  updateRecipeAmount: async (recipeId: string, amount: number) => {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    if (!recipe) return;

    recipe.amount = amount;
  },

  fetchIngredients: async (query: string = ''): Promise<Ingredient[]> => {
    return ingredients
      .filter((ingredient) => ingredient.name.toLowerCase().includes(query.toLowerCase()))
      .map((ingredient) => ({
        ...ingredient,
        calories: ingredient.calories / 100,
        carbs: ingredient.carbs / 100,
        fat: ingredient.fat / 100,
      }));
  },
  addIngredient: async (name: string, calories: string, carbs: string) => {
    const id = String(Math.max(...ingredients.map((ingr) => Number(ingr.id))) + 1);
    ingredients.push({ id, name, calories: parseInt(calories), carbs: parseInt(carbs), fat: 0 });
  },
};
