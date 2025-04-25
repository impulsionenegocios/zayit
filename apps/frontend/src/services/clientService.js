import api from '@/lib/axios';
// Leads/Clients API
export async function getLeads() {
    return api.get('/leads/');
}
export async function getLeadById(id) {
    return api.get(`/leads/${id}`);
}
export async function createLead(payload) {
    return api.post('/leads/', payload);
}
export async function updateLead(id, payload) {
    return api.put(`/leads/${id}`, payload);
}
export async function deleteLead(id) {
    return api.delete(`/leads/${id}`);
}
// Comments API
export async function getLeadComments(leadId) {
    return api.get(`/leads/${leadId}/comments`);
}
export async function addLeadComment(leadId, text) {
    return api.post(`/leads/${leadId}/comments`, { text });
}
// Contacts API
export async function getLeadContacts(leadId) {
    return api.get(`/leads/${leadId}/contacts`);
}
export async function addLeadContact(leadId, contact) {
    return api.post(`/leads/${leadId}/contacts`, contact);
}
// Tags API
export async function getTags() {
    return api.get('/tags');
}
