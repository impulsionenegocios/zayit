<template>
  <div class="space-y-4">
    <FormControl label="Nome da Fonte" :error="errors.name">
      <BaseInput v-model="form.name" placeholder="Digite o nome da fonte" :error="!!errors.name" />
    </FormControl>

    <FormControl label="Descrição" :error="errors.description">
      <BaseTextarea
        v-model="form.description"
        placeholder="Digite uma descrição para esta fonte"
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
import { createSource, updateSource } from '@/services/sourceService';
import type { Source, SourceCreatePayload, SourceUpdatePayload } from '@/types';

const props = defineProps<{
  crmId: string;
  source?: Source;
  onSuccess?: () => void;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'success'): void;
}>();

const toast = useToast();
const isSubmitting = ref(false);
const isEditing = computed(() => !!props.source);

const form = reactive<SourceCreatePayload>({
  name: props.source?.name || '',
  description: props.source?.description || '',
});

const errors = reactive({
  name: '',
  description: '',
});

const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.description = '';

  if (!form.name.trim()) {
    errors.name = 'O nome da fonte é obrigatório';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    if (isEditing.value && props.source) {
      const payload: SourceUpdatePayload = {
        name: form.name,
        description: form.description,
      };
      await updateSource(props.crmId, props.source.id, payload);
      toast.success('Fonte atualizada com sucesso!');
    } else {
      await createSource(props.crmId, form);
      toast.success('Fonte criada com sucesso!');
    }
    emit('success');
    props.onSuccess?.();
  } catch (error) {
    console.error('Erro ao salvar fonte:', error);
    toast.error('Erro ao salvar fonte. Tente novamente.');
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
