// src/composables/clientes/useClienteDelete.ts
import { deletarCliente } from '@/services/clienteService'
import { useClientesStore } from '@/stores/clientes'
import { useToast } from '@/composables/useToast'

export function useClienteDelete() {
  const toast = useToast()
  const clientesStore = useClientesStore()

  async function removerCliente(id: string) {
    try {
      await deletarCliente(id)
      toast.success('Cliente removido com sucesso!')
      await clientesStore.carregarClientes()
    } catch (error) {
      toast.error('Erro ao remover cliente.')
      console.error(error)
    }
  }

  return {
    removerCliente,
  }
}
