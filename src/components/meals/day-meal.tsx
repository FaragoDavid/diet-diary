import { Ingredient } from '@prisma/client';

import config, { MealType } from '../../config';
import { RecipeForSelection } from '../../repository/recipe';
import { MealWithDishes } from '../../repository/meal';
import { dateToParam } from '../../utils/converters';
import icons from '../../utils/icons';
import { StatLayout } from '../stats';
import { dayMealDish, dayMealDishHeader } from './day-meal-dish';
import { mealStats } from './meal-stats';
import { newDish } from './new-dish';
import { dayMealDishList } from './day-meal-dish-list';

export enum STATS_SPAN {
  TWO = 'col-span-2',
  FOUR = 'col-span-4',
}

export function getDeleteMealId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-delete`;
}
export function getMealDishesId(date: Date, mealType: string) {
  return `day-${dateToParam(date)}-${mealType}-dishes`;
}

export async function dayMeal(
  meal: MealWithDishes,
  date: Date,
  ingredients: Ingredient[],
  recipes: RecipeForSelection[],
  options: { layout: 'dayList' | 'page'; swapOob?: HtmxSwapOobOption } = { layout: 'page' },
) {
  const mealName = () => {
    return `
      <div class="text text-secondary">${config.mealTypes.find(({ key }) => key === meal.type)!.name}</div>
    `;
  };

  const dishes = async () => {
    const dishComponents: string[] = [];
    for (const dish of meal.dishes) {
      dishComponents.push(await dayMealDish(dish, date, meal.type as MealType, { swapOob: false }));
    }

    return `
      <div
       id="${getMealDishesId(date, meal.type)}"
       class="col-span-3 grid grid-cols-max-6 gap-2 items-center px-2"
      >
        ${meal.dishes.length > 0 ? await dayMealDishHeader(date, meal.type as MealType, { swapOob: false }) : ''}
        ${dishComponents.join('')}
        ${await newDish(meal, date, ingredients, recipes, { swapOob: false })}
      </div>
    `;
  };

  const deleteMeal = () => {
    return `
      <button 
        id="${getDeleteMealId(date, meal.type)}"
        class="btn btn-sm btn-secondary p-0"
        hx-delete="/day/${dateToParam(date)}/meal/${meal.type}"
      >
        ${icons.delete}
      </button>
    `;
  };

  const mealStatLayout: StatLayout = options.layout === 'page' ? 'horizontal' : 'cells';
  const showDishes = options.layout === 'page';

  return `
    ${mealName()}
    ${await mealStats(meal, { layout: mealStatLayout, swapOob: false })}
    ${showDishes ? deleteMeal() : ''}
    ${showDishes ? await dayMealDishList(meal, date, ingredients, recipes, { swapOob: options.swapOob }) : ''}
  `;
}
