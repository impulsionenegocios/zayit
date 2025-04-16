<template>
  <FormSection title="Cadastrar Cliente" class="px-8">
    <form @submit.prevent="salvar">
      <FormGrid :cols="{ base: 1, md: 2 }" :gap="4">
        <FormControl
          label="Nome do Cliente"
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
            placeholder="Digite o nome"
            @blur="blurName"
          />
        </FormControl>

        <FormControl
          label="Email do Cliente"
          forLabel="email"
          :error="emailError"
          :touched="emailMeta.touched"
          :valid="emailMeta.valid"
          :showSuccess="true"
        >
          <BaseInput
            v-model="email"
            name="email"
            type="email"
            id="email"
            placeholder="Digite o email"
            @blur="blurEmail"
          />
        </FormControl>

        <FormControl
          label="Senha do Cliente"
          forLabel="password"
          :error="passwordError"
          :touched="passwordMeta.touched"
          :valid="passwordMeta.valid"
          :showSuccess="true"
        >
          <BaseInput
            v-model="password"
            name="password"
            type="password"
            id="password"
            placeholder="Digite a senha"
            @blur="blurPassword"
          />
        </FormControl>
      </FormGrid>

      <FormGrid :cols="1">
        <FormControl label="Logo">
          <BaseFileInput
            v-model="logo"
            name="logo"
            :multiple="false"
            :auto-upload="false"
            upload-url="/uploads/avatar"
            upload-field-name="avatar"
          />
        </FormControl>
      </FormGrid>

      <div class="flex justify-end mt-6">
        <button type="submit" class="btn-success btn" :disabled="carregando">
          <span v-if="carregando">Salvando...</span>
          <span v-else>Salvar Cliente</span>
        </button>
      </div>
    </form>
  </FormSection>
</template>

<script setup lang="ts">
// Composable atualizado com estrutura modular
import { useClienteForm } from '@/composables/clientes/useClienteForm'

// Componentes visuais
import FormSection from '@/components/ui/forms/FormSection.vue'
import FormGrid from '@/components/ui/forms/FormGrid.vue'
import FormControl from '@/components/ui/forms/FormControl.vue'
import BaseInput from '@/components/ui/forms/BaseInput.vue'
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue'

// Lógica do formulário
const {
  name,
  nameError,
  blurName,
  nameMeta,
  email,
  emailError,
  blurEmail,
  emailMeta,
  password,
  passwordError,
  blurPassword,
  passwordMeta,
  logo,
  salvar,
  carregando
} = useClienteForm()
</script>
