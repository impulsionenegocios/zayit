<template>
  <div class="bg-surface rounded-lg shadow p-4">
    <!-- Header with filters and search -->
    <div class="flex flex-col gap-4 mb-6">
      <!-- Search and status filter row -->
      <div class="flex justify-between items-center">
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
          <BaseSelect
            v-model="statusFilter"
            :options="statusOptions"
            placeholder="All Statuses"
            class="w-48"
          />
        </div>
      </div>
      
      <!-- Additional filters row -->
      <div class="flex flex-wrap gap-4">
        <!-- Date range filter -->
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-400 mb-1">Creation Date</label>
          <DateRangeInput
            v-model="dateFilter"
            startPlaceholder="From"
            endPlaceholder="To"
          />
        </div>
        
        <!-- Source filter -->
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-400 mb-1">Source</label>
          <BaseSelect
            v-model="sourceFilter"
            :options="sourceOptions"
            placeholder="All Sources"
            class="w-48"
          />
        </div>
        
        <!-- Tags filter -->
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-400 mb-1">Tags</label>
          <BaseCombobox
            v-model="tagFilter"
            :options="tagOptions"
            placeholder="Select Tags"
            class="w-48"
          />
        </div>
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
            v-for="lead in paginatedItems"
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
                :class="statusClasses[lead.status as keyof typeof statusClasses]"
              >
                {{ formatStatus(lead.status as string) }}
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
    
    <!-- Pagination controls -->
    <div v-if="filteredLeads.length > 0" class="flex justify-between items-center px-6 py-4 bg-card">
      <div class="text-sm text-gray-400">
        Showing {{ (currentPage - 1) * 20 + 1 }} to {{ Math.min(currentPage * 20, filteredLeads.length) }} of {{ filteredLeads.length }} leads
      </div>
      <div class="flex gap-2">
        <button 
          @click="prevPage" 
          class="px-3 py-1 rounded bg-surface text-white hover:bg-zayit-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          class="px-3 py-1 rounded bg-surface text-white hover:bg-zayit-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="py-10 text-center">
      <div class="text-white/60 text-lg">No leads found</div>
      <div class="mt-2 text-white/40 text-sm">Try adjusting your filters or add a new lead</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useLeadStore } from '@/stores/crm/lead';
import { useToast } from '@/composables/useToast';
import { useStatusList } from '@/composables/crm/useStatusList';
import { useSourceList } from '@/composables/crm/useSourceList';
import { useTagList } from '@/composables/crm/useTagList';
import { usePagination } from '@/composables/usePagination';
import type { Lead, LeadStatusType } from '@/types/lead.types';
import { useModal } from '@/composables/useModal';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import { formatDate } from '@/utils/dateFormatter';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import BaseCombobox from '@/components/ui/forms/BaseCombobox.vue';
import DateRangeInput from '@/components/ui/forms/DateRangeInput.vue';
import { getDefaultDateRange, isDateInRange } from '@/utils/dateFilter';

// Props
const props = defineProps<{
  crmId: string;
  initialViewMode: 'list' | 'kanban';
}>();

// Composables
const leadStore = useLeadStore();
const toast = useToast();
const modal = useModal();
const router = useRouter();
const { statuses, fetchStatuses } = useStatusList(props.crmId);
const { sources, fetchSources } = useSourceList(props.crmId);
const { tags, fetchTags } = useTagList(props.crmId);

// Filter states
const searchQuery = ref('');
const statusFilter = ref<'all' | LeadStatusType>('all');
const sourceFilter = ref<string | null>(null);
const tagFilter = ref<{ value: string; label: string } | null>(null);
const dateFilter = ref(getDefaultDateRange());
const isLoading = computed(() => leadStore.isLoading);

// Filter options
const statusOptions = computed(() => [
  { value: 'all', label: 'All Statuses' },
  { value: 'lead', label: 'Leads' },
  { value: 'opportunity', label: 'Opportunities' },
  { value: 'client', label: 'Clients' },
  { value: 'lost', label: 'Lost' }
]);

const sourceOptions = computed(() => [
  { value: null, label: 'All Sources' },
  ...sources.value.map(source => ({
    value: source.id,
    label: source.name
  }))
]);

const tagOptions = computed(() => 
  tags.value.map(tag => ({
    value: tag.id,
    label: tag.name
  }))
);

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

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((l) => l.status as string === statusFilter.value);
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q),
    );
  }
  
  // Apply source filter
  if (sourceFilter.value) {
    result = result.filter(l => l.sourceId === sourceFilter.value);
  }
  
  // Apply tag filter
  if (tagFilter.value) {
    result = result.filter(l => 
      l.tags.some(tag => tag.id === tagFilter.value?.value)
    );
  }
  
  // Apply date filter
  if (dateFilter.value.start && dateFilter.value.end) {
    result = result.filter(l => 
      isDateInRange(l.created_at, dateFilter.value.start, dateFilter.value.end)
    );
  }
  
  return result;
});

// Pagination
const { currentPage, paginatedItems, totalPages, goToPage, nextPage, prevPage } = 
  usePagination(filteredLeads, 20);

function formatSource(source?: string) {
  if (!source) return 'Unknown';
  return source[0].toUpperCase() + source.slice(1);
}

function formatStatus(status: LeadStatusType) {
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
    params: { crmId: props.crmId, leadId: lead.id },
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
  toast[ok ? 'success' : 'error'](ok ? `Lead "${lead.name}" deleted.` : 'Failed to delete lead');
}

// Load data
onMounted(async () => {
  if (!props.crmId) {
    toast.error('CRM ID is missing');
    return;
  }
  
  // Fetch all required data in parallel
  await Promise.all([
    leadStore.fetchLeads(props.crmId),
    fetchStatuses(),
    fetchSources(),
    fetchTags()
  ]);
});

// Watch for filter changes to reset pagination
watch([statusFilter, sourceFilter, tagFilter, dateFilter, searchQuery], () => {
  goToPage(1);
});
</script>
