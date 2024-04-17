import { FastifyReply, FastifyRequest } from 'fastify';
import { IngredientList } from '../components/ingredients/list.js';
import repository from '../repository/ingredient.js';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type PostIngredientsRequest = FastifyRequest<{ Body: { name: string; calories: string; carbs: string } }>;

export const getIngredient = async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const query = request.query.query;

  const template = await new IngredientList(query).render();
  return reply.type('text/html').send(template);
};

export const addIngredient = async (request: PostIngredientsRequest, reply: FastifyReply) => {
  const { name, calories, carbs } = request.body;

  if (name) await repository.addIngredient(name, calories, carbs);

  const template = await new IngredientList(name).render();
  return reply.type('text/html').send(template);
};
