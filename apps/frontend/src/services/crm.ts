import api from '@/lib/axios';
import type { Lead, Comment, Contact, Tag, Task, LeadFile } from '@/types/lead.types';

// Leads API
export async function getLeads() {
  return api.get('/crm/leads/');
}

export async function getLeadById(id: string) {
  return api.get(`/crm/leads/${id}`);
}

export async function createLead(payload: Partial<Lead>) {
  return api.post('/crm/leads/', payload);
}

export async function updateLead(id: string, payload: Partial<Lead>) {
  return api.put(`/crm/leads/${id}`, payload);
}

export async function deleteLead(id: string) {
  return api.delete(`/crm/leads/${id}`);
}

// Comments API
export async function getLeadComments(leadId: string) {
  return api.get(`/crm/leads/${leadId}/comments`);
}

export async function addLeadComment(leadId: string, text: string) {
  return api.post(`/crm/leads/${leadId}/comments`, { text });
}

export async function deleteLeadComment(leadId: string, commentId: string) {
  return api.delete(`/crm/leads/${leadId}/comments/${commentId}`);
}

// Contacts API
export async function getLeadContacts(leadId: string) {
  return api.get(`/crm/leads/${leadId}/contacts`);
}

export async function addLeadContact(leadId: string, contact: Partial<Contact>) {
  return api.post(`/crm/leads/${leadId}/contacts`, contact);
}

export async function deleteLeadContact(leadId: string, contactId: string) {
  return api.delete(`/crm/leads/${leadId}/contacts/${contactId}`);
}

// Tags API
export async function getTags() {
  return api.get('/crm/tags');
}

export async function createTag(tag: Omit<Tag, 'id'>) {
  return api.post('/crm/tags', tag);
}

// Tasks API
export async function getLeadTasks(leadId: string) {
  return api.get(`/crm/leads/${leadId}/tasks`);
}

export async function createLeadTask(leadId: string, task: Partial<Task>) {
  return api.post(`/crm/leads/${leadId}/tasks`, task);
}

export async function updateLeadTask(leadId: string, taskId: string, update: Partial<Task>) {
  return api.put(`/crm/leads/${leadId}/tasks/${taskId}`, update);
}

export async function deleteLeadTask(leadId: string, taskId: string) {
  return api.delete(`/crm/leads/${leadId}/tasks/${taskId}`);
}

// Files API
export async function getLeadFiles(leadId: string) {
  return api.get(`/crm/leads/${leadId}/files`);
}

export async function uploadLeadFile(leadId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(`/crm/leads/${leadId}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export async function deleteLeadFile(leadId: string, fileId: string) {
  return api.delete(`/crm/leads/${leadId}/files/${fileId}`);
}