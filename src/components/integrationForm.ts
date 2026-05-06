import { z } from 'zod';
import type { Integration, IntegrationPayload } from '../types/api';

const optionalSecret = z.string().trim().optional();

export const integrationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  is_enabled: z.boolean(),
  pyrus: z.object({
    login: z.string().trim().email('Use a valid email'),
    security_key: optionalSecret,
    api_base_url: z.string().trim().url('Use a valid URL'),
    task_list_id: z.preprocess(
      (value) => (value === '' || value === undefined || Number.isNaN(value) ? null : value),
      z.number().int().positive().nullable(),
    ),
  }),
  telegram: z.object({
    bot_token: optionalSecret,
    chat_id: z.string().trim().min(1, 'Telegram chat id is required'),
    topic_prefix: z.string().trim(),
    disable_notification: z.boolean(),
  }),
  watch_rules: z
    .array(
      z.object({
        rule_type: z.enum(['user', 'role', 'form']),
        pyrus_entity_id: z.number().int().positive('Use a positive ID'),
        name: z.string().trim().optional(),
        is_enabled: z.boolean(),
      }),
    )
    .min(1, 'Add at least one watch rule'),
});

export type IntegrationFormValues = z.infer<typeof integrationSchema>;

export function getDefaultValues(integration?: Integration): IntegrationFormValues {
  return {
    name: integration?.name ?? '',
    is_enabled: integration?.is_enabled ?? true,
    pyrus: {
      login: integration?.pyrus.login ?? '',
      security_key: '',
      api_base_url: integration?.pyrus.api_base_url ?? 'https://api.pyrus.com/v4',
      task_list_id: integration?.pyrus.task_list_id ?? null,
    },
    telegram: {
      bot_token: '',
      chat_id: integration?.telegram.chat_id ?? '',
      topic_prefix: integration?.telegram.topic_prefix ?? 'Pyrus',
      disable_notification: integration?.telegram.disable_notification ?? false,
    },
    watch_rules: integration?.watch_rules.length
      ? integration.watch_rules.map((rule) => ({
          rule_type: rule.rule_type,
          pyrus_entity_id: rule.pyrus_entity_id,
          name: rule.name ?? '',
          is_enabled: rule.is_enabled,
        }))
      : [{ rule_type: 'user', pyrus_entity_id: 0, name: '', is_enabled: true }],
  };
}

export function toPayload(values: IntegrationFormValues, mode: 'create' | 'edit'): IntegrationPayload {
  const securityKey = values.pyrus.security_key?.trim();
  const botToken = values.telegram.bot_token?.trim();

  const payload: IntegrationPayload = {
    name: values.name.trim(),
    is_enabled: values.is_enabled,
    pyrus: {
      login: values.pyrus.login.trim(),
      api_base_url: values.pyrus.api_base_url.trim(),
      task_list_id: values.pyrus.task_list_id,
    },
    telegram: {
      chat_id: values.telegram.chat_id.trim(),
      topic_prefix: values.telegram.topic_prefix.trim(),
      disable_notification: values.telegram.disable_notification,
    },
    watch_rules: values.watch_rules.map((rule) => ({
      rule_type: rule.rule_type,
      pyrus_entity_id: rule.pyrus_entity_id,
      name: rule.name?.trim() || null,
      is_enabled: rule.is_enabled,
    })),
  };

  if (mode === 'create' || securityKey) {
    payload.pyrus.security_key = securityKey;
  }

  if (mode === 'create' || botToken) {
    payload.telegram.bot_token = botToken;
  }

  return payload;
}
