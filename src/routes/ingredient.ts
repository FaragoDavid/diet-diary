import { FastifyInstance } from 'fastify';

import createHandler from '../controllers/base';
import createIngredient from '../controllers/ingredient/create';
import deleteIngredient from '../controllers/ingredient/delete';
import getIngredients from '../controllers/ingredient/get-list';
import newIngredientPage from '../controllers/ingredient/get-new-page';
import getIngredientPage from '../controllers/ingredient/get-page';
import getIngredientsTab from '../controllers/ingredient/tab';
import updateIngredient from '../controllers/ingredient/update';

export default (fastify: FastifyInstance) => {
  fastify.get('/ingredientsTab', createHandler(getIngredientsTab));
  fastify.get('/ingredients', createHandler(getIngredients));
  fastify.get('/new-ingredient', createHandler(newIngredientPage));
  fastify.post('/new-ingredient', createHandler(createIngredient));
  fastify.get('/ingredient/:ingredientId', createHandler(getIngredientPage));
  fastify.delete('/ingredient/:ingredientId', createHandler(deleteIngredient));
  fastify.post('/ingredient/:ingredientId', createHandler(updateIngredient));
};
