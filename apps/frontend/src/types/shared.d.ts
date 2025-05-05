declare module '@shared/schemas/user' {
  import { z } from 'zod';
  
  export const userFormSchema: z.ZodObject<any>;
  export interface UserFormData {
    name: string;
    email: string;
    [key: string]: any;
  }
}
