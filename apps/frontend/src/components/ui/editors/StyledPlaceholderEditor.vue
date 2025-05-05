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
      @paste="onEditorPaste"
      @blur="onEditorBlur"
      v-html="styledContent"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps<{
  modelValue: string;
  textareaId: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'format', type: string): void;
}>();

// Exposing methods for parent components
defineExpose({
  formatText
});

const hiddenTextarea = ref<HTMLTextAreaElement | null>(null);
const editorDiv = ref<HTMLDivElement | null>(null);
const isComposing = ref(false);
const lastSelection = ref<{ start: number, end: number } | null>(null);
const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const lastModelValue = ref('');

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
    
    return `<span class="placeholder-tag" data-placeholder="${match}" contenteditable="false">
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
  if (!editorDiv.value || !hiddenTextarea.value || isComposing.value) return;
  
  // Save current state to undo stack before updating (throttled)
  if (props.modelValue !== lastModelValue.value) {
    pushToUndoStack(lastModelValue.value);
    lastModelValue.value = props.modelValue;
  }
  
  // Get the raw text content without HTML
  let content = getPlainTextWithPlaceholders();
  
  // Update the model value
  emit('update:modelValue', content);
  
  // Save cursor position for later restoration
  saveSelection();
}

// Extract plain text with placeholders from editor
function getPlainTextWithPlaceholders(): string {
  if (!editorDiv.value) return '';
  
  let result = '';
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      // Check if this is a placeholder element
      if (element.classList.contains('placeholder-tag')) {
        const placeholder = element.dataset.placeholder;
        if (placeholder) {
          result += placeholder;
        }
        return; // Skip processing children of placeholders
      }
      
      // Handle line breaks properly
      if (element.tagName === 'BR') {
        result += '\n';
      } else if (element.tagName === 'DIV' && result.length > 0 && !result.endsWith('\n')) {
        // Add newline for div elements (when they're not the first element)
        result += '\n';
      }
      
      // Process children
      element.childNodes.forEach(processNode);
    }
  };
  
  editorDiv.value.childNodes.forEach(processNode);
  return result;
}

// Handle keydown events in the editor
function onEditorKeydown(event: KeyboardEvent) {
  if (!editorDiv.value) return;

  // Handle Ctrl+Z (Undo)
  if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    if (event.shiftKey) {
      handleRedo();
    } else {
      handleUndo();
    }
    return;
  }
  
  // Handle Ctrl+Y or Cmd+Shift+Z (Redo)
  if ((event.key === 'y' && (event.ctrlKey || event.metaKey)) || 
      (event.key === 'z' && event.shiftKey && (event.ctrlKey || event.metaKey))) {
    event.preventDefault();
    handleRedo();
    return;
  }

  // Handle Enter key to ensure proper line breaks
  if (event.key === 'Enter') {
    event.preventDefault();
    
    // Insert a proper line break
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // Save current state to undo stack
      pushToUndoStack(props.modelValue);
      
      const range = selection.getRangeAt(0);
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);
      
      // Move the cursor after the break
      range.setStartAfter(br);
      range.setEndAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Update the model value
      setTimeout(() => {
        const content = getPlainTextWithPlaceholders();
        emit('update:modelValue', content);
      }, 0);
    }
    return;
  }
  
  // Special handling for backspace and delete keys
  if (event.key === 'Backspace' || event.key === 'Delete') {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Skip if there's a selected range (normal deletion behavior for selections)
      if (!range.collapsed) return;
      
      const node = range.startContainer;
      
      // Check if we're inside or next to a placeholder
      const placeholderTag = findClosestPlaceholder(node);
      if (placeholderTag) {
        event.preventDefault();
        
        // Save current state to undo stack
        pushToUndoStack(props.modelValue);
        
        // Delete the entire placeholder
        removePlaceholder(placeholderTag);
      }
    }
  }
}

// Handle paste events to strip formatting
function onEditorPaste(event: ClipboardEvent) {
  event.preventDefault();
  
  if (!event.clipboardData) return;
  
  // Get plain text from clipboard
  const text = event.clipboardData.getData('text/plain');
  
  // Save current state to undo stack
  pushToUndoStack(props.modelValue);
  
  // Insert the text at cursor position
  document.execCommand('insertText', false, text);
  
  // Update the model value
  setTimeout(() => {
    const content = getPlainTextWithPlaceholders();
    emit('update:modelValue', content);
  }, 0);
}

// Handle blur event
function onEditorBlur() {
  // Final update of model value when leaving the editor
  const content = getPlainTextWithPlaceholders();
  emit('update:modelValue', content);
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
    
    if (!current.parentNode) break;
    current = current.parentNode as HTMLElement;
  }
  
  return null;
}

// Remove a placeholder
function removePlaceholder(element: HTMLElement) {
  if (!element || !editorDiv.value) return;
  
  // Get the placeholder text
  const placeholder = element.dataset.placeholder;
  if (!placeholder) return;
  
  // Remove the element from the DOM
  element.remove();
  
  // Update the model value
  const content = getPlainTextWithPlaceholders();
  emit('update:modelValue', content);
}

// Save the current selection
function saveSelection() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && editorDiv.value) {
    const range = selection.getRangeAt(0);
    
    // Calculate the offsets relative to the editor
    const editorNode = editorDiv.value;
    const start = getTextOffset(editorNode, range.startContainer, range.startOffset);
    const end = getTextOffset(editorNode, range.endContainer, range.endOffset);
    
    lastSelection.value = { start, end };
  }
}

// Restore the saved selection
function restoreSelection() {
  if (!lastSelection.value || !editorDiv.value) return;
  
  try {
    const selection = window.getSelection();
    if (!selection) return;
    
    // Find the position based on character offsets
    const { start, end } = lastSelection.value;
    const startPos = getNodeAndOffsetFromTextOffset(editorDiv.value, start);
    const endPos = getNodeAndOffsetFromTextOffset(editorDiv.value, end);
    
    if (startPos && endPos) {
      const range = document.createRange();
      range.setStart(startPos.node, startPos.offset);
      range.setEnd(endPos.node, endPos.offset);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } catch (error) {
    console.error('Error restoring selection:', error);
  }
}

// Get text offset from node and offset
function getTextOffset(root: Node, node: Node, offset: number): number {
  let totalOffset = 0;
  
  const traverse = (current: Node): boolean => {
    if (current === node) {
      totalOffset += offset;
      return true;
    }
    
    if (current.nodeType === Node.TEXT_NODE) {
      totalOffset += current.textContent?.length || 0;
    } else {
      for (let i = 0; i < current.childNodes.length; i++) {
        if (traverse(current.childNodes[i])) {
          return true;
        }
      }
      
      // Add offset for BR elements (line breaks)
      if (current.nodeName === 'BR') {
        totalOffset += 1; // Count as 1 character
      }
    }
    
    return false;
  };
  
  traverse(root);
  return totalOffset;
}

// Get node and offset from text offset
function getNodeAndOffsetFromTextOffset(root: Node, targetOffset: number): { node: Node, offset: number } | null {
  let currentOffset = 0;
  
  const traverse = (current: Node): { node: Node, offset: number } | null => {
    if (current.nodeType === Node.TEXT_NODE) {
      const length = current.textContent?.length || 0;
      
      if (currentOffset + length >= targetOffset) {
        return {
          node: current,
          offset: targetOffset - currentOffset
        };
      }
      
      currentOffset += length;
    } else {
      // Handle BR elements (line breaks)
      if (current.nodeName === 'BR') {
        if (currentOffset === targetOffset) {
          const parentNode = current.parentNode!;
          // Usar um cast explícito para ChildNode para resolver o erro de TypeScript
          const currentAsChildNode = current as ChildNode;
          return {
            node: parentNode,
            offset: Array.from(parentNode.childNodes).indexOf(currentAsChildNode) + 1
          };
        }
        currentOffset += 1; // Count as 1 character
      } else {
        for (let i = 0; i < current.childNodes.length; i++) {
          const result = traverse(current.childNodes[i]);
          if (result) return result;
        }
      }
    }
    
    return null;
  };
  
  return traverse(root);
}

// Undo/Redo functionality
function pushToUndoStack(state: string) {
  // Don't add duplicate states
  if (undoStack.value.length > 0 && undoStack.value[undoStack.value.length - 1] === state) {
    return;
  }
  
  // Max 50 states in the stack
  if (undoStack.value.length > 50) {
    undoStack.value.shift();
  }
  
  undoStack.value.push(state);
  redoStack.value = []; // Clear redo stack on new changes
}

// Format text with WhatsApp style formatting
function formatText(format: string) {
  // Save current state to undo stack
  pushToUndoStack(props.modelValue);
  
  // Get the selected text
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editorDiv.value) return;
  
  const range = selection.getRangeAt(0);
  if (range.collapsed) return; // No selection
  
  // Check if selection contains any placeholder elements
  const containsPlaceholder = checkSelectionContainsPlaceholder(range);
  if (containsPlaceholder) {
    // Alert user or handle specially
    console.warn("Cannot format text containing placeholders");
    return; // Prevent formatting text with placeholders
  }
  
  // Get the selected text
  const selectedText = range.toString();
  if (!selectedText) return;
  
  // Determine the formatting markers
  let prefix = '';
  let suffix = '';
  
  switch (format) {
    case 'bold':
      prefix = '*';
      suffix = '*';
      break;
    case 'italic':
      prefix = '_';
      suffix = '_';
      break;
    case 'strikethrough':
      prefix = '~';
      suffix = '~';
      break;
    case 'code':
      prefix = '`';
      suffix = '`';
      break;
    case 'list':
      // For lists, prefix each line with "- "
      prefix = '';
      suffix = '';
      const lines = selectedText.split('\n');
      const formattedLines = lines.map(line => `- ${line}`);
      const formattedText = formattedLines.join('\n');
      
      // Replace the selection with the formatted text
      range.deleteContents();
      range.insertNode(document.createTextNode(formattedText));
      
      // Update the model value
      const content = getPlainTextWithPlaceholders();
      emit('update:modelValue', content);
      return;
    case 'orderedList':
      // For ordered lists, prefix each line with "1. ", "2. ", etc.
      prefix = '';
      suffix = '';
      const oLines = selectedText.split('\n');
      const formattedOLines = oLines.map((line, index) => `${index + 1}. ${line}`);
      const formattedOText = formattedOLines.join('\n');
      
      // Replace the selection with the formatted text
      range.deleteContents();
      range.insertNode(document.createTextNode(formattedOText));
      
      // Update the model value
      const oContent = getPlainTextWithPlaceholders();
      emit('update:modelValue', oContent);
      return;
    case 'quote':
      // For quotes, prefix each line with "> "
      prefix = '';
      suffix = '';
      const qLines = selectedText.split('\n');
      const formattedQLines = qLines.map(line => `> ${line}`);
      const formattedQText = formattedQLines.join('\n');
      
      // Replace the selection with the formatted text
      range.deleteContents();
      range.insertNode(document.createTextNode(formattedQText));
      
      // Update the model value
      const qContent = getPlainTextWithPlaceholders();
      emit('update:modelValue', qContent);
      return;
    default:
      return; // Unknown format
  }
  
  // Format the text by adding prefix and suffix
  const formattedText = `${prefix}${selectedText}${suffix}`;
  
  // Replace the selection with the formatted text
  range.deleteContents();
  range.insertNode(document.createTextNode(formattedText));
  
  // Update the model value
  const content = getPlainTextWithPlaceholders();
  emit('update:modelValue', content);
  
  // Emit format event for parent components
  emit('format', format);
}

