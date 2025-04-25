import type { ContactType } from '@/constants/contactTypes';
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  birthDate?: string;
  source?: LeadSource;
  status: LeadStatus;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export type LeadSource = 'organic' | 'advertisement' | 'referral' | 'social' | 'other';

export type LeadStatus = 'lead' | 'opportunity' | 'client' | 'lost';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  leadId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  leadId: string;
  type: ContactType;
  description: string;
  date: string;
  userId: string;
}

export interface NewContact {
  type: ContactType | '';
  date: string;
  description: string;
}
