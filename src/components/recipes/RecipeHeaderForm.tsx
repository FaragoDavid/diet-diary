import { useState } from 'react';
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

export default function RecipeHeaderForm({
  name,
  amount,
  servings,
  subtitle,
  initialEditing = false,
  onSave,
}: {
  name: string;
  amount: number | null;
  servings: number;
  subtitle: string;
  initialEditing?: boolean;
  onSave: (changes: RecipeUpdate) => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(initialEditing);
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount?.toString() ?? '');
  const [editServings, setEditServings] = useState(servings.toString());
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return <HeaderDisplay name={name} subtitle={subtitle} onEdit={() => setEditing(true)} />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await onSave({
        name: trimmed,
        amount: editAmount ? parseFloat(editAmount) : null,
        servings: parseInt(editServings) || 1,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
                required
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
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost btn-sm">
          {TEXTS.common.cancel}
        </button>
        <button type="submit" disabled={saving || !editName.trim()} className="btn btn-primary btn-sm">
          {saving ? TEXTS.common.saving : TEXTS.common.save}
        </button>
      </div>
    </form>
  );
}