// Helper function to check if a selection contains placeholder elements
function checkSelectionContainsPlaceholder(range: Range): boolean {
  if (!editorDiv.value) return false;
  
  // Create a temporary div to hold the selection
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(range.cloneContents());
  
  // Check if it contains any placeholder elements
  return tempDiv.querySelector('.placeholder-tag') !== null;
}

function handleUndo() {
  if (undoStack.value.length === 0) return;
  
  // Move current state to redo stack
  redoStack.value.push(props.modelValue);
  
  // Pop last state from undo stack
  const previousState = undoStack.value.pop();
  if (previousState !== undefined) {
    emit('update:modelValue', previousState);
    lastModelValue.value = previousState;
  }
}

function handleRedo() {
  if (redoStack.value.length === 0) return;
  
  // Move current state to undo stack
  undoStack.value.push(props.modelValue);
  
  // Pop last state from redo stack
  const nextState = redoStack.value.pop();
  if (nextState !== undefined) {
    emit('update:modelValue', nextState);
    lastModelValue.value = nextState;
  }
}

// Watch for model value changes from outside
watch(() => props.modelValue, (newValue) => {
  // Update last model value to prevent adding to undo stack
  lastModelValue.value = newValue;
  
  if (hiddenTextarea.value && hiddenTextarea.value.value !== newValue) {
    hiddenTextarea.value.value = newValue;
  }
  
  // Restore selection on next tick after the DOM updates
  nextTick(() => {
    restoreSelection();
  });
}, { immediate: true });

