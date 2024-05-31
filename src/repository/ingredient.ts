import { v4 as uuid } from 'uuid';
import prisma from '../utils/prisma-client.js';

export type Ingredient = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
};

export const ingredients: Ingredient[] = [
  { id: uuid(), name: 'Banana', calories: 89, carbs: 23, fat: 0.3 },
  { id: uuid(), name: 'Oatmeal', calories: 68, carbs: 12, fat: 1.4 },
  { id: uuid(), name: 'Milk', calories: 42, carbs: 5, fat: 2 },
  { id: uuid(), name: 'Apple', calories: 52, carbs: 14, fat: 0.2 },
  { id: uuid(), name: 'Chicken', calories: 165, carbs: 0, fat: 3.6 },
  { id: uuid(), name: 'Rice', calories: 130, carbs: 28, fat: 0.3 },
  { id: uuid(), name: 'Broccoli', calories: 34, carbs: 7, fat: 0.4 },
  { id: uuid(), name: 'Yogurt', calories: 59, carbs: 5, fat: 3.3 },
  { id: uuid(), name: 'Salmon', calories: 206, carbs: 0, fat: 13 },
  { id: uuid(), name: 'Potato', calories: 77, carbs: 17, fat: 0.1 },
  { id: uuid(), name: 'Asparagus', calories: 20, carbs: 3, fat: 0.2 },
  { id: uuid(), name: 'Cottage cheese', calories: 98, carbs: 3, fat: 4.3 },
  { id: uuid(), name: 'kale', calories: 49, carbs: 10, fat: 0.4 },
];

export async function fetchIngredients(query: string = '') {
  return prisma.ingredient.findMany({ where: { name: { contains: query } } });
}

export async function selectIngredients(query: string = ''): Promise<Ingredient[]> {
  return ingredients
    .filter((ingredient) => ingredient.name.toLowerCase().includes(query.toLowerCase()))
    .map((ingredient) => ({
      ...ingredient,
      calories: ingredient.calories / 100,
      carbs: ingredient.carbs / 100,
      fat: ingredient.fat / 100,
    }));
}

export async function selectIngredient(id: string): Promise<Ingredient> {
  const ingredient =  ingredients.find((ingredient) => ingredient.id === id);
  if(!ingredient) throw new Error('Ingredient not found');

  return ingredient;
}

export async function insertIngredient(name: string): Promise<Ingredient> {
  const newIngredient = { id: uuid(), name, calories: 0, carbs: 0, fat: 0 };
  ingredients.push(newIngredient);

  return newIngredient;
}

export async function deleteIngredient(id: string): Promise<void> {
  const index = ingredients.findIndex((ingredient) => ingredient.id === id);
  if(index === -1) throw new Error('Ingredient not found');

  ingredients.splice(index, 1);
}

export async function updateIngredient(id: string, values: { calories?: number; carbs?: number; fat?: number }): Promise<void> {
  const ingredient = ingredients.find((ingredient) => ingredient.id === id);
  if(!ingredient) throw new Error('Ingredient not found');

  if(values.calories) ingredient.calories = values.calories;
  if(values.carbs) ingredient.carbs = values.carbs;
  if(values.fat) ingredient.fat = values.fat;
}