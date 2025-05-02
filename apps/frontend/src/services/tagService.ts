import api from '@/lib/axios';
import type { Tag, TagCreate, TagUpdate } from '@/types';

export async function getTags(crmId: string) {
  return api.get<Tag[]>(`/crms/${crmId}/tags/`);
}

export async function getTagById(crmId: string, id: string) {
  return api.get<Tag>(`/crms/${crmId}/tags/${id}`);
}

export async function createTag(crmId: string, tag: TagCreate) {
  return api.post<{ msg: string; id: string }>(`/crms/${crmId}/tags/`, tag);
}

export async function updateTag(crmId: string, id: string, tag: TagUpdate) {
  return api.put<{ msg: string }>(`/crms/${crmId}/tags/${id}`, tag);
}

export async function deleteTag(crmId: string, id: string) {
  return api.delete<{ msg: string }>(`/crms/${crmId}/tags/${id}`);
}
