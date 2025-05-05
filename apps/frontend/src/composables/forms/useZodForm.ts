import { reactive, ref, toRaw } from 'vue';
import { z } from 'zod';

export function useZodForm<T extends z.ZodRawShape, TOutput = z.infer<z.ZodObject<T>>>(
  schema: z.ZodObject<T>,
  defaultValues?: Partial<TOutput>,
): {
  form: any;
  errors: any;
  isSubmitting: any;
  validate: () => boolean;
  handleSubmit: (callback: (data: any) => Promise<void> | void) => Promise<void>;
} {
  type FormData = z.infer<typeof schema>;

  const form = reactive<FormData>({
    ...(defaultValues || {}),
  } as FormData);

  const errors = ref<Partial<Record<keyof FormData, string>>>({});
  const isSubmitting = ref(false);

  function validate(): boolean {
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors.value = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      }
      errors.value = fieldErrors;
      return false;
    }

    errors.value = {};
    return true;
  }

  async function handleSubmit(callback: (data: FormData) => Promise<void> | void) {
    if (!validate()) return;

    isSubmitting.value = true;
    try {
      await callback(toRaw(form) as FormData);
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
