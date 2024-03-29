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
      ch: { name: 'CH', type: 'number' },
    },
  },
  recipes: {
    title: 'Receptek',
    props: {
      name: { name: 'Név', type: 'text' },
      amount: { name: 'Mennyiség', type: 'number' },
    },
  },
  tableHeaders: {
    meals: ['', 'Név', 'Mennyiség', 'Kalória', 'CH'],
  },
  texts: {
    search: 'Keresés',
    add: 'Új',
    titles: {
      page: 'Diéta Napló',
      overview: 'Étkezések',
    },
  },
  mealTypes: {
    morningSnack: {
      name: 'Előreggeli',
      targetCal: 160,
    },
    breakfast: {
      name: 'Reggeli',
      targetCal: 330,
    },
    brunch: {
      name: 'Tízórai',
      targetCal: 220,
    },
    lunch: {
      name: 'Ebéd',
      targetCal: 440,
    },
    afternoonSnack: {
      name: 'Uzsonna',
      targetCal: 220,
    },
    dinner: {
      name: 'Vacsora',
      targetCal: 330,
    },
    lateNightSnack: {
      name: 'Utóvacsora',
      targetCal: 165,
    },
  },
};