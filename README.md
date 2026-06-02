# Diet Diary

A meal tracking app for managing daily nutrition intake. Built with React, Vite, Firebase, and DaisyUI.

## Features

- **Ingredients** — create and manage ingredients with nutritional values (calories, carbs, fat per 100g). Editing an ingredient automatically recalculates all recipes that use it.
- **Recipes** — combine ingredients with specific amounts. Set the cooked weight to enable portion-based calculations. Create dated variants to track what you actually cooked.
- **Meals** — track daily meals (breakfast, lunch, dinner, snacks) by adding ingredients or recipes as dishes with adjustable portions.
- **Recipe gallery** — browse recipes with photos stored in Google Drive.
- **Shopping list** — generate an aggregated ingredient list for a date range.

Data is cached in localStorage for fast reads and synced to Firestore periodically.

## Setup

### Prerequisites

- Node.js 20+
- A Firebase project with Firestore and Authentication (Google provider) enabled

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable                      | Required | Description                                        |
| ----------------------------- | -------- | -------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`       | yes      | Firebase project API key from the Firebase Console |
| `VITE_DRIVE_FOLDER_ID`        | no       | Google Drive folder ID for recipe gallery images   |
| `VITE_WRITE_DEBOUNCE_MINUTES` | no       | Firestore sync interval in minutes (default: 10)   |

### Recipe Gallery

To enable the recipe gallery, create a Google Drive folder for recipe images and set `VITE_DRIVE_FOLDER_ID` to its ID. The app uses the signed-in user's Google access token to list and upload images. Without this variable, the gallery uses placeholder images.

### Installation

1. Configure `.env` as described above
2. Run `npm install`

### Development

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

In dev mode, authentication is bypassed and data stays in localStorage only.

### Production Build

```bash
npm run build
npm run preview
```

### Testing

```bash
npm test              # Playwright E2E tests (headless)
npm run test:e2e:dev  # Playwright UI mode
```

### Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the app and deploys it to GitHub Pages. The workflow reads `VITE_FIREBASE_API_KEY` and `VITE_DRIVE_FOLDER_ID` from repository secrets.
