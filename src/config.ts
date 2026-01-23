export const MEAL_TYPE = {
  morningSnack: 'morningSnack',
  breakfast: 'breakfast',
  brunch: 'brunch',
  lunch: 'lunch',
  afternoonSnack: 'afternoonSnack',
  dinner: 'dinner',
  lateNightSnack: 'lateNightSnack',
} as const;

export default {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  cookieSecret: process.env.COOKIE_SECRET || 'cookie_secret',
  sessionSecret: process.env.SESSION_SECRET || 'session_secret_change_in_production',
  publicAssetsPath: process.env.PUBLIC_ASSETS_PATH || 'http://localhost:3000',
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    },
    allowedEmails: process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim()) || [],
  },
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

export type MealType = (typeof MEAL_TYPE)[keyof typeof MEAL_TYPE];
