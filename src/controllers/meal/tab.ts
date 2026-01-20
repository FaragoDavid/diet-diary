import { subDays } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';

import { MealTab } from '../../components/meals/meal-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import { HTMX_SWAP } from '../../utils/htmx';
import { mealService } from '../../services/meal.service';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const { days, ingredients, recipes } = await mealService.getAllDays();

  const template = `
    ${tabList(TAB_NAME.meals, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new MealTab(days, ingredients, recipes).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.meals}`).send(template);
};
