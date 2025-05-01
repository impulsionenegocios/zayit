// src/composables/crm/useCRMForm.ts
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import type { CRMCreatePayload, CRMUpdatePayload } from '@/types/crm.types';
import { getCRMById, createCRM, updateCRM } from '@/services/crmService';

export function useCRMForm(crmId?: string) {
  const router = useRouter();
  const toast = useToast();

  const isSubmitting = ref(false);
  const isEditing = computed(() => !!crmId);

  // Form state
  const form = reactive({
    name: '',
  });

  const errors = reactive<Record<string, string>>({});

  async function loadCRM(id: string) {
    try {
      const { data: crm } = await getCRMById(id);
      form.name = crm.name;
    } catch {
      toast.error('Failed to load CRM');
      router.push({ name: 'CRMList' });
    }
  }

  function validateForm() {
    errors.name = !form.name.trim() ? 'Name is required' : '';
    return !Object.values(errors).some((e) => e);
  }

  async function handleSubmit() {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    isSubmitting.value = true;

    try {
      if (isEditing.value && crmId) {
        const payload: CRMUpdatePayload = {
          name: form.name,
        };

        await updateCRM(crmId, payload);
        toast.success('CRM updated successfully');
      } else {
        const payload: CRMCreatePayload = {
          name: form.name,
        };

        await createCRM(payload);
        toast.success('CRM created successfully');
      }

      router.push({ name: 'CRMList' });
    } catch {
      toast.error('Failed to save CRM');
    } finally {
      isSubmitting.value = false;
    }
  }

  function cancel() {
    router.push({ name: 'CRMList' });
  }

  if (crmId) loadCRM(crmId);

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    handleSubmit,
    cancel,
  };
}
