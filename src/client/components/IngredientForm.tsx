import { useState } from 'react';
import type { Ingredient, NewIngredient } from '../types/ingredient';
import { TEXTS } from '../constants/texts';

const emptyIngredient: NewIngredient = {
  name: '',
  caloriesPer100: 0,
  carbsPer100: 0,
  fatPer100: 0,
  isVegetable: false,
  isCarbCounted: true,
  inStock: true,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">{TEXTS.common.name}</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          className="input input-bordered w-full"
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text">{TEXTS.ingredients.calPer100g}</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.caloriesPer100}
            onChange={(e) => setField('caloriesPer100', parseFloat(e.target.value) || 0)}
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">{TEXTS.ingredients.carbsPer100g}</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.carbsPer100}
            onChange={(e) => setField('carbsPer100', parseFloat(e.target.value) || 0)}
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">{TEXTS.ingredients.fatPer100g}</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={form.fatPer100}
            onChange={(e) => setField('fatPer100', parseFloat(e.target.value) || 0)}
            className="input input-bordered"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="label cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={form.isVegetable}
            onChange={(e) => setField('isVegetable', e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="label-text">{TEXTS.ingredients.vegetable}</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={form.isCarbCounted}
            onChange={(e) => setField('isCarbCounted', e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="label-text">{TEXTS.ingredients.carbCounted}</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setField('inStock', e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="label-text">{TEXTS.ingredients.inStock}</span>
        </label>
      </div>

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
