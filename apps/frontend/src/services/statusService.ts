import api from '@/lib/axios';
import type { Status, StatusCreatePayload, StatusUpdatePayload } from '@/types/status.types';

export async function getStatuses(crmId: string) {
  return api.get<Status[]>(`/crms/${crmId}/statuses/`);
}

export async function getStatusById(crmId: string, id: string) {
  return api.get<Status>(`/crms/${crmId}/statuses/${id}`);
}

export async function createStatus(crmId: string, status: StatusCreatePayload) {
  return api.post<{ msg: string; id: string }>(`/crms/${crmId}/statuses/`, status);
}

export async function updateStatus(crmId: string, id: string, status: StatusUpdatePayload) {
  return api.put<{ msg: string }>(`/crms/${crmId}/statuses/${id}`, status);
}

export async function deleteStatus(crmId: string, id: string) {
  return api.delete<{ msg: string }>(`/crms/${crmId}/statuses/${id}`);
}
