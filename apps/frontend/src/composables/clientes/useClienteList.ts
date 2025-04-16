// src/composables/clientes/useClienteList.ts
import { ref, onMounted } from 'vue'
import { getClientes } from '@/services/clienteService'
import type { Cliente } from '@/types'
import { getStoredToken } from '@/utils/authToken'

export function useClienteList() {
  const clientes = ref<Cliente[]>([])
  const carregando = ref(false)

  const fetchClientes = async () => {
    console.log('⚙️ fetchClientes rodando...')
    carregando.value = true
    try {
      console.log('token antes do fetch:', getStoredToken())
      const res = await getClientes()
      clientes.value = res.data.clientes
    } catch (err) {
      console.error('Erro ao carregar clientes', err)
    } finally {
      carregando.value = false
    }
  }

  return {
    clientes,
    carregando,
    fetchClientes,
  }
}
