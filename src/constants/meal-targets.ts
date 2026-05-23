import type { MealType } from '../types/day';

export const MEAL_TARGETS: Record<MealType, { calories: number; carbs: number }> = {
  morningSnack: { calories: 160, carbs: 15 },
  breakfast: { calories: 330, carbs: 30 },
  brunch: { calories: 220, carbs: 20 },
  lunch: { calories: 440, carbs: 40 },
  afternoonSnack: { calories: 330, carbs: 20 },
  dinner: { calories: 330, carbs: 30 },
  lateNightSnack: { calories: 165, carbs: 10 },
};

export const DAY_TARGETS = { calories: 1700, carbs: 165 };
