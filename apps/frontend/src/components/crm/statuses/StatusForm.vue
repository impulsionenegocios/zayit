<template>
  <div class="space-y-4">
    <FormControl label="Nome do Status" :error="errors.name ? errors.name : ''">
      <BaseInput v-model="form.name" placeholder="Digite o nome do status" :error="!!errors.name" />
    </FormControl>

    <FormControl label="Cor" :error="errors.color ? errors.color : ''">
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 rounded-full border border-gray-600"
          :style="{ backgroundColor: form.color }"
        ></div>
        <BaseInput
          v-model="form.color"
          type="text"
          class="w-12 h-8 p-0 bg-transparent"
          :style="{ appearance: 'none', backgroundColor: form.color }"
          :error="!!errors.color"
        />
      </div>
    </FormControl>

    <FormControl label="Ordem" :error="errors.order ? errors.order : ''">
      <BaseInput
        v-model="form.order"
        type="text"
        min="0"
        placeholder="Ordem de exibição"
        :error="!!errors.order"
      />
    </FormControl>

    <FormControl label="Descrição" :error="errors.description ? errors.description : ''">
      <BaseTextarea
        v-model="form.description"
        placeholder="Digite uma descrição para este status"
        :error="errors.description ? errors.description : ''"
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import { useStatusList } from '@/composables/crm/useStatusList';
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
const { statuses, fetchStatuses } = useStatusList(props.crmId);

// Compute the suggested next order value
const suggestedOrder = computed(() => {
  if (statuses.value.length === 0) return 1;
  return Math.max(...statuses.value.map(s => s.order)) + 1;
});

const form = reactive<Omit<StatusCreatePayload, 'order'> & { order: string }>({
  name: props.status?.name || '',
  color: props.status?.color || '#3B82F6',
  order: String(props.status?.order || 0),
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

  if (Number(form.order) < 0) {
    errors.order = 'A ordem deve ser um número positivo';
    isValid = false;
  }

  // Check if the order is already in use by another status (only for new statuses)
  if (!isEditing.value) {
    const orderExists = statuses.value.some(s => s.order === Number(form.order));
    if (orderExists) {
      errors.order = 'Esta ordem já está em uso. Sugerimos usar ' + suggestedOrder.value;
    }
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
        order: Number(form.order),
        description: form.description,
      };
      await updateStatus(props.crmId, props.status.id, payload);
      toast.success('Status atualizado com sucesso!');
    } else {
      await createStatus(props.crmId, {
        ...form,
        order: Number(form.order)
      });
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

// Initialize form with suggested order when not editing
onMounted(async () => {
  await fetchStatuses();
  if (!isEditing.value) {
    form.order = String(suggestedOrder.value);
  }
});

defineExpose({
  handleSubmit,
});
</script>
