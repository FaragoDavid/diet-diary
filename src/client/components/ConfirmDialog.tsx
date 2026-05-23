import { useRef, useEffect } from 'react';
import { TEXTS } from '../constants/texts';

interface Props {
  open: boolean;
  title: string;
  lines: string[];
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({ open, title, lines, onConfirm, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="font-bold text-base">{title}</h3>
        <ul className="mt-3 space-y-1">
          {lines.map((line, i) => (
            <li key={i} className="text-sm text-base-content/70">
              • {line}
            </li>
          ))}
        </ul>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-ghost">{TEXTS.common.cancel}</button>
          </form>
          <button onClick={onConfirm} className="btn btn-sm btn-error">
            {TEXTS.confirm.confirmDelete}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
