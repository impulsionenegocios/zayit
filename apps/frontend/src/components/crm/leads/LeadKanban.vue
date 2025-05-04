<template>
  <div class="bg-surface rounded-lg shadow p-4">
    <!-- Header com search -->
    <div class="flex flex-wrap justify-between items-center mb-6">
      <div class="flex gap-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Pesquisar leads..."
            class="pl-9 pr-4 py-2 rounded-lg bg-card border border-white/10 text-white placeholder-gray-400 w-60"
          />
          <Icon icon="mdi:magnify" class="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Kanban board -->
    <div class="overflow-x-auto pb-4">
      <div v-if="isLoadingStatuses" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zayit-blue"></div>
      </div>
      
      <div v-else class="flex gap-4 min-w-max">
        <div v-for="status in statuses" :key="status.id" class="w-72 flex-shrink-0">
          <!-- Cabeçalho da coluna -->
          <div
            class="mb-3 px-4 py-2 rounded-lg text-white font-medium text-sm flex justify-between items-center"
            :style="{ backgroundColor: status.color }"
            :class="getColumnHeaderClass(status)"
          >
            <span class="flex items-center">
              <Icon :icon="getColumnIcon(status)" class="mr-2" />
              {{ status.name }}
            </span>
            <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {{ board[status.id]?.length || 0 }}
            </span>
          </div>

          <!-- Lista dragável -->
          <draggable
            tag="div"
            :list="board[status.id] || []"
            :group="{ name: 'leads', pull: true, put: true }"
            item-key="id"
            class="space-y-3 min-h-[calc(100vh-250px)] relative"
            :data-status="status.id"
            @end="onDragEnd"
            ghost-class="opacity-50"
            :animation="250"
          >
            <template #item="{ element: lead }">
              <div
                class="bg-card rounded-lg border border-white/10 p-4 hover:border-white/30 transition-colors cursor-move"
              >
                <div class="flex justify-between items-start mb-2">
                  <div
                    class="h-10 w-10 rounded-full bg-zayit-blue flex items-center justify-center text-white font-semibold"
                  >
                    {{ getInitials(lead.name) }}
                  </div>
                  <div class="flex gap-1">
                    <router-link
                      :to="{ name: 'CRMLeadDetail', params: { crmId, leadId: lead.id } }"
                      class="text-zayit-blue hover:text-zayit-blue/80 bg-white/5 hover:bg-white/10 transition-colors p-1.5 rounded"
                    >
                      <Icon icon="mdi:eye" class="text-sm" />
                    </router-link>
                    <button
                      @click="editLead(lead)"
                      class="text-zayit-blue hover:text-zayit-blue/80 bg-white/5 hover:bg-white/10 transition-colors p-1.5 rounded"
                    >
                      <Icon icon="mdi:pencil" class="text-sm" />
                    </button>
                    <button
                      @click="deleteLead(lead)"
                      class="text-zayit-danger hover:text-zayit-danger/80 bg-white/5 hover:bg-white/10 transition-colors p-1.5 rounded"
                    >
                      <Icon icon="mdi:delete" class="text-sm" />
                    </button>
                  </div>
                </div>

                <h3 class="text-white font-medium text-base mb-1">{{ lead.name }}</h3>
                <div class="text-sm text-gray-400 mb-2 flex items-center">
                  <Icon icon="mdi:email-outline" class="mr-1 text-xs" />
                  {{ lead.email }}
                </div>
                <div class="text-sm text-gray-400 mb-2 flex items-center">
                  <Icon icon="mdi:phone-outline" class="mr-1 text-xs" />
                  {{ lead.phone }}
                </div>

                <div class="flex gap-1 flex-wrap mt-2">
                  <span
                    v-for="tag in lead.tags || []"
                    :key="tag.id"
                    class="px-2 py-0.5 text-xs rounded-full text-white"
                    :style="{ backgroundColor: tag.color || '#666' }"
                  >
                    {{ tag.name }}
                  </span>
                </div>

                <div class="text-xs text-gray-500 mt-3 flex items-center">
                  <Icon icon="mdi:calendar" class="mr-1" />
                  Criado {{ formatDate(lead.created_at) }}
                </div>
              </div>
            </template>

            <!-- Mensagem se estiver vazio -->
            <template #footer>
              <div
  v-if="(board[status.id]?.length || 0) === 0"
  class="absolute  left-1/2 -translate-x-1/2  text-center text-gray-500 text-sm py-8 flex flex-col justify-center items-center"
>

                <Icon :icon="getColumnIcon(status)" class="text-2xl mb-2" />
                <p>Nenhum Lead Aqui ainda</p>
                <p class="text-xs mt-1">Arraste o lead pra cá</p>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
