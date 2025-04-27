<template>
  <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
    <h3 class="text-lg font-medium text-white mb-4">Adicionar Tarefa</h3>

    <FormControl label="Título da Tarefa" forLabel="taskTitle">
      <BaseInput
        v-model="form.title"
        id="taskTitle"
        placeholder="Digite o título da tarefa"
      />
    </FormControl>

    <FormControl label="Data Prevista" forLabel="taskDueDate" class="mt-4">
      <BaseInput
        v-model="form.due_date"
        id="taskDueDate"
        type="date"
      />
    </FormControl>

    <div class="flex justify-end gap-3 mt-6">
      <DefaultButton variant="default" size="sm" @click="$emit('cancel')">
        Cancelar
      </DefaultButton>
      <DefaultButton
        variant="primary"
        size="sm"
        :disabled="!form.title || !form.due_date"
        @click="handleSubmit"
      >
        Adicionar
      </DefaultButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  title: string;
  dueDate: string;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { title: string; dueDate: string }): void;
  (e: 'cancel'): void;
}>();

const form = ref({
  title: props.title,
  due_date: props.dueDate,
});

watch(() => props.title, (newTitle) => form.value.title = newTitle);
watch(() => props.dueDate, (newDueDate) => form.value.due_date = newDueDate);

function handleSubmit() {
  emit('submit', { title: form.value.title, dueDate: form.value.due_date });
}
</script>
