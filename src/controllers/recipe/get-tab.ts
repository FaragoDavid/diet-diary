import { FastifyReply, FastifyRequest } from 'fastify';

import { RecipeTab } from '../../components/recipes/recipe-tab';
import { TAB_NAME, tabList } from '../../components/tab-list';
import { HTMX_SWAP } from '../../utils/htmx';
import { recipeService } from '../../services/recipe.service';

export default async (_: FastifyRequest, reply: FastifyReply) => {
  const { recipes, ingredients } = await recipeService.getAllRecipesWithIngredients('');

  const template = `
    ${tabList(TAB_NAME.recipes, { swapOob: HTMX_SWAP.ReplaceElement })}
    ${await new RecipeTab(recipes, ingredients).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/dashboard/${TAB_NAME.recipes}`).send(template);
};
