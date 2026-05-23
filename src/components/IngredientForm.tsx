import { useState } from 'react';
import { X } from 'lucide-react';
import type { Ingredient, NewIngredient } from '../types/ingredient';
import { TEXTS } from '../constants/texts';

const emptyIngredient: NewIngredient = {
  name: '',
  caloriesPer100: 0,
  carbsPer100: 0,
  fatPer100: 0,
  isVegetable: false,
  carbLimit: 0,
};

interface IngredientFormProps {
  initial?: Ingredient;
  onSave: (data: NewIngredient) => Promise<void>;
  onCancel: () => void;
}

export default function IngredientForm({ initial, onSave, onCancel }: IngredientFormProps) {
  const [form, setForm] = useState<NewIngredient>(initial ? { ...initial } : { ...emptyIngredient });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form, name: form.name.trim() });
    } finally {
      setSaving(false);
    }
  };

  const setField = <K extends keyof NewIngredient>(key: K, value: NewIngredient[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <table className="table">
        <tbody>
          <tr>
            <td className="font-medium">{TEXTS.common.name}</td>
            <td>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className="input input-bordered input-sm w-full"
                required
                autoFocus
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.ingredients.calPer100g}</td>
            <td>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.caloriesPer100}
                onChange={(e) => setField('caloriesPer100', parseFloat(e.target.value) || 0)}
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.ingredients.carbsPer100g}</td>
            <td>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.carbsPer100}
                onChange={(e) => setField('carbsPer100', parseFloat(e.target.value) || 0)}
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.ingredients.fatPer100g}</td>
            <td>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.fatPer100}
                onChange={(e) => setField('fatPer100', parseFloat(e.target.value) || 0)}
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.ingredients.vegetable}</td>
            <td>
              <input
                type="checkbox"
                checked={form.isVegetable}
                onChange={(e) => setField('isVegetable', e.target.checked)}
                className="checkbox checkbox-sm"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.ingredients.carbLimit}</td>
            <td>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="—"
                  value={form.carbLimit ?? ''}
                  onChange={(e) => setField('carbLimit', e.target.value === '' ? null : parseFloat(e.target.value) || 0)}
                  className="input input-bordered input-sm w-full"
                />
                <button
                  type="button"
                  onClick={() => setField('carbLimit', null)}
                  disabled={form.carbLimit === null}
                  className="btn btn-ghost btn-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
          {TEXTS.common.cancel}
        </button>
        <button type="submit" disabled={saving || !form.name.trim()} className="btn btn-primary btn-sm">
          {saving ? TEXTS.common.saving : initial ? TEXTS.common.update : TEXTS.common.add}
        </button>
      </div>
    </form>
  );
}
