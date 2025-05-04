<!-- /home/ubuntu/repos/zayit/apps/frontend/src/components/crm/scripts/ScriptCard.vue -->
<template>
  <div
    class="bg-card rounded-lg shadow-sm border-[1px] border-gray-700  hover:shadow-md transition-shadow p-4 flex flex-col h-full"
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
          class="text-primary hover:text-primary-600 transition-colors cursor-pointer hover:bg-zayit-blue rounded-full px-[3px] py-1"
          title="Editar"
        >
          <Icon icon="mdi:pencil" class="w-5 h-5" />
        </button>
        <button
          @click="confirmDelete"
          class="text-danger hover:text-danger-600 transition-colors cursor-pointer hover:bg-zayit-danger rounded-full px-[3px] py-1r"
          title="Excluir"
        >
          <Icon icon="mdi:delete" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { useModal } from '@/composables/useModal';
import { useScriptStore } from '@/stores/crm/scriptStore';
import type { Script } from '@/types/script.types';
import { formatDate } from '@/utils/dateFormatter';
import { useToast } from '@/composables/useToast';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';

const props = defineProps<{
  script: Script;
  crmId: string;
}>();

const router = useRouter();
const modal = useModal();
const scriptStore = useScriptStore();
const toast = useToast();

const onEdit = () => {
  router.push({
    name: 'ScriptEdit',
    params: {
      crmId: props.crmId,
      scriptId: props.script.id,
    },
  });
};

const confirmDelete = async () => {
  const result = await modal.open(ConfirmModal,{
    title: 'Excluir Script',
    props: {
      message: `Tem certeza que deseja excluir o script "${props.script.name}"?`,
    },
  });

  if(!result) return;
  await scriptStore.deleteScript(props.crmId, props.script.id);
  toast[result ? 'success' : 'error'](result ? `Script "${props.script.name}" Excluído.` : 'Falha ao deletar o script');
};

</script>
