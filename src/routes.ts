import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { Dashboard } from './components/dashboard.js';
import { IngredientList } from './components/ingredients/list.js';
import { layout } from './components/layout.js';
import { Days } from './components/overview/days.js';
import repository from './repository.js';
import { Recipe } from './components/recipes/recipe.js';
import { RecipeList } from './components/recipes/list.js';

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;
type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type PostIngredientsRequest = FastifyRequest<{ Body: { name: string; calories: string; ch: string } }>;
type GetRecipesRequest = FastifyRequest<{ Querystring: { query: string } }>;
type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;

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

  fastify.get('/ingredients', async (request: GetIngredientsRequest, reply: FastifyReply) => {
    const query = request.query.query;
    console.log({ query });

    const template = await new IngredientList(query).render();
    return reply.type('text/html').send(template);
  });

  fastify.post('/ingredients', async (request: PostIngredientsRequest, reply: FastifyReply) => {
    const { name, calories, ch } = request.body;

    await repository.addIngredient(name, calories, ch);

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
};

export default registerRoutes;
