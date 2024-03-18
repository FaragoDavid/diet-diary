import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { Dashboard } from './components/dashboard.js';
import { IngredientList } from './components/ingredients/list.js';
import { layout } from './components/layout.js';
import { Days } from './components/overview/days.js';
import repository from './repository.js';
import { Recipe } from './components/recipes/recipe.js';
import { RecipeList } from './components/recipes/recipe-list.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;
type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type PostIngredientsRequest = FastifyRequest<{ Body: { name: string; calories: string; ch: string } }>;
type GetRecipesRequest = FastifyRequest<{ Querystring: { query: string } }>;
type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;
type PostRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { newIngredient: string[] } & Record<string, string> }>;

const registerRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', function handler(request: FastifyRequest, reply: FastifyReply) {
    reply.redirect(301, '/dashboard');
  });

  fastify.get('/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const template = await layout(new Dashboard());
    return reply.type('text/html').send(template);
  });

  fastify.get('/days', async (request: GetMealsRequest, reply: FastifyReply) => {
    const fromDate = new Date(request.query.fromDate);
    const toDate = new Date(request.query.toDate);

    const template = await new Days(fromDate, toDate).render();
    return reply.type('text/html').send(template);
  });

  fastify.get('/ingredient', async (request: GetIngredientsRequest, reply: FastifyReply) => {
    const query = request.query.query;

    const template = await new IngredientList(query).render();
    return reply.type('text/html').send(template);
  });

  fastify.post('/ingredient', async (request: PostIngredientsRequest, reply: FastifyReply) => {
    const { name, calories, ch } = request.body;

    if (name) await repository.addIngredient(name, calories, ch);

    const template = await new IngredientList(name).render();
    return reply.type('text/html').send(template);
  });

  fastify.get('/recipe', async (request: FastifyRequest, reply: FastifyReply) => {
    const template = await layout(new Recipe());
    return reply.type('text/html').send(template);
  });

  fastify.get('/recipes', async (request: GetRecipesRequest, reply: FastifyReply) => {
    const template = await layout(new RecipeList(request.query.query));
    return reply.type('text/html').send(template);
  });

  fastify.get('/recipe/:recipeId', async (request: GetRecipeRequest, reply: FastifyReply) => {
    
    const template = await layout(new Recipe(request.params.recipeId));
    return reply.type('text/html').send(template);
  });

  fastify.post('/recipe/:recipeId', async (request: PostRecipeRequest, reply: FastifyReply) => {
    try {
      const recipeId = request.params.recipeId;

      const recipe = await repository.fetchRecipe(recipeId);
      if (!recipe) throw new Error('Recipe not found');

      const { newIngredient, ...ingredients } = request.body;
      if (!newIngredient) throw new Error('New ingredient not found');
      if (!newIngredient[0] || !newIngredient[1]) throw new Error('New ingredient not found');

      await repository.updateRecipe(recipeId, [
        ...recipe.ingredients.map((ingredient) => ({ id: ingredient.id, amount: Number(ingredients[String(ingredient.id)]) })),
        { id: newIngredient[0], amount: Number(newIngredient[1]) },
      ]);

      const template = await layout(new RecipeList(recipeId));
      return reply.type('text/html').send(template);
    } catch (error) {
      console.error(error);
    }
  }
  );
};

export default registerRoutes;
