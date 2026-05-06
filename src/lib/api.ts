import type { Integration, IntegrationPayload, IntegrationsResponse, ApiErrorPayload } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const payload = data as ApiErrorPayload | null;
    const message = payload?.message || payload?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function createApiClient() {
  async function request<T>(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);

    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    return parseResponse<T>(response);
  }

  return {
    listIntegrations(params: { search?: string; page?: number; limit?: number }) {
      const searchParams = new URLSearchParams({
        search: params.search ?? '',
        page: String(params.page ?? 1),
        limit: String(params.limit ?? 50),
      });
      return request<IntegrationsResponse>(`/api/integrations?${searchParams.toString()}`);
    },
    getIntegration(id: number) {
      return request<Integration>(`/api/integrations/${id}`);
    },
    createIntegration(payload: IntegrationPayload) {
      return request<Integration>('/api/integrations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    updateIntegration(id: number, payload: Partial<IntegrationPayload>) {
      return request<Integration>(`/api/integrations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    deleteIntegration(id: number) {
      return request<void>(`/api/integrations/${id}`, {
        method: 'DELETE',
      });
    },
  };
}
