import { Ingredient } from '@prisma/client';

import { MealType } from '../../config';
import { RecipeForSelection } from '../../repository/recipe';
import { MealWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import { dayMealDish, dayMealDishHeader } from './day-meal-dish';
import { newDish } from './new-dish';

export function getDeleteMealId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-delete`;
}
export function getMealDishesId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-dishes`;
}

export async function dayMealDishList(
  meal: MealWithDishes,
  date: Date,
  ingredients: Ingredient[],
  recipes: RecipeForSelection[],
  options: { swapOob?: HtmxSwapOobOption } = {},
) {
  const dishComponents: string[] = [];
  for (const dish of meal.dishes) {
    dishComponents.push(await dayMealDish(dish, date, meal.type as MealType, { swapOob: false }));
  }
  return `
    <div
     id="${getMealDishesId(date, meal.type)}"
     class="col-span-3 grid grid-cols-max-6 gap-2 items-center px-2"
     ${options.swapOob ? 'hx-swap-oob="true"' : ''}
    >
      ${meal.dishes.length > 0 ? await dayMealDishHeader(date, meal.type as MealType, { swapOob: false }) : ''}
      ${dishComponents.join('')}
      ${await newDish(meal, date, ingredients, recipes, { swapOob: false })}
    </div>
  `;
}
