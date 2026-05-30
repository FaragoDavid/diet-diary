import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { WRITE_DEBOUNCE_MS } from './constants/config';
import { syncDays } from './services/days';
import { syncRecipes } from './services/recipes';
import { syncIngredients } from './services/ingredients';
import App from './App';

async function flushWrites(): Promise<void> {
  await Promise.all([syncDays(), syncRecipes(), syncIngredients()]);
}

setInterval(flushWrites, WRITE_DEBOUNCE_MS);
window.addEventListener('beforeunload', () => flushWrites());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
