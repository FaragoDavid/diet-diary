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
      });
    },
  },
});
