import { FastifyInstance } from 'fastify';

import createHandler from '../controllers/base.js';
import createIngredient from '../controllers/ingredient/create.js';
import deleteIngredient from '../controllers/ingredient/delete.js';
import getIngredients from '../controllers/ingredient/get-list.js';
import newIngredientPage from '../controllers/ingredient/get-new-page.js';
import getIngredientPage from '../controllers/ingredient/get-page.js';
import getIngredientsTab from '../controllers/ingredient/tab.js';
import updateIngredient from '../controllers/ingredient/update.js';

export default (fastify: FastifyInstance) => {
  fastify.get('/ingredientsTab', createHandler(getIngredientsTab));
  fastify.get('/ingredients', createHandler(getIngredients));
  fastify.get('/new-ingredient', createHandler(newIngredientPage));
  fastify.post('/new-ingredient', createHandler(createIngredient));
  fastify.get('/ingredient/:ingredientId', createHandler(getIngredientPage));
  fastify.delete('/ingredient/:ingredientId', createHandler(deleteIngredient));
  fastify.post('/ingredient/:ingredientId', createHandler(updateIngredient));
};
