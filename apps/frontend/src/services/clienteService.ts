import api from '@/lib/axios';
import { Cliente } from '@/types'; // se tiver esse tipo

export async function getClientes(): Promise<Cliente[]> {
  const { data } = await api.get<Cliente[]>('/clientes/');
  return data;
}

export async function getClientePorId(id: string): Promise<Cliente> {
  const { data } = await api.get<Cliente>(`/clientes/${id}`);
  return data;
}
export async function criarCliente(payload: FormData): Promise<Cliente> {
  const { data } = await api.post<Cliente>('/clientes/', payload);
  return data;
}

export async function atualizarCliente(id: string, payload: FormData): Promise<Cliente> {
  const { data } = await api.put<Cliente>(`/clientes/${id}`, payload);
  return data;
}

export async function deletarCliente(id: string | number): Promise<void> {
  await api.delete(`/clientes/${id}`);
}
