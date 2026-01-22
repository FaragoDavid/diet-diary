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
      });
    },
  },
});
