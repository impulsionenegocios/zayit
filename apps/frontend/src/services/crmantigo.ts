// src/services/kanban.ts

import api from '@/lib/axios'; // ajusta o path se necessário

// ---- Tipagens ----
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  checklist?: ChecklistItem[];
}

export interface Column {
  id: string;
  name: string;
  color: string;
  cards: Card[];
}

// ---- Funções ----
/**
 * Cria uma nova coluna
 */
export async function createColumn(payload: Pick<Column, 'name' | 'color'>): Promise<Column> {
  const { data } = await api.post<Column>('/columns', payload);
  return data;
}
/**
 * Busca todas as colunas com seus cards
 */
export async function fetchColumns(): Promise<Column[]> {
  const { data } = await api.get<Column[]>('/columns/');
  return data;
}

/**
 * Atualiza nome ou ordem de cards de uma coluna
 */
export async function updateColumn(
  columnId: string,
  payload: Partial<Pick<Column, 'name' | 'cards'>>,
): Promise<Column> {
  const { data } = await api.patch<Column>(`/columns/${columnId}`, payload);
  return data;
}

/**
 * Remove uma coluna inteira
 */
export async function deleteColumn(columnId: string): Promise<void> {
  await api.delete(`/columns/${columnId}`);
}

/**
 * Cria um card novo na coluna
 */
export async function createCard(columnId: string, title: string): Promise<Card> {
  const { data } = await api.post<Card>(`/columns/${columnId}/cards`, { title });
  return data;
}

/**
 * Atualiza um card específico (título, checklist, tags…)
 */
export async function updateCard(card: Card): Promise<Card> {
  const { data } = await api.patch<Card>(`/cards/${card.id}`, card);
  return data;
}

/**
 * Remove um card pelo ID
 */
export async function deleteCard(cardId: string): Promise<void> {
  await api.delete(`/cards/${cardId}`);
}
