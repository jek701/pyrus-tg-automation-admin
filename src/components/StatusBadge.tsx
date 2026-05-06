import { CheckCircle2, CircleOff } from 'lucide-react';

interface StatusBadgeProps {
  enabled: boolean;
}

export function StatusBadge({ enabled }: StatusBadgeProps) {
  return (
    <span className={enabled ? 'statusBadge enabled' : 'statusBadge disabled'}>
      {enabled ? <CheckCircle2 size={14} /> : <CircleOff size={14} />}
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  );
}
