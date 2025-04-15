<!-- src/App.vue -->
<template>
  <ModalContainer />
  <ToastContainer />
    <TailwindDebug />
  <router-view />
</template>

<script setup lang="ts">
import TailwindDebug from '@/components/dev/TailwindDebug.vue'
import ToastContainer from '@/components/ui/toast/ToastContainer.vue';
import ModalContainer from '@/components/ui/modals/ModalContainer.vue';
// vazio
</script>
