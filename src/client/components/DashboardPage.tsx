import { useState, useMemo } from 'react';
import { startOfWeek, endOfWeek, format, isWithinInterval, parseISO } from 'date-fns';
import { useDays } from '../services/days';
import { round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import NutritionStats from './NutritionStats';

export default function DashboardPage({ uid }: { uid: string }) {
  const { days, loading } = useDays(uid);

  const today = new Date();
  const [fromDate, setFromDate] = useState(() => format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(() => format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));

  const filteredDays = useMemo(() => {
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    return days.filter((d) => {
      const date = parseISO(d.date);
      return isWithinInterval(date, { start: from, end: to });
    });
  }, [days, fromDate, toDate]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const totals = filteredDays.reduce(
    (acc, day) => {
      day.meals.forEach((meal) =>
        meal.dishes.forEach((d) => {
          acc.calories += d.calories;
          acc.carbs += d.carbs;
          acc.fat += d.fat;
        }),
      );
      return acc;
    },
    { calories: 0, carbs: 0, fat: 0 },
  );
  const dayCount = filteredDays.length || 1;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{TEXTS.nav.dashboard}</h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text">{TEXTS.dashboard.from}</span>
          </label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="input input-bordered input-sm" />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">{TEXTS.dashboard.to}</span>
          </label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="input input-bordered input-sm" />
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">{TEXTS.dashboard.totalCalories}</div>
          <div className="stat-value text-lg">{round(totals.calories)}</div>
          <div className="stat-desc">
            avg {round(totals.calories / dayCount)}
            {TEXTS.dashboard.perDay}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">{TEXTS.dashboard.totalCarbs}</div>
          <div className="stat-value text-lg">{round(totals.carbs)}g</div>
          <div className="stat-desc">
            avg {round(totals.carbs / dayCount)}
            {TEXTS.dashboard.gPerDay}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">{TEXTS.dashboard.totalFat}</div>
          <div className="stat-value text-lg">{round(totals.fat)}g</div>
          <div className="stat-desc">
            avg {round(totals.fat / dayCount)}
            {TEXTS.dashboard.gPerDay}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">{TEXTS.dashboard.days}</div>
          <div className="stat-value text-lg">{filteredDays.length}</div>
        </div>
      </div>

      <NutritionStats days={filteredDays} />
    </div>
  );
}
