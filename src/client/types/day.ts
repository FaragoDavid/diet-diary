export const MEAL_TYPES = ['morningSnack', 'breakfast', 'brunch', 'lunch', 'afternoonSnack', 'dinner', 'lateNightSnack'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  morningSnack: 'Morning Snack',
  breakfast: 'Breakfast',
  brunch: 'Brunch',
  lunch: 'Lunch',
  afternoonSnack: 'Afternoon Snack',
  dinner: 'Dinner',
  lateNightSnack: 'Late Night Snack',
};

export interface Dish {
  id: string;
  name: string;
  amount: number;
  calories: number;
  carbs: number;
  fat: number;
  recipeId: string | null;
  ingredientId: string | null;
}

export interface Meal {
  type: MealType;
  dishes: Dish[];
}

export interface Day {
  id: string;
  date: string;
  meals: Meal[];
}
