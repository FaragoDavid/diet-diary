import { Pencil, Trash2 } from 'lucide-react';
import type { Ingredient } from '../../types/ingredient';

export default function IngredientRow({
  ingredient: ing,
  onEdit,
  onDelete,
  deleting,
}: {
  ingredient: Ingredient;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <tr>
      <td className="font-medium sticky left-0 z-[1] bg-base-200">{ing.name}</td>
      <td className="text-right tabular-nums whitespace-nowrap">{ing.caloriesPer100}</td>
      <td className="text-right tabular-nums whitespace-nowrap">{ing.carbsPer100}</td>
      <td className="text-right tabular-nums whitespace-nowrap">{ing.fatPer100}</td>
      <td className="text-right whitespace-nowrap">
        <div className="flex justify-end gap-1">
          <button onClick={onEdit} className="btn btn-ghost btn-xs">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} disabled={deleting} className="btn btn-ghost btn-xs text-error">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
