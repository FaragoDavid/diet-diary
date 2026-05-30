import { useState, useEffect, useRef } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { listDriveImages, uploadImage } from '../../services/drive';
import { getAccessToken } from '../../services/auth';
import { TEXTS } from '../../constants/texts';
import type { DriveImage } from '../../services/drive';

interface Props {
  open: boolean;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

export default function ImagePickerDialog({ open, onSelect, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      loadImages();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listDriveImages(getAccessToken());
      setImages(result);
    } catch {
      setError(TEXTS.recipeGallery.uploadError);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadImage(getAccessToken(), file);
      setImages((prev) => [...prev, uploaded]);
      onSelect(uploaded.webContentLink);
    } catch {
      setError(TEXTS.recipeGallery.uploadError);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelect = (image: DriveImage) => {
    onSelect(image.webContentLink);
  };

  const renderImageGrid = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12 text-base-content/50">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          {TEXTS.recipeGallery.loadingImages}
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-8 text-error">{error}</div>;
    }

    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
          <ImageIcon className="w-12 h-12 mb-2" />
          <p>{TEXTS.recipeGallery.noImage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-auto">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => handleSelect(image)}
            className="aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
          >
            <img src={image.thumbnailLink} alt={image.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-base mb-4">{TEXTS.recipeGallery.selectImage}</h3>

        {renderImageGrid()}

        <div className="divider"></div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="file-input file-input-bordered file-input-sm flex-1"
            disabled={uploading}
          />
          {uploading && (
            <span className="flex items-center gap-1 text-sm text-base-content/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              {TEXTS.recipeGallery.uploading}
            </span>
          )}
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-ghost">{TEXTS.common.cancel}</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
