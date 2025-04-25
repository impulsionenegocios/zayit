// src/composables/clientes/useClienteList.ts
import { ref } from 'vue';
import { getClientes } from '@/services/clienteService';
export function useClienteList() {
    const clientes = ref([]);
    const carregando = ref(false);
    const error = ref(null);
    const fetchClientes = async () => {
        carregando.value = true;
        error.value = null;
        try {
            const clientesData = await getClientes();
            clientes.value = clientesData;
        }
        catch (err) {
            console.error('Erro ao carregar clientes', err);
            error.value =
                err instanceof Error ? err : new Error('Erro desconhecido ao carregar clientes');
            throw err;
        }
        finally {
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
