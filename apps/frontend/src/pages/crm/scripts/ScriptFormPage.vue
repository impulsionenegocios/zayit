<!-- /home/ubuntu/repos/zayit/apps/frontend/src/pages/crm/scripts/ScriptFormPage.vue -->
<template>
  <div>
    <div class="mt-6">
      <ScriptForm :scriptId="scriptId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ScriptForm from '@/components/crm/scripts/ScriptForm.vue';
const route = useRoute();
const scriptId = computed(() => route.params.scriptId as string);
</script>
