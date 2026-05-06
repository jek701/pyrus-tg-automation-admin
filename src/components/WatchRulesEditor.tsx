import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { IntegrationFormValues } from './integrationForm';

interface WatchRulesEditorProps {
  control: Control<IntegrationFormValues>;
  register: UseFormRegister<IntegrationFormValues>;
  errors: FieldErrors<IntegrationFormValues>;
  readOnly?: boolean;
}

export function WatchRulesEditor({ control, register, errors, readOnly }: WatchRulesEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'watch_rules',
  });

  return (
    <section className="formSection">
      <div className="sectionHeader">
        <div>
          <h3>Watch rules</h3>
          {errors.watch_rules?.message ? <p className="fieldError">{errors.watch_rules.message}</p> : null}
        </div>
        {!readOnly ? (
          <button
            type="button"
            className="secondaryButton compactButton"
            onClick={() => append({ rule_type: 'user', pyrus_entity_id: 0, name: '', is_enabled: true })}
          >
            <Plus size={15} />
            Add rule
          </button>
        ) : null}
      </div>

      <div className="rulesList">
        {fields.map((field, index) => (
          <div className="ruleRow" key={field.id}>
            <label>
              <span>Type</span>
              <select {...register(`watch_rules.${index}.rule_type`)} disabled={readOnly}>
                <option value="user">User</option>
                <option value="role">Role</option>
                <option value="form">Form</option>
              </select>
            </label>
            <label>
              <span>Pyrus ID</span>
              <input type="number" {...register(`watch_rules.${index}.pyrus_entity_id`, { valueAsNumber: true })} disabled={readOnly} />
              {errors.watch_rules?.[index]?.pyrus_entity_id ? (
                <em className="fieldError">{errors.watch_rules[index]?.pyrus_entity_id?.message}</em>
              ) : null}
            </label>
            <label>
              <span>Name</span>
              <input {...register(`watch_rules.${index}.name`)} disabled={readOnly} placeholder="Optional" />
            </label>
            <Controller
              control={control}
              name={`watch_rules.${index}.is_enabled`}
              render={({ field: controllerField }) => (
                <label className="switchField ruleSwitch">
                  <input
                    type="checkbox"
                    checked={controllerField.value}
                    onChange={controllerField.onChange}
                    disabled={readOnly}
                  />
                  <span>Enabled</span>
                </label>
              )}
            />
            {!readOnly ? (
              <button type="button" className="iconButton dangerIcon" onClick={() => remove(index)} aria-label="Remove rule">
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
