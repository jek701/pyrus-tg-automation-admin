export type WatchRuleType = 'user' | 'role' | 'form';
export type StaleThresholdUnit = 'minutes' | 'hours' | 'days';

export interface WatchRule {
  id?: number;
  rule_type: WatchRuleType;
  pyrus_entity_id: number;
  name?: string | null;
  is_enabled: boolean;
}

export interface StaleResponder {
  id?: number;
  responder_type: WatchRuleType;
  pyrus_entity_id: number;
  name?: string | null;
}

export interface StaleReplyRule {
  id?: number;
  threshold_amount: number;
  threshold_unit: StaleThresholdUnit;
  is_enabled: boolean;
  responders: StaleResponder[];
}

export interface StaleAlertsSettings {
  topic_name: string;
  thread_id?: number | null;
  icon_color: number | null;
  icon_custom_emoji_id: string | null;
}

export type TopicIconMatchType = WatchRuleType | 'field';

export interface TopicIconRule {
  id?: number;
  match_type: TopicIconMatchType;
  pyrus_entity_id: number;
  match_field_choice_id: number | null;
  name?: string | null;
  icon_color: number | null;
  icon_custom_emoji_id: string | null;
  sort_order: number;
  is_enabled: boolean;
}

export interface TopicIconPreset {
  custom_emoji_id: string;
  emoji: string | null;
}

export interface TopicIconPresetsResponse {
  items: TopicIconPreset[];
  cached: boolean;
}

export interface PyrusSettings {
  login: string;
  api_base_url: string;
  task_list_id: number | null;
  has_security_key?: boolean;
  security_key?: string;
}

export interface TelegramSettings {
  chat_id: string;
  topic_prefix: string;
  disable_notification: boolean;
  has_bot_token?: boolean;
  bot_token?: string;
}

export interface Integration {
  id: number;
  name: string;
  is_enabled: boolean;
  pyrus: PyrusSettings;
  telegram: TelegramSettings;
  stale_alerts: StaleAlertsSettings;
  watch_rules: WatchRule[];
  stale_reply_rules: StaleReplyRule[];
  topic_icon_rules: TopicIconRule[];
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IntegrationsResponse {
  items: Integration[];
  pagination: Pagination;
}

export interface IntegrationPayload {
  name: string;
  is_enabled?: boolean;
  pyrus: {
    login: string;
    security_key?: string;
    api_base_url: string;
    task_list_id: number | null;
  };
  telegram: {
    bot_token?: string;
    chat_id: string;
    topic_prefix: string;
    disable_notification: boolean;
  };
  stale_alerts?: {
    topic_name: string;
    icon_color: number | null;
    icon_custom_emoji_id: string | null;
  };
  watch_rules: Array<{
    rule_type: WatchRuleType;
    pyrus_entity_id: number;
    name?: string | null;
    is_enabled: boolean;
  }>;
  stale_reply_rules: Array<{
    id?: number;
    threshold_amount: number;
    threshold_unit: StaleThresholdUnit;
    is_enabled: boolean;
    responders: Array<{
      responder_type: WatchRuleType;
      pyrus_entity_id: number;
      name?: string | null;
    }>;
  }>;
  topic_icon_rules: Array<{
    match_type: TopicIconMatchType;
    pyrus_entity_id: number;
    match_field_choice_id: number | null;
    name?: string | null;
    icon_color: number | null;
    icon_custom_emoji_id: string | null;
    sort_order: number;
    is_enabled: boolean;
  }>;
}

export interface ApiErrorPayload {
  message?: string;
  error?: string;
}
