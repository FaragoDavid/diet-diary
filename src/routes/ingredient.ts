import { FastifyReply, FastifyRequest } from 'fastify';

import { Ingredients } from '../components/ingredients/index.js';
import { IngredientList } from '../components/ingredients/list.js';
import { layout } from '../components/layout.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { insertIngredient } from '../repository/ingredient.js';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type PostIngredientsRequest = FastifyRequest<{ Body: { name: string; calories: string; carbs: string } }>;

export const displayIngredientsTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = `
    ${tabList(TAB_NAME.ingredients, true)}
    ${await new Ingredients().render()}
  `;

  return reply.type('text/html').send(template);
};

export const getIngredient = async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const query = request.query.query;

  const template = await new IngredientList(query).render();
  return reply.type('text/html').send(template);
};

export const addIngr = async (request: PostIngredientsRequest, reply: FastifyReply) => {
  const { name, calories, carbs } = request.body;

  if (name) await insertIngredient(name, calories, carbs);

  const template = await new IngredientList(name).render();
  return reply.type('text/html').send(template);
};
