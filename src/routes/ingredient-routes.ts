import { FastifyReply, FastifyRequest } from 'fastify';
import { IngredientList } from '../components/ingredients/list.js';
import repository from '../repository.js';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type PostIngredientsRequest = FastifyRequest<{ Body: { name: string; calories: string; ch: string } }>;

export const getIngredient = async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const query = request.query.query;

  const template = await new IngredientList(query).render();
  return reply.type('text/html').send(template);
};

export const adIngredient = async (request: PostIngredientsRequest, reply: FastifyReply) => {
  const { name, calories, ch } = request.body;

  if (name) await repository.addIngredient(name, calories, ch);

  const template = await new IngredientList(name).render();
  return reply.type('text/html').send(template);
};
