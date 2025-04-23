<template>
    <div>
      <h1 class="text-2xl font-bold text-white mb-6">
        {{ isEditing ? 'Edit Lead' : 'Create Lead' }}
      </h1>
      
      <LeadForm :leadId="leadId" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import LeadForm from '@/components/crm/leads/LeadForm.vue';
  
  const route = useRoute();
  const leadId = computed(() => route.params.id as string);
  const isEditing = computed(() => !!leadId.value);
  </script>