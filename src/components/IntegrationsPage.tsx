import { Plus, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  useCreateIntegration,
  useDeleteIntegration,
  useIntegrations,
  useUpdateIntegration,
} from '../lib/hooks';
import type { Integration, IntegrationPayload } from '../types/api';
import { ConfirmDialog } from './ConfirmDialog';
import { IntegrationPanel } from './IntegrationPanel';
import { IntegrationsTable } from './IntegrationsTable';

type PanelState =
  | { open: false; mode: 'create' | 'edit' | 'view'; integration: null }
  | { open: true; mode: 'create'; integration: null }
  | { open: true; mode: 'edit' | 'view'; integration: Integration };

export function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState<PanelState>({ open: false, mode: 'create', integration: null });
  const [deleteTarget, setDeleteTarget] = useState<Integration | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const integrationsQuery = useIntegrations(search);
  const createIntegration = useCreateIntegration();
  const updateIntegration = useUpdateIntegration();
  const deleteIntegration = useDeleteIntegration();

  const isSaving = createIntegration.isPending || updateIntegration.isPending;
  const updatingId = useMemo(() => {
    const variables = updateIntegration.variables;
    return updateIntegration.isPending ? variables?.id : undefined;
  }, [updateIntegration.isPending, updateIntegration.variables]);

  function openCreatePanel() {
    setMutationError(null);
    setPanel({ open: true, mode: 'create', integration: null });
  }

  function openViewPanel(integration: Integration) {
    setMutationError(null);
    setPanel({ open: true, mode: 'view', integration });
  }

  function closePanel() {
    setMutationError(null);
    setPanel({ open: false, mode: 'create', integration: null });
  }

  async function submitPanel(payload: IntegrationPayload) {
    setMutationError(null);
    try {
      if (panel.mode === 'create') {
        await createIntegration.mutateAsync(payload);
      } else if (panel.integration) {
        await updateIntegration.mutateAsync({ id: panel.integration.id, payload });
      }
      closePanel();
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Unable to save integration');
    }
  }

  async function toggleIntegration(integration: Integration) {
    setMutationError(null);
    try {
      await updateIntegration.mutateAsync({
        id: integration.id,
        payload: { is_enabled: !integration.is_enabled },
      });
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Unable to update status');
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setMutationError(null);
    try {
      await deleteIntegration.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Unable to delete integration');
    }
  }

  const integrations = integrationsQuery.data?.items ?? [];
  const pagination = integrationsQuery.data?.pagination;

  return (
    <div className="pageStack">
      <section className="toolbar">
        <div className="toolbarTitle">
          <h2>Integrations</h2>
          <span>{pagination ? `${pagination.total} total` : 'Manage sync connections'}</span>
        </div>
        <div className="toolbarControls">
          <label className="searchField">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search integrations..."
            />
          </label>
          <button className="secondaryButton" onClick={() => integrationsQuery.refetch()} disabled={integrationsQuery.isFetching}>
            <RefreshCw size={16} className={integrationsQuery.isFetching ? 'spin' : undefined} />
            Refresh
          </button>
          <button className="primaryButton" onClick={openCreatePanel}>
            <Plus size={16} />
            Add integration
          </button>
        </div>
      </section>

      {mutationError && !panel.open ? <div className="errorBanner">{mutationError}</div> : null}
      {integrationsQuery.error ? (
        <div className="errorBanner">
          {integrationsQuery.error instanceof Error ? integrationsQuery.error.message : 'Unable to load integrations'}
        </div>
      ) : null}

      <section className="contentPanel">
        {integrationsQuery.isLoading ? (
          <div className="stateBlock">Loading integrations...</div>
        ) : integrations.length === 0 ? (
          <div className="emptyState">
            <h3>No integrations found</h3>
            <p>Create the first Pyrus to Telegram sync connection, or adjust your search.</p>
            <button className="primaryButton" onClick={openCreatePanel}>
              <Plus size={16} />
              Add integration
            </button>
          </div>
        ) : (
          <IntegrationsTable
            integrations={integrations}
            isUpdatingId={updatingId}
            onEdit={openViewPanel}
            onToggle={toggleIntegration}
            onDelete={setDeleteTarget}
          />
        )}
      </section>

      <IntegrationPanel
        open={panel.open}
        mode={panel.mode}
        integration={panel.integration}
        isSaving={isSaving}
        error={mutationError}
        onClose={closePanel}
        onModeChange={(mode) => {
          if (panel.open && panel.integration) {
            setMutationError(null);
            setPanel({ open: true, mode: mode as 'edit' | 'view', integration: panel.integration });
          }
        }}
        onSubmit={submitPanel}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete integration?"
        message={`This will permanently delete "${deleteTarget?.name ?? 'this integration'}".`}
        isBusy={deleteIntegration.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
