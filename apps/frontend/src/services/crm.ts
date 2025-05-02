import api from '@/lib/axios';
import type { Lead, LeadCreatePayload, LeadUpdatePayload } from '@/types/lead.types';

// ————————————————————————————————————
// Leads
// ————————————————————————————————————

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
