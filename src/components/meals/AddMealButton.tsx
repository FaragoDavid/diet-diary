import { useState } from 'react';
import { Plus } from 'lucide-react';
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../../types/day';
import type { Meal, MealType } from '../../types/day';

export default function AddMealButton({
  availableTypes,
  meals,
  onSave,
}: {
  availableTypes: MealType[];
  meals: Meal[];
  onSave: (meals: Meal[]) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);

  if (availableTypes.length === 0) return null;

  const handleAdd = async (type: MealType) => {
    setAdding(true);
    try {
      const sorted = [...meals, { type, dishes: [] }].sort(
        (first, second) => MEAL_TYPES.indexOf(first.type) - MEAL_TYPES.indexOf(second.type),
      );
      await onSave(sorted);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
        <Plus className="w-4 h-4" />
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
        {availableTypes.map((type) => (
          <li key={type}>
            <button onClick={() => handleAdd(type)} disabled={adding}>
              {MEAL_TYPE_LABELS[type]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
