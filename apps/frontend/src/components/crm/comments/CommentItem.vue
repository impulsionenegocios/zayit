<template>
  <div class="bg-card rounded-lg p-4">
    <div class="flex justify-between items-start">
      <div class="font-medium text-white">{{ comment.user_name || 'User' }}</div>
      <div class="flex items-center gap-2">
        <div class="text-sm text-gray-400">{{ formatDateTime(comment.created_at) }}</div>

        <!-- Action Buttons -->
        <div class="flex gap-1" v-if="!isEditing">
          <button
            class="text-zayit-info hover:text-white transition-colors p-1 rounded"
            title="Edit comment"
            @click="startEditing"
          >
            <Icon icon="mdi:pencil" class="text-sm" />
          </button>
          <button
            class="text-zayit-danger hover:text-white transition-colors p-1 rounded"
            title="Delete comment"
            @click="$emit('delete-comment', comment.id)"
          >
            <Icon icon="mdi:delete" class="text-sm" />
          </button>
        </div>
      </div>
    </div>

    <!-- Display Comment -->
    <p v-if="!isEditing" class="mt-1 text-white/80">{{ comment.text }}</p>

    <!-- Edit Comment Form -->
    <div v-else class="mt-2">
      <BaseTextarea v-model="editedText" :rows="3" />
      <div class="flex justify-end gap-2 mt-2">
        <DefaultButton variant="default" size="sm" @click="cancelEditing"> Cancel </DefaultButton>
        <DefaultButton variant="primary" size="sm" :disabled="!editedText.trim()" @click="saveEdit">
          Save
        </DefaultButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { formatDateTime } from '@/utils/dateFormatter';
import type { Comment } from '@/types/comment.types';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  comment: Comment;
}>();

const emit = defineEmits<{
  (e: 'delete-comment', id: string): void;
  (e: 'edit-comment', id: string, text: string): void;
}>();

const isEditing = ref(false);
const editedText = ref(props.comment.text);

function startEditing() {
  isEditing.value = true;
  editedText.value = props.comment.text;
}

function cancelEditing() {
  isEditing.value = false;
}

function saveEdit() {
  if (editedText.value.trim()) {
    emit('edit-comment', props.comment.id, editedText.value);
    isEditing.value = false;
  }
}
</script>
