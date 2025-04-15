<template>
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4 "
    >
      <transition-group
        name="toast-fade"
        tag="div"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="min-w-[250px] max-w-sm px-4 mt-4 mb-4 py-3 rounded-lg shadow-lg text-white flex items-start gap-3 border-l-4 animate-slide-in"
          :class="toastClasses(toast.type)"
        >
          <!-- Ícone -->
          <div class="mt-0.5">
            <Icon :icon="iconMap[toast.type]" class="w-5 h-5" />
          </div>
  
          <!-- Mensagem -->
          <div class="flex-1 text-sm leading-snug">
            {{ toast.message }}
          </div>
  
          <!-- Fechar -->
          <button
            @click="remove(toast.id)"
            class="text-white/60 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useToastStore } from '@/stores/layout/toast'
  import { Icon } from '@iconify/vue'
  
  const store = useToastStore()
  const { toasts } = storeToRefs(store)
  const { removeToast: remove } = store
  
  const iconMap = {
    success: 'mdi:check-circle',
    error: 'mdi:alert-circle',
    info: 'mdi:information',
    warning: 'mdi:alert',
  }
  
  function toastClasses(type: string) {
    const base = 'bg-black border-[0.5px]'
    const map = {
      success: 'border-zayit-green text-zayit-green',
      error: 'border-zayit-danger text-zayit-danger',
      info: 'border-zayit-info text-zayit-info',
      warning: 'border-zayit-warning text-zayit-warning',
    }
    return `${base} ${map[type as keyof typeof map] || ''}`
  }
  </script>
  
  <style scoped>
  @keyframes slide-in {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0%);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  
  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition: all 0.3s ease;
  }
  .toast-fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
  </style>
  