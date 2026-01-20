import { FastifyReply, FastifyRequest } from 'fastify';

import { IngredientDetails } from '../../components/ingredients/ingredient-details';
import { ingredientHeader } from '../../components/ingredients/ingredient-header';
import { ingredientService } from '../../services/ingredient.service';

type CreateIngredientRequest = FastifyRequest<{ Body: { ingredientName: string } }>;

export default async (request: CreateIngredientRequest, reply: FastifyReply) => {
  const ingredientName = (request.body.ingredientName || '').trim();

  if (!ingredientName || ingredientName.length === 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Ingredient name is required</div>');
  }

  const ingredient = await ingredientService.createIngredient(ingredientName);

  const template = `
    ${ingredientHeader(ingredient)}
    ${await new IngredientDetails(ingredient).render()}
  `;

  return reply.type('text/html').header('HX-Push-Url', `/recipe/${ingredient.id}`).send(template);
};
