<template>
  <div class="styled-placeholder-editor">
    <!-- Hidden textarea for form data -->
    <textarea
      ref="hiddenTextarea"
      :id="textareaId"
      :value="modelValue"
      @input="onTextareaInput"
      class="hidden"
    ></textarea>
    
    <!-- Styled editor with placeholders -->
    <div 
      ref="editorDiv"
      class="input-base styled-editor"
      contenteditable="true"
      @input="onEditorInput"
      @keydown="onEditorKeydown"
      @click="syncCursorPosition"
      v-html="styledContent"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps<{
  modelValue: string;
  textareaId: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const hiddenTextarea = ref<HTMLTextAreaElement | null>(null);
const editorDiv = ref<HTMLDivElement | null>(null);
const lastCursorPosition = ref(0);

// Style the content by replacing placeholders with styled spans
const styledContent = computed(() => {
  if (!props.modelValue) return '';
  
  // Replace placeholders with styled spans
  return props.modelValue.replace(/{{([^}]+)}}/g, (match, placeholder) => {
    const placeholderText = placeholder.trim();
    let displayText = placeholderText;
    
    // For tag placeholders, extract the ID
    if (placeholderText.startsWith('tag:')) {
      displayText = placeholderText;
    }
    
    return `<span class="placeholder-tag" data-placeholder="${match}">
      {{${displayText}}}
      <span class="placeholder-remove" data-placeholder="${match}">×</span>
    </span>`;
  });
});

// Handle input in the hidden textarea
function onTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}

// Handle input in the styled editor
function onEditorInput(event: Event) {
  if (!editorDiv.value || !hiddenTextarea.value) return;
  
  // Get the raw text content (without HTML)
  let content = editorDiv.value.innerText;
  
  // Update the model value
  emit('update:modelValue', content);
  
  // Save cursor position
  saveCursorPosition();
}

// Handle keydown events in the editor
function onEditorKeydown(event: KeyboardEvent) {
  // Special handling for backspace and delete keys
  if (event.key === 'Backspace' || event.key === 'Delete') {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      
      // Check if we're inside or next to a placeholder
      const placeholderTag = findClosestPlaceholder(node);
      if (placeholderTag) {
        // Delete the entire placeholder
        removePlaceholder(placeholderTag);
        event.preventDefault();
      }
    }
  }
}

// Find the closest placeholder element
function findClosestPlaceholder(node: Node): HTMLElement | null {
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode as Node;
  }
  
  let current = node as HTMLElement;
  while (current && current !== editorDiv.value) {
    if (current.classList && current.classList.contains('placeholder-tag')) {
      return current;
    }
    current = current.parentNode as HTMLElement;
  }
  
  return null;
}

// Remove a placeholder
function removePlaceholder(element: HTMLElement) {
  if (!element || !hiddenTextarea.value) return;
  
  // Get the placeholder text
  const placeholder = element.dataset.placeholder;
  if (!placeholder) return;
  
  // Remove the placeholder from the model value
  const newValue = props.modelValue.replace(placeholder, '');
  emit('update:modelValue', newValue);
}

// Save the current cursor position
function saveCursorPosition() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    lastCursorPosition.value = range.startOffset;
  }
}

// Sync the cursor position between the editor and textarea
function syncCursorPosition() {
  saveCursorPosition();
}

// Handle clicks on the editor
onMounted(() => {
  if (!editorDiv.value) return;
  
  // Add event delegation for placeholder removal
  editorDiv.value.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Check if the click was on a remove button
    if (target.classList.contains('placeholder-remove')) {
      const placeholder = target.dataset.placeholder;
      if (placeholder) {
        // Find the parent placeholder element
        const placeholderElement = target.closest('.placeholder-tag') as HTMLElement;
        if (placeholderElement) {
          removePlaceholder(placeholderElement);
          event.stopPropagation();
        }
      }
    }
  });
});

// Watch for model value changes from outside
watch(() => props.modelValue, (newValue) => {
  if (hiddenTextarea.value && hiddenTextarea.value.value !== newValue) {
    hiddenTextarea.value.value = newValue;
  }
});
</script>

<style scoped>
.styled-editor {
  white-space: pre-wrap;
  min-height: 100px;
  overflow-y: auto;
}

.hidden {
  display: none;
}

:deep(.placeholder-tag) {
  display: inline-flex;
  align-items: center;
  background-color: rgba(111, 75, 219, 0.2);
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 2px;
  color: var(--color-zayit-blue);
  font-weight: 500;
}

:deep(.placeholder-remove) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(111, 75, 219, 0.3);
  color: white;
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.placeholder-remove:hover) {
  background-color: rgba(111, 75, 219, 0.5);
}
</style>
