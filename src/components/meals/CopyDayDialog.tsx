import { useState, useRef, useEffect, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { hu } from 'react-day-picker/locale';
import { TEXTS } from '../../constants/texts';
import type { Day } from '../../types/day';

export default function CopyDayDialog({
  sourceDay,
  existingDates,
  onConfirm,
  onClose,
}: {
  sourceDay: Day | null;
  existingDates: Set<string>;
  onConfirm: (targetDate: string) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [targetDate, setTargetDate] = useState<Date | undefined>();

  const disabledDates = useMemo(() => Array.from(existingDates).map((dateStr) => new Date(dateStr + 'T00:00:00')), [existingDates]);

  const canCopy = targetDate !== undefined;

  useEffect(() => {
    if (sourceDay) {
      setTargetDate(undefined);
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [sourceDay]);

  const handleConfirm = () => {
    if (canCopy && targetDate) {
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      onConfirm(`${year}-${month}-${day}`);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box w-auto">
        <h3 className="font-bold text-base">{TEXTS.copyDay.title}</h3>
        <div className="mt-4">
          <DayPicker
            className="react-day-picker"
            mode="single"
            selected={targetDate}
            onSelect={setTargetDate}
            disabled={disabledDates}
            locale={hu}
          />
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-ghost">{TEXTS.common.cancel}</button>
          </form>
          <button onClick={handleConfirm} disabled={!canCopy} className="btn btn-sm btn-primary">
            {TEXTS.copyDay.copy}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
