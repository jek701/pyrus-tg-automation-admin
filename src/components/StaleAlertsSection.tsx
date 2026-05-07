import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { useState } from 'react';
import { TOPIC_ICON_COLORS, type IntegrationFormValues } from './integrationForm';
import { useTopicIconPresets } from '../lib/hooks';

interface StaleAlertsSectionProps {
  register: UseFormRegister<IntegrationFormValues>;
  control: Control<IntegrationFormValues>;
  errors: FieldErrors<IntegrationFormValues>;
  readOnly?: boolean;
  currentThreadId: number | null;
}

export function StaleAlertsSection({ register, control, errors, readOnly, currentThreadId }: StaleAlertsSectionProps) {
  const presetsQuery = useTopicIconPresets();
  const presets = presetsQuery.data?.items ?? [];
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <section className="formSection">
      <div className="sectionHeader">
        <h3>Stale-task alerts</h3>
      </div>
      <label>
        <span>Topic name</span>
        <input
          {...register('stale_alerts.topic_name')}
          disabled={readOnly}
          placeholder="Not answered tasks"
        />
        {errors.stale_alerts?.topic_name ? (
          <em className="fieldError">{errors.stale_alerts.topic_name.message}</em>
        ) : null}
      </label>

      <div className="iconPickerSection">
        <Controller
          control={control}
          name="stale_alerts.icon_color"
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
        {errors.stale_alerts?.icon_color ? (
          <em className="fieldError">{errors.stale_alerts.icon_color.message}</em>
        ) : null}

        <Controller
          control={control}
          name="stale_alerts.icon_custom_emoji_id"
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
            name="stale_alerts.icon_custom_emoji_id"
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

      {currentThreadId ? (
        <p className="sectionHint">
          Forum topic created (thread ID {currentThreadId}). Changing name, color, or emoji clears it so a fresh topic
          is created on the next alert (Telegram does not allow editing existing topic color).
        </p>
      ) : (
        <p className="sectionHint">Topic will be created lazily on the first alert.</p>
      )}
    </section>
  );
}
