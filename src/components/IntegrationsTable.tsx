import { Edit3, Power, Trash2 } from 'lucide-react';
import type { Integration } from '../types/api';
import { StatusBadge } from './StatusBadge';

interface IntegrationsTableProps {
  integrations: Integration[];
  isUpdatingId?: number;
  onEdit: (integration: Integration) => void;
  onToggle: (integration: Integration) => void;
  onDelete: (integration: Integration) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function IntegrationsTable({
  integrations,
  isUpdatingId,
  onEdit,
  onToggle,
  onDelete,
}: IntegrationsTableProps) {
  return (
    <div className="tableWrap">
      <table className="integrationsTable">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Pyrus login</th>
            <th>Telegram chat id</th>
            <th>Topic prefix</th>
            <th>Rules</th>
            <th>Updated at</th>
            <th className="actionsColumn">Actions</th>
          </tr>
        </thead>
        <tbody>
          {integrations.map((integration) => (
            <tr key={integration.id}>
              <td>
                <StatusBadge enabled={integration.is_enabled} />
              </td>
              <td className="nameCell">{integration.name}</td>
              <td>{integration.pyrus.login}</td>
              <td className="monoCell">{integration.telegram.chat_id}</td>
              <td>{integration.telegram.topic_prefix || '-'}</td>
              <td>{integration.watch_rules.length}</td>
              <td>{formatDate(integration.updated_at)}</td>
              <td>
                <div className="rowActions">
                  <button className="iconButton" onClick={() => onEdit(integration)} aria-label="View or edit">
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="iconButton"
                    onClick={() => onToggle(integration)}
                    disabled={isUpdatingId === integration.id}
                    aria-label={integration.is_enabled ? 'Disable integration' : 'Enable integration'}
                  >
                    <Power size={16} />
                  </button>
                  <button className="iconButton dangerIcon" onClick={() => onDelete(integration)} aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
