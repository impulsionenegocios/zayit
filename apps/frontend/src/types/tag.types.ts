export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface TagCreate {
  name: string;
  color: string;
}

export interface TagUpdate {
  name?: string;
  color?: string;
}
