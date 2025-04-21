<template>
  <div class="relative w-full">
    <textarea
      ref="textareaRef"
      :id="id"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :rows="rows"
      class="input-base"
      style="--tw-ring-color: var(--color-zayit-blue), --tw-ring-shadow: none"
    />
    <div
      v-if="maxlength"
      class="absolute bottom-1 right-2 text-xs text-white/50 pointer-events-none focus:border-zayit-blue"
    >
      {{ modelValue?.length }} / {{ maxlength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  rows?: number;
  maxlength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autogrow?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const resizeClass = computed(() => {
  return {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  }[props.resize ?? 'none'];
});

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  if (props.autogrow) adjustHeight();
}

function adjustHeight() {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
  }
}

onMounted(() => {
  if (props.autogrow) nextTick(adjustHeight);
});

watch(
  () => props.modelValue,
  () => {
    if (props.autogrow) nextTick(adjustHeight);
  },
);
</script>
