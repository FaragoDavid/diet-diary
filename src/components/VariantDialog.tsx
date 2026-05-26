import { useRef, useEffect } from 'react';
import { useRecipes } from '../services/recipes';
import RecipeDialog from './recipes/RecipeDialog';

export default function VariantDialog({ variantId, onClose }: { variantId: string | null; onClose: () => void }) {
  const { recipes } = useRecipes();
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
      <div className="modal-box">{variant && <RecipeDialog recipe={variant} onClose={onClose} baseRecipeName={baseName} />}</div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
