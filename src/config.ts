const enum MEAL_TYPE {
  morningSnack = 'morningSnack',
  breakfast = 'breakfast',
  brunch = 'brunch',
  lunch = 'lunch',
  afternoonSnack = 'afternoonSnack',
  dinner = 'dinner',
  lateNightSnack = 'lateNightSnack',
}

export default {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  password: process.env.PASSWORD || 'admin',
  cookieSecret: process.env.COOKIE_SECRET || 'cookie_secret',
  publicAssetsPath: process.env.PUBLIC_ASSETS_PATH || 'http://localhost:3000',
  pages: {
    login: {
      login: 'Bejelentkezés',
    },
  },
  ingredients: {
    title: 'Alapanyagok',
    props: {
      name: { name: 'Név', type: 'text' },
      calories: { name: 'Kalória', type: 'number' },
      carbs: { name: 'carbs', type: 'number' },
    },
  },
  recipes: {
    title: 'Receptek',
    props: {
      name: { name: 'Név', type: 'text' },
      amount: { name: 'Mennyiség', type: 'number' },
    },
  },
  texts: {
    search: 'Keresés',
    add: 'Új',
    titles: {
      page: 'Diéta Napló',
      overview: 'Étkezések',
    },
  },
  meals: {
    title: 'Étkezések',
  },
  mealTypes: [
    { key: MEAL_TYPE.morningSnack, name: 'Előreggeli', targetCal: 160 },
    { key: MEAL_TYPE.breakfast, name: 'Reggeli', targetCal: 330 },
    { key: MEAL_TYPE.brunch, name: 'Tízórai', targetCal: 220 },
    { key: MEAL_TYPE.lunch, name: 'Ebéd', targetCal: 440 },
    { key: MEAL_TYPE.afternoonSnack, name: 'Uzsonna', targetCal: 220 },
    { key: MEAL_TYPE.dinner, name: 'Vacsora', targetCal: 330 },
    { key: MEAL_TYPE.lateNightSnack, name: 'Utóvacsora', targetCal: 165 },
  ],
};

export type MealType = `${MEAL_TYPE}`;
