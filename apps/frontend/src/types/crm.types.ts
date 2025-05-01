// src/types/crm.types.ts

// ————————————————————————————————————————————
// Domain models (from the backend)
// ————————————————————————————————————————————

export interface CRM {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// ————————————————————————————————————————————
// Payloads for creation/update (sent to the backend)
// ————————————————————————————————————————————

export interface CRMCreatePayload {
  name: string;
}

export interface CRMUpdatePayload {
  name?: string;
}
