

export interface Source {
  id: string;
  name: string;
  description?: string;
  crm_id: string;
}


export interface SourceCreatePayload {
  name: string;
  description?: string;
}

export interface SourceUpdatePayload {
  name?: string;
  description?: string;
}
