<template>
  <div class="border border-white/10 rounded-lg p-6 bg-card relative">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 class="text-lg font-medium text-white">{{ title }}</h3>
        <p v-if="description" class="text-sm text-white/60">{{ description }}</p>
      </div>

      <button
        v-if="code"
        @click="copyCode"
        :class="[
          'text-xs px-2 py-1 rounded-md border transition-colors duration-300 cursor-pointer',
          copied
            ? 'bg-zayit-blue border-zayit-blue text-white'
            : 'bg-zinc-800 border-white/10 text-white/50 hover:text-white',
        ]"
        :title="copied ? 'Copiado!' : 'Copiar código'"
      >
        {{ copied ? 'Copiado!' : 'Copiar' }}
      </button>
    </div>

    <div class="mb-4">
      <slot />
    </div>

    <pre
      v-if="code"
      class="text-xs text-white bg-zinc-900 rounded-lg p-4 overflow-auto whitespace-pre-wrap"
    >
<code>{{ code }}</code>
</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  description?: string
  code?: string
}>()

const copied = ref(false)

function copyCode() {
  if (!props.code) return
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>
