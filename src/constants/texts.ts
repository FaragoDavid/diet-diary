export const texts = {
  common: {
    amount: 'Menny.',
    search: 'Keresés',
    add: 'Új',
    emptyOption: 'Válassz',
  },

  navigation: {
    ingredients: 'Alapanyagok',
    recipes: 'Receptek',
    meals: 'Étkezések',
  },

  nutrients: {
    calories: {
      long: 'Kalória',
      short: 'Kal',
    },
    carbs: {
      long: 'Szénhidrát',
      short: 'CH',
    },
    fat: 'Zsír',
  },

  ingredients: {
    newIngredient: 'Új Alapanyag',
    placeholder: 'Alapanyag neve',
    vegetable: 'Zöldség',
    carbCounted: 'számolandó',
  },

  recipes: {
    placeholder: 'Recept neve',
    ingredientsHeader: 'Alapanyagok',
    newIngredient: 'Új alapanyag hozzáadása',
  },

  meals: {
    newDay: 'Új Nap',
  },
} as const;

export type TextKeys = typeof texts;
