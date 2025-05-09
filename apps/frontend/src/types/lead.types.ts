// src/types/lead.types.ts
export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface LeadSource {
  id: string;
  name: string;
  description?: string;
}

export interface LeadStatus {
  id: string;
  name: string;
  color: string;
  order: number;
  description?: string;
}

export type LeadSourceType = string;
export type LeadStatusType = string;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string;
  source?: LeadSourceType;
  sourceId?: string;
  status: LeadStatusType;
  statusId?: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  leadId: string;
  userId: string;
  text: string;
  created_at: string;
}

export interface Contact {
  id: string;
  leadId: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting';
  description: string;
  date: string;
  userId: string;
}

export interface LeadFile {
  id: string;
  leadId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  assignedTo?: string;
}

// ————————————————————————————————————————————
// Payloads para criação/atualização (envio ao back-end)
// ————————————————————————————————————————————

/** Só IDs de tags, pois o back aceita um array de strings */
export interface LeadCreatePayload {
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string;
  source?: LeadSourceType;
  sourceId?: string;
  status: LeadStatusType;
  statusId?: string;
  tags: string[];
}

/** Mesma forma do create, mas tudo opcional para PATCH/PUT */
export interface LeadUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  source?: LeadSourceType;
  sourceId?: string;
  status?: LeadStatusType;
  statusId?: string;
  tags?: string[];
}
