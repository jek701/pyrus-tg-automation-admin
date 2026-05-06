import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createApiClient } from './api';
import type { IntegrationPayload } from '../types/api';

export function useApiClient() {
  return useMemo(() => createApiClient(), []);
}

export function useIntegrations(search: string, page = 1, limit = 50) {
  const api = useApiClient();
  return useQuery({
    queryKey: ['integrations', search, page, limit],
    queryFn: () => api.listIntegrations({ search, page, limit }),
  });
}

export function useIntegration(id?: number) {
  const api = useApiClient();
  return useQuery({
    queryKey: ['integration', id],
    queryFn: () => api.getIntegration(id!),
    enabled: Boolean(id),
  });
}

export function useCreateIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IntegrationPayload) => api.createIntegration(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['integrations'] }),
  });
}

export function useUpdateIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<IntegrationPayload> }) =>
      api.updateIntegration(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['integration', variables.id] });
    },
  });
}

export function useDeleteIntegration() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteIntegration(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['integrations'] }),
  });
}
