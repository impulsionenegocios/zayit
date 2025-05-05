<template>
  <div class="bg-surface p-4 rounded-lg shadow-md hover:bg-card transition-colors">
    <div class="flex items-center justify-between">
      <!-- Nome e status -->
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full bg-zayit-blue text-white flex items-center justify-center font-bold"
        >
          {{ getInitials(lead.name) }}
        </div>
        <div>
          <h3 class="text-white font-medium">{{ lead.name }}</h3>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full"
            :style="{
  backgroundColor: (typeof lead.status === 'string' ? '#3B82F6' : (lead.status as any).color) + '33', // fundo translúcido (~20%)
  color: typeof lead.status === 'string' ? '#3B82F6' : (lead.status as any).color // cor do texto
}"

          >
            {{ formatStatus(typeof lead.status === 'string' ? lead.status : (lead.status as any).name) }}
          </span>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex gap-2">
        <router-link
          :to="{ name: 'CRMLeadDetail', params: { crmId, leadId: lead.id } }"
          class="text-zayit-blue hover:text-zayit-blue/80"
          title="View"
        >
          <Icon icon="mdi:eye" />
        </router-link>

        <router-link
          :to="{ name: 'EditLead', params: { id: lead.id } }"
          class="text-zayit-blue hover:text-zayit-blue/80"
          title="Edit"
        >
          <Icon icon="mdi:pencil" />
        </router-link>
      </div>
    </div>

    <!-- Tags -->
    <div class="mt-3 flex flex-wrap gap-1">
      <span
        v-for="tag in lead.tags.slice(0, 3)"
        :key="tag.id"
        class="text-xs px-2 py-0.5 rounded-full text-white"
        :style="{ backgroundColor: tag.color }"
      >
        {{ tag.name }}
      </span>
      <span
        v-if="lead.tags.length > 3"
        class="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-white"
      >
        +{{ lead.tags.length - 3 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lead } from '@/types/lead.types';
import { useRouter, useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
const route = useRoute();
const crmId = route.params.crmId as string;

const props = defineProps<{
  lead: Lead;
}>();

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    lead: 'Lead',
    opportunity: 'Opportunity',
    client: 'Client',
    lost: 'Lost',
  };
  return labels[status] || 'Unknown';
}

const statusClasses = {
  lead: 'bg-zayit-info/20 text-zayit-info',
  opportunity: 'bg-zayit-warning/20 text-zayit-warning',
  client: 'bg-zayit-blue/20 text-zayit-blue',
  lost: 'bg-zayit-danger/20 text-zayit-danger',
};
</script>
