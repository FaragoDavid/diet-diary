import { Ingredient } from '@prisma/client';
import { format } from 'date-fns';

import { DayWithMealsWithDishes } from '../../repository/meal';
import { RecipeForSelection } from '../../repository/recipe';
import { dateToParam } from '../../utils/converters';
import icons from '../../utils/icons';
import { dayMealList } from './day-meal-list';
import { dayStats } from './day-stats';

export async function dayListItem(day: DayWithMealsWithDishes, ingredients: Ingredient[], recipes: RecipeForSelection[]) {
  const dayDate = () => {
    return `
      <div class="flex items-center text-lg text-primary">${format(day.date, 'MMM. d. (EEE)')}</div>
    `;
  };

  const editDay = () => {
    return `
      <a href="/day/${dateToParam(day.date)}">
        <button 
          class="btn btn-primary btn-sm"
        >${icons.edit}</button>
      </a>
    `;
  };

  return `
    ${dayDate()}
    ${await dayStats(day, { layout: 'vertical', swapOob: false })}
    ${editDay()}
    ${await dayMealList(day, ingredients, recipes, {
      layout: 'dayList',
      swapOob: false,
    })}
  `;
}
