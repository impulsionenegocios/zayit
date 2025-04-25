// src/composables/forms/useUserForm.ts
import { ref, reactive } from 'vue';
import { userFormSchema } from '@shared/schemas/user';
export function useUserForm() {
  const form = reactive({
    name: '',
    email: '',
  });
  const errors = ref({});
  function validate() {
    const result = userFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
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
