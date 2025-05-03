<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Status</h2>
      <DefaultButton variant="primary" size="sm" @click="showAddForm = true" v-if="!showAddForm">
        <Icon icon="mdi:plus" class="mr-2" />
        Novo Status
      </DefaultButton>
    </div>

    <div v-if="showAddForm" class="bg-surface-light p-4 rounded-lg mb-4">
      <h3 class="text-lg font-medium mb-4">{{ editingStatus ? 'Editar' : 'Novo' }} Status</h3>
      <form @submit.prevent="statusFormRef?.handleSubmit()">
        <StatusForm
          ref="statusFormRef"
          :crm-id="crmId"
          :status="editingStatus"
          @success="handleFormSuccess"
          @cancel="cancelForm"
        />
      </form>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zayit-blue"></div>
    </div>

    <div v-else-if="statuses.length === 0" class="text-center py-8 text-gray-400">
      Nenhum status cadastrado. Crie um novo status para começar.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="status in sortedStatuses"
        :key="status.id"
        class="bg-surface-light p-4 rounded-lg flex justify-between items-center"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: status.color }"
          ></div>
          <div>
            <h3 class="font-medium">{{ status.name }}</h3>
            <p v-if="status.description" class="text-sm text-gray-400">{{ status.description }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-400">Ordem: {{ status.order }}</span>
          <div class="flex space-x-2">
            <button
              @click="editStatus(status)"
              class="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Icon icon="mdi:pencil" />
            </button>
            <button
              @click="confirmDelete(status)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Icon icon="mdi:delete" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Excluir Status"
      :message="`Tem certeza que deseja excluir o status '${statusToDelete?.name}'? Esta ação não pode ser desfeita.`"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="HandleDeleteStatus"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ConfirmDialog from '@/components/ui/dialogs/ConfirmDialog.vue';
import StatusForm from './StatusForm.vue';
import { useStatusList } from '@/composables/crm/useStatusList';
import { deleteStatus } from '@/services/statusService';
import { useToast } from '@/composables/useToast';
import type { Status } from '@/types';

const props = defineProps<{
  crmId: string;
}>();

const toast = useToast();
const { statuses, isLoading, fetchStatuses } = useStatusList(props.crmId);
const showAddForm = ref(false);
const editingStatus = ref<Status | undefined>(undefined);
const statusFormRef = ref<InstanceType<typeof StatusForm> | null>(null);

const showDeleteConfirm = ref(false);
const statusToDelete = ref<Status | null>(null);

const sortedStatuses = computed(() => {
  return [...statuses.value].sort((a, b) => a.order - b.order);
});

onMounted(async () => {
  await fetchStatuses();
});

const handleFormSuccess = async () => {
  showAddForm.value = false;
  editingStatus.value = undefined;
  await fetchStatuses();
};

const cancelForm = () => {
  showAddForm.value = false;
  editingStatus.value = undefined;
};

const editStatus = (status: Status) => {
  editingStatus.value = status;
  showAddForm.value = true;
};

const confirmDelete = (status: Status) => {
  statusToDelete.value = status;
  showDeleteConfirm.value = true;
};

const HandleDeleteStatus = async () => {
  if (!statusToDelete.value) return;
  
  try {
    await deleteStatus(props.crmId, statusToDelete.value.id);
    toast.success('Status excluído com sucesso!');
    await fetchStatuses();
  } catch (error) {
    console.error('Erro ao excluir status:', error);
    toast.error('Erro ao excluir status. Tente novamente.');
  } finally {
    showDeleteConfirm.value = false;
    statusToDelete.value = null;
  }
};
</script>
