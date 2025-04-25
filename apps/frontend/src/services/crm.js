// src/services/crm.ts
import api from '@/lib/axios';
// ————————————————————————————————————
// Leads
// ————————————————————————————————————
export function getLeads() {
    return api.get('/crm/leads/');
}
export function getLeadById(id) {
    return api.get(`/crm/leads/${id}`);
}
export function createLead(payload) {
    return api.post('/crm/leads/', payload);
}
export function updateLead(id, payload) {
    return api.put(`/crm/leads/${id}`, payload);
}
export function deleteLead(id) {
    return api.delete(`/crm/leads/${id}`);
}
// ————————————————————————————————————
// Comments
// ————————————————————————————————————
export function getLeadComments(leadId) {
    return api.get(`/crm/leads/${leadId}/comments`);
}
export function addLeadComment(leadId, text) {
    return api.post(`/crm/leads/${leadId}/comments`, { text });
}
export function deleteLeadComment(leadId, commentId) {
    return api.delete(`/crm/leads/${leadId}/comments/${commentId}`);
}
// ————————————————————————————————————
// Contacts
// ————————————————————————————————————
export function getLeadContacts(leadId) {
    return api.get(`/crm/leads/${leadId}/contacts`);
}
// envie apenas o objeto sem id; o backend vai devolver o Contact completo
export function addLeadContact(leadId, contact) {
    return api.post(`/crm/leads/${leadId}/contacts`, contact);
}
export function deleteLeadContact(leadId, contactId) {
    return api.delete(`/crm/leads/${leadId}/contacts/${contactId}`);
}
// ————————————————————————————————————
// Tags
// ————————————————————————————————————
export function getTags() {
    return api.get('/crm/tags');
}
export function createTag(tag) {
    return api.post('/crm/tags', tag);
}
// ————————————————————————————————————
// Tasks
// ————————————————————————————————————
export function getLeadTasks(leadId) {
    return api.get(`/crm/leads/${leadId}/tasks`);
}
// envie apenas o objeto sem id; o backend vai devolver o Task completo
export function createLeadTask(leadId, task) {
    return api.post(`/crm/leads/${leadId}/tasks`, task);
}
export function updateLeadTask(leadId, taskId, update) {
    return api.put(`/crm/leads/${leadId}/tasks/${taskId}`, update);
}
export function deleteLeadTask(leadId, taskId) {
    return api.delete(`/crm/leads/${leadId}/tasks/${taskId}`);
}
// ————————————————————————————————————
// Files
// ————————————————————————————————————
export function getLeadFiles(leadId) {
    return api.get(`/crm/leads/${leadId}/files`);
}
export function uploadLeadFile(leadId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/crm/leads/${leadId}/files`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}
export function deleteLeadFile(leadId, fileId) {
    return api.delete(`/crm/leads/${leadId}/files/${fileId}`);
}
