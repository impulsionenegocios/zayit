// src/composables/forms/useLoginForm.ts
import { ref, reactive } from 'vue';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
});

export function useLoginForm() {
  const form = reactive({
    email: '',
    password: '',
  });

  const errors = ref<Partial<Record<keyof typeof form, string>>>({});

  function validate() {
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors.value = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof typeof form;
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
