import { Controller, useFieldArray, useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { TOPIC_ICON_COLORS, type IntegrationFormValues } from './integrationForm';
import { useTopicIconPresets } from '../lib/hooks';
import type { TopicIconPreset } from '../types/api';

interface TopicIconRulesEditorProps {
  control: Control<IntegrationFormValues>;
  register: UseFormRegister<IntegrationFormValues>;
  errors: FieldErrors<IntegrationFormValues>;
  readOnly?: boolean;
}

export function TopicIconRulesEditor({ control, register, errors, readOnly }: TopicIconRulesEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'topic_icon_rules' });
  const presetsQuery = useTopicIconPresets();
  const presets = presetsQuery.data?.items ?? [];

  return (
    <section className="formSection">
      <div className="sectionHeader">
        <div>
          <h3>Topic icons</h3>
          <p className="sectionHint">
            Match a Pyrus user/role/form. First matching rule wins. Color applies only to new topics — Telegram does not
            allow changing color of existing forum topics.
          </p>
          {presetsQuery.isError ? (
            <p className="fieldError">Failed to load icon presets — custom emoji ID still works.</p>
          ) : null}
        </div>
        {!readOnly ? (
          <button
            type="button"
            className="secondaryButton compactButton"
            onClick={() =>
              append({
                match_type: 'form',
                pyrus_entity_id: 0,
                match_field_choice_id: null,
                name: '',
                icon_color: TOPIC_ICON_COLORS[0]!.value,
                icon_custom_emoji_id: null,
                sort_order: fields.length,
                is_enabled: true,
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
          <TopicIconRuleRow
            key={field.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            readOnly={readOnly}
            presets={presets}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </section>
  );
}

interface RowProps {
  index: number;
  control: Control<IntegrationFormValues>;
  register: UseFormRegister<IntegrationFormValues>;
  errors: FieldErrors<IntegrationFormValues>;
  readOnly?: boolean;
  presets: TopicIconPreset[];
  onRemove: () => void;
}

function TopicIconRuleRow({ index, control, register, errors, readOnly, presets, onRemove }: RowProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const ruleErrors = errors.topic_icon_rules?.[index];
  const matchType = useWatch({ control, name: `topic_icon_rules.${index}.match_type` });
  const isFieldMatch = matchType === 'field';

  return (
    <div className="ruleGroup">
      <div className="ruleRow">
        <label>
          <span>Match</span>
          <select {...register(`topic_icon_rules.${index}.match_type`)} disabled={readOnly}>
            <option value="user">User</option>
            <option value="role">Role</option>
            <option value="form">Form</option>
            <option value="field">Field</option>
          </select>
        </label>
        <label>
          <span>{isFieldMatch ? 'Field ID' : 'Pyrus ID'}</span>
          <input
            type="number"
            {...register(`topic_icon_rules.${index}.pyrus_entity_id`, { valueAsNumber: true })}
            disabled={readOnly}
          />
          {ruleErrors?.pyrus_entity_id ? (
            <em className="fieldError">{ruleErrors.pyrus_entity_id.message}</em>
          ) : null}
        </label>
        {isFieldMatch ? (
          <label>
            <span>Choice ID</span>
            <input
              type="number"
              {...register(`topic_icon_rules.${index}.match_field_choice_id`, { valueAsNumber: true })}
              disabled={readOnly}
            />
            {ruleErrors?.match_field_choice_id ? (
              <em className="fieldError">{ruleErrors.match_field_choice_id.message}</em>
            ) : null}
          </label>
        ) : null}
        <label>
          <span>Name</span>
          <input {...register(`topic_icon_rules.${index}.name`)} disabled={readOnly} placeholder="Optional" />
        </label>
        <Controller
          control={control}
          name={`topic_icon_rules.${index}.is_enabled`}
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

      <div className="iconPickerSection">
        <Controller
          control={control}
          name={`topic_icon_rules.${index}.icon_color`}
          render={({ field }) => (
            <div className="colorSwatches">
              <span className="colorSwatchLabel">Color</span>
              <button
                type="button"
                className={`colorSwatch ${field.value === null ? 'colorSwatchActive' : ''}`}
                onClick={() => field.onChange(null)}
                disabled={readOnly}
                title="No color"
              >
                ∅
              </button>
              {TOPIC_ICON_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`colorSwatch ${field.value === color.value ? 'colorSwatchActive' : ''}`}
                  style={{ background: color.hex }}
                  onClick={() => field.onChange(color.value)}
                  disabled={readOnly}
                  title={color.label}
                  aria-label={color.label}
                />
              ))}
            </div>
          )}
        />
        {ruleErrors?.icon_color ? <em className="fieldError">{ruleErrors.icon_color.message}</em> : null}

        <Controller
          control={control}
          name={`topic_icon_rules.${index}.icon_custom_emoji_id`}
          render={({ field }) => (
            <div className="emojiPicker">
              <span className="colorSwatchLabel">Emoji</span>
              <button
                type="button"
                className={`emojiSwatch ${!field.value ? 'colorSwatchActive' : ''}`}
                onClick={() => field.onChange(null)}
                disabled={readOnly}
                title="No emoji"
              >
                ∅
              </button>
              {field.value ? (
                <span className="emojiSelected">
                  {presets.find((p) => p.custom_emoji_id === field.value)?.emoji ?? '🆔'} <code>{field.value}</code>
                </span>
              ) : null}
              {!readOnly ? (
                <button
                  type="button"
                  className="secondaryButton compactButton"
                  onClick={() => setPickerOpen((value) => !value)}
                >
                  {pickerOpen ? 'Hide presets' : 'Pick preset'}
                </button>
              ) : null}
              {!readOnly ? (
                <input
                  type="text"
                  className="emojiIdInput"
                  placeholder="or paste custom emoji ID"
                  value={field.value ?? ''}
                  onChange={(event) => field.onChange(event.target.value || null)}
                />
              ) : null}
            </div>
          )}
        />

        {pickerOpen && !readOnly ? (
          <Controller
            control={control}
            name={`topic_icon_rules.${index}.icon_custom_emoji_id`}
            render={({ field }) => (
              <div className="emojiPresetGrid">
                {presets.length === 0 ? (
                  <p className="sectionHint">No presets loaded.</p>
                ) : (
                  presets.map((preset) => (
                    <button
                      key={preset.custom_emoji_id}
                      type="button"
                      className={`emojiPresetItem ${field.value === preset.custom_emoji_id ? 'colorSwatchActive' : ''}`}
                      onClick={() => {
                        field.onChange(preset.custom_emoji_id);
                        setPickerOpen(false);
                      }}
                      title={preset.emoji ?? preset.custom_emoji_id}
                    >
                      {preset.emoji ?? '·'}
                    </button>
                  ))
                )}
              </div>
            )}
          />
        ) : null}
      </div>
    </div>
  );
}
