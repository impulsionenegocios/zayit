// src/types/comment.types.ts
export interface Comment {
    id: string;
    leadId: string;
    userId: string;
    user_name: string;
    text: string;
    created_at: string;
  }
  
  export interface NewComment {
    text: string;
  }