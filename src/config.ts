export default {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  texts: {
    titles: {
      page: 'Diéta Napló',
      meals: 'Étkezések',
      recipes: 'Receptek',
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