import config from './config.js';

export type Dish = {
  id: string;
  name: string;
  amount: number;
};

export type Meal = {
  id: string;
  type: keyof typeof config.mealTypes;
  date: Date;
  dishes: Dish[];
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: Dish[];
};

export type Ingredient = {
  id: string;
  name: string;
  calories: number;
  CH: number;
  fat: number;
};

const ingredients: Ingredient[] = [
  { id: '1', name: 'Banana', calories: 89, CH: 23, fat: 0.3 },
  { id: '2', name: 'Oatmeal', calories: 68, CH: 12, fat: 1.4 },
  { id: '3', name: 'Milk', calories: 42, CH: 5, fat: 2 },
  { id: '4', name: 'Apple', calories: 52, CH: 14, fat: 0.2 },
  { id: '5', name: 'Chicken', calories: 165, CH: 0, fat: 3.6 },
  { id: '6', name: 'Rice', calories: 130, CH: 28, fat: 0.3 },
  { id: '7', name: 'Broccoli', calories: 34, CH: 7, fat: 0.4 },
  { id: '8', name: 'Yogurt', calories: 59, CH: 5, fat: 3.3 },
  { id: '9', name: 'Salmon', calories: 206, CH: 0, fat: 13 },
  { id: '10', name: 'Potato', calories: 77, CH: 17, fat: 0.1 },
  { id: '11', name: 'Asparagus', calories: 20, CH: 3, fat: 0.2 },
  { id: '12', name: 'Cottage cheese', calories: 98, CH: 3, fat: 4.3 },
  { id: '13', name: 'kale', calories: 49, CH: 10, fat: 0.4 },
];

const meals: Meal[] = [
  {
    id: '1',
    type: 'morningSnack',
    date: new Date('2024-03-07T08:00:00'),
    dishes: [{ id: '1', name: 'Banana', amount: 1 }],
  },
  {
    id: '2',
    type: 'breakfast',
    date: new Date('2024-03-08T10:00:00'),
    dishes: [
      { id: '2', name: 'Oatmeal', amount: 1 },
      { id: '3', name: 'Milk', amount: 1 },
    ],
  },
  {
    id: '3',
    type: 'brunch',
    date: new Date('2024-03-08T12:00:00'),
    dishes: [{ id: '4', name: 'Apple', amount: 1 }],
  },
  {
    id: '4',
    type: 'lunch',
    date: new Date('2024-03-08T14:00:00'),
    dishes: [
      { id: '5', name: 'Chicken', amount: 1 },
      { id: '6', name: 'Rice', amount: 1 },
      { id: '7', name: 'Broccoli', amount: 1 },
    ],
  },
  {
    id: '5',
    type: 'afternoonSnack',
    date: new Date('2024-03-08T16:00:00'),
    dishes: [{ id: '8', name: 'Yogurt', amount: 1 }],
  },
  {
    id: '6',
    type: 'dinner',
    date: new Date('2024-03-08T18:00:00'),
    dishes: [
      { id: '9', name: 'Salmon', amount: 1 },
      { id: '10', name: 'Potato', amount: 1 },
      { id: '11', name: 'Asparagus', amount: 1 },
    ],
  },
  {
    id: '7',
    type: 'lateNightSnack',
    date: new Date('2024-03-08T20:00:00'),
    dishes: [{ id: '12', name: 'Cottage cheese', amount: 1 }],
  },
];

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Banana',
    ingredients: [{ id: '1', name: 'Banana', amount: 1 }],
  },
  {
    id: '2',
    name: 'Oatmeal',
    ingredients: [
      { id: '2', name: 'Oatmeal', amount: 1 },
      { id: '3', name: 'Milk', amount: 1 },
    ],
  },
  {
    id: '3',
    name: 'Apple',
    ingredients: [{ id: '4', name: 'Apple', amount: 1 }],
  },
  {
    id: '4',
    name: 'Chicken with rice and broccoli',
    ingredients: [
      { id: '5', name: 'Chicken', amount: 1 },
      { id: '6', name: 'Rice', amount: 1 },
      { id: '7', name: 'Broccoli', amount: 1 },
    ],
  },
  {
    id: '5',
    name: 'Yogurt',
    ingredients: [{ id: '8', name: 'Yogurt', amount: 1 }],
  },
  {
    id: '6',
    name: 'Salmon with potato and asparagus',
    ingredients: [
      { id: '9', name: 'Salmon', amount: 1 },
      { id: '10', name: 'Potato', amount: 1 },
      { id: '11', name: 'Asparagus', amount: 1 },
    ],
  },
  {
    id: '7',
    name: 'Cottage cheese',
    ingredients: [{ id: '12', name: 'Cottage cheese', amount: 1 }],
  },
];

export default {
  fetchDay: async (date: Date): Promise<Meal[]> => {
    return meals.filter((meal) => meal.date.toDateString() === date.toDateString());
  },
  fetchRecipes: async (query: string): Promise<Recipe[]> => {
    return recipes.filter((recipe) => recipe.name.toLowerCase().includes(query.toLowerCase()));
  },
  fetchIngredients: async (query: string): Promise<Ingredient[]> => {
    return ingredients.filter((ingredient) => ingredient.name.toLowerCase().includes(query.toLowerCase()));
  },
  addIngredient: async (name: string, calories: string, ch: string) => {
    const id = String(Math.max(...ingredients.map((ingr) => Number(ingr.id))) + 1);
    ingredients.push({ id, name, calories: parseInt(calories), CH: parseInt(ch), fat: 0 });
  },
};
