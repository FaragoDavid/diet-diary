import { useRef, useEffect } from 'react';
import RecipeDialog from './RecipeDialog';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

export default function VariantDialog({
  variantId,
  recipes,
  ingredients,
  onClose,
}: {
  variantId: string | null;
  recipes: Recipe[];
  ingredients: Ingredient[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const variant = variantId ? (recipes.find((r) => r.id === variantId) ?? null) : null;
  const baseName = variant?.baseRecipeId ? recipes.find((r) => r.id === variant.baseRecipeId)?.name : undefined;

  useEffect(() => {
    if (variant) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [variant]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        {variant && <RecipeDialog recipe={variant} ingredients={ingredients} recipes={recipes} onClose={onClose} baseRecipeName={baseName} />}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
