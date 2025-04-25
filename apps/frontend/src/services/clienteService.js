import api from '@/lib/axios';
export async function getClientes() {
    const { data } = await api.get('/clientes/');
    return data;
}
export async function getClientePorId(id) {
    const { data } = await api.get(`/clientes/${id}`);
    return data;
}
export async function criarCliente(payload) {
    const { data } = await api.post('/clientes/', payload);
    return data;
}
export async function atualizarCliente(id, payload) {
    const { data } = await api.put(`/clientes/${id}`, payload);
    return data;
}
export async function deletarCliente(id) {
    await api.delete(`/clientes/${id}`);
}
