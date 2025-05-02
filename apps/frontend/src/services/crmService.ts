// src/services/crmService.ts
import api from '@/lib/axios';
import type { CRM, CRMCreatePayload, CRMUpdatePayload } from '@/types/crm.types';
import type { Lead, LeadCreatePayload, LeadUpdatePayload } from '@/types/lead.types';

// CRM API endpoints
export async function getCRMs() {
  return api.get('/crms/');
}

export async function getCRMById(id: string) {
  return api.get(`/crms/${id}`);
}

export async function createCRM(payload: CRMCreatePayload) {
  return api.post('/crms/', payload);
}

export async function updateCRM(id: string, payload: CRMUpdatePayload) {
  return api.put(`/crms/${id}`, payload);
}

export async function deleteCRM(id: string) {
  return api.delete(`/crms/${id}`);
}

// Lead API endpoints
export function getLeads(crmId: string) {
  return api.get<Lead[]>(`/crms/${crmId}/leads`);
}

export function getLeadById(crmId: string, leadId: string) {
  return api.get<Lead>(`/crms/${crmId}/leads/${leadId}`);
}

export function createLead(crmId: string, payload: LeadCreatePayload) {
  return api.post<Lead>(`/crms/${crmId}/leads`, payload);
}

export function updateLead(crmId: string, leadId: string, payload: LeadUpdatePayload) {
  return api.put<Lead>(`/crms/${crmId}/leads/${leadId}`, payload);
}

export function deleteLead(crmId: string, leadId: string) {
  return api.delete<void>(`/crms/${crmId}/leads/${leadId}`);
}
