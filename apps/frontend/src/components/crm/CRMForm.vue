<template>
  <div class="bg-surface rounded-lg p-6">
    <h1 class="text-2xl font-bold text-white mb-6">
      {{ isEditing ? 'Editar CRM' : 'Criar Novo CRM' }}
    </h1>

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
</template>

<script setup lang="ts">
import { useCRMForm } from '@/composables/crm/useCRMForm';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  crmId?: string;
}>();

const { form, errors, isSubmitting, isEditing, handleSubmit, cancel } = useCRMForm(props.crmId);
</script>
