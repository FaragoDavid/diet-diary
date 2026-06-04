import { useState } from 'react';
import type { Ingredient, NewIngredient } from '../../types/ingredient';
import { CARB_LIMIT_NOT_APPLICABLE } from '../../types/ingredient';
import { TEXTS } from '../../constants/texts';

type IngredientFormData = {
  name: string;
  caloriesPer100: number | undefined;
  carbsPer100: number | undefined;
  fatPer100: number | undefined;
  isVegetable: boolean;
  carbLimit: number | null;
};

const emptyForm: IngredientFormData = {
  name: '',
  caloriesPer100: undefined,
  carbsPer100: undefined,
  fatPer100: undefined,
  isVegetable: false,
  carbLimit: 0,
};

interface IngredientFormProps {
  initial?: Ingredient;
  onSave: (data: NewIngredient) => Promise<void>;
  onCancel: () => void;
}

export default function IngredientForm({ initial, onSave, onCancel }: IngredientFormProps) {
  const [form, setForm] = useState<IngredientFormData>(initial ? { ...initial } : { ...emptyForm });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        caloriesPer100: form.caloriesPer100 ?? 0,
        carbsPer100: form.carbsPer100 ?? 0,
        fatPer100: form.fatPer100 ?? 0,
      });
    } finally {
      setSaving(false);
    }
  };

  const setField = <K extends keyof IngredientFormData>(key: K, value: IngredientFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const parseNumber = (value: string): number | undefined => {
    if (value === '') return undefined;
    return parseFloat(value) || 0;
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
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
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
                value={form.caloriesPer100 ?? ''}
                onChange={(event) => setField('caloriesPer100', parseNumber(event.target.value))}
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
                value={form.carbsPer100 ?? ''}
                onChange={(event) => setField('carbsPer100', parseNumber(event.target.value))}
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
                value={form.fatPer100 ?? ''}
                onChange={(event) => setField('fatPer100', parseNumber(event.target.value))}
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
                  onChange={(event) =>
                    setField('carbLimit', event.target.value === '' ? CARB_LIMIT_NOT_APPLICABLE : parseFloat(event.target.value) || 0)
                  }
                  className="input input-bordered input-sm w-full"
                  disabled={form.carbLimit === CARB_LIMIT_NOT_APPLICABLE}
                />
                <button
                  type="button"
                  onClick={() => setField('carbLimit', form.carbLimit === CARB_LIMIT_NOT_APPLICABLE ? 0 : CARB_LIMIT_NOT_APPLICABLE)}
                  className={`btn btn-xs whitespace-nowrap ${form.carbLimit === CARB_LIMIT_NOT_APPLICABLE ? 'btn-active' : 'btn-ghost'}`}
                >
                  {TEXTS.ingredients.carbNotApplicable}
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
