<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black/50" @click="onCancel"></div>

    <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
      <h3 class="text-lg font-medium text-white mb-4">Registro de Contato</h3>

      <FormControl label="Tipo de Contato" forLabel="contactType">
        <BaseSelect
          v-model="form.type"
          id="contactType"
          :options="contactTypeOptions"
          placeholder="Selecione um tipo de contato"
        />
      </FormControl>

      <FormControl label="Data & Hora" forLabel="contactDate" class="mt-4">
        <BaseInput v-model="form.date" id="contactDate" type="datetime-local" />
      </FormControl>

      <FormControl label="Descrição" forLabel="contactDescription" class="mt-4">
        <BaseTextarea
          v-model="form.description"
          id="contactDescription"
          placeholder="Descreva a Interação"
          :rows="3"
        />
      </FormControl>

      <div class="flex justify-end gap-3 mt-6">
        <DefaultButton variant="default" size="sm" @click="onCancel"> Cancelar </DefaultButton>
        <DefaultButton
          variant="primary"
          size="sm"
          @click="onSubmit"
          :disabled="!form.type || !form.description"
        >
          Salvar Contato
        </DefaultButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import { CONTACT_TYPE_OPTIONS } from '@/constants/contactTypes';

const props = defineProps<{
  show: boolean;
  form: {
    type: string;
    date: string;
    description: string;
  };
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();

const contactTypeOptions = CONTACT_TYPE_OPTIONS;

function onSubmit() {
  emit('submit');
}

function onCancel() {
  emit('cancel');
}
</script>
