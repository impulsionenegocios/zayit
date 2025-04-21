import api from '@/lib/axios';

export async function getRoles() {
  return api.get('/roles/');
}

export async function getRolePorId(id: string) {
  return api.get(`/roles/${id}`);
}

export async function criarRole(payload: Record<string, any>) {
  return api.post('/roles/', payload);
}

export async function atualizarRole(id: string, payload: Record<string, any>) {
  return api.put(`/roles/${id}`, payload);
}

export async function deletarRole(id: string | number) {
  return api.delete(`/roles/${id}`);
}
