<template>
  <div>
    <CRMForm :crm-id="crmId" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import CRMForm from '@/components/crm/CRMForm.vue';

const route = useRoute();
const crmId = route.params.crmId as string;
</script>
