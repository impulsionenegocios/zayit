// src/types/contact.types.ts
import { ContactType } from '@/constants/contactTypes';

export interface Contact {
  id: string;
  leadId: string;
  type: ContactType;
  description: string;
  date: string;
  userId: string;
}

export interface ContactCreate {
  type: ContactType;
  description: string;
  date: string;
}
