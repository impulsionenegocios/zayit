<template>
  <div>
    <h1 class="text-2xl px-6 font-bold text-white mb-6">
      {{ isEditing ? 'Editar Lead' : 'Criar Lead' }}
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
