import { useState, forwardRef, useImperativeHandle } from 'react';
import { Pencil } from 'lucide-react';
import { TEXTS } from '../../constants/texts';
import type { RecipeUpdate } from '../../types/recipe';

function HeaderDisplay({ name, subtitle, onEdit }: { name: string; subtitle: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-bold text-base">{name}</h3>
        <div className="text-sm text-base-content/70">{subtitle}</div>
      </div>
      <button onClick={onEdit} data-testid="edit-header-button" className="btn btn-ghost btn-xs">
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export interface RecipeHeaderFormRef {
  getPendingChanges: () => RecipeUpdate | null;
}

const RecipeHeaderForm = forwardRef<
  RecipeHeaderFormRef,
  {
    name: string;
    amount: number | null;
    servings: number;
    subtitle: string;
    initialEditing?: boolean;
  }
>(function RecipeHeaderForm({ name, amount, servings, subtitle, initialEditing = false }, ref) {
  const [editing, setEditing] = useState(initialEditing);
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount?.toString() ?? '');
  const [editServings, setEditServings] = useState(servings.toString());

  useImperativeHandle(
    ref,
    () => ({
      getPendingChanges: () => {
        if (!editing) return null;
        const trimmed = editName.trim();
        if (!trimmed) return null;
        return {
          name: trimmed,
          amount: editAmount ? parseFloat(editAmount) : null,
          servings: parseInt(editServings) || 1,
        };
      },
    }),
    [editing, editName, editAmount, editServings],
  );

  if (!editing) {
    return <HeaderDisplay name={name} subtitle={subtitle} onEdit={() => setEditing(true)} />;
  }

  return (
    <div>
      <table className="table">
        <tbody>
          <tr>
            <td className="font-medium">{TEXTS.common.name}</td>
            <td>
              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                className="input input-bordered input-sm w-full"
                autoFocus
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.recipes.amountG}</td>
            <td>
              <input
                type="number"
                min="0"
                step="1"
                value={editAmount}
                onChange={(event) => setEditAmount(event.target.value)}
                placeholder="—"
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.recipes.servings}</td>
            <td>
              <input
                type="number"
                min="1"
                step="1"
                value={editServings}
                onChange={(event) => setEditServings(event.target.value)}
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default RecipeHeaderForm;
