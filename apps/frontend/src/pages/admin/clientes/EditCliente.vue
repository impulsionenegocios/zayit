<template>
  <FormSection title="Editar Cliente" class="px-8">
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
          help="Deixe em branco para manter a senha atual"
        >
          <BaseInput
            v-model="password"
            name="password"
            type="password"
            id="password"
            placeholder="Digite a nova senha (opcional)"
            @blur="blurPassword"
          />
        </FormControl>
        <FormControl
          label="Escolha a permissão"
          forLabel="role"
          :error="roleError"
          :touched="roleMeta.touched"
          :valid="roleMeta.valid"
          :showSuccess="true"
        >
          <BaseSelect
            v-model="role"
            name="role"
            :options="roles"
            placeholder="selecione uma role"
            @blur="blurRole"
          />
        </FormControl>
      </FormGrid>

      <FormGrid :cols="1">
        <FormControl label="Logo">
          <BaseFileInput
            v-model="logo"
            :existing-file-url="verifyExistingLogoUrl"
            name="logo"
            :multiple="false"
            :auto-upload="false"
            upload-url="/uploads/avatar"
            upload-field-name="avatar"
            @file-removed="removeExistingLogo"
          />
        </FormControl>
      </FormGrid>

      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn-default btn" :disabled="carregando" @click="voltar">
          Cancelar
        </button>
        <button type="submit" class="btn-success btn" :disabled="carregando">
          <span v-if="carregando">Salvando...</span>
          <span v-else>Atualizar Cliente</span>
        </button>
      </div>
    </form>
  </FormSection>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useClienteForm } from '@/composables/clientes/useClienteForm';
import { useModalStore } from '@/stores/layout/modal';
import { deletarCliente } from '@/services/clienteService';
import { useToast } from '@/composables/useToast';

// Componentes visuais
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const toast = useToast();

const clienteId = route.params.id as string;

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
  carregarClienteParaEdicao,
  existingLogoUrl,
  removeExistingLogo,
  carregando,
  role,
  roleError,
  roleMeta,
  blurRole,
  roles,
} = useClienteForm(clienteId);
// Carregar dados do cliente ao montar o componente
onMounted(() => {
  carregarClienteParaEdicao();
});
const verifyExistingLogoUrl = computed(() => {
  if (existingLogoUrl.value) {
    return 'http://localhost:8000' + existingLogoUrl.value;
  }
  return null;
});
const voltar = () => {
  router.back();
};
</script>
