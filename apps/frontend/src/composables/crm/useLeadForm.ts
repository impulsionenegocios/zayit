// src/composables/crm/useLeadForm.ts
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

export function useLeadForm(leadIdParam?: string) {
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();

  // 1) Captura o crmId do URL e, se houver, o leadId
  const crmId = route.params.crmId as string;
  const leadId = leadIdParam ?? (route.params.leadId as string | undefined);

  const isSubmitting = ref(false);
  const isEditing = computed(() => !!leadId);

  // tags selecionadas e disponíveis
  const selectedTagIds = ref<string[]>([]);
  const availableTags = ref<Tag[]>([]);

  // estado do form
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

  const sourceOptions = [
    { label: 'Organic',        value: 'organic' },
    { label: 'Advertisement',  value: 'advertisement' },
    { label: 'Referral',       value: 'referral' },
    { label: 'Social Media',   value: 'social' },
    { label: 'Other',          value: 'other' },
  ] as { label: string; value: LeadSource }[];

  const statusOptions = [
    { label: 'Lead',        value: 'lead' },
    { label: 'Opportunity', value: 'opportunity' },
    { label: 'Client',      value: 'client' },
    { label: 'Lost',        value: 'lost' },
  ] as { label: string; value: LeadStatus }[];

  // carrega todas as tags
  async function loadAvailableTags() {
    try {
      const { data } = await getTags();
      availableTags.value = data;
    } catch (err) {
      console.error('Error loading tags', err);
    }
  }

  // carrega um lead existente para edição
  async function loadLead(id: string) {
    try {
      await loadAvailableTags();
      const { data: lead } = await getLeadById(crmId, id);
      form.name       = lead.name;
      form.email      = lead.email;
      form.phone      = lead.phone;
      form.address    = lead.address    || '';
      form.birthDate  = lead.birthDate  || '';
      form.source     = lead.source;
      form.status     = lead.status;
      selectedTagIds.value = lead.tags.map((t: Tag) => t.id);
    } catch {
      toast.error('Failed to load lead');
      router.push({ name: 'CRMLeadList', params: { crmId } });
    }
  }

  function validateForm() {
    errors.name   = form.name.trim()   ? '' : 'Name is required';
    errors.email  = form.email.trim()  ? '' : 'Email is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    errors.phone  = form.phone.trim()  ? '' : 'Phone is required';
    errors.status = form.status       ? '' : 'Status is required';
    return !Object.values(errors).some((e) => e);
  }

  async function handleSubmit() {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    isSubmitting.value = true;

    // payload compartilhado
    const payload = {
      name:       form.name,
      email:      form.email,
      phone:      form.phone,
      address:    form.address,
      birthDate:  form.birthDate,
      source:     form.source,
      status:     form.status,
      tags:       selectedTagIds.value,
    };

    try {
      if (isEditing.value && leadId) {
        await updateLead(crmId, leadId, payload as LeadUpdatePayload);
        toast.success('Lead updated successfully');
      } else {
        await createLead(crmId, payload as LeadCreatePayload);
        toast.success('Lead created successfully');
      }
      // volta pra lista de leads desse CRM
      router.push({ name: 'CRMLeadList', params: { crmId } });
    } catch {
      toast.error('Failed to save lead');
    } finally {
      isSubmitting.value = false;
    }
  }

  function cancel() {
    router.push({ name: 'CRMLeadList', params: { crmId } });
  }

  onMounted(() => {
    if (leadId) {
      loadLead(leadId);
    } else {
      loadAvailableTags();
    }
  });

  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    sourceOptions,
    statusOptions,
    selectedTagIds,
    availableTags,
    handleSubmit,
    cancel,
  };
}
