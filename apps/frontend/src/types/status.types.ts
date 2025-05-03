

export interface Status {
  id: string;
  name: string;
  color: string;
  order: number;
  description?: string;
  crm_id: string;
}


export interface StatusCreatePayload {
  name: string;
  color: string;
  order: number;
  description?: string;
}

export interface StatusUpdatePayload {
  name?: string;
  color?: string;
  order?: number;
  description?: string;
}
