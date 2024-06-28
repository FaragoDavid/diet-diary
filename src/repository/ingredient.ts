import { Prisma } from '@prisma/client';

import prisma from '../utils/prisma-client';

export type Ingredient = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
};

export async function fetchIngredients(query: string = '') {
  return prisma.ingredient.findMany({ where: { name: { contains: query } }, orderBy: { name: 'asc' }});
}

export async function fetchIngredient(id: string) {
  return prisma.ingredient.findUnique({ where: { id } });
}

export async function insertIngredient(name: string) {
  return await prisma.ingredient.create({ data: { name } });
}

export async function deleteIngredient(id: string): Promise<void> {
  await prisma.ingredient.delete({ where: { id } });
}

export async function updateIngredient(id: string, data: Prisma.IngredientUpdateInput): Promise<void> {
  await prisma.ingredient.update({ where: { id }, data });
}