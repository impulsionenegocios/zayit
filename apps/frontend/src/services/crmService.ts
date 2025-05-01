// src/services/crmService.ts
import api from '@/lib/axios';
import type { CRM, CRMCreatePayload, CRMUpdatePayload } from '@/types/crm.types';

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