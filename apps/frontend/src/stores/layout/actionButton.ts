// src/stores/layout/actionButton.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActionButton = defineStore('layout', () => {
  const component = ref<null | (() => JSX.Element)>(null)
  return { component }
})
