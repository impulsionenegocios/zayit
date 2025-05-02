<script setup lang="ts">
import { useRoute } from 'vue-router';
import LeadManagement from '@/components/crm/leads/LeadManagement.vue';

const route = useRoute();
const crmId = route.params.crmId as string;
</script>

<template>
  <LeadManagement :crm-id="crmId" />
</template>
