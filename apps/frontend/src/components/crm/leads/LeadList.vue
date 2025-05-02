<template>
  <div class="bg-surface rounded-lg shadow p-4">
    <!-- Header with filters and search -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-3">
        <!-- Search input -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search leads..."
            class="pl-9 pr-4 py-2 rounded-lg bg-card border border-white/10 text-white placeholder-gray-400 w-60"
          />
          <Icon icon="mdi:magnify" class="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <!-- Status filter -->
        <select
          v-model="statusFilter"
          class="px-4 py-2 rounded-lg bg-card border border-white/10 text-white"
        >
          <option value="all">All Statuses</option>
          <option value="lead">Leads</option>
          <option value="opportunity">Opportunities</option>
          <option value="client">Clients</option>
          <option value="lost">Lost</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-10">
      <div
        class="animate-spin h-8 w-8 border-4 border-zayit-blue border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- Leads table -->
    <div v-else-if="filteredLeads.length" class="overflow-hidden rounded-lg border border-white/10">
      <table class="min-w-full divide-y divide-white/10">
        <thead class="bg-card">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Source
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Tags
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-surface divide-y divide-white/10">
          <tr
            v-for="lead in filteredLeads"
            :key="lead.id"
            class="hover:bg-card/50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-zayit-blue flex items-center justify-center text-white font-semibold"
                >
                  {{ getInitials(lead.name) }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-white">{{ lead.name }}</div>
                  <div class="text-sm text-gray-400">Criado {{ formatDate(lead.created_at) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-white">{{ lead.email }}</div>
              <div class="text-sm text-gray-400">{{ lead.phone }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-card text-white"
              >
                {{ formatSource(lead.source) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="statusClasses[lead.status]"
              >
                {{ formatStatus(lead.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-1">
                <span
                  v-for="tag in lead.tags.slice(0, 2)"
                  :key="tag.id"
                  class="px-2 py-0.5 text-xs rounded-full text-white"
                  :style="{ backgroundColor: tag.color }"
                >
                  {{ tag.name }}
                </span>
                <span
                  v-if="lead.tags.length > 2"
                  class="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-white"
                >
                  +{{ lead.tags.length - 2 }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex gap-2 justify-end">
                <router-link
                :to="{ name: 'CRMLeadDetail', params: { crmId, leadId: lead.id } }"
                class="text-zayit-blue hover:text-zayit-blue/80 bg-white/5 hover:bg-white/10 transition-colors p-2 rounded-full"
                >
                  <Icon icon="mdi:eye" />
                </router-link>

                <button
                  @click="editLead(lead)"
                  class="text-zayit-blue hover:text-zayit-blue/80 bg-white/5 hover:bg-white/10 transition-colors p-2 rounded-full"
                >
                  <Icon icon="mdi:pencil" />
                </button>
                <button
                  @click="confirmDelete(lead)"
                  class="text-zayit-danger hover:text-zayit-danger/80 bg-white/5 hover:bg-white/10 transition-colors p-2 rounded-full"
                >
                  <Icon icon="mdi:delete" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="py-10 text-center">
      <div class="text-white/60 text-lg">No leads found</div>
      <div class="mt-2 text-white/40 text-sm">Try adjusting your filters or add a new lead</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useLeadStore } from '@/stores/crm/lead';
import { useToast } from '@/composables/useToast';
import type { Lead, LeadStatus } from '@/types/lead.types';
import { useModal } from '@/composables/useModal';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import { formatDate } from '@/utils/dateFormatter';

// 1) Recebe o crmId vindo do componente pai (via <component :crm-id="crmId" />)
const props = defineProps<{
  crmId: string;
  initialViewMode: 'list' | 'kanban';
}>();

const leadStore = useLeadStore();
const toast = useToast();
const modal = useModal();
const router = useRouter();

const searchQuery = ref('');
const statusFilter = ref<'all' | LeadStatus>('all');
const isLoading = computed(() => leadStore.isLoading);

// Status styling
const statusClasses = {
  lead: 'bg-zayit-info/20 text-zayit-info',
  opportunity: 'bg-zayit-warning/20 text-zayit-warning',
  client: 'bg-zayit-blue/20 text-zayit-blue',
  lost: 'bg-zayit-danger/20 text-zayit-danger',
};

// Filtered leads
const filteredLeads = computed(() => {
  let result = leadStore.leads;

  if (statusFilter.value !== 'all') {
    result = result.filter((l) => l.status === statusFilter.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q),
    );
  }
  return result;
});

function formatSource(source?: string) {
  if (!source) return 'Unknown';
  return source[0].toUpperCase() + source.slice(1);
}

function formatStatus(status: LeadStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Actions
function editLead(lead: Lead) {
  router.push({
    name: 'CRMLeadEdit',
    params: { crmId: props.crmId, leadId: lead.id }
  });
}


async function confirmDelete(lead: Lead) {
  const confirmed = await modal.open(ConfirmModal, {
    title: 'Delete Lead',
    props: {
      message: `Are you sure you want to delete ${lead.name}?`,
    },
    size: 'sm',
  });
  if (!confirmed) return;
  const ok = await leadStore.deleteLead(props.crmId, lead.id);
  toast[ok ? 'success' : 'error'](
    ok ? `Lead "${lead.name}" deleted.` : 'Failed to delete lead'
  );
}

// Load data
onMounted(async () => {
  if (!props.crmId) {
    toast.error('CRM ID is missing');
    return;
  }
  await leadStore.fetchLeads(props.crmId);
});
</script>
