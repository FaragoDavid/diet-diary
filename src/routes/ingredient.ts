import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientDetails } from '../components/ingredients/ingredient-details.js';
import { ingredientHeader } from '../components/ingredients/ingredient-header.js';
import { IngredientList } from '../components/ingredients/ingredient-list.js';
import { IngredientTab } from '../components/ingredients/ingredient-tab.js';
import { layout } from '../components/layout.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { IngredientPage, NewIngredientPage } from '../pages/ingredient.js';
import * as ingredientRepository from '../repository/ingredient.js';
import { HTMX_SWAP } from '../utils/htmx.js';

type GetIngredientsRequest = FastifyRequest<{ Querystring: { query: string } }>;
type CreateIngredientRequest = FastifyRequest<{ Body: { ingredientName: string } }>;
type GetIngredientRequest = FastifyRequest<{ Params: { ingredientId: string } }>;
type DeleteIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { query: string } }>;
type UpdateIngredientRequest = FastifyRequest<{ Params: { ingredientId: string }; Body: { calories: string; carbs: string; fat: string } }>;

export const displayIngredientsTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${tabList(TAB_NAME.ingredients, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new IngredientTab(ingredients).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.ingredients}`).send(template);
};

export const getIngredients = async (request: GetIngredientsRequest, reply: FastifyReply) => {
  const { query } = request.query;

  const ingredients = await ingredientRepository.fetchIngredients(query);

  const template = await new IngredientList(ingredients, { swapOob: false }).render();

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
    ${await new IngredientDetails(ingredient).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/recipe/${ingredient.id}`).send(template);
};

export const getIngredient = async (request: GetIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;

  const ingredient = await ingredientRepository.fetchIngredient(ingredientId);
  if (!ingredient) {
    return reply.status(404).send('Ingredient not found');
  }

  const template = await layout(new IngredientPage(ingredient));

  return reply.type('text/html').send(template);
};

export const deleteIngredient = async (request: DeleteIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { query } = request.body;

  await ingredientRepository.deleteIngredient(ingredientId);
  let ingredients = await ingredientRepository.fetchIngredients(query);
  if (ingredients.length === 0) {
    ingredients = await ingredientRepository.fetchIngredients();
  }

  const template = await new IngredientList(ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render();

  return reply.type('text/html').send(template);
};

export const updateIngredient = async (request: UpdateIngredientRequest, reply: FastifyReply) => {
  const { ingredientId } = request.params;
  const { calories, carbs, fat } = request.body;

  await ingredientRepository.updateIngredient(ingredientId, {
    ...(calories && { caloriesPer100: parseFloat(calories) }),
    ...(carbs && { carbsPer100: parseFloat(carbs) }),
    ...(fat && { fatPer100: parseFloat(fat) }),
  });

  return reply.type('text/html').send();
};
