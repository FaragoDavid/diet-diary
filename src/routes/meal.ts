import { FastifyInstance } from 'fastify';

import createHandler from '../controllers/base.js';
import addDish from '../controllers/meal/add-dish.js';
import addMeal from '../controllers/meal/add-meal.js';
import createDay from '../controllers/meal/create-day.js';
import deleteDish from '../controllers/meal/delete-dish.js';
import deleteMeal from '../controllers/meal/delete-meal.js';
import getDayList from '../controllers/meal/get-day-list.js';
import getDayPage from '../controllers/meal/get-day-page.js';
import newDayPage from '../controllers/meal/get-new-day-page.js';
import getMealsTab from '../controllers/meal/tab.js';

export default (fastify: FastifyInstance) => {
  fastify.get('/mealsTab', createHandler(getMealsTab));
  fastify.get('/days', createHandler(getDayList));
  fastify.get('/day/:date', createHandler(getDayPage));
  fastify.get('/new-day', createHandler(newDayPage));
  fastify.post('/new-day', createHandler(createDay));
  fastify.post('/day/:date/meal', createHandler(addMeal));
  fastify.post('/day/:date/meal/:mealType/dish', createHandler(addDish));
  fastify.delete('/day/:date/meal/:mealType', createHandler(deleteMeal));
  fastify.delete('/day/:date/meal/:mealType/dish/:dishId', createHandler(deleteDish));
};