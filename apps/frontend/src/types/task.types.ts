// src/types/task.types.ts
export interface Task {
    id: string;
    leadId: string;
    title: string;
    due_date: string; // YYYY-MM-DD
    completed: boolean;
    createdAt: string;
  }
  
  export interface NewTask {
    title: string;
    due_date: string;
    completed: boolean;
  }
  