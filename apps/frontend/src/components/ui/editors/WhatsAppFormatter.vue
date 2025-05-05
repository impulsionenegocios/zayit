<template>
  <div class="whatsapp-formatter">
    <!-- Formatting Toolbar -->
    <div class="flex bg-surface rounded p-2 mb-2 gap-2 flex-wrap">
      <DefaultButton
        v-for="(tool, index) in formattingTools"
        :key="index"
        variant="default"
        size="sm"
        @click="applyFormatting(tool.type, tool.format)"
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

// Format definitions with type for our formatText function
const formattingTools = [
  { icon: 'mdi:format-bold', format: '*', type: 'bold', tooltip: 'Negrito (*texto*)' },
  { icon: 'mdi:format-italic', format: '_', type: 'italic', tooltip: 'Itálico (_texto_)' },
  { icon: 'mdi:format-strikethrough', format: '~', type: 'strikethrough', tooltip: 'Tachado (~texto~)' },
  { icon: 'mdi:code-tags', format: '`', type: 'code', tooltip: 'Monospace (`texto`)' },
  { icon: 'mdi:format-list-bulleted', format: '- ', type: 'list', tooltip: 'Lista com marcadores (- item)' },
  { icon: 'mdi:format-list-numbered', format: '1. ', type: 'orderedList', tooltip: 'Lista numerada (1. item)' },
  { icon: 'mdi:format-quote-open', format: '> ', type: 'quote', tooltip: 'Citação (> texto)' },
];

// Apply formatting to the selected text in our editor
function applyFormatting(type: string, format: string) {
  // Método 1: Tentar obter o editor do mapa global
  if (window && (window as any).__editorInstances && (window as any).__editorInstances[props.textareaId]) {
    const editor = (window as any).__editorInstances[props.textareaId];
    if (editor && editor.formatText) {
      editor.formatText(type);
      return;
    }
  }
  
  // Método 2 (fallback): Tentar com o textarea tradicional
  // Isso só funcionará se o editor não estiver disponível, mas mantém a compatibilidade com versões antigas
  const textarea = document.getElementById(props.textareaId) as HTMLTextAreaElement;
  if (textarea) {
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
    return;
  }
  
  // Método 3: Emitir um evento personalizado que o editor pode escutar
  const event = new CustomEvent('whatsapp-format', {
    detail: { format: type, textareaId: props.textareaId },
    bubbles: true
  });
  document.dispatchEvent(event);
}
</script>