import { reactive, ref, toRaw } from 'vue';
export function useZodForm(schema, defaultValues) {
  const form = reactive({
    ...(defaultValues || {}),
  });
  const errors = ref({});
  const isSubmitting = ref(false);
  function validate() {
    const result = schema.safeParse(form);
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
  async function handleSubmit(callback) {
    if (!validate()) return;
    isSubmitting.value = true;
    try {
      await callback(toRaw(form));
    } finally {
      isSubmitting.value = false;
    }
  }
  return {
    form,
    errors,
    isSubmitting,
    validate,
    handleSubmit,
  };
}
