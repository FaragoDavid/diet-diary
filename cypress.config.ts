import { defineConfig } from 'cypress';
import { config as dotenvConfig } from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenvConfig();

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      on('task', {
        async 'db:reset'() {
          await prisma.dish.deleteMany();
          await prisma.meal.deleteMany();
          await prisma.day.deleteMany();
          await prisma.recipeIngredient.deleteMany();
          await prisma.recipe.deleteMany();
          await prisma.ingredient.deleteMany();
          return null;
        },
        async 'db:createIngredient'(name: string) {
          const ingredient = await prisma.ingredient.create({
            data: {
              name,
              caloriesPer100: 100,
              carbsPer100: 20,
              fatPer100: 5,
              isVegetable: false,
              isCarbCounted: true,
            },
          });
          return { id: ingredient.id, name: ingredient.name };
        },
        async 'db:createRecipe'(name: string) {
          const recipe = await prisma.recipe.create({
            data: {
              name,
              calories: 500,
              carbs: 50,
              fat: 20,
              servings: 1,
            },
          });
          return { id: recipe.id, name: recipe.name };
        },
        async 'db:createDayWithMeal'({ date, mealType }: { date: string; mealType: string }) {
          const dayDate = new Date(date);
          const day = await prisma.day.upsert({
            where: { date: dayDate },
            update: {},
            create: { date: dayDate },
          });
          const meal = await prisma.meal.create({
            data: {
              date: dayDate,
              type: mealType,
              dayDate: day.date,
            },
          });
          return { date: day.date.toISOString(), mealType: meal.type };
        },
        async 'db:createDay'(date: string) {
          const dayDate = new Date(date);
          const day = await prisma.day.upsert({
            where: { date: dayDate },
            update: {},
            create: { date: dayDate },
          });
          return { date: day.date.toISOString() };
        },
        async 'db:createRecipeWithIngredient'({
          recipeName,
          ingredientName,
          amount,
        }: {
          recipeName: string;
          ingredientName: string;
          amount: number;
        }) {
          const ingredient = await prisma.ingredient.create({
            data: {
              name: ingredientName,
              caloriesPer100: 100,
              carbsPer100: 20,
              fatPer100: 5,
              isVegetable: false,
              isCarbCounted: true,
            },
          });
          const recipe = await prisma.recipe.create({
            data: {
              name: recipeName,
              calories: 500,
              carbs: 50,
              fat: 20,
              servings: 1,
              ingredients: {
                create: {
                  ingredientId: ingredient.id,
                  amount,
                },
              },
            },
          });
          return { recipeId: recipe.id, recipeName: recipe.name, ingredientId: ingredient.id, ingredientName: ingredient.name };
        },
        async 'db:createDayWithMealAndRecipeDish'({ date, mealType, recipeName }: { date: string; mealType: string; recipeName: string }) {
          const dayDate = new Date(date);
          const recipe = await prisma.recipe.create({
            data: {
              name: recipeName,
              calories: 500,
              carbs: 50,
              fat: 20,
              servings: 1,
            },
          });
          await prisma.day.upsert({
            where: { date: dayDate },
            update: {},
            create: { date: dayDate },
          });
          await prisma.meal.create({
            data: {
              date: dayDate,
              type: mealType,
              dayDate: dayDate,
            },
          });
          const dish = await prisma.dish.create({
            data: {
              name: recipeName,
              recipeId: recipe.id,
              amount: 1,
              calories: 500,
              carbs: 50,
              fat: 20,
              mealDate: dayDate,
              mealType: mealType,
            },
          });
          return { dishId: dish.id, recipeId: recipe.id, recipeName: recipe.name };
        },
        async 'db:getRecipeByName'(name: string) {
          const recipe = await prisma.recipe.findFirst({ where: { name } });
          return recipe;
        },
        async 'db:getDishById'(id: string) {
          const dish = await prisma.dish.findUnique({ where: { id } });
          return dish;
        },
      });
    },
  },
});
