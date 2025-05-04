<!-- /home/ubuntu/repos/zayit/apps/frontend/src/components/crm/scripts/ScriptCard.vue -->
<template>
  <div
    class="bg-surface rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow p-4 flex flex-col h-full"
  >
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="text-lg font-semibold text-primary truncate">{{ script.name }}</h3>
        <div class="text-sm text-muted mt-1">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
            {{ script.type }}
          </span>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
          @click="onEdit"
          class="text-primary hover:text-primary-600 transition-colors"
          title="Editar"
        >
          <Icon icon="mdi:pencil" class="w-5 h-5" />
        </button>
        <button
          @click="confirmDelete"
          class="text-danger hover:text-danger-600 transition-colors"
          title="Excluir"
        >
          <Icon icon="mdi:delete" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="mt-2 flex-grow">
      <p class="text-sm text-muted line-clamp-3">{{ script.content }}</p>
    </div>

    <div class="mt-3 pt-3 border-t border-border text-xs text-muted">
      <div class="flex justify-between">
        <span>Criado: {{ formatDate(script.created_at) }}</span>
        <span>Atualizado: {{ formatDate(script.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { useConfirm } from '@/composables/useConfirm';
import { useScriptStore } from '@/stores/crm/scriptStore';
import type { Script } from '@/types/script.types';
import { formatDate } from '@/utils/formatters';

const props = defineProps<{
  script: Script;
  crmId: string;
}>();

const router = useRouter();
const confirm = useConfirm();
const scriptStore = useScriptStore();

const onEdit = () => {
  router.push({
    name: 'ScriptForm',
    params: {
      crmId: props.crmId,
      scriptId: props.script.id,
    },
  });
};

const confirmDelete = async () => {
  const result = await confirm.show({
    title: 'Excluir Script',
    message: `Tem certeza que deseja excluir o script "${props.script.name}"?`,
    confirmText: 'Excluir',
    cancelText: 'Cancelar',
    confirmVariant: 'danger',
  });

  if (result) {
    await scriptStore.deleteScript(props.crmId, props.script.id);
  }
};
</script>
