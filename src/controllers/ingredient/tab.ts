import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientTab } from '../../components/ingredients/ingredient-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import * as ingredientRepository from '../../repository/ingredient';
import { HTMX_SWAP } from '../../utils/htmx';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await ingredientRepository.fetchIngredients();

  const template = `
    ${tabList(TAB_NAME.ingredients, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new IngredientTab(ingredients).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.ingredients}`).send(template);
};
