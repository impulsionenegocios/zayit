<!-- /home/ubuntu/repos/zayit/apps/frontend/src/components/crm/scripts/ScriptForm.vue -->
<template>
  <div class="bg-surface rounded-lg shadow p-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Icon icon="mdi:loading" class="w-8 h-8 text-primary animate-spin" />
      <span class="ml-2">Carregando script...</span>
    </div>
    
    <form v-else @submit.prevent="save" class="space-y-6">
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
          <!-- Placeholder buttons and formatting tools -->
          <PlaceholderButtons textareaId="content" />
           
          <!-- WhatsApp formatting tools -->
          <WhatsAppFormatter textareaId="content" />
          
          <!-- Content textarea with styled placeholders -->
          <StyledPlaceholderEditor
            v-model="content"
            textareaId="content"
          />
          <!-- Hidden textarea for form validation -->
          <BaseTextarea
            v-model="content"
            id="content-hidden"
            class="hidden"
            placeholder="Conteúdo do script"
            :rows="6"
            :error="contentError"
            @blur="blurContent"
            style="display: none;"
          />
          
          <!-- Live preview -->
          <div v-if="content" class="mt-3">
            <div class="text-sm text-white/70 mb-1">Preview:</div>
            <div 
              class="p-3 bg-card border border-white/10 rounded min-h-[100px] text-white whatsapp-preview"
              v-html="formattedPreview"
            ></div>
          </div>
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
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatWhatsAppPreview, replacePlaceholders } from '@/utils/placeholderUtils';
import { useTagList } from '@/composables/crm/useTagList';

import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import PlaceholderButtons from '@/components/ui/editors/PlaceholderButtons.vue';
import WhatsAppFormatter from '@/components/ui/editors/WhatsAppFormatter.vue';
import StyledPlaceholderEditor from '@/components/ui/editors/StyledPlaceholderEditor.vue';

const route = useRoute();
const props = defineProps<{
  scriptId?: string;
}>();

// Obtenha o scriptId da rota se não foi passado como prop
const scriptIdFromRoute = route.params.scriptId as string | undefined;
const effectiveScriptId = props.scriptId || scriptIdFromRoute;

// Get the CRM ID from the route
const crmId = route.params.crmId as string;

// Get tags for placeholder preview
const { tags, fetchTags } = useTagList(crmId);

// Mock lead for preview purposes
const mockLead = ref({
  name: 'Nome do Cliente',
  source: 'Fonte do Lead',
});

console.log('ScriptForm component initializing with:');
console.log('- scriptId from props:', props.scriptId);
console.log('- scriptId from route:', scriptIdFromRoute);
console.log('- effective scriptId:', effectiveScriptId);

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
} = useScriptForm(effectiveScriptId);

onMounted(async () => {
  console.log('ScriptForm component mounted');
  console.log('Current route:', route.name, route.params);
  
  // Fetch tags for preview
  await fetchTags();
});

// Formatted preview for WhatsApp messages
const formattedPreview = computed(() => {
  // First replace placeholders with values (especially tag IDs with tag names)
  const replaced = replacePlaceholders(content.value, mockLead.value, tags.value);
  // Then apply WhatsApp formatting
  return formatWhatsAppPreview(replaced);
});
</script>