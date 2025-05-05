// src/stores/clientes.ts
import { defineStore } from 'pinia';
import { getClientes, getClientePorId } from '@/services/clienteService';

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    lista: [] as any[],
    carregando: false,
    clienteSelecionado: null as any | null,
  }),

  actions: {
    async carregarClientes() {
      this.carregando = true;
      try {
        const res = await getClientes();
        this.lista = res;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        this.carregando = false;
      }
    },

    async selecionarCliente(id: string) {
      try {
        const res = await getClientePorId(id);
        this.clienteSelecionado = res;
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
      }
    },

    limparSelecionado() {
      this.clienteSelecionado = null;
    },
  },
});
