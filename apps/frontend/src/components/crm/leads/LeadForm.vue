<template>
  <div class="bg-surface rounded-lg shadow p-6">
    <form @submit.prevent="salvar" class="space-y-6">
      <!-- Basic Information -->
      <FormSection title="Informações Básicas">
        <FormGrid :cols="{ base: 1, md: 2 }" gap="4">
          <FormControl label="Nome" forLabel="name" :error="nameError" :touched="nameMeta.touched">
            <BaseInput
              v-model="name"
              id="name"
              placeholder="Nome completo"
              :error="!!nameError"
              @blur="blurName"
            />
          </FormControl>

          <FormControl
            label="Email"
            forLabel="email"
            :error="emailError"
            :touched="emailMeta.touched"
          >
            <BaseInput
              v-model="email"
              id="email"
              type="email"
              placeholder="Endereço de email"
              :error="!!emailError"
              @blur="blurEmail"
            />
          </FormControl>

          <FormControl
            label="Telefone"
            forLabel="phone"
            :error="phoneError"
            :touched="phoneMeta.touched"
          >
            <BaseInput
              v-model="phone"
              id="phone"
              placeholder="Número de telefone"
              :error="!!phoneError"
              @blur="blurPhone"
            />
          </FormControl>

          <FormControl
            label="Data de Nascimento"
            forLabel="birthDate"
            :error="birthDateError"
            :touched="birthDateMeta.touched"
          >
            <BaseInput
              v-model="birthDate"
              id="birthDate"
              type="date"
              placeholder="Data de nascimento (opcional)"
              @blur="blurBirthDate"
            />
          </FormControl>
        </FormGrid>
      </FormSection>

      <!-- Address -->
      <FormSection title="Endereço">
        <FormControl
          label="Endereço"
          forLabel="address"
          :error="addressError"
          :touched="addressMeta.touched"
        >
          <BaseTextarea
            v-model="address"
            id="address"
            placeholder="Endereço completo (opcional)"
            :rows="2"
            @blur="blurAddress"
          />
        </FormControl>
      </FormSection>

      <!-- Lead Information -->
      <FormSection title="Informações do Lead">
        <FormGrid :cols="{ base: 1, md: 2 }" gap="4">
          <FormControl
            label="Fonte"
            forLabel="source"
            :error="sourceError"
            :touched="sourceMeta.touched"
          >
            <BaseSelect
              v-model="sourceId"
              id="source"
              :options="sourceOptions"
              placeholder="Selecione a fonte"
              @blur="blurSource"
              :loading="isLoadingSources"
            />
          </FormControl>

          <FormControl
            label="Status"
            forLabel="status"
            :error="statusError"
            :touched="statusMeta.touched"
          >
            <BaseSelect
              v-model="statusId"
              id="status"
              :options="statusOptions"
              placeholder="Selecione o status"
              :error="!!statusError"
              @blur="blurStatus"
              :loading="isLoadingStatuses"
            />
          </FormControl>
        </FormGrid>
      </FormSection>

      <!-- Tags -->
      <FormSection title="Tags">
        <TagSelector v-model="selectedTagIds" :canCreateTags="true" />
      </FormSection>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <DefaultButton variant="default" size="md" @click="voltar" type="button">
          Cancelar
        </DefaultButton>

        <DefaultButton variant="primary" size="md" type="submit" :disabled="carregando">
          <span v-if="carregando">
            <Icon icon="mdi:loading" class="animate-spin mr-1" />
            Salvando...
          </span>
          <span v-else>
            {{ isEditing ? 'Atualizar Lead' : 'Criar Lead' }}
          </span>
        </DefaultButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useLeadForm } from '@/composables/crm/useLeadForm';
import { Icon } from '@iconify/vue';

import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import TagSelector from '@/components/crm/tags/TagSelector.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  leadId?: string;
}>();

// Use our lead form composable with updated naming
const {
  // Campos do formulário
  name,
  nameError,
  blurName,
  nameMeta,

  email,
  emailError,
  blurEmail,
  emailMeta,

  phone,
  phoneError,
  blurPhone,
  phoneMeta,

  address,
  addressError,
  blurAddress,
  addressMeta,

  birthDate,
  birthDateError,
  blurBirthDate,
  birthDateMeta,

  sourceId,
  sourceError,
  blurSource,
  sourceMeta,

  statusId,
  statusError,
  blurStatus,
  statusMeta,

  // Tags
  selectedTagIds,
  availableTags,

  // Options
  sourceOptions,
  statusOptions,
  
  // Loading states
  isLoadingSources,
  isLoadingStatuses,

  // Ações
  salvar,
  carregarLeadParaEdicao,
  carregando,
  isEditing,
  voltar,
} = useLeadForm(props.leadId);
</script>
