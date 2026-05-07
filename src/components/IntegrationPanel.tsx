import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CheckCircle2, KeyRound, Save, X } from 'lucide-react';
import { useEffect } from 'react';
import type { Integration, IntegrationPayload } from '../types/api';
import { useIntegration } from '../lib/hooks';
import { StaleAlertsSection } from './StaleAlertsSection';
import { StaleReplyRulesEditor } from './StaleReplyRulesEditor';
import { TopicIconRulesEditor } from './TopicIconRulesEditor';
import { WatchRulesEditor } from './WatchRulesEditor';
import { getDefaultValues, integrationSchema, toPayload, type IntegrationFormValues } from './integrationForm';
import { StatusBadge } from './StatusBadge';

type PanelMode = 'create' | 'edit' | 'view';

interface IntegrationPanelProps {
  open: boolean;
  mode: PanelMode;
  integration?: Integration | null;
  isSaving?: boolean;
  error?: string | null;
  onClose: () => void;
  onModeChange: (mode: PanelMode) => void;
  onSubmit: (payload: IntegrationPayload) => void;
}

export function IntegrationPanel({
  open,
  mode,
  integration,
  isSaving,
  error,
  onClose,
  onModeChange,
  onSubmit,
}: IntegrationPanelProps) {
  const { isLoading } = useIntegration(open && integration?.id ? integration.id : undefined);
  const currentIntegration = integration ?? undefined;
  const readOnly = mode === 'view';

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: getDefaultValues(currentIntegration),
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(currentIntegration));
    }
  }, [currentIntegration, open, reset]);

  if (!open) return null;

  const title = mode === 'create' ? 'Add integration' : mode === 'edit' ? 'Edit integration' : 'Integration details';
  const submitLabel = mode === 'create' ? 'Create integration' : 'Save changes';

  function submit(values: IntegrationFormValues) {
    if (mode === 'create') {
      if (!values.pyrus.security_key?.trim()) {
        setError('pyrus.security_key', { message: 'Pyrus security key is required' });
        return;
      }
      if (!values.telegram.bot_token?.trim()) {
        setError('telegram.bot_token', { message: 'Telegram bot token is required' });
        return;
      }
    }

    onSubmit(toPayload(values, mode === 'create' ? 'create' : 'edit'));
  }

  return (
    <div className="panelBackdrop" role="presentation">
      <aside className="integrationPanel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <div className="panelHeader">
          <div>
            <h2 id="panel-title">{title}</h2>
            {currentIntegration && mode !== 'create' ? (
              <div className="panelMeta">
                <StatusBadge enabled={currentIntegration.is_enabled} />
                <span>ID {currentIntegration.id}</span>
              </div>
            ) : null}
          </div>
          <button className="iconButton" onClick={onClose} aria-label="Close panel">
            <X size={18} />
          </button>
        </div>

        {isLoading ? <div className="panelLoading">Loading integration...</div> : null}
        {error ? <div className="errorBanner">{error}</div> : null}

        <form className="panelForm" onSubmit={handleSubmit(submit)}>
          <section className="formSection">
            <div className="sectionHeader">
              <h3>General</h3>
              {readOnly && currentIntegration ? (
                <button type="button" className="secondaryButton compactButton" onClick={() => onModeChange('edit')}>
                  Edit
                </button>
              ) : null}
            </div>
            <label>
              <span>Name</span>
              <input {...register('name')} disabled={readOnly} placeholder="Bellissimo IT group" />
              {errors.name ? <em className="fieldError">{errors.name.message}</em> : null}
            </label>
            <Controller
              control={control}
              name="is_enabled"
              render={({ field }) => (
                <label className="switchField">
                  <input type="checkbox" checked={field.value} onChange={field.onChange} disabled={readOnly} />
                  <span>Enabled</span>
                </label>
              )}
            />
          </section>

          <section className="formSection">
            <div className="sectionHeader">
              <h3>Pyrus</h3>
              {readOnly && currentIntegration?.pyrus.has_security_key ? (
                <span className="secretBadge">
                  <KeyRound size={14} />
                  Secret configured
                </span>
              ) : null}
            </div>
            <label>
              <span>Login</span>
              <input {...register('pyrus.login')} disabled={readOnly} placeholder="user@example.com" />
              {errors.pyrus?.login ? <em className="fieldError">{errors.pyrus.login.message}</em> : null}
            </label>
            {!readOnly ? (
              <label>
                <span>Security key</span>
                <input
                  {...register('pyrus.security_key')}
                  type="password"
                  autoComplete="new-password"
                  placeholder={mode === 'edit' ? 'Leave empty to keep existing' : 'PYRUS_SECURITY_KEY'}
                />
                {errors.pyrus?.security_key ? <em className="fieldError">{errors.pyrus.security_key.message}</em> : null}
              </label>
            ) : null}
            <label>
              <span>API base URL</span>
              <input {...register('pyrus.api_base_url')} disabled={readOnly} placeholder="https://api.pyrus.com/v4" />
              {errors.pyrus?.api_base_url ? <em className="fieldError">{errors.pyrus.api_base_url.message}</em> : null}
            </label>
            <label>
              <span>Task list ID</span>
              <input
                type="number"
                {...register('pyrus.task_list_id', { valueAsNumber: true })}
                disabled={readOnly}
                placeholder="Optional"
              />
              {errors.pyrus?.task_list_id ? <em className="fieldError">{errors.pyrus.task_list_id.message}</em> : null}
            </label>
          </section>

          <section className="formSection">
            <div className="sectionHeader">
              <h3>Telegram</h3>
              {readOnly && currentIntegration?.telegram.has_bot_token ? (
                <span className="secretBadge">
                  <KeyRound size={14} />
                  Token configured
                </span>
              ) : null}
            </div>
            {!readOnly ? (
              <label>
                <span>Bot token</span>
                <input
                  {...register('telegram.bot_token')}
                  type="password"
                  autoComplete="new-password"
                  placeholder={mode === 'edit' ? 'Leave empty to keep existing' : '123:telegram-token'}
                />
                {errors.telegram?.bot_token ? <em className="fieldError">{errors.telegram.bot_token.message}</em> : null}
              </label>
            ) : null}
            <label>
              <span>Chat ID</span>
              <input {...register('telegram.chat_id')} disabled={readOnly} placeholder="-1001234567890" />
              {errors.telegram?.chat_id ? <em className="fieldError">{errors.telegram.chat_id.message}</em> : null}
            </label>
            <label>
              <span>Topic prefix</span>
              <input {...register('telegram.topic_prefix')} disabled={readOnly} placeholder="Pyrus" />
            </label>
            <Controller
              control={control}
              name="telegram.disable_notification"
              render={({ field }) => (
                <label className="switchField">
                  <input type="checkbox" checked={field.value} onChange={field.onChange} disabled={readOnly} />
                  <span>Disable notifications</span>
                </label>
              )}
            />
          </section>

          <StaleAlertsSection
            register={register}
            control={control}
            errors={errors}
            readOnly={readOnly}
            currentThreadId={currentIntegration?.stale_alerts?.thread_id ?? null}
          />

          <WatchRulesEditor control={control} register={register} errors={errors} readOnly={readOnly} />

          <StaleReplyRulesEditor control={control} register={register} errors={errors} readOnly={readOnly} />

          <TopicIconRulesEditor control={control} register={register} errors={errors} readOnly={readOnly} />

          {!readOnly ? (
            <div className="panelFooter">
              <button type="button" className="secondaryButton" onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
              <button className="primaryButton" type="submit" disabled={isSaving}>
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} />
                    {submitLabel}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="panelFooter detailsFooter">
              <span>
                <CheckCircle2 size={16} />
                Secrets are write-only and never displayed.
              </span>
            </div>
          )}
        </form>
      </aside>
    </div>
  );
}
