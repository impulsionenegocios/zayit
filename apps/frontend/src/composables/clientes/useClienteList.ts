// src/composables/clientes/useClienteList.ts
import { ref } from 'vue';
import { getClientes } from '@/services/clienteService';
import type { Cliente } from '@/types';

export function useClienteList() {
  const clientes = ref<Cliente[]>([]);
  const carregando = ref(false);
  const error = ref<Error | null>(null);

  const fetchClientes = async () => {
    carregando.value = true;
    error.value = null;
    
    try {
      const res = await getClientes();
      clientes.value = res.data;
      return res;
    } catch (err) {
      console.error('Erro ao carregar clientes', err);
      error.value = err instanceof Error ? err : new Error('Erro desconhecido ao carregar clientes');
      throw err;
    } finally {
      carregando.value = false;
    }
  };

  return {
    clientes,
    carregando,
    error,
    fetchClientes,
  };
}
