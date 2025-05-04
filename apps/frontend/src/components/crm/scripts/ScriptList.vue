<!-- /home/ubuntu/repos/zayit/apps/frontend/src/components/crm/scripts/ScriptList.vue -->
<template>
  <div class="relative px-6"> 
    <!-- Barra de ações e filtros -->
    <div class="flex flex-col gap-4 mb-6">
      <!-- Primeira linha: Ações e visualização -->
      <div class="flex justify-between items-center">
        <!-- Filtros -->
        <div class="flex gap-3">
          <!-- Filtro de tipo -->
          <div class="w-48">
            <BaseSelect
              v-model="typeFilter"
              :options="typeOptions"
              placeholder="Todos os tipos"
            />
          </div>
          
          <!-- Filtro de busca -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar scripts..."
              class="pl-9 pr-4 py-2 rounded-lg bg-card border border-white/10 text-white placeholder-gray-400 w-60"
            />
            <Icon icon="mdi:magnify" class="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        
        <!-- Botões de visualização -->
        <div>
          <button
            @click="viewMode = 'list'"
            class="px-8 py-2 cursor-pointer font-medium text-sm transition-all duration-500 rounded-l-xl"
            :class="
              viewMode === 'list'
                ? 'bg-zayit-blue text-white border-zayit-blue border'
                : 'bg-surface border border-zayit-blue text-white hover:bg-zayit-pink hover:border-zayit-pink hover:text-white'
            "
          >
            <Icon icon="mdi:format-list-bulleted" class="mr-2" />
            Lista
          </button>
          <button
            @click="viewMode = 'grid'"
            class="px-8 py-2 cursor-pointer font-medium text-sm transition-all duration-500 rounded-r-xl"
            :class="
              viewMode === 'grid'
                ? 'bg-zayit-blue text-white border-zayit-blue border'
                : 'bg-surface border border-zayit-blue text-white hover:bg-zayit-pink hover:border-zayit-pink hover:text-white'
            "
          >
            <Icon icon="mdi:grid" class="mr-2" />
            Cards
          </button> 
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <Icon icon="mdi:loading" class="w-8 h-8 text-primary animate-spin" />
    </div>

    <!-- Empty state -->
    <div v-else-if="scripts.length === 0" class="bg-surface rounded-lg shadow p-8 text-center">
      <div class="flex flex-col items-center">
        <Icon icon="mdi:script-text-outline" class="w-16 h-16 text-muted mb-4" />
        <h3 class="text-lg font-medium mb-2">Nenhum script encontrado</h3>
        <p class="text-muted mb-6">
          Você ainda não criou nenhum script para este CRM.
        </p>
        <DefaultButton variant="primary" size="md" @click="onAddNew">
          <Icon icon="mdi:plus" class="mr-1" />
          Criar Primeiro Script
        </DefaultButton>
      </div>
    </div>

    <!-- Table view using BaseTable -->
    <BaseTable
      v-else-if="viewMode === 'list'"
      :items="paginatedItems"
      :loading="isLoading"
      :columns="tableColumns"
      @bulkDelete="handleBulkDelete"
    >
      <!-- Célula personalizada para o tipo -->
      <template #cell:type="{ item }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
          {{ item.type }}
        </span>
      </template>

      <!-- Célula personalizada para data de criação -->
      <template #cell:created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <!-- Ações por linha -->
      <template #actions="{ item }">
        <div class="flex justify-end space-x-3">
          <button
            @click="onEdit(item.id)"
            class="text-primary hover:text-primary-600 transition-colors"
            title="Editar"
          >
            <Icon icon="mdi:pencil" class="w-5 h-5" />
          </button>
          <button
            @click="confirmDelete(item)"
            class="text-danger hover:text-danger-600 transition-colors"
            title="Excluir"
          >
            <Icon icon="mdi:delete" class="w-5 h-5" />
          </button>
        </div> 
      </template>
    </BaseTable>
    
    <!-- Pagination controls for list view -->
    <div v-if="viewMode === 'list' && filteredScripts.length > 0 && totalPages > 1" class="flex justify-between items-center px-6 py-4 mt-4">
      <div class="text-sm text-gray-400">
        Mostrando {{ (currentPage - 1) * 20 + 1 }} a {{ Math.min(currentPage * 20, filteredScripts.length) }} de {{ filteredScripts.length }} scripts
      </div>
      <div class="flex gap-2">
        <button 
          @click="prevPage" 
          class="px-3 py-1 rounded bg-surface text-white hover:bg-zayit-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
        >
          Anterior
        </button>
        <button 
          @click="nextPage" 
          class="px-3 py-1 rounded bg-surface text-white hover:bg-zayit-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
        >
          Próximo
        </button>
      </div>
    </div>

    <!-- Grid view -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <ScriptCard
        v-for="script in paginatedItems"
        :key="script.id"
        :script="script"
        :crmId="crmId"
      />
    </div>
    
    <!-- Pagination controls for grid view -->
    <div v-if="viewMode === 'grid' && filteredScripts.length > 0 && totalPages > 1" class="flex justify-between items-center px-6 py-4 mt-4">
      <div class="text-sm text-gray-400">
        Mostrando {{ (currentPage - 1) * 20 + 1 }} a {{ Math.min(currentPage * 20, filteredScripts.length) }} de {{ filteredScripts.length }} scripts
      </div>
      <div class="flex gap-2">
        <button 
          @click="prevPage" 
          class="px-3 py-1 rounded bg-surface text-white hover:bg-zayit-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
        >
          Anterior
        </button>
        <button 
          @click="nextPage" 
          class="px-3 py-1 rounded bg-surface text-white hover:bg-zayit-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
        >
          Próximo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useModal } from '@/composables/useModal';
