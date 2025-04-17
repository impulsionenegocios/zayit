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
            :existingFileUrl="logoUrl"
            @file-removed="marcarLogoParaRemocao"
            accept="image/*"
          />
        </FormControl>
      </FormGrid>

      <div class="flex justify-end gap-4 mt-6">
        <button 
          type="button" 
          class="btn-error btn" 
          @click="confirmarExclusao"
          :disabled="carregando"
        >
          Excluir
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
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClienteForm } from '@/composables/clientes/useClienteForm'
import { useModalStore } from '@/stores/layout/modal'
import { deletarCliente } from '@/services/clienteService'
import { useToast } from '@/composables/useToast'

// Componentes visuais
import FormSection from '@/components/ui/forms/FormSection.vue'
import FormGrid from '@/components/ui/forms/FormGrid.vue'
import FormControl from '@/components/ui/forms/FormControl.vue'
import BaseInput from '@/components/ui/forms/BaseInput.vue'
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue'
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const modalStore = useModalStore()
const toast = useToast()

const clienteId = route.params.id as string

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
  logoUrl,
  logoRemovido,
  marcarLogoParaRemocao,
  salvar,
  carregarClienteParaEdicao,
  carregando
} = useClienteForm(clienteId)

// Carregar dados do cliente ao montar o componente
onMounted(() => {
  carregarClienteParaEdicao()
})

// Função para confirmar exclusão
const confirmarExclusao = () => {
  modalStore.open({
    component: ConfirmModal,
    props: {
      title: 'Excluir Cliente',
      message: 'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar'
    }
  }).then(async (confirmed) => {
    if (confirmed) {
      try {
        await deletarCliente(clienteId)
        toast.success('Cliente excluído com sucesso!')
        router.push({ name: 'VerClientes' })
      } catch (error) {
        toast.error('Erro ao excluir cliente.')
        console.error(error)
      }
    }
  })
}
</script>
