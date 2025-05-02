import api from '@/lib/axios';
import type { Comment, NewComment } from '@/types/comment.types';

export async function getCommentsByLeadId(crmId: string, leadId: string) {
  const response = await api.get<Comment[]>(`/crms/${crmId}/leads/${leadId}/comments`);
  return response.data;
}

export async function createComment(crmId: string, leadId: string, newComment: NewComment) {
  const response = await api.post<Comment>(`/crms/${crmId}/leads/${leadId}/comments`, newComment);
  return response.data;
}

export async function deleteCommentById(crmId: string, leadId: string, commentId: string) {
  await api.delete(`/crms/${crmId}/leads/${leadId}/comments/${commentId}`);
}

export async function updateComment(
  crmId: string,
  leadId: string,
  commentId: string,
  text: string,
) {
  const response = await api.put<Comment>(`/crms/${crmId}/leads/${leadId}/comments/${commentId}`, {
    text,
  });
  return response.data;
}