import { useScriptStore } from '@/stores/crm/scriptStore';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import { formatDate } from '@/utils/dateFormatter';
import type { Script } from '@/types/script.types';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ScriptCard from './ScriptCard.vue';
import { useToast } from '@/composables/useToast';
import BaseTable from '@/components/layout/BaseTable.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import { usePagination } from '@/composables/usePagination';

const route = useRoute();
const router = useRouter();
const scriptStore = useScriptStore();
const modal = useModal();
const toast = useToast();

const crmId = computed(() => route.params.crmId as string);
const viewMode = ref<'list' | 'grid'>('grid');

// Filter states
const searchQuery = ref('');
const typeFilter = ref<string | null>(null);

// Get scripts from store
const scripts = computed(() => scriptStore.sortedScripts);
const isLoading = computed(() => scriptStore.isLoading);

// Get unique script types for filter options
const scriptTypes = computed(() => {
  const types = new Set<string>();
  scripts.value.forEach(script => {
    if (script.type) types.add(script.type);
  });
  return Array.from(types);
});

// Type filter options
const typeOptions = computed(() => [
  { value: null, label: 'Todos os tipos' },
  ...scriptTypes.value.map(type => ({
    value: type,
    label: type
  }))
]);

// Filtered scripts
const filteredScripts = computed(() => {
  let result = scripts.value;
  
  // Apply type filter
  if (typeFilter.value) {
    result = result.filter(script => script.type === typeFilter.value);
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(script => 
      script.name.toLowerCase().includes(query) || 
      (script.content && script.content.toLowerCase().includes(query))
    );
  }
  
  return result;
});

// Pagination
const { currentPage, paginatedItems, totalPages, goToPage, nextPage, prevPage } = 
  usePagination(filteredScripts, 20);

// Define table columns for BaseTable
const tableColumns = [
  { key: 'name', label: 'Nome' },
  { key: 'type', label: 'Tipo' },
  { key: 'created_at', label: 'Data de Criação' }
];

// Load scripts on mount
onMounted(async () => {
  console.log('CRM ID:', crmId.value);
  await scriptStore.fetchScripts(crmId.value);
  console.log('Scripts after fetch:', scriptStore.scripts);
});

// Watch for CRM ID changes to reload scripts
watch(
  () => crmId.value,
  async (newCrmId) => {
    if (newCrmId) {
      console.log('CRM ID changed to:', newCrmId);
      await scriptStore.fetchScripts(newCrmId);
      console.log('Scripts after CRM change:', scriptStore.scripts);
    }
  }
);

// Watch for filter changes to reset pagination
watch([typeFilter, searchQuery], () => {
  goToPage(1);
});

// Navigation
const onAddNew = () => {
  router.push({
    name: 'ScriptForm',
    params: { crmId: crmId.value },
  });
};

const onEdit = (scriptId: string) => {
  router.push({
    name: 'ScriptForm',
    params: {
      crmId: crmId.value,
      scriptId,
    },
  });
};

// Delete confirmation
const confirmDelete = async (script: Script) => {
  const result = await modal.open(ConfirmModal, {
    title: 'Excluir Script',
    props: {
      message: `Tem certeza que deseja excluir o script "${script.name}"?`,
    },
    size: 'sm',
  });

  if(!result) return;
  await scriptStore.deleteScript(crmId.value, script.id);
  toast[result ? 'success' : 'error'](result ? `Script "${script.name}" Excluído.` : 'Falha ao deletar o script');
};

// Bulk delete handler
const handleBulkDelete = async (ids: (string | number)[]) => {
  const result = await modal.open(ConfirmModal, {
    title: 'Excluir Scripts',
    props: {
      message: `Tem certeza que deseja excluir ${ids.length} scripts selecionados?`,
    },
    size: 'sm',
  });

  if (!result) return;

  let successCount = 0;
  for (const id of ids) {
    const success = await scriptStore.deleteScript(crmId.value, id.toString());
    if (success) successCount++;
  }

  toast.success(`${successCount} scripts excluídos com sucesso`);
};
</script>
