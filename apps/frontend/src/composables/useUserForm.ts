// src/composables/forms/useUserForm.ts
import { ref, reactive } from 'vue'
import { userFormSchema, type UserFormData } from '@shared/schemas/user'

export function useUserForm() {
  const form = reactive<UserFormData>({
    name: '',
    email: '',
  })

  const errors = ref<Partial<Record<keyof UserFormData, string>>>({})

  function validate(): boolean {
    const result = userFormSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: typeof errors.value = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UserFormData
        fieldErrors[field] = issue.message
      }
      errors.value = fieldErrors
      return false
    }

    errors.value = {}
    return true
  }

  return {
    form,
    errors,
    validate,
  }
}
