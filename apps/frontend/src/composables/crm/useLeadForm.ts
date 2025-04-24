import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import type { Lead, LeadSource, LeadStatus } from '@/types/lead.types';
import { createLead, updateLead, getLeadById } from '@/services/crm';

export function useLeadForm(leadId?: string) {
  const router = useRouter();
  const toast = useToast();
  const isSubmitting = ref(false);
  const isEditing = computed(() => !!leadId);
  
  // Form data
  const form = reactive<{
    name: string;
    email: string;
    phone: string;
    address?: string;
    birthDate?: string;
    source?: LeadSource;
    status: LeadStatus;
    tags: string[];
  }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    source: undefined,
    status: 'lead',
    tags: []
  });

  // Form validation
  const errors = reactive<Record<string, string>>({});

  // Options for dropdowns
  const sourceOptions = [
    { label: 'Organic', value: 'organic' },
    { label: 'Advertisement', value: 'advertisement' },
    { label: 'Referral', value: 'referral' },
    { label: 'Social Media', value: 'social' },
    { label: 'Other', value: 'other' }
  ];

  const statusOptions = [
    { label: 'Lead', value: 'lead' },
    { label: 'Opportunity', value: 'opportunity' },
    { label: 'Client', value: 'client' },
    { label: 'Lost', value: 'lost' }
  ];
  
  // Load lead data if editing
  if (leadId) {
    loadLead(leadId);
  }
  
  async function loadLead(id: string) {
    try {
      const response = await getLeadById(id);
      const lead = response.data;
      
      form.name = lead.name;
      form.email = lead.email;
      form.phone = lead.phone;
      form.address = lead.address;
      form.birthDate = lead.birthDate;
      form.source = lead.source;
      form.status = lead.status;
      form.tags = lead.tags.map(tag => tag.id);
    } catch (error) {
      console.error('Error loading lead:', error);
      toast.error('Failed to load lead data');
      router.push('/crm/leads');
    }
  }

  // Validate form
  function validateForm() {
    errors.name = !form.name.trim() ? 'Name is required' : '';
    errors.email = !form.email.trim() ? 'Email is required' : '';
    
    // Email format validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    
    errors.phone = !form.phone.trim() ? 'Phone is required' : '';
    errors.status = !form.status ? 'Status is required' : '';
    
    return !Object.values(errors).some(error => error);
  }

  // Form submission
  async function handleSubmit() {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    isSubmitting.value = true;
    
    try {
      if (isEditing.value && leadId) {
        await updateLead(leadId, form);
        toast.success('Lead updated successfully');
      } else {
        await createLead(form);
        toast.success('Lead created successfully');
      }
      
      // Navigate back to list
      router.push('/crm/leads');
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save lead');
    } finally {
      isSubmitting.value = false;
    }
  }

  // Cancel form
  function cancel() {
    router.push('/crm/leads');
  }
  
  return {
    form,
    errors,
    isSubmitting,
    isEditing,
    sourceOptions,
    statusOptions,
    handleSubmit,
    cancel
  };
}