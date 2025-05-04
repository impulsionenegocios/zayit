<template>
  <div class="whatsapp-formatter">
    <!-- Formatting Toolbar -->
    <div class="flex bg-surface rounded p-2 mb-2 gap-2 flex-wrap">
      <DefaultButton
        v-for="(tool, index) in formattingTools"
        :key="index"
        variant="default"
        size="sm"
        @click="applyFormatting(tool.format)"
        :title="tool.tooltip"
      >
        <Icon :icon="tool.icon" />
      </DefaultButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  textareaId: string;
}>();

// Format definitions
const formattingTools = [
  { icon: 'mdi:format-bold', format: '*', tooltip: 'Negrito (*texto*)' },
  { icon: 'mdi:format-italic', format: '_', tooltip: 'Itálico (_texto_)' },
  { icon: 'mdi:format-strikethrough', format: '~', tooltip: 'Tachado (~texto~)' },
  { icon: 'mdi:code-tags', format: '`', tooltip: 'Monospace (`texto`)' },
  { icon: 'mdi:format-list-bulleted', format: '- ', tooltip: 'Lista com marcadores (- item)' },
  { icon: 'mdi:format-list-numbered', format: '1. ', tooltip: 'Lista numerada (1. item)' },
  { icon: 'mdi:format-quote-open', format: '> ', tooltip: 'Citação (> texto)' },
];

// Apply formatting to the selected text in textarea
function applyFormatting(format: string) {
  const textarea = document.getElementById(props.textareaId) as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  let newText = '';

  if (format === '- ' || format === '1. ' || format === '> ') {
    // These are prefix formats (lists, quotes)
    newText = format + selectedText;
  } else {
    // These are wrapping formats (bold, italic, etc.)
    newText = format + selectedText + format;
  }

  const newTextareaValue = 
    textarea.value.substring(0, start) + 
    newText + 
    textarea.value.substring(end);
  
  // Create a new input event to trigger Vue reactivity
  const event = new Event('input', { bubbles: true });
  textarea.value = newTextareaValue;
  textarea.dispatchEvent(event);
  
  // Set the selection range to after the newly inserted text
  textarea.focus();
  textarea.selectionStart = start + newText.length;
  textarea.selectionEnd = start + newText.length;
}
</script>
