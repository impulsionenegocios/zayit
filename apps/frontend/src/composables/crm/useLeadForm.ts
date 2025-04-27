// src/composables/crm/useLeadForm.ts

import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import type {
  LeadSource,
  LeadStatus,
  LeadCreatePayload,
  LeadUpdatePayload,
  Tag,
} from '@/types/lead.types';
import { createLead, updateLead, getLeadById } from '@/services/crm';
import { getTags } from '@/services/tagService';

export function useLeadForm(leadId?: string) {
  const router = useRouter();
  const toast = useToast();
  const isSubmitting = ref(false);
  const isEditing = computed(() => !!leadId);

  // Só IDs de tag
  const selectedTagIds = ref<string[]>([]);
  // Todas as tags para lookup
  const availableTags = ref<Tag[]>([]);

  // Estado do form (sem form.tags)
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    source: undefined as LeadSource | undefined,
    status: 'lead' as LeadStatus,
  });

  const errors = reactive<Record<string, string>>({});

  // Tipagem explícita para evitar any[]
  const sourceOptions: { label: string; value: LeadSource }[] = [
    { label: 'Organic', value: 'organic' },
    { label: 'Advertisement', value: 'advertisement' },
    { label: 'Referral', value: 'referral' },
    { label: 'Social Media', value: 'social' },
    { label: 'Other', value: 'other' },
  ];

  const statusOptions: { label: string; value: LeadStatus }[] = [
    { label: 'Lead', value: 'lead' },
    { label: 'Opportunity', value: 'opportunity' },
    { label: 'Client', value: 'client' },
    { label: 'Lost', value: 'lost' },
  ];

  async function loadAvailableTags() {
    try {
      const { data } = await getTags();
      availableTags.value = data;
    } catch (err) {
      console.error('Error loading tags', err);
    }
  }

  async function loadLead(id: string) {
    try {
      await loadAvailableTags();
      const { data: lead } = await getLeadById(id);
      form.name = lead.name;
      form.email = lead.email;
      form.phone = lead.phone;
      form.address = lead.address || '';
      form.birthDate = lead.birthDate || '';
      form.source = lead.source;
      form.status = lead.status;
      // Aqui anotamos explicitamente o tipo de `t`
      selectedTagIds.value = lead.tags.map((t: Tag) => t.id);
    } catch {
      toast.error('Failed to load lead');
      router.push({ name: 'LeadList', params: {} });
    }
  }

  function validateForm() {
    errors.name = !form.name.trim() ? 'Name is required' : '';
    errors.email = !form.email.trim() ? 'Email is required' : '';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    errors.phone = !form.phone.trim() ? 'Phone is required' : '';
    errors.status = !form.status ? 'Status is required' : '';
    return !Object.values(errors).some((e) => e);
  }

  async function handleSubmit() {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    isSubmitting.value = true;

    const payload: LeadCreatePayload | LeadUpdatePayload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      birthDate: form.birthDate,
      source: form.source,
      status: form.status,
      tags: selectedTagIds.value, // somente string[]
    };

    try {
      if (isEditing.value && leadId) {
        await updateLead(leadId, payload as LeadUpdatePayload);
        toast.success('Lead updated successfully');
      } else {
        await createLead(payload as LeadCreatePayload);
        toast.success('Lead created successfully');
      }
      router.push({ name: 'LeadList', params: {} });
    } catch {
      toast.error('Failed to save lead');
    } finally {
      isSubmitting.value = false;
    }
  }
  console.log(router.resolve({ name: 'LeadList' }));

  function cancel() {
    // const resolved = router.resolve({ name: 'LeadList' });
    // console.log('🔁 Redirecionando para:', resolved.fullPath);
    console.log('⚠️ TODAS AS ROTAS');
    console.table(
      router
        .getRoutes()
        .filter((r) => r.name === 'LeadList')
        .map((r) => ({
          name: r.name,
          path: r.path,
          fullPath: router.resolve({ name: r.name }).fullPath,
        })),
    );
    // router.push({ name: 'LeadList' });
  }

  if (leadId) loadLead(leadId);
  else loadAvailableTags();

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    sourceOptions,
    statusOptions,
    selectedTagIds,
    handleSubmit,
    cancel,
  };
}
