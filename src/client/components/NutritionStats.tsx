import { round } from '../utils/nutrition';
import type { Day } from '../types/day';

export default function NutritionStats({ days }: { days: Day[] }) {
  if (days.length === 0) {
    return <p className="text-center py-8 text-base-content/50">No data for this date range.</p>;
  }

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Date</th>
            <th className="text-right">Meals</th>
            <th className="text-right">Dishes</th>
            <th className="text-right">Calories</th>
            <th className="text-right">Carbs (g)</th>
            <th className="text-right">Fat (g)</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((day) => {
            const totals = day.meals.reduce(
              (acc, m) => {
                m.dishes.forEach((d) => {
                  acc.calories += d.calories;
                  acc.carbs += d.carbs;
                  acc.fat += d.fat;
                  acc.dishes++;
                });
                return acc;
              },
              { calories: 0, carbs: 0, fat: 0, dishes: 0 },
            );
            return (
              <tr key={day.id}>
                <td>{formatShortDate(day.date)}</td>
                <td className="text-right">{day.meals.length}</td>
                <td className="text-right">{totals.dishes}</td>
                <td className="text-right tabular-nums">{round(totals.calories)}</td>
                <td className="text-right tabular-nums">{round(totals.carbs)}</td>
                <td className="text-right tabular-nums">{round(totals.fat)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', weekday: 'short' });
}
