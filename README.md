# Diet Diary

A meal tracking application for managing daily nutrition intake. Built with Fastify, HTMX, and PostgreSQL.

## Main Workflows

### 1. Ingredient Management

Create and manage ingredients with nutritional information (calories, carbs, fat per 100g).

- Navigate to the **Ingredients** tab
- Add new ingredients with nutrition values
- Edit existing ingredients (changes automatically recalculate all recipes using them)

### 2. Recipe Management

Create recipes by combining ingredients with specific amounts.

- Navigate to the **Recipes** tab
- Create a new recipe and add ingredients
- Nutrition totals are automatically calculated from ingredients
- Set the cooked amount after cooking to enable weight-based portion calculations

### 3. Meal Planning

Track daily meals by adding dishes (ingredients or recipes) to meals.

- Navigate to the **Meals** tab
- Create a day entry
- Add meals (breakfast, lunch, dinner, snacks)
- Add dishes to each meal - either raw ingredients or recipes
- Adjust portion amounts as needed

### 4. Recipe Versions (Cooking Sessions)

When you cook a recipe, create a version to track the actual outcome:

- Add a recipe to a meal
- Click the copy icon to "Save as cooking version"
- This creates a dated copy (e.g., "Chicken Curry (Jan 30)")
- Modify the version's ingredients/amounts to match what you actually cooked
- Reuse this version for subsequent meals throughout the week

## Setup

### Prerequisites

- Node.js v24+
- PostgreSQL 15+
- Docker (optional, for database)

### Database Setup

**Option 1: Docker**

```bash
docker-compose up -d postgres
```

**Option 2: Local PostgreSQL**

Create a database and set the connection string in `.env`:

```
DB_CONN_STRING=postgresql://user:password@localhost:5432/diet_diary
```

### Installation

```bash
npm install
npx prisma migrate deploy
npm run build
```

### Development

Terminal 1 - Build TypeScript (watch mode):

```bash
npm run build -- --watch
```

Terminal 2 - Start server:

```bash
npm run start:dev
```

Terminal 3 - Build CSS (watch mode):

```bash
npm run css
```

The app runs at `http://localhost:3000`

### Authentication Setup (Google OAuth)

The app uses Google OAuth for authentication.

**1. Create Google OAuth credentials:**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Navigate to **APIs & Services** > **Credentials**
- Click **Create Credentials** > **OAuth client ID**
- Select **Web application**
- Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
- Copy the Client ID and Client Secret

**2. Configure environment variables:**

Create a `.env` file with:

```bash
# Database
DB_CONN_STRING=postgresql://user:password@localhost:5432/diet_diary

# Session security (generate random strings for production)
COOKIE_SECRET=your_cookie_secret_here
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Callback URL (update for production)
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Restrict access to specific email addresses (comma-separated)
ALLOWED_EMAILS=user1@gmail.com,user2@gmail.com
```

**3. Production deployment:**

Update `GOOGLE_CALLBACK_URL` to your production URL and add it to the authorized redirect URIs in Google Cloud Console.

### Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# E2E tests (Cypress)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:dev
```
