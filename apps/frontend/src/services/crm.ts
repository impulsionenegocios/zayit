import api from '@/lib/axios';
import type {
  Lead,
  Comment,
  Contact,
  Tag,
  Task,
  LeadCreatePayload,
  LeadUpdatePayload,
} from '@/types/lead.types';

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

// ————————————————————————————————————
// Comments
// ————————————————————————————————————

export function getLeadComments(crmId: string, leadId: string) {
  return api.get<Comment[]>(`/crms/${crmId}/leads/${leadId}/comments`);
}

export function addLeadComment(crmId: string, leadId: string, text: string) {
  return api.post<Comment>(`/crms/${crmId}/leads/${leadId}/comments`, { text });
}

export function deleteLeadComment(crmId: string, leadId: string, commentId: string) {
  return api.delete<void>(`/crms/${crmId}/leads/${leadId}/comments/${commentId}`);
}

// ————————————————————————————————————
// Contacts
// ————————————————————————————————————

export function getLeadContacts(crmId: string, leadId: string) {
  return api.get<Contact[]>(`/crms/${crmId}/leads/${leadId}/contacts`);
}

export function addLeadContact(crmId: string, leadId: string, contact: Omit<Contact, 'id'>) {
  return api.post<Contact>(`/crms/${crmId}/leads/${leadId}/contacts`, contact);
}

export function deleteLeadContact(crmId: string, leadId: string, contactId: string) {
  return api.delete<void>(`/crms/${crmId}/leads/${leadId}/contacts/${contactId}`);
}

// ————————————————————————————————————
// Tags
// ————————————————————————————————————

export function getTags(crmId: string) {
  return api.get<Tag[]>(`/crms/${crmId}/tags`);
}

export function createTag(crmId: string, tag: Omit<Tag, 'id'>) {
  return api.post<Tag>(`/crms/${crmId}/tags`, tag);
}

// ————————————————————————————————————
// Tasks
// ————————————————————————————————————

export function getLeadTasks(crmId: string, leadId: string) {
  return api.get<Task[]>(`/crms/${crmId}/leads/${leadId}/tasks`);
}

export function createLeadTask(crmId: string, leadId: string, task: Omit<Task, 'id'>) {
  return api.post<Task>(`/crms/${crmId}/leads/${leadId}/tasks`, task);
}

export function updateLeadTask(
  crmId: string,
  leadId: string,
  taskId: string,
  update: Partial<Task>,
) {
  return api.put<Task>(`/crms/${crmId}/leads/${leadId}/tasks/${taskId}`, update);
}

export function deleteLeadTask(crmId: string, leadId: string, taskId: string) {
  return api.delete<void>(`/crms/${crmId}/leads/${leadId}/tasks/${taskId}`);
}
