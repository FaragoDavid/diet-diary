import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientList } from '../components/ingredients/ingredient-list.js';
import { IngredientTab } from '../components/ingredients/ingredient-tab.js';
import { layout } from '../components/layout.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { IngredientPage, NewIngredientPage } from '../pages/ingredient.js';
import * as ingredientRepository from '../repository/ingredient.js';
import { ingredientHeader } from '../components/ingredients/ingredient-header.js';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type CreateIngredientRequest = FastifyRequest<{ Body: { ingredientName: string } }>;
type GetIngredientRequest = FastifyRequest<{ Params: { ingredientId: string } }>;
type DeleteIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { query: string } }>;

export const displayIngredientsTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await ingredientRepository.selectIngredients();

  const template = `
    ${tabList(TAB_NAME.ingredients, true)}
    ${await new IngredientTab(ingredients).render()}
  `;

  return reply.type('text/html').send(template);
};

export const getIngredients = async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const { query } = request.query;

  const ingredients = await ingredientRepository.selectIngredients(query);

  const template = await new IngredientList(ingredients, { swap: false }).render();

  return reply.type('text/html').send(template);
};

export const newIngredient = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewIngredientPage());

  return reply.type('text/html').send(template);
};

export const createIngredient = async (request: CreateIngredientRequest, reply: FastifyReply) => {
  const { ingredientName } = request.body;

  const ingredient = await ingredientRepository.insertIngredient(ingredientName);

  const template = `
    ${ingredientHeader(ingredient)}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/recipe/${ingredient.id}`).send(template);
};

export const getIngredient = async (request: GetIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;

  const ingredient = await ingredientRepository.selectIngredient(ingredientId);

  const template = await layout(new IngredientPage(ingredient));

  return reply.type('text/html').send(template);
};

export const deleteIngredient = async (request: DeleteIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { query } = request.body;

  await ingredientRepository.deleteIngredient(ingredientId);
  let ingredients = await ingredientRepository.selectIngredients(query);
  if (ingredients.length === 0) {
    ingredients = await ingredientRepository.selectIngredients('');
  }

  const template = await new IngredientList(ingredients, { swap: true }).render();

  return reply.type('text/html').send(template);
};