// Atribui este componente a uma propriedade global para facilitar acesso
onMounted(() => {
  // Registre o ID do componente em um mapa global para referência entre componentes
  if (window && props.textareaId) {
    if (!(window as any).__editorInstances) {
      (window as any).__editorInstances = {};
    }
    // Armazene a referência a este componente usando o textareaId como chave
    (window as any).__editorInstances[props.textareaId] = {
      formatText
    };
  }
});

// Initialize
onMounted(() => {
  if (!editorDiv.value) return;
  
  // Initialize the undo stack with the initial state
  if (props.modelValue) {
    lastModelValue.value = props.modelValue;
    pushToUndoStack(props.modelValue);
  }
  
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
          // Save current state to undo stack
          pushToUndoStack(props.modelValue);
          
          removePlaceholder(placeholderElement);
          event.stopPropagation();
        }
      }
    }
  });
  
  // Focus the editor
  editorDiv.value.focus();
});
</script>

<style scoped>
.styled-placeholder-editor {
  /* white-space: pre-wrap; */
  min-height: 100px;
  position: relative;
}

.styled-editor {
  /* white-space: pre-wrap; */
  min-height: 100px;
  overflow-y: auto;
  outline: none;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.styled-editor:focus {
  border-color: var(--color-zayit-blue, #6F4BDB);
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
  color: var(--color-zayit-blue, #6F4BDB);
  font-weight: 500;
  user-select: all;
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