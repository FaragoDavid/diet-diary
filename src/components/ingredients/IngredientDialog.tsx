import { useRef, useEffect } from 'react';
import { TEXTS } from '../../constants/texts';
import IngredientForm from './IngredientForm';
import type { Ingredient, NewIngredient } from '../../types/ingredient';

export default function IngredientDialog({
  editing,
  onSave,
  onClose,
}: {
  editing: Ingredient | 'new' | null;
  onSave: (data: NewIngredient) => Promise<void>;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (editing) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [editing]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{editing === 'new' ? TEXTS.ingredients.newIngredient : TEXTS.common.update}</h3>
        {editing && <IngredientForm initial={editing === 'new' ? undefined : editing} onSave={onSave} onCancel={onClose} />}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
