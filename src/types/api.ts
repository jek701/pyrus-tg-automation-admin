export type WatchRuleType = 'user' | 'role' | 'form';

export interface WatchRule {
  id?: number;
  rule_type: WatchRuleType;
  pyrus_entity_id: number;
  name?: string | null;
  is_enabled: boolean;
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
  watch_rules: WatchRule[];
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
  watch_rules: Array<{
    rule_type: WatchRuleType;
    pyrus_entity_id: number;
    name?: string | null;
    is_enabled: boolean;
  }>;
}

export interface ApiErrorPayload {
  message?: string;
  error?: string;
}
