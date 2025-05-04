import { z } from 'zod';
export declare const userFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
}, {
    name: string;
    email: string;
}>;
export type UserFormData = z.infer<typeof userFormSchema>;
