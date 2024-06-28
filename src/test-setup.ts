import * as dotenv from 'dotenv';
dotenv.config();

import prisma from './utils/prisma-client';

beforeEach(async () => {
  await prisma.dish.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.day.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
});

global.infoMock = {};
global.errorMock = {};
