<template>
  <BaseTable :items="clientes" :perPage="10" @bulkDelete="handleDelete" :loading="tableLoading">
    <template #actions="{ item }">
      <button @click="editarCliente(item as Cliente)">Editar</button>
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
const tableLoading = ref<boolean>(true)
const router = useRouter()
const { clientes, carregando, fetchClientes } = useClienteList()

const handleDelete = () => {
  console.log('Deletar em massa')
}

const editarCliente = (item: Cliente) => {
  router.push({ name: 'EditarCliente', params: { id: item.id } })
}

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
// Substituir o watch do token por um carregamento direto dos dados
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

