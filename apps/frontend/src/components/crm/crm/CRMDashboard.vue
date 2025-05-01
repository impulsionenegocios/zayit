<template>
    <div>
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-surface rounded-lg p-6 flex justify-center items-center h-64">
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-zayit-blue border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-400">Carregando CRM...</p>
        </div>
      </div>
  
      <!-- Content -->
      <div v-else-if="crm" class="space-y-6">
        <!-- CRM Header -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white">{{ crm.name }}</h1>
              <div class="text-sm text-gray-400 mt-1">
                Criado em {{ formatDate(crm.created_at) }} • Atualizado em {{ formatDate(crm.updated_at) }}
              </div>
            </div>
  
            <div class="flex gap-2">
              <DefaultButton variant="info" size="md" @click="editCRM">
                <Icon icon="mdi:pencil" class="mr-1" />
                Editar
              </DefaultButton>
              <DefaultButton variant="danger" size="md" @click="confirmDelete">
                <Icon icon="mdi:delete" class="mr-1" />
                Apagar
              </DefaultButton>
            </div>
          </div>
        </div>
  
        <!-- CRM Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Lead Management Section -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-surface rounded-lg p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Leads</h2>
              <!-- This would be replaced with your LeadManagement or LeadList component -->
              <div class="py-8 text-center text-gray-400">
                <Icon icon="mdi:account-multiple" class="text-5xl mx-auto mb-4" />
                <p>Gerenciamento de Leads estará disponível em breve.</p>
                <DefaultButton variant="primary" size="md" class="mt-4">
                  <Icon icon="mdi:plus" class="mr-1" />
                  Adicionar Lead
                </DefaultButton>
              </div>
            </div>
          </div>
  
          <!-- Quick Stats Section -->
          <div class="space-y-6">
            <div class="bg-surface rounded-lg p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Estatísticas</h2>
              <div class="space-y-4">
                <div class="bg-black/30 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Total de Leads</div>
                  <div class="text-2xl font-bold text-white">0</div>
                </div>
                <div class="bg-black/30 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Leads Ativos</div>
                  <div class="text-2xl font-bold text-white">0</div>
                </div>
                <div class="bg-black/30 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Conversões</div>
                  <div class="text-2xl font-bold text-white">0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Error State -->
      <div v-else class="bg-surface rounded-lg p-10 text-center">
        <div class="flex justify-center mb-4">
          <Icon icon="mdi:alert-circle-outline" class="text-5xl text-zayit-danger" />
        </div>
        <h2 class="text-lg font-semibold text-white mb-2">CRM não encontrado</h2>
        <p class="text-gray-400 mb-4">O CRM solicitado não existe ou foi excluído.</p>
        <DefaultButton variant="primary" size="lg" @click="goBack">
          <Icon icon="mdi:arrow-left" class="mr-2" />
          Voltar para a lista
        </DefaultButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCRMStore } from '@/stores/crm/crm';
  import { useToast } from '@/composables/useToast';
  import { useModal } from '@/composables/useModal';
  import { Icon } from '@iconify/vue';
  import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
  import { formatDate } from '@/utils/dateFormatter';
  import type { CRM } from '@/types/crm.types';
  
  const props = defineProps<{
    crmId: string;
  }>();
  
  const router = useRouter();
  const crmStore = useCRMStore();
  const toast = useToast();
  const modal = useModal();
  
  const crm = ref<CRM | null>(null);
  const { isLoading } = crmStore;
  
  onMounted(async () => {
    if (!props.crmId) {
      toast.error('CRM ID is required');
      router.push({ name: 'CRMList' });
      return;
    }
  
    const result = await crmStore.fetchCRMById(props.crmId);
    if (result) {
      crm.value = result;
    } else {
      toast.error('Failed to load CRM');
    }
  });
  
  function editCRM() {
    router.push({ name: 'EditCRM', params: { id: props.crmId } });
  }
  
  async function confirmDelete() {
    if (!crm.value) return;
    
    try {
      const confirmed = await modal.open(ConfirmModal, {
        title: 'Apagar CRM',
        props: {
          message: `Tem certeza que quer deletar "${crm.value.name}"? Essa ação não pode ser desfeita e todos os dados associados serão perdidos.`,
        },
        size: 'sm',
      });
  
      if (confirmed) {
        const success = await crmStore.deleteCRM(props.crmId);
        if (success) {
          toast.success(`CRM "${crm.value.name}" Apagado com Sucesso!`);
          router.push({ name: 'CRMList' });
        } else {
          toast.error('Erro ao tentar apagar esse CRM');
        }
      }
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  }
  
  function goBack() {
    router.push({ name: 'CRMList' });
  }
  </script>