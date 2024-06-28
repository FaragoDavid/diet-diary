import { FastifyInstance } from 'fastify';

import createHandler from '../controllers/base';
import addDish from '../controllers/meal/add-dish';
import addMeal from '../controllers/meal/add-meal';
import createDay from '../controllers/meal/create-day';
import deleteDish from '../controllers/meal/delete-dish';
import deleteMeal from '../controllers/meal/delete-meal';
import getDayList from '../controllers/meal/get-day-list';
import getDayPage from '../controllers/meal/get-day-page';
import newDayPage from '../controllers/meal/get-new-day-page';
import getMealsTab from '../controllers/meal/tab';
import updateDish from '../controllers/meal/update-dish';

export default (fastify: FastifyInstance) => {
  fastify.get('/mealsTab', createHandler(getMealsTab));
  fastify.get('/days', createHandler(getDayList));
  fastify.get('/day/:date', createHandler(getDayPage));
  fastify.get('/new-day', createHandler(newDayPage));
  fastify.post('/new-day', createHandler(createDay));
  fastify.post('/day/:date/meal', createHandler(addMeal));
  fastify.post('/day/:date/meal/:mealType/dish', createHandler(addDish));
  fastify.post('/day/:date/meal/:mealType/dish/:dishId', createHandler(updateDish));
  fastify.delete('/day/:date/meal/:mealType', createHandler(deleteMeal));
  fastify.delete('/day/:date/meal/:mealType/dish/:dishId', createHandler(deleteDish));
};