import draggable from 'vuedraggable';
import { useLeadStore } from '@/stores/crm/lead';
import { useToast } from '@/composables/useToast';
import { useStatusList } from '@/composables/crm/useStatusList';
import type { Lead, LeadStatus, LeadStatusType } from '@/types/lead.types';
import type { Status } from '@/types/status.types';
import { formatDate } from '@/utils/dateFormatter';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const leadStore = useLeadStore();
const { statuses, isLoading: isLoadingStatuses, fetchStatuses } = useStatusList(route.params.crmId as string);

const crmId = route.params.crmId as string;

const props = defineProps<{
  initialViewMode?: 'list' | 'kanban';
}>();

const emit = defineEmits<{
  (e: 'view-change', mode: 'list' | 'kanban'): void;
}>();

// Estado de exclusão
const showDeleteModal = ref(false);
const leadToDelete = ref<Lead | null>(null);

// Colunas Kanban são carregadas dinamicamente do backend

const searchQuery = ref('');

// Computa os leads agrupados por status
const board = computed(() => {
  // Inicializa um objeto vazio para armazenar os leads agrupados por status
  const obj: Record<string, Lead[]> = {};
  
  // Inicializa cada status com um array vazio
  statuses.value.forEach(status => {
    obj[status.id] = [];
  });

  // Filtra os leads se houver uma busca
  const filteredLeads = searchQuery.value.trim() 
    ? leadStore.leads.filter(
        lead => 
          lead.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          lead.phone?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : leadStore.leads;

  // Agrupa os leads por status
  filteredLeads.forEach(lead => {
    if (lead.statusId && obj[lead.statusId]) {
      obj[lead.statusId].push(lead);
    } else if (lead.status) {
      // Fallback para compatibilidade com leads antigos que não têm statusId
      const statusObj = statuses.value.find(s => s.name.toLowerCase() === lead.status.toLowerCase());
      if (statusObj) {
        obj[statusObj.id].push(lead);
      }
    }
  });

  return obj;
});

function getColumnHeaderClass(status: Status): string {
  // Usa a cor definida no status ou uma cor padrão
  return status.color ? `bg-opacity-30` : 'bg-gray-700';
}

function getColumnIcon(status: Status): string {
  // Mapeamento de nomes de status para ícones
  const iconMap: Record<string, string> = {
    'lead': 'mdi:account-arrow-right',
    'oportunidade': 'mdi:star-check',
    'cliente': 'mdi:handshake',
    'perdido': 'mdi:close-circle'
  };
  
  // Tenta encontrar um ícone pelo nome do status (case insensitive)
  const statusNameLower = status.name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (statusNameLower.includes(key.toLowerCase())) {
      return icon;
    }
  }
  
  // Ícone padrão se não encontrar correspondência
  return 'mdi:help-circle';
}

function getInitials(name: string): string {
  if (!name) return '--';
  return name
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function editLead(lead: Lead) {
  router.push({ name: 'CRMLeadEdit', params: { crmId, leadId: lead.id } });
}

function deleteLead(lead: Lead) {
  leadToDelete.value = lead;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!leadToDelete.value) return;

  try {
    const success = await leadStore.deleteLead(crmId, leadToDelete.value.id);

    if (success) {
      toast.success(`Lead "${leadToDelete.value.name}" deleted successfully`);
    } else {
      toast.error('Failed to delete lead');
    }

    showDeleteModal.value = false;
    leadToDelete.value = null;
  } catch (error) {
    console.error('Error deleting lead:', error);
    toast.error('An error occurred while deleting the lead');
  }
}

async function onDragEnd(evt: any) {
  const item: Lead = evt.item.__draggable_context.element;
  const newStatusId = (evt.to as HTMLElement).dataset.status;
  const oldStatusId = item.statusId;
  const oldStatus = item.status;

  if (!item || !newStatusId || item.statusId === newStatusId) return;

  // Encontra o objeto de status correspondente ao ID
  const newStatusObj = statuses.value.find(s => s.id === newStatusId);
  if (!newStatusObj) return;

  // Atualiza o lead com o novo status
  item.statusId = newStatusId;
  item.status = newStatusObj.name;

  try {
    const success = await leadStore.updateLead(crmId, item.id, { 
      status: newStatusObj.name,
      statusId: newStatusId 
    });

    if (success) {
      toast.success(`Lead "${item.name}" movido para ${newStatusObj.name}`);
    } else {
      throw new Error('Failed to update on server');
    }
  } catch (error) {
    console.error('Erro atualizando lead:', error);
    item.statusId = oldStatusId;
    item.status = oldStatus;
    await leadStore.fetchLeads(crmId);
    toast.error(`Erro ao mover o lead "${item.name}".`);
  }
}

onMounted(async () => {
  try {
    if (!crmId) {
      toast.error('CRM ID não encontrado');
      return;
    }

    // Carrega os status e leads em paralelo
    await Promise.all([
      fetchStatuses(),
      leadStore.fetchLeads(crmId)
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Failed to load data');
  }
});
</script>

<style scoped>
/* Scroll horizontal */
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
/* Animação bonita tipo mola no drag-and-drop */
.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1); /* mola */
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
