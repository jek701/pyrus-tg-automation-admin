import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isBusy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  isBusy,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="dialogBackdrop" role="presentation">
      <section className="confirmDialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="warningIcon">
          <AlertTriangle size={20} />
        </div>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="dialogActions">
          <button className="secondaryButton" onClick={onCancel} disabled={isBusy}>
            Cancel
          </button>
          <button className="dangerButton" onClick={onConfirm} disabled={isBusy}>
            {isBusy ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
