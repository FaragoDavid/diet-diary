export default {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  publicAssetsPath: process.env.PUBLIC_ASSETS_PATH || 'http://localhost:3000',
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
    },
  },
  tableHeaders: {
    meals: ['', 'Név', 'Mennyiség', 'Kalória', 'CH'],
  },
  texts: {
    search: 'Keresés',
    add: 'Hozzáadás',
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