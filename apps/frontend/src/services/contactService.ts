// src/services/contactService.ts
import api from '@/lib/axios';
import type { Contact, ContactCreate } from '@/types/contact.types';

export async function getLeadContacts(leadId: string) {
  return api.get<Contact[]>(`/leads/${leadId}/contacts`);
}

export async function addLeadContact(leadId: string, contact: ContactCreate) {
  return api.post<Contact>(`/leads/${leadId}/contacts`, contact);
}

export async function deleteLeadContact(leadId: string, contactId: string) {
  return api.delete(`/leads/${leadId}/contacts/${contactId}`);
}
