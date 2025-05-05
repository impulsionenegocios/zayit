<template>
  <div>
    <div class="flex gap-2 flex-wrap mb-3">
      <div class="text-sm text-white/70 mb-1 w-full">Campos Dinâmicos: <br> Para estilizar os campos dinamicos utilize os formatadores antes de aplicar o campo</div>
      <!-- Basic placeholders -->
      <DefaultButton
        v-for="placeholder in basicPlaceholders"
        :key="placeholder.value"
        variant="info"
        size="sm"
        @click="insertPlaceholder(placeholder.value)"
        :title="placeholder.tooltip"
      >
        {{ placeholder.label }}
      </DefaultButton>
      
      <!-- Tag placeholders dropdown -->
      <div class="relative group">
        <DefaultButton
          variant="info"
          size="sm"
          class="flex items-center"
          @click="tagsDropdownOpen = !tagsDropdownOpen"
        >
          Tags
          <Icon icon="mdi:chevron-down" class="ml-1" />
        </DefaultButton>
        
        <div
          v-if="tagsDropdownOpen"
          class="absolute left-0 top-full mt-1 bg-card border border-white/10 rounded-lg shadow-lg z-50 w-64 max-h-48 overflow-y-auto"
        >
          <div v-if="isLoading" class="p-3 text-center">
            <Icon icon="mdi:loading" class="animate-spin mr-1" />
            Carregando tags...
          </div>
          
          <div v-else-if="tags.length === 0" class="p-3 text-center text-white/60">
            Nenhuma tag disponível
          </div>
          
          <div v-else class="p-2">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              @click="insertTagPlaceholder(tag)"
              class="flex items-center gap-2 p-2 w-full text-left hover:bg-white/5 rounded transition-colors"
            >
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: tag.color }"
              ></div>
              <span>{{ tag.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import { useTagList } from '@/composables/crm/useTagList';
import type { Tag } from '@/types';

const props = defineProps<{
  textareaId: string;
}>();

const route = useRoute();
const crmId = route.params.crmId as string;

// Get tags using the existing composable
const { tags, isLoading, fetchTags } = useTagList(crmId);

// UI state
const tagsDropdownOpen = ref(false);

// Basic placeholders
const basicPlaceholders = [
  { label: '{{name}}', value: '{{name}}', tooltip: 'Nome do lead' },
  { label: '{{source}}', value: '{{source}}', tooltip: 'Fonte do lead' },
];

// Insert a placeholder at the current cursor position
function insertPlaceholder(placeholder: string) {
  const textarea = document.getElementById(props.textareaId) as HTMLTextAreaElement;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  const newTextareaValue = 
    textarea.value.substring(0, start) + 
    placeholder + 
    textarea.value.substring(end);
  
  // Create a new input event to trigger Vue reactivity
  const event = new Event('input', { bubbles: true });
  textarea.value = newTextareaValue;
  textarea.dispatchEvent(event);
  
  // Set the selection range to after the newly inserted placeholder
  textarea.focus();
  textarea.selectionStart = start + placeholder.length;
  textarea.selectionEnd = start + placeholder.length;
  
  // Close the dropdown if it's open
  tagsDropdownOpen.value = false;
}

// Insert a tag placeholder
function insertTagPlaceholder(tag: Tag) {
  insertPlaceholder(`{{tag:${tag.id}}}`);
}

// Close dropdown on click outside
function handleClickOutside(event: MouseEvent) {
  if (tagsDropdownOpen.value) {
    const target = event.target as HTMLElement;
    if (!target.closest('.group')) {
      tagsDropdownOpen.value = false;
    }
  }
}

// Load tags on mount
onMounted(() => {
  fetchTags();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
