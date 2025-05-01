import api from '@/lib/axios';
import type { Lead, Comment, Contact } from '@/types/lead.types';

// Leads/Clients API
export async function getLeads() {
  return api.get('/leads/');
}

export async function getLeadById(id: string) {
  return api.get(`/leads/${id}`);
}

export async function createLead(payload: Partial<Lead>) {
  return api.post('/leads/', payload);
}

export async function updateLead(id: string, payload: Partial<Lead>) {
  return api.put(`/leads/${id}`, payload);
}

export async function deleteLead(id: string) {
  return api.delete(`/leads/${id}`);
}

// Comments API
export async function getLeadComments(leadId: string) {
  return api.get(`/leads/${leadId}/comments`);
}

export async function addLeadComment(leadId: string, text: string) {
  return api.post(`/leads/${leadId}/comments`, { text });
}

// Contacts API
export async function getLeadContacts(leadId: string) {
  return api.get(`/leads/${leadId}/contacts`);
}

export async function addLeadContact(leadId: string, contact: Partial<Contact>) {
  return api.post(`/leads/${leadId}/contacts`, contact);
}

// Tags API
export async function getTags() {
  return api.get('/tags');
}
