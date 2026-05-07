import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { IntegrationFormValues } from './integrationForm';

interface StaleReplyRulesEditorProps {
  control: Control<IntegrationFormValues>;
  register: UseFormRegister<IntegrationFormValues>;
  errors: FieldErrors<IntegrationFormValues>;
  readOnly?: boolean;
}

export function StaleReplyRulesEditor({ control, register, errors, readOnly }: StaleReplyRulesEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'stale_reply_rules' });

  return (
    <section className="formSection">
      <div className="sectionHeader">
        <div>
          <h3>Stale-reply rules</h3>
          <p className="sectionHint">
            Trigger an alert if no expected responder has commented within the threshold.
          </p>
          {errors.stale_reply_rules?.message ? (
            <p className="fieldError">{errors.stale_reply_rules.message}</p>
          ) : null}
        </div>
        {!readOnly ? (
          <button
            type="button"
            className="secondaryButton compactButton"
            onClick={() =>
              append({
                threshold_amount: 1,
                threshold_unit: 'days',
                is_enabled: true,
                responders: [{ responder_type: 'user', pyrus_entity_id: 0, name: '' }],
              })
            }
          >
            <Plus size={15} />
            Add rule
          </button>
        ) : null}
      </div>

      <div className="rulesList">
        {fields.map((field, index) => (
          <StaleRuleRow
            key={field.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            readOnly={readOnly}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </section>
  );
}

interface StaleRuleRowProps {
  index: number;
  control: Control<IntegrationFormValues>;
  register: UseFormRegister<IntegrationFormValues>;
  errors: FieldErrors<IntegrationFormValues>;
  readOnly?: boolean;
  onRemove: () => void;
}

function StaleRuleRow({ index, control, register, errors, readOnly, onRemove }: StaleRuleRowProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `stale_reply_rules.${index}.responders`,
  });
  const ruleErrors = errors.stale_reply_rules?.[index];

  return (
    <div className="ruleGroup">
      <div className="ruleRow">
        <label>
          <span>If no answer in</span>
          <input
            type="number"
            min={1}
            {...register(`stale_reply_rules.${index}.threshold_amount`, { valueAsNumber: true })}
            disabled={readOnly}
          />
          {ruleErrors?.threshold_amount ? (
            <em className="fieldError">{ruleErrors.threshold_amount.message}</em>
          ) : null}
        </label>
        <label>
          <span>Unit</span>
          <select {...register(`stale_reply_rules.${index}.threshold_unit`)} disabled={readOnly}>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </label>
        <Controller
          control={control}
          name={`stale_reply_rules.${index}.is_enabled`}
          render={({ field }) => (
            <label className="switchField ruleSwitch">
              <input type="checkbox" checked={field.value} onChange={field.onChange} disabled={readOnly} />
              <span>Enabled</span>
            </label>
          )}
        />
        {!readOnly ? (
          <button type="button" className="iconButton dangerIcon" onClick={onRemove} aria-label="Remove rule">
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>

      <div className="responderList">
        <div className="responderHeader">
          <span>Expected responders (any of)</span>
          {!readOnly ? (
            <button
              type="button"
              className="secondaryButton compactButton"
              onClick={() => append({ responder_type: 'user', pyrus_entity_id: 0, name: '' })}
            >
              <Plus size={14} />
              Add
            </button>
          ) : null}
        </div>
        {ruleErrors?.responders?.message ? (
          <p className="fieldError">{ruleErrors.responders.message}</p>
        ) : null}
        {fields.map((responder, rIdx) => (
          <div className="ruleRow" key={responder.id}>
            <label>
              <span>Type</span>
              <select
                {...register(`stale_reply_rules.${index}.responders.${rIdx}.responder_type`)}
                disabled={readOnly}
              >
                <option value="user">User</option>
                <option value="role">Role</option>
                <option value="form">Form</option>
              </select>
            </label>
            <label>
              <span>Pyrus ID</span>
              <input
                type="number"
                {...register(`stale_reply_rules.${index}.responders.${rIdx}.pyrus_entity_id`, {
                  valueAsNumber: true,
                })}
                disabled={readOnly}
              />
              {ruleErrors?.responders?.[rIdx]?.pyrus_entity_id ? (
                <em className="fieldError">{ruleErrors.responders[rIdx]?.pyrus_entity_id?.message}</em>
              ) : null}
            </label>
            <label>
              <span>Name</span>
              <input
                {...register(`stale_reply_rules.${index}.responders.${rIdx}.name`)}
                disabled={readOnly}
                placeholder="Optional"
              />
            </label>
            {!readOnly ? (
              <button
                type="button"
                className="iconButton dangerIcon"
                onClick={() => remove(rIdx)}
                aria-label="Remove responder"
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
