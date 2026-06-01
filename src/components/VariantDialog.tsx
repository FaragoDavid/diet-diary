import { useState, useRef, useEffect, useCallback } from 'react';
import { readRecipes } from '../services/recipes';
import RecipeDialog from './recipes/RecipeDialog';
import type { Recipe } from '../types/recipe';

export default function VariantDialog({ variantId, onClose }: { variantId: string | null; onClose: () => void }) {
  const [variant, setVariant] = useState<Recipe | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (variantId) {
      setVariant(readRecipes().find((recipe) => recipe.id === variantId) ?? null);
    } else {
      setVariant(null);
    }
  }, [variantId]);

  const baseName = variant?.baseRecipeId ? readRecipes().find((recipe) => recipe.id === variant.baseRecipeId)?.name : undefined;

  const handleRecipeChange = useCallback((updated: Recipe) => {
    setVariant(updated);
  }, []);

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
        {variant && <RecipeDialog recipe={variant} onClose={onClose} onRecipeChange={handleRecipeChange} baseRecipeName={baseName} />}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
