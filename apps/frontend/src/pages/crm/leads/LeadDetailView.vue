<template>
  <div>
    <LeadDetail :leadId="leadId" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LeadDetail from '@/components/crm/leads/leadDetail.vue';

const route = useRoute();
const leadId = computed(() => route.params.id as string);
</script>
