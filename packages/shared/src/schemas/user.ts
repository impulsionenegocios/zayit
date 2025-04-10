import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
})

export type UserFormData = z.infer<typeof userFormSchema>
