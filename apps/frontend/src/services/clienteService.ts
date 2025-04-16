import api from '@/lib/axios'

export async function getClientes() {
  return api.get('/clientes/')
}

export async function getClientePorId(id: string) {
  return api.get(`/clientes/${id}`)
}

export async function criarCliente(payload: FormData | object) {
  return api.post('/clientes/', payload)
}

export async function atualizarCliente(id: string, payload: FormData | object) {
  return api.put(`/clientes/${id}`, payload)
}

export async function deletarCliente(id: string) {
  return api.delete(`/clientes/${id}`)
}
