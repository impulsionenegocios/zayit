// src/services/kanban.ts
import api from '@/lib/axios'; // ajusta o path se necessário
// ---- Funções ----
/**
 * Cria uma nova coluna
 */
export async function createColumn(payload) {
    const { data } = await api.post('/columns', payload);
    return data;
}
/**
 * Busca todas as colunas com seus cards
 */
export async function fetchColumns() {
    const { data } = await api.get('/columns/');
    return data;
}
/**
 * Atualiza nome ou ordem de cards de uma coluna
 */
export async function updateColumn(columnId, payload) {
    const { data } = await api.patch(`/columns/${columnId}`, payload);
    return data;
}
/**
 * Remove uma coluna inteira
 */
export async function deleteColumn(columnId) {
    await api.delete(`/columns/${columnId}`);
}
/**
 * Cria um card novo na coluna
 */
export async function createCard(columnId, title) {
    const { data } = await api.post(`/columns/${columnId}/cards`, { title });
    return data;
}
/**
 * Atualiza um card específico (título, checklist, tags…)
 */
export async function updateCard(card) {
    const { data } = await api.patch(`/cards/${card.id}`, card);
    return data;
}
/**
 * Remove um card pelo ID
 */
export async function deleteCard(cardId) {
    await api.delete(`/cards/${cardId}`);
}
