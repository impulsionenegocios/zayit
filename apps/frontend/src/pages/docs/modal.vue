<template>
  <section class="p-8 space-y-10">
    <h1 class="text-2xl text-white font-bold">🪟 Modal Global</h1>

    <DocBlock
      title="useModal + ModalContainer"
      description="Exemplo completo de como abrir um modal global dinâmico com suporte a Promise e componente injetado."
      :code="modalCode"
    >
      <div class="space-x-2">
        <button @click="abrirModal" class="btn-toast btn-toast-blue">Abrir Modal</button>
      </div>
    </DocBlock>
  </section>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/useModal';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import DocBlock from '@/components/docs/DocBlock.vue';

const modal = useModal();

async function abrirModal() {
  try {
    const confirmado = await modal.open(ConfirmModal, {
      title: 'Tem certeza?',
      props: {
        message: 'Essa ação não poderá ser desfeita.',
      },
      size: 'sm',
      persistent: false,
    });
    console.log('✅ Confirmado:', confirmado);
  } catch {
    console.log('❌ Cancelado');
  }
}

const modalCode = `
  import { useModal } from '@/stores/layout/modal'
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue'
  
  const modal = useModal()
  
  try {
    const result = await modal.open(ConfirmModal, {
      title: 'Tem certeza?',
      props: { message: 'Essa ação não poderá ser desfeita.' },
      size: 'sm',
      persistent: false,
    })
  
    console.log('Confirmado:', result)
  } catch {
    console.log('Cancelado')
  }
  `.trim();
</script>
