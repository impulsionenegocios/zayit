<template>
  <div class="bg-surface rounded-lg p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      {{ isEditing ? 'Configurações do CRM' : 'Criar Novo CRM' }}
    </h1>

    <!-- Tabs -->
    <div class="border-b border-gray-700 mb-6">
      <div class="flex space-x-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-2 px-1 font-medium text-sm transition-all duration-300"
          :class="
            activeTab === tab.id
              ? 'text-zayit-blue border-b-2 border-zayit-blue'
              : 'text-gray-400 hover:text-white'
          "
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- General Tab -->
    <div v-if="activeTab === 'general'">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <FormControl label="Nome do CRM" :error="errors.name">
          <BaseInput v-model="form.name" placeholder="Digite o nome do CRM" :error="!!errors.name" />
        </FormControl>

        <div class="flex justify-end space-x-3 mt-8">
          <DefaultButton type="button" variant="default" size="lg" @click="cancel">
            Cancelar
          </DefaultButton>
          <DefaultButton type="submit" variant="primary" size="lg" :loading="isSubmitting">
            {{ isEditing ? 'Atualizar' : 'Criar' }}
          </DefaultButton>
        </div>
      </form>
    </div>

    <!-- Sources Tab -->
    <div v-else-if="activeTab === 'sources' && crmId">
      <SourceList :crm-id="crmId" />
    </div>

    <!-- Status Tab -->
    <div v-else-if="activeTab === 'status' && crmId">
      <StatusList :crm-id="crmId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCRMForm } from '@/composables/crm/useCRMForm';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import SourceList from '@/components/crm/sources/SourceList.vue';
import StatusList from '@/components/crm/statuses/StatusList.vue';

const props = defineProps<{
  crmId?: string;
}>();

const { form, errors, isSubmitting, isEditing, handleSubmit, cancel } = useCRMForm(props.crmId);

const tabs = [
  { id: 'general', label: 'Geral' },
  { id: 'sources', label: 'Fontes' },
  { id: 'status', label: 'Status' }
];

const activeTab = ref('general');
</script>
