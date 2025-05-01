import api from '@/lib/axios'; // your axios instance
import type { Comment, NewComment } from '@/types/comment.types';

export async function getCommentsByLeadId(leadId: string) {
  const response = await api.get<Comment[]>(`/leads/${leadId}/comments`);
  return response.data;
}

export async function createComment(leadId: string, newComment: NewComment) {
  const response = await api.post<Comment>(`/leads/${leadId}/comments`, newComment);
  return response.data;
}

export async function deleteCommentById(leadId: string, commentId: string) {
  await api.delete(`/leads/${leadId}/comments/${commentId}`);
}

export async function updateComment(leadId: string, commentId: string, text: string) {
  const response = await api.put<Comment>(`/leads/${leadId}/comments/${commentId}`, { text });
  return response.data;
}
