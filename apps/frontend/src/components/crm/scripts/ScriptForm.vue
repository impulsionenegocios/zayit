<!-- /home/ubuntu/repos/zayit/apps/frontend/src/components/crm/scripts/ScriptForm.vue -->
<template>
  <div class="bg-surface rounded-lg shadow p-6">
    <form @submit.prevent="save" class="space-y-6">
      <!-- Basic Information -->
      <FormSection title="Informações do Script">
        <FormGrid :cols="{ base: 1, md: 2 }" :gap=4>
          <FormControl label="Nome" forLabel="name" :error="nameError" :touched="nameMeta.touched">
            <BaseInput
              v-model="name"
              id="name"
              placeholder="Nome do script"
              :error="!!nameError"
              @blur="blurName"
            />
          </FormControl>

          <FormControl
            label="Tipo"
            forLabel="type"
            :error="typeError"
            :touched="typeMeta.touched"
          >
            <BaseInput
              v-model="type"
              id="type"
              placeholder="Tipo do script"
              :error="!!typeError"
              @blur="blurType"
            />
          </FormControl>
        </FormGrid>

        <FormControl
          label="Conteúdo"
          forLabel="content"
          :error="contentError"
          :touched="contentMeta.touched"
        >
          <BaseTextarea
            v-model="content"
            id="content"
            placeholder="Conteúdo do script"
            :rows="6"
            :error="!!contentError"
            @blur="blurContent"
          />
        </FormControl>
      </FormSection>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <DefaultButton variant="default" size="md" @click="cancel" type="button">
          Cancelar
        </DefaultButton>

        <DefaultButton variant="primary" size="md" type="submit" :disabled="loading">
          <span v-if="loading">
            <Icon icon="mdi:loading" class="animate-spin mr-1" />
            Salvando...
          </span>
          <span v-else>
            {{ isEditing ? 'Atualizar Script' : 'Criar Script' }}
          </span>
        </DefaultButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useScriptForm } from '@/composables/crm/useScriptForm';
import { Icon } from '@iconify/vue';

import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  scriptId?: string;
}>();

// Use our script form composable
const {
  // Form fields
  name,
  nameError,
  blurName,
  nameMeta,

  type,
  typeError,
  blurType,
  typeMeta,

  content,
  contentError,
  blurContent,
  contentMeta,

  // Actions
  save,
  loading,
  isEditing,
  cancel,
} = useScriptForm(props.scriptId);
</script>
