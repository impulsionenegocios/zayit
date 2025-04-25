import api from '@/lib/axios';
export async function getRoles() {
    return api.get('/roles/');
}
export async function getRolePorId(id) {
    return api.get(`/roles/${id}`);
}
export async function criarRole(payload) {
    return api.post('/roles/', payload);
}
export async function atualizarRole(id, payload) {
    return api.put(`/roles/${id}`, payload);
}
export async function deletarRole(id) {
    return api.delete(`/roles/${id}`);
}
