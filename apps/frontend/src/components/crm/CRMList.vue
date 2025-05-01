<template>
  <div class="space-y-6">
    <!-- Empty State -->
    <div v-if="!isLoading && !crms.length" class="bg-surface rounded-lg p-10 text-center">
      <div class="flex justify-center mb-4">
        <Icon icon="mdi:database-off-outline" class="text-5xl text-gray-400" />
      </div>
      <h2 class="text-lg font-semibold text-white mb-2">Nenhum CRM encontrado</h2>
      <p class="text-gray-400 mb-4">Crie seu primeiro CRM para gerenciar seus leads e clientes.</p>
      <DefaultButton variant="primary" size="lg" @click="createCRM">
        <Icon icon="mdi:plus" class="mr-2" />
        Criar um CRM
      </DefaultButton>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="isLoading"
      class="bg-surface rounded-lg p-6 flex justify-center items-center h-64"
    >
      <div class="flex flex-col items-center">
        <div
          class="w-16 h-16 border-4 border-zayit-blue border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="mt-4 text-gray-400">Carregando CRMs...</p>
      </div>
    </div>

    <!-- CRM List -->
    <div v-else class="space-y-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-white">Meus CRMs</h1>
        <DefaultButton variant="primary" size="md" @click="createCRM">
          <Icon icon="mdi:plus" class="mr-2" />
          Novo CRM
        </DefaultButton>
      </div>

      <!-- CRM Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="crm in sortedCRMs"
          :key="crm.id"
          class="bg-surface rounded-lg p-6 hover:bg-black/40 transition-colors cursor-pointer"
          @click="viewCRM(crm.id)"
        >
          <div class="flex justify-between">
            <div>
              <h2 class="text-xl font-semibold text-white mb-2">{{ crm.name }}</h2>
              <div class="text-sm text-gray-400">Criado em {{ formatDate(crm.created_at) }}</div>
            </div>
            <div class="flex space-x-2">
              <button
                class="text-gray-400 hover:text-white p-1 rounded"
                @click.stop="editCRM(crm.id)"
                title="Editar CRM"
              >
                <Icon icon="mdi:pencil" />
              </button>
              <button
                class="text-gray-400 hover:text-zayit-danger p-1 rounded"
                @click.stop="confirmDelete(crm)"
                title="Apagar CRM"
              >
                <Icon icon="mdi:delete" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useCRMStore } from '@/stores/crm/crmStore';
import { storeToRefs } from 'pinia';
import { useToast } from '@/composables/useToast';
import { useModal } from '@/composables/useModal';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import { formatDate } from '@/utils/dateFormatter';

const router = useRouter();
const crmStore = useCRMStore();
const { crms, isLoading, sortedCRMs } = storeToRefs(crmStore);
const toast = useToast();
const modal = useModal();

onMounted(() => {
  crmStore.fetchCRMs();
});undefined

function createCRM() {
  // nome alinhado ao seu router: 'CRMCreate'
  router.push({ name: 'CRMCreate' });
}

function viewCRM(crmId: string) {
  if (!crmId) {
    toast.error('ID do CRM inválido');
    return;
  }
  // nome alinhado ao seu router: 'CRMManagement'
  router.push({ name: 'CRMManagement', params: { crmId } });
}

function editCRM(crmId: string) {
  if (!crmId) {
    toast.error('ID do CRM inválido');
    return;
  }
  // nome alinhado ao seu router: 'CRMEdit'
  router.push({ name: 'CRMEdit', params: { crmId } });
}

async function confirmDelete(crm: { id: string; name: string }) {
  try {
    const confirmed = await modal.open(ConfirmModal, {
      title: 'Apagar CRM',
      props: {
        message: `Tem certeza que quer deletar "${crm.name}"? Essa ação não pode ser desfeita.`,
      },
      size: 'sm',
    });
    if (confirmed) {
      const ok = await crmStore.deleteCRM(crm.id);
      toast[ok ? 'success' : 'error'](ok ? `CRM "${crm.name}" apagado!` : 'Erro ao apagar CRM');
    }
  } catch (e) {
    console.error(e);
  }
}
</script>
