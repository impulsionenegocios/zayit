<template>
    <FormSection title="Cadastrar Role" class="px-8">
      <form @submit.prevent="salvar">
        <FormGrid :cols="{ base: 1, md: 2 }" :gap="4">
          <FormControl
            label="Nome da Role"
            forLabel="name"
            :error="nameError"
            :touched="nameMeta.touched"
            :valid="nameMeta.valid"
            :showSuccess="true"
          >
            <BaseInput
              v-model="name"
              name="name"
              id="name"
              placeholder="Digite o nome da Role"
              @blur="blurName"
            />
          </FormControl>
          </FormGrid>
        <div class="flex justify-end mt-6">
          <button type="submit" class="btn-success btn" :disabled="carregando">
            <span v-if="carregando">Salvando...</span>
            <span v-else>Salvar Role</span>
          </button>
        </div>
      </form>
    </FormSection>
  </template>
  
  <script setup lang="ts">
  // Composable atualizado com estrutura modular
  import { useRoleForm } from '@/composables/roles/useRoleForm'
  // Componentes visuais
  import FormSection from '@/components/ui/forms/FormSection.vue'
  import FormGrid from '@/components/ui/forms/FormGrid.vue'
  import FormControl from '@/components/ui/forms/FormControl.vue'
  import BaseInput from '@/components/ui/forms/BaseInput.vue'
  
  // Lógica do formulário
  const {
    name,
    nameError,
    blurName,
    nameMeta,
    salvar,
    carregando
  } = useRoleForm()
  </script>