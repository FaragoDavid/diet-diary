import { FastifyReply, FastifyRequest } from 'fastify';
import getIngredientList from './get-list';
import * as ingredientRepository from '../../repository/ingredient';

jest.mock('../../repository/ingredient');

describe('ingredient/get-list', () => {
  let mockRequest: FastifyRequest<{ Querystring: { query: string } }>;
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockRequest = {
      query: { query: 'tomato' },
    } as FastifyRequest<{ Querystring: { query: string } }>;
    mockReply = {} as FastifyReply;

    jest.clearAllMocks();
  });

  it('filters ingredients at database level using query parameter', async () => {
    const mockIngredients = [{ id: '1', name: 'Tomato', calories: 20, carbs: 4, fat: 0 }];

    (ingredientRepository.fetchIngredients as jest.Mock).mockResolvedValue(mockIngredients);

    await getIngredientList(mockRequest, mockReply);

    expect(ingredientRepository.fetchIngredients).toHaveBeenCalledWith('tomato');
  });
});
