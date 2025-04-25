// src/services/crm.ts

import api from '@/lib/axios'
import type {
  Lead,
  Comment,
  Contact,
  Tag,
  Task,
  LeadFile,
  LeadCreatePayload,
  LeadUpdatePayload
} from '@/types/lead.types'

// ————————————————————————————————————
// Leads
// ————————————————————————————————————

export function getLeads() {
  return api.get<Lead[]>('/crm/leads/')
}

export function getLeadById(id: string) {
  return api.get<Lead>(`/crm/leads/${id}`)
}

export function createLead(payload: LeadCreatePayload) {
  return api.post<Lead>('/crm/leads/', payload)
}

export function updateLead(id: string, payload: LeadUpdatePayload) {
  return api.put<Lead>(`/crm/leads/${id}`, payload)
}

export function deleteLead(id: string) {
  return api.delete<void>(`/crm/leads/${id}`)
}


// ————————————————————————————————————
// Comments
// ————————————————————————————————————

export function getLeadComments(leadId: string) {
  return api.get<Comment[]>(`/crm/leads/${leadId}/comments`)
}

export function addLeadComment(leadId: string, text: string) {
  return api.post<Comment>(`/crm/leads/${leadId}/comments`, { text })
}

export function deleteLeadComment(leadId: string, commentId: string) {
  return api.delete<void>(`/crm/leads/${leadId}/comments/${commentId}`)
}


// ————————————————————————————————————
// Contacts
// ————————————————————————————————————

export function getLeadContacts(leadId: string) {
  return api.get<Contact[]>(`/crm/leads/${leadId}/contacts`)
}

// envie apenas o objeto sem id; o backend vai devolver o Contact completo
export function addLeadContact(leadId: string, contact: Omit<Contact, 'id'>) {
  return api.post<Contact>(`/crm/leads/${leadId}/contacts`, contact)
}

export function deleteLeadContact(leadId: string, contactId: string) {
  return api.delete<void>(`/crm/leads/${leadId}/contacts/${contactId}`)
}


// ————————————————————————————————————
// Tags
// ————————————————————————————————————

export function getTags() {
  return api.get<Tag[]>('/crm/tags')
}

export function createTag(tag: Omit<Tag, 'id'>) {
  return api.post<Tag>('/crm/tags', tag)
}


// ————————————————————————————————————
// Tasks
// ————————————————————————————————————

export function getLeadTasks(leadId: string) {
  return api.get<Task[]>(`/crm/leads/${leadId}/tasks`)
}

// envie apenas o objeto sem id; o backend vai devolver o Task completo
export function createLeadTask(leadId: string, task: Omit<Task, 'id'>) {
  return api.post<Task>(`/crm/leads/${leadId}/tasks`, task)
}

export function updateLeadTask(
  leadId: string,
  taskId: string,
  update: Partial<Task>
) {
  return api.put<Task>(`/crm/leads/${leadId}/tasks/${taskId}`, update)
}

export function deleteLeadTask(leadId: string, taskId: string) {
  return api.delete<void>(`/crm/leads/${leadId}/tasks/${taskId}`)
}


// ————————————————————————————————————
// Files
// ————————————————————————————————————

export function getLeadFiles(leadId: string) {
  return api.get<LeadFile[]>(`/crm/leads/${leadId}/files`)
}

export function uploadLeadFile(leadId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<LeadFile>(
    `/crm/leads/${leadId}/files`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
}

export function deleteLeadFile(leadId: string, fileId: string) {
  return api.delete<void>(`/crm/leads/${leadId}/files/${fileId}`)
}