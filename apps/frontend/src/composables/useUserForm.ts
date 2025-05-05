// src/composables/forms/useUserForm.ts
import { ref, reactive } from 'vue';
import { z } from 'zod';

const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

type UserFormData = {
  name: string;
  email: string;
  [key: string]: any;
};

export function useUserForm() {
  const form = reactive<UserFormData>({
    name: '',
    email: '',
  });

  const errors = ref<Partial<Record<keyof UserFormData, string>>>({});

  function validate(): boolean {
    const result = userFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors.value = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UserFormData;
        fieldErrors[field] = issue.message;
      }
      errors.value = fieldErrors;
      return false;
    }

    errors.value = {};
    return true;
  }

  return {
    form,
    errors,
    validate,
  };
}
