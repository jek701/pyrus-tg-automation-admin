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
  stale_alerts: z.object({
    topic_name: z.string().trim().min(1, 'Topic name is required').max(128),
    icon_color: z.number().int().nullable(),
    icon_custom_emoji_id: z.string().trim().nullable(),
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
  stale_reply_rules: z
    .array(
      z.object({
        id: z.number().int().positive().optional(),
        threshold_amount: z.number().int().positive('Use a positive amount'),
        threshold_unit: z.enum(['minutes', 'hours', 'days']),
        is_enabled: z.boolean(),
        responders: z
          .array(
            z.object({
              responder_type: z.enum(['user', 'role', 'form']),
              pyrus_entity_id: z.number().int().positive('Use a positive ID'),
              name: z.string().trim().optional(),
            }),
          )
          .min(1, 'Add at least one responder'),
      }),
    )
    .default([]),
  topic_icon_rules: z
    .array(
      z
        .object({
          match_type: z.enum(['user', 'role', 'form', 'field']),
          pyrus_entity_id: z.number().int().positive('Use a positive ID'),
          match_field_choice_id: z.number().int().positive().nullable(),
          name: z.string().trim().optional(),
          icon_color: z.number().int().nullable(),
          icon_custom_emoji_id: z.string().trim().nullable(),
          sort_order: z.number().int().min(0),
          is_enabled: z.boolean(),
        })
        .superRefine((value, ctx) => {
          if (value.icon_color === null && !value.icon_custom_emoji_id) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['icon_color'], message: 'Pick a color or icon' });
          }
          if (value.match_type === 'field' && !value.match_field_choice_id) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['match_field_choice_id'],
              message: 'Choice ID is required',
            });
          }
        }),
    )
    .default([]),
});

export const TOPIC_ICON_COLORS: Array<{ value: number; label: string; hex: string }> = [
  { value: 7322096, label: 'Blue', hex: '#6FB9F0' },
  { value: 16766590, label: 'Yellow', hex: '#FFD67E' },
  { value: 13338331, label: 'Purple', hex: '#CB86DB' },
  { value: 9367192, label: 'Green', hex: '#8EEE98' },
  { value: 16749490, label: 'Pink', hex: '#FF93B2' },
  { value: 16478047, label: 'Red', hex: '#FB6F5F' },
];

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
    stale_alerts: {
      topic_name: integration?.stale_alerts?.topic_name ?? 'Not answered tasks',
      icon_color: integration?.stale_alerts?.icon_color ?? null,
      icon_custom_emoji_id: integration?.stale_alerts?.icon_custom_emoji_id ?? null,
    },
    watch_rules: integration?.watch_rules.length
      ? integration.watch_rules.map((rule) => ({
          rule_type: rule.rule_type,
          pyrus_entity_id: rule.pyrus_entity_id,
          name: rule.name ?? '',
          is_enabled: rule.is_enabled,
        }))
      : [{ rule_type: 'user', pyrus_entity_id: 0, name: '', is_enabled: true }],
    stale_reply_rules:
      integration?.stale_reply_rules?.map((rule) => ({
        ...(rule.id ? { id: rule.id } : {}),
        threshold_amount: rule.threshold_amount,
        threshold_unit: rule.threshold_unit,
        is_enabled: rule.is_enabled,
        responders: rule.responders.map((responder) => ({
          responder_type: responder.responder_type,
          pyrus_entity_id: responder.pyrus_entity_id,
          name: responder.name ?? '',
        })),
      })) ?? [],
    topic_icon_rules:
      integration?.topic_icon_rules?.map((rule) => ({
        match_type: rule.match_type,
        pyrus_entity_id: rule.pyrus_entity_id,
        match_field_choice_id: rule.match_field_choice_id ?? null,
        name: rule.name ?? '',
        icon_color: rule.icon_color,
        icon_custom_emoji_id: rule.icon_custom_emoji_id,
        sort_order: rule.sort_order,
        is_enabled: rule.is_enabled,
      })) ?? [],
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
    stale_alerts: {
      topic_name: values.stale_alerts.topic_name.trim(),
      icon_color: values.stale_alerts.icon_color,
      icon_custom_emoji_id: values.stale_alerts.icon_custom_emoji_id?.trim() || null,
    },
    watch_rules: values.watch_rules.map((rule) => ({
      rule_type: rule.rule_type,
      pyrus_entity_id: rule.pyrus_entity_id,
      name: rule.name?.trim() || null,
      is_enabled: rule.is_enabled,
    })),
    stale_reply_rules: values.stale_reply_rules.map((rule) => ({
      ...(rule.id ? { id: rule.id } : {}),
      threshold_amount: rule.threshold_amount,
      threshold_unit: rule.threshold_unit,
      is_enabled: rule.is_enabled,
      responders: rule.responders.map((responder) => ({
        responder_type: responder.responder_type,
        pyrus_entity_id: responder.pyrus_entity_id,
        name: responder.name?.trim() || null,
      })),
    })),
    topic_icon_rules: values.topic_icon_rules.map((rule, index) => ({
      match_type: rule.match_type,
      pyrus_entity_id: rule.pyrus_entity_id,
      match_field_choice_id: rule.match_type === 'field' ? rule.match_field_choice_id ?? null : null,
      name: rule.name?.trim() || null,
      icon_color: rule.icon_color,
      icon_custom_emoji_id: rule.icon_custom_emoji_id?.trim() || null,
      sort_order: rule.sort_order ?? index,
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
