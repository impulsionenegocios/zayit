<template>
    <section class="p-8 space-y-10">
      <h1 class="text-2xl text-white font-bold">🔔 Toast Notifications</h1>
  
      <DocBlock
        title="useToast + ToastContainer"
        description="Exemplo completo de como disparar notificações toast globais com Pinia."
        :code="toastCode"
      >
        <div class="space-x-2">
          <button @click="toast.success('Operação realizada com sucesso!')" class="btn-toast btn-toast-green">Sucesso</button>
          <button @click="toast.error('Ocorreu um erro inesperado!')" class="btn-toast btn-toast-red">Erro</button>
          <button @click="toast.info('Essa é uma informação importante.')" class="btn-toast btn-toast-blue">Info</button>
          <button @click="toast.warning('Atenção: algo requer cuidado.')" class="btn-toast btn-toast-yellow">Aviso</button>
        </div>
      </DocBlock>
    </section>
  </template>
  
  <script setup lang="ts">
  import { useToast } from '@/stores/layout/toast'
  import DocBlock from '@/components/docs/DocBlock.vue'
  
  const toast = useToast()
  
  const toastCode = `
  const toast = useToast()
  
  toast.success('Operação realizada com sucesso!')
  toast.error('Ocorreu um erro inesperado!')
  toast.info('Essa é uma informação importante.')
  toast.warning('Atenção: algo requer cuidado.')
  `.trim()
  </script>
