import api from '@/lib/axios';
import type { Source, SourceCreatePayload, SourceUpdatePayload } from '@/types/source.types';

export async function getSources(crmId: string) {
  return api.get<Source[]>(`/crms/${crmId}/sources/`);
}

export async function getSourceById(crmId: string, id: string) {
  return api.get<Source>(`/crms/${crmId}/sources/${id}`);
}

export async function createSource(crmId: string, source: SourceCreatePayload) {
  return api.post<{ msg: string; id: string }>(`/crms/${crmId}/sources/`, source);
}

export async function updateSource(crmId: string, id: string, source: SourceUpdatePayload) {
  return api.put<{ msg: string }>(`/crms/${crmId}/sources/${id}`, source);
}

export async function deleteSource(crmId: string, id: string) {
  return api.delete<{ msg: string }>(`/crms/${crmId}/sources/${id}`);
}
