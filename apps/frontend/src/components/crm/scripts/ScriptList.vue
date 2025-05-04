<!-- /home/ubuntu/repos/zayit/apps/frontend/src/components/crm/scripts/ScriptList.vue -->
<template>
  <div>
    <!-- Header with actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-xl font-semibold">Scripts</h2>
        <p class="text-muted text-sm mt-1">
          Gerencie scripts para interação com leads
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- View toggle -->
        <div class="flex items-center bg-surface border border-border rounded-md">
          <button
            @click="viewMode = 'list'"
            class="p-2 rounded-l-md"
            :class="viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-primary'"
            title="Visualização em lista"
          >
            <Icon icon="mdi:format-list-bulleted" class="w-5 h-5" />
          </button>
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded-r-md"
            :class="viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-primary'"
            title="Visualização em grade"
          >
            <Icon icon="mdi:grid" class="w-5 h-5" />
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar scripts..."
            class="pl-9 pr-4 py-2 rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
          />
          <Icon
            icon="mdi:magnify"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4"
          />
        </div>

        <!-- Add new script button -->
        <DefaultButton
          variant="primary"
          size="md"
          @click="onAddNew"
          class="whitespace-nowrap"
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Novo Script
        </DefaultButton>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <Icon icon="mdi:loading" class="w-8 h-8 text-primary animate-spin" />
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredScripts.length === 0" class="bg-surface rounded-lg shadow p-8 text-center">
      <div class="flex flex-col items-center">
        <Icon icon="mdi:script-text-outline" class="w-16 h-16 text-muted mb-4" />
        <h3 class="text-lg font-medium mb-2">Nenhum script encontrado</h3>
        <p class="text-muted mb-6">
          {{ searchQuery ? 'Nenhum script corresponde à sua busca.' : 'Você ainda não criou nenhum script para este CRM.' }}
        </p>
        <DefaultButton variant="primary" size="md" @click="onAddNew">
          <Icon icon="mdi:plus" class="mr-1" />
          Criar Primeiro Script
        </DefaultButton>
      </div>
    </div>

    <!-- List view -->
    <div v-else-if="viewMode === 'list'" class="bg-surface rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-surface-variant">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
            >
              Nome
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
            >
              Tipo
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
            >
              Conteúdo
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
            >
              Data de Criação
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-surface divide-y divide-border">
          <tr v-for="script in filteredScripts" :key="script.id" class="hover:bg-surface-variant/20">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium">{{ script.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
              >
                {{ script.type }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-muted truncate max-w-xs">{{ script.content }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-muted">
              {{ formatDate(script.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-3">
                <button
                  @click="onEdit(script.id)"
                  class="text-primary hover:text-primary-600 transition-colors"
                  title="Editar"
                >
                  <Icon icon="mdi:pencil" class="w-5 h-5" />
                </button>
                <button
                  @click="confirmDelete(script)"
                  class="text-danger hover:text-danger-600 transition-colors"
                  title="Excluir"
                >
                  <Icon icon="mdi:delete" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid view -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <ScriptCard
        v-for="script in filteredScripts"
        :key="script.id"
        :script="script"
        :crmId="crmId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useConfirm } from '@/composables/useConfirm';
import { useScriptStore } from '@/stores/crm/scriptStore';
import { formatDate } from '@/utils/formatters';
import type { Script } from '@/types/script.types';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ScriptCard from './ScriptCard.vue';

const route = useRoute();
const router = useRouter();
const scriptStore = useScriptStore();
const confirm = useConfirm();

const crmId = computed(() => route.params.crmId as string);
const viewMode = ref<'list' | 'grid'>('grid');
const searchQuery = ref('');

// Get scripts from store
const { scripts, isLoading } = scriptStore;

// Filter scripts based on search query
const filteredScripts = computed(() => {
  if (!searchQuery.value) return scripts.value;
  
  const query = searchQuery.value.toLowerCase();
  return scripts.value.filter(
    (script) =>
      script.name.toLowerCase().includes(query) ||
      script.type.toLowerCase().includes(query) ||
      script.content.toLowerCase().includes(query)
  );
});

// Load scripts on mount
onMounted(async () => {
  await scriptStore.fetchScripts(crmId.value);
});

// Watch for CRM ID changes to reload scripts
watch(
  () => crmId.value,
  async (newCrmId) => {
    if (newCrmId) {
      await scriptStore.fetchScripts(newCrmId);
    }
  }
);

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
  const result = await confirm.show({
    title: 'Excluir Script',
    message: `Tem certeza que deseja excluir o script "${script.name}"?`,
    confirmText: 'Excluir',
    cancelText: 'Cancelar',
    confirmVariant: 'danger',
  });

  if (result) {
    await scriptStore.deleteScript(crmId.value, script.id);
  }
};
</script>
