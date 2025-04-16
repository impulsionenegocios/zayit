<template>
  <BaseTable :items="clientes" :perPage="10" @bulkDelete="handleDelete">
    <template #actions="{ item }">
      <button @click="editarCliente(item as Cliente)">Editar</button>
    </template>
  </BaseTable>
</template>
<script setup lang="ts">
import { h, watch  } from 'vue'
import { useRouter } from 'vue-router'
import type { Cliente } from '@/types'
import BaseTable from '@/components/layout/BaseTable.vue'
import { usePageActionButton } from '@/composables/usePageActionButton'
import { Icon } from '@iconify/vue'
import { useClienteList } from '@/composables/clientes/useClienteList'
import { useTokenRef } from '@/utils/authToken'

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
const tokenRef = useTokenRef()

watch(
  tokenRef,
  (token) => {
    if (token) fetchClientes()
  },
  { immediate: true }
)
</script>

