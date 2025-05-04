export interface Script {
  id: string;
  crmId: string;
  name: string;
  type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ScriptCreatePayload {
  name: string;
  type: string;
  content: string;
}

export interface ScriptUpdatePayload {
  name?: string;
  type?: string;
  content?: string;
}
