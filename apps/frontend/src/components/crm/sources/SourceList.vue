<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Fontes</h2>
      <DefaultButton variant="primary" size="sm" @click="showAddForm = true" v-if="!showAddForm">
        <Icon icon="mdi:plus" class="mr-2" />
        Nova Fonte
      </DefaultButton>
    </div>

    <div v-if="showAddForm" class="bg-surface-light p-4 rounded-lg mb-4">
      <h3 class="text-lg font-medium mb-4">{{ editingSource ? 'Editar' : 'Nova' }} Fonte</h3>
      <form @submit.prevent="sourceFormRef?.handleSubmit()">
        <SourceForm
          ref="sourceFormRef"
          :crm-id="crmId"
          :source="editingSource"
          @success="handleFormSuccess"
          @cancel="cancelForm"
        />
      </form>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zayit-blue"></div>
    </div>

    <div v-else-if="sources.length === 0" class="text-center py-8 text-gray-400">
      Nenhuma fonte cadastrada. Crie uma nova fonte para começar.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="source in sources"
        :key="source.id"
        class="bg-surface-light p-4 rounded-lg flex justify-between items-center"
      >
        <div>
          <h3 class="font-medium">{{ source.name }}</h3>
          <p v-if="source.description" class="text-sm text-gray-400">{{ source.description }}</p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="editSource(source)"
            class="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Icon icon="mdi:pencil" />
          </button>
          <button
            @click="confirmDelete(source)"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Excluir Fonte"
      :message="`Tem certeza que deseja excluir a fonte '${sourceToDelete?.name}'? Esta ação não pode ser desfeita.`"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="deleteSource"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ConfirmDialog from '@/components/ui/dialogs/ConfirmDialog.vue';
import SourceForm from './SourceForm.vue';
import { useSourceList } from '@/composables/crm/useSourceList';
import { deleteSource } from '@/services/sourceService';
import { useToast } from '@/composables/useToast';
import type { Source } from '@/types';

const props = defineProps<{
  crmId: string;
}>();

const toast = useToast();
const { sources, isLoading, fetchSources } = useSourceList(props.crmId);
const showAddForm = ref(false);
const editingSource = ref<Source | undefined>(undefined);
const sourceFormRef = ref<InstanceType<typeof SourceForm> | null>(null);

const showDeleteConfirm = ref(false);
const sourceToDelete = ref<Source | null>(null);

onMounted(async () => {
  await fetchSources();
});

const handleFormSuccess = async () => {
  showAddForm.value = false;
  editingSource.value = undefined;
  await fetchSources();
};

const cancelForm = () => {
  showAddForm.value = false;
  editingSource.value = undefined;
};

const editSource = (source: Source) => {
  editingSource.value = source;
  showAddForm.value = true;
};

const confirmDelete = (source: Source) => {
  sourceToDelete.value = source;
  showDeleteConfirm.value = true;
};

const deleteSource = async () => {
  if (!sourceToDelete.value) return;
  
  try {
    await deleteSource(props.crmId, sourceToDelete.value.id);
    toast.success('Fonte excluída com sucesso!');
    await fetchSources();
  } catch (error) {
    console.error('Erro ao excluir fonte:', error);
    toast.error('Erro ao excluir fonte. Tente novamente.');
  } finally {
    showDeleteConfirm.value = false;
    sourceToDelete.value = null;
  }
};
</script>
