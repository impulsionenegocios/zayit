import api from '@/lib/axios';
import type { Tag, TagCreate, TagUpdate } from '@/types';

export async function getTags() {
  return api.get<Tag[]>('/tags/');
}

export async function getTagById(id: string) {
  return api.get<Tag>(`/tags/${id}`);
}

export async function createTag(tag: TagCreate) {
  return api.post<{ msg: string; id: string }>('/tags/', tag);
}

export async function updateTag(id: string, tag: TagUpdate) {
  return api.put<{ msg: string }>(`/tags/${id}`, tag);
}

export async function deleteTag(id: string) {
  return api.delete<{ msg: string }>(`/tags/${id}`);
}
