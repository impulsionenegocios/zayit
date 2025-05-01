// src/types/crm.types.ts

// ————————————————————————————————————————————
// Domain models (from the backend)
// ————————————————————————————————————————————

export interface CRM {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }
  
  // ————————————————————————————————————————————
  // Payloads for creation/update (sent to the backend)
  // ————————————————————————————————————————————
  
  export interface CRMCreatePayload {
    name: string;
    user_id: string;
  }
  
  export interface CRMUpdatePayload {
    name?: string;
  }