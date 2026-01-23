import { FastifyReply, FastifyRequest } from 'fastify';
import getRecipeList from './get-list';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';

jest.mock('../../repository/ingredient');
jest.mock('../../repository/recipe');

describe('recipe/get-list', () => {
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockRequest = {
      query: { query: 'test' },
    } as FastifyRequest;
    mockReply = {} as FastifyReply;

    jest.clearAllMocks();
  });

  it('does not fetch ingredients when listing recipes', async () => {
    const mockRecipes = [
      { id: '1', name: 'Recipe 1', amount: 1, ingredients: [] },
    ];

    (recipeRepository.fetchRecipes as jest.Mock).mockResolvedValue(mockRecipes);
    (ingredientRepository.fetchIngredients as jest.Mock).mockResolvedValue([]);

    await getRecipeList(mockRequest, mockReply);

    expect(recipeRepository.fetchRecipes).toHaveBeenCalledWith('test');
    expect(ingredientRepository.fetchIngredients).not.toHaveBeenCalled();
  });
});
