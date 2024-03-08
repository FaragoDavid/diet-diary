import config from './config';
export type Dish = {
    id: string;
    name: string;
    amount: number;
};
export type Meal = {
    id: string;
    type: keyof typeof config.mealTypes;
    date: Date;
    dishes: Dish[];
};
export type Recipe = {
    id: string;
    name: string;
    ingredients: Dish[];
};
export type Ingredient = {
    id: string;
    name: string;
    calories: number;
    CH: number;
    fat: number;
};
declare const _default: {
    fetchDay: (date: Date) => Promise<Meal[]>;
    fetchRecipes: () => Promise<Recipe[]>;
    fetchIngredients: () => Promise<Ingredient[]>;
};
export default _default;
