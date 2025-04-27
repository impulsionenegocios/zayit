// src/composables/crm/useContactHistory.ts
import { ref, Ref } from 'vue';
import { useToast } from '@/composables/useToast';
import { getLeadContacts, addLeadContact, deleteLeadContact } from '@/services/contactService';
import type { Contact, ContactCreate } from '@/types/contact.types';
import { ContactType } from '@/constants/contactTypes';

export function useContactHistory(leadId: string) {
  const contacts = ref<Contact[]>([]) as Ref<Contact[]>;
  const isLoading = ref(false);
  const toast = useToast();

  // Form for new contact
  const newContact = ref<ContactCreate>({
    type: 'call' as ContactType,
    description: '',
    date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
  });

  // Load contacts
  async function loadContacts() {
    isLoading.value = true;
    try {
      const { data } = await getLeadContacts(leadId);
      contacts.value = data;
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contact history');
    } finally {
      isLoading.value = false;
    }
  }

  // Add new contact
  async function addContact() {
    if (!newContact.value.type || !newContact.value.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    isLoading.value = true;
    try {
      const { data } = await addLeadContact(leadId, newContact.value);
      contacts.value.unshift(data); // Add to beginning of array
      toast.success('Contact record added successfully');

      // Reset form
      newContact.value = {
        type: 'call' as ContactType,
        description: '',
        date: new Date().toISOString().slice(0, 16),
      };

      return true;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact record');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Delete contact
  async function deleteContact(contactId: string) {
    isLoading.value = true;
    try {
      await deleteLeadContact(leadId, contactId);
      contacts.value = contacts.value.filter((contact) => contact.id !== contactId);
      toast.success('Contact record deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact record');
    } finally {
      isLoading.value = false;
    }
  }

  // Load contacts immediately
  loadContacts();

  return {
    contacts,
    isLoading,
    newContact,
    loadContacts,
    addContact,
    deleteContact,
  };
}
