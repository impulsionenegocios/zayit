<template>
  <BaseTable 
    :items="clientes" 
    :perPage="10" 
    @bulkDelete="handleBulkDelete" 
    :loading="tableLoading"
    :columns="columns"
  >
    <template #actions="{ item }">
      <div class="flex gap-2">
        <button 
          @click="editarCliente(item as Cliente)" 
          class="btn btn-sm btn-primary"
          title="Editar cliente"
        >
          <Icon icon="mdi:pencil" />
        </button>
        <button 
          @click="excluirCliente(item as Cliente)" 
          class="btn btn-sm btn-error"
          title="Excluir cliente"
        >
          <Icon icon="mdi:delete" />
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Cliente } from '@/types'
import BaseTable from '@/components/layout/BaseTable.vue'
import { usePageActionButton } from '@/composables/usePageActionButton'
import { Icon } from '@iconify/vue'
import { useClienteList } from '@/composables/clientes/useClienteList'
import { useModalStore } from '@/stores/layout/modal'
import { deletarCliente } from '@/services/clienteService'
import { useToast } from '@/composables/useToast'

const tableLoading = ref<boolean>(true)
const router = useRouter()
const modalStore = useModalStore()
const toast = useToast()
const { clientes, carregando, fetchClientes } = useClienteList()

// Definição das colunas da tabela
const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Função' },
]

// Função para exclusão em massa
const handleBulkDelete = (ids: (string | number)[]) => {
  if (!ids.length) return

  modalStore.open({
    type: 'confirm',
    title: 'Excluir Clientes',
    message: `Tem certeza que deseja excluir ${ids.length} cliente(s)? Esta ação não pode ser desfeita.`,
    confirmText: 'Sim, excluir',
    cancelText: 'Cancelar',
    onConfirm: async () => {
      try {
        // Excluir cada cliente selecionado
        await Promise.all(ids.map(id => deletarCliente(id.toString())))
        toast.success(`${ids.length} cliente(s) excluído(s) com sucesso!`)
        // Recarregar a lista
        fetchClientes()
      } catch (error) {
        toast.error('Erro ao excluir clientes.')
        console.error(error)
      }
    }
  })
}

// Função para editar cliente
const editarCliente = (item: Cliente) => {
  router.push({ name: 'EditarCliente', params: { id: item.id } })
}

// Função para excluir cliente individual
const excluirCliente = (item: Cliente) => {
  modalStore.open({
    type: 'confirm',
    title: 'Excluir Cliente',
    message: `Tem certeza que deseja excluir o cliente "${item.name}"? Esta ação não pode ser desfeita.`,
    confirmText: 'Sim, excluir',
    cancelText: 'Cancelar',
    onConfirm: async () => {
      try {
        await deletarCliente(item.id)
        toast.success('Cliente excluído com sucesso!')
        // Recarregar a lista
        fetchClientes()
      } catch (error) {
        toast.error('Erro ao excluir cliente.')
        console.error(error)
      }
    }
  })
}

// Botão de ação para criar cliente
usePageActionButton(
  {
    title: 'Criar Cliente',
    variant: 'primary',
    onClick: () => {
      router.push({ name: 'AddCliente' })
    },
    loading: false,
  },
  {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
  },
)

// Carregar dados ao montar o componente
onMounted(async () => {
  tableLoading.value = true
  try {
    await fetchClientes()
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
  } finally {
    tableLoading.value = false
  }
})
</script>

