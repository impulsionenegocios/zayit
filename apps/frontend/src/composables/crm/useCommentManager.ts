import { ref, reactive } from 'vue';
import type { Comment, NewComment } from '@/types/comment.types';
import { useToast } from '@/composables/useToast';
import {
  getCommentsByLeadId,
  createComment,
  deleteCommentById,
  updateComment,
} from '@/services/commentService';

export function useCommentManager(leadId: string) {
  const toast = useToast();
  const comments = ref<Comment[]>([]);
  const isLoading = ref(false);

  const newComment = reactive<NewComment>({
    text: '',
  });

  async function loadComments() {
    isLoading.value = true;
    try {
      comments.value = await getCommentsByLeadId(leadId);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      isLoading.value = false;
    }
  }

  async function addComment() {
    if (!newComment.text.trim()) return false;
    isLoading.value = true;
    try {
      const createdComment = await createComment(leadId, newComment);
      comments.value.unshift(createdComment); // Add to the beginning of the array
      toast.success('Comentário criado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Failed to create comment');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteComment(commentId: string) {
    try {
      await deleteCommentById(leadId, commentId);
      comments.value = comments.value.filter((comment) => comment.id !== commentId);
      toast.success('Comentário excluído');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  }

  async function editComment(commentId: string, text: string) {
    if (!text.trim()) return false;
    try {
      const updatedComment = await updateComment(leadId, commentId, text);
      const index = comments.value.findIndex((c) => c.id === commentId);
      if (index !== -1) {
        comments.value[index] = updatedComment;
        toast.success('Comentário atualizado');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update comment');
      return false;
    }
  }

  return {
    comments,
    isLoading,
    newComment,
    loadComments,
    addComment,
    deleteComment,
    editComment,
  };
}