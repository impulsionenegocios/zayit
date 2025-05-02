import api from '@/lib/axios';
import type { Contact, ContactCreate } from '@/types/contact.types';

export async function getLeadContacts(crmId: string, leadId: string) {
  return api.get<Contact[]>(`/crms/${crmId}/leads/${leadId}/contacts`);
}

export async function addLeadContact(crmId: string, leadId: string, contact: ContactCreate) {
  return api.post<Contact>(`/crms/${crmId}/leads/${leadId}/contacts`, contact);
}

export async function deleteLeadContact(crmId: string, leadId: string, contactId: string) {
  return api.delete(`/crms/${crmId}/leads/${leadId}/contacts/${contactId}`);
}
