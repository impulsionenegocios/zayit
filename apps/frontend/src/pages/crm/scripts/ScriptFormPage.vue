<!-- /home/ubuntu/repos/zayit/apps/frontend/src/pages/crm/scripts/ScriptFormPage.vue -->
<template>
  <div>
    <PageHeader
      :title="isEditing ? 'Editar Script' : 'Novo Script'"
      :breadcrumbs="breadcrumbs"
      :loading="loading"
    >
      <template #actions>
        <DefaultButton variant="default" size="md" @click="goBack">
          <Icon icon="mdi:arrow-left" class="mr-1" />
          Voltar
        </DefaultButton>
      </template>
    </PageHeader>

    <div class="mt-6">
      <ScriptForm :scriptId="scriptId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import PageHeader from '@/components/ui/layout/PageHeader.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ScriptForm from '@/components/crm/scripts/ScriptForm.vue';

const route = useRoute();
const router = useRouter();

const crmId = computed(() => route.params.crmId as string);
const scriptId = computed(() => route.params.scriptId as string);
const isEditing = computed(() => !!scriptId.value);
const loading = ref(false);

// Breadcrumbs
const breadcrumbs = computed(() => [
  {
    label: 'CRMs',
    to: { name: 'CRMList' },
  },
  {
    label: 'Gerenciamento',
    to: {
      name: 'CRMManagement',
      params: { crmId: crmId.value },
      query: { tab: 'scripts' },
    },
  },
  {
    label: isEditing.value ? 'Editar Script' : 'Novo Script',
    to: route.fullPath,
  },
]);

// Navigation
const goBack = () => {
  router.push({
    name: 'CRMManagement',
    params: { crmId: crmId.value },
    query: { tab: 'scripts' },
  });
};
</script>
