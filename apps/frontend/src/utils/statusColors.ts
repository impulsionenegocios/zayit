import { LeadStatus } from '@/types/lead.types';
export function formatStatus(status: LeadStatus) {
  switch (status) {
    case 'lead':
      return 'Lead';
    case 'opportunity':
      return 'Opportunity';
    case 'client':
      return 'Client';
    case 'lost':
      return 'Lost';
    default:
      return 'Unknown';
  }
}
