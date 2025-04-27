<template>
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-white">Comentários</h2>
        <DefaultButton 
          v-if="comments.length > 0" 
          variant="default" 
          size="sm" 
          icon="mdi:refresh"
          @click="refreshComments"
          :disabled="isLoading"
        >
          Atualizar
        </DefaultButton>
      </div>
  
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zayit-blue"></div>
      </div>
  
      <div v-else-if="!comments.length" class="text-center py-8 text-white/60">
        <Icon icon="mdi:comment-outline" class="text-4xl mx-auto mb-2" />
        <p>Sem comentários Ainda</p>
        <p class="text-sm">Adicione o primeiro comentário para esse lead</p>
      </div>
  
      <div v-else class="space-y-3">
        <TransitionGroup name="list">
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @delete-comment="deleteComment"
            @edit-comment="editComment"
          />
        </TransitionGroup>
      </div>
  
      <div class="pt-4">
        <FormControl label="Add Comentário">
          <BaseTextarea v-model="newComment.text" placeholder="Escreva um comentário..." :rows="3" />
        </FormControl>
  
        <div class="flex justify-end mt-2">
          <DefaultButton
            variant="primary"
            size="sm"
            @click="addComment"
            :disabled="!newComment.text.trim() || isLoading"
          >
            Postar Comentário
          </DefaultButton>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCommentManager } from '@/composables/crm/useCommentManager';
  import { Icon } from '@iconify/vue';
  import CommentItem from './CommentItem.vue';
  import FormControl from '@/components/ui/forms/FormControl.vue';
  import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
  import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
  
  const props = defineProps<{
    leadId: string;
  }>();
  
  const {
    comments,
    isLoading,
    newComment,
    loadComments,
    addComment: submitComment,
    deleteComment,
    editComment,
  } = useCommentManager(props.leadId);
  
  async function addComment() {
    const success = await submitComment();
    if (success) {
      newComment.text = '';
    }
  }
  
  function refreshComments() {
    loadComments();
  }
  
  onMounted(() => {
    loadComments();
  });
  </script>
  
  <style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.4s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  </style>