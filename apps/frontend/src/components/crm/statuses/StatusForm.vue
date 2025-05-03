<template>
  <div class="space-y-4">
    <FormControl label="Nome do Status" :error="errors.name">
      <BaseInput v-model="form.name" placeholder="Digite o nome do status" :error="!!errors.name" />
    </FormControl>

    <FormControl label="Cor" :error="errors.color">
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 rounded-full border border-gray-600"
          :style="{ backgroundColor: form.color }"
        ></div>
        <BaseInput
          v-model="form.color"
          type="color"
          class="w-12 h-8 p-0 bg-transparent"
          :error="!!errors.color"
        />
      </div>
    </FormControl>

    <FormControl label="Ordem" :error="errors.order">
      <BaseInput
        v-model.number="form.order"
        type="number"
        min="0"
        placeholder="Ordem de exibição"
        :error="!!errors.order"
      />
    </FormControl>

    <FormControl label="Descrição" :error="errors.description">
      <BaseTextarea
        v-model="form.description"
        placeholder="Digite uma descrição para este status"
        :error="!!errors.description"
      />
    </FormControl>

    <div class="flex justify-end space-x-3 mt-4">
      <DefaultButton type="button" variant="default" @click="cancel">
        Cancelar
      </DefaultButton>
      <DefaultButton type="submit" variant="primary" :loading="isSubmitting">
        {{ isEditing ? 'Atualizar' : 'Criar' }}
      </DefaultButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import { createStatus, updateStatus } from '@/services/statusService';
import type { Status, StatusCreatePayload, StatusUpdatePayload } from '@/types';

const props = defineProps<{
  crmId: string;
  status?: Status;
  onSuccess?: () => void;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'success'): void;
}>();

const toast = useToast();
const isSubmitting = ref(false);
const isEditing = computed(() => !!props.status);

const form = reactive<StatusCreatePayload>({
  name: props.status?.name || '',
  color: props.status?.color || '#3B82F6',
  order: props.status?.order || 0,
  description: props.status?.description || '',
});

const errors = reactive({
  name: '',
  color: '',
  order: '',
  description: '',
});

const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.color = '';
  errors.order = '';
  errors.description = '';

  if (!form.name.trim()) {
    errors.name = 'O nome do status é obrigatório';
    isValid = false;
  }

  if (!form.color) {
    errors.color = 'A cor é obrigatória';
    isValid = false;
  }

  if (form.order < 0) {
    errors.order = 'A ordem deve ser um número positivo';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    if (isEditing.value && props.status) {
      const payload: StatusUpdatePayload = {
        name: form.name,
        color: form.color,
        order: form.order,
        description: form.description,
      };
      await updateStatus(props.crmId, props.status.id, payload);
      toast.success('Status atualizado com sucesso!');
    } else {
      await createStatus(props.crmId, form);
      toast.success('Status criado com sucesso!');
    }
    emit('success');
    props.onSuccess?.();
  } catch (error) {
    console.error('Erro ao salvar status:', error);
    toast.error('Erro ao salvar status. Tente novamente.');
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  emit('cancel');
};

defineExpose({
  handleSubmit,
});
</script>
