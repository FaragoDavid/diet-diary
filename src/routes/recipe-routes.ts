import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';
import { RecipeList } from '../components/recipes/recipe-list.js';
import repository from '../repository.js';
import { NewRecipe } from '../components/recipes/new-recipe.js';
import { EditRecipe } from '../components/recipes/edit-recipe.js';

type GetRecipesRequest = FastifyRequest<{ Querystring: { query: string } }>;
type GetRecipeRequest = FastifyRequest<{ Params: { recipeId: string } }>;
type PostRecipeRequest = FastifyRequest<{ Params: { recipeId: string }; Body: { newIngredient: string[] } & Record<string, string> }>;
type PostRecipeIngredientRequest = FastifyRequest<{
  Params: { recipeId: string; ingredientId: string };
  Body: { newIngredient: string[] } & Record<string, string>;
}>;
type CreateRecipeRequest = FastifyRequest<{ Body: { name: string; ingredient: string; amount: string } }>;

export const getRecipes = async (request: GetRecipesRequest, reply: FastifyReply) => {
  const template = await layout(new RecipeList(request.query.query));
  return reply.type('text/html').send(template);
};

export const editRecipe = async (request: GetRecipeRequest, reply: FastifyReply) => {
  const template = await layout(new EditRecipe(request.params.recipeId));
  return reply.type('text/html').send(template);
};

export const updateRecipe = async (request: PostRecipeRequest, reply: FastifyReply) => {
  const recipeId = request.params.recipeId;

  const recipe = await repository.fetchRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const { newIngredient, ...ingredients } = request.body;
  if (!newIngredient) throw new Error('New ingredient not found');
  if (!newIngredient[0] || !newIngredient[1]) throw new Error('New ingredient not found');

  await repository.updateRecipe(recipeId, [
    ...recipe.ingredients.map((ingredient) => ({ id: ingredient.id, amount: Number(ingredients[String(ingredient.id)]) })),
    { id: newIngredient[0], amount: Number(newIngredient[1]) },
  ]);

  const template = await layout(new RecipeIngredientList(recipeId));
  return reply.type('text/html').send(template);
};

export const updateRecipeIngredient = async (request: PostRecipeIngredientRequest, reply: FastifyReply) => {
  console.log({ body: request.body });
  console.log({ params: request.params });

  const { recipeId, ingredientId } = request.params;

  const recipe = await repository.fetchRecipe(recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!ingredient) throw new Error('Ingredient not found in recipe');

  await repository.updateRecipeIngredient(recipeId, ingredientId, Number(request.body[ingredientId]));

  const template = await layout(new RecipeIngredientList(recipeId));
  return reply.type('text/html').send(template);
};

export const newRecipe = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewRecipe());
  return reply.type('text/html').send(template);
};

export const createRecipe = async (request: CreateRecipeRequest, reply: FastifyReply) => {
  const { name, ingredient, amount } = request.body;

  const id = await repository.addRecipe(name, { id: ingredient, amount: Number(amount) });

  return reply.type('text/html').send(`<script>window.location.href = '/recipe/${id}'</script>`);
};