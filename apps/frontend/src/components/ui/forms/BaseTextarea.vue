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
        :class="[
          'w-full rounded-lg px-4 py-2 bg-surface border text-white placeholder-gray-400 overflow-hidden',
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-zayit-blue',
          'focus:outline-none focus:ring-1 focus:zayit-blue',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          resizeClass,
        ]"
      />
      <div
        v-if="maxlength"
        class="absolute bottom-1 right-2 text-xs text-white/50 pointer-events-none"
      >
        {{ modelValue.length }} / {{ maxlength }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed, onMounted, nextTick } from 'vue'
  
  const props = defineProps<{
    modelValue: string
    placeholder?: string
    error?: string
    disabled?: boolean
    id?: string
    rows?: number
    maxlength?: number
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
    autogrow?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  
  const resizeClass = computed(() => {
    return {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }[props.resize ?? 'none']
  })
  
  function onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    if (props.autogrow) adjustHeight()
  }
  
  function adjustHeight() {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    }
  }
  
  onMounted(() => {
    if (props.autogrow) nextTick(adjustHeight)
  })
  
  watch(() => props.modelValue, () => {
    if (props.autogrow) nextTick(adjustHeight)
  })
  </script>
  