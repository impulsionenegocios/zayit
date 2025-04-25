// src/composables/crm/useLeadForm.ts
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { createLead, updateLead, getLeadById } from '@/services/crm';
import { getTags } from '@/services/tagService';
export function useLeadForm(leadId) {
    const router = useRouter();
    const toast = useToast();
    const isSubmitting = ref(false);
    const isEditing = computed(() => !!leadId);
    // Só IDs de tag
    const selectedTagIds = ref([]);
    // Todas as tags para lookup
    const availableTags = ref([]);
    // Estado do form (sem form.tags)
    const form = reactive({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthDate: '',
        source: undefined,
        status: 'lead'
    });
    const errors = reactive({});
    // Tipagem explícita para evitar any[]
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
    async function loadAvailableTags() {
        try {
            const { data } = await getTags();
            availableTags.value = data;
        }
        catch (err) {
            console.error('Error loading tags', err);
        }
    }
    async function loadLead(id) {
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
            selectedTagIds.value = lead.tags.map((t) => t.id);
        }
        catch {
            toast.error('Failed to load lead');
            router.push('/crm/leads');
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
        return !Object.values(errors).some(e => e);
    }
    async function handleSubmit() {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }
        isSubmitting.value = true;
        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            birthDate: form.birthDate,
            source: form.source,
            status: form.status,
            tags: selectedTagIds.value // somente string[]
        };
        try {
            if (isEditing.value && leadId) {
                await updateLead(leadId, payload);
                toast.success('Lead updated successfully');
            }
            else {
                await createLead(payload);
                toast.success('Lead created successfully');
            }
            router.push('/crm/leads');
        }
        catch {
            toast.error('Failed to save lead');
        }
        finally {
            isSubmitting.value = false;
        }
    }
    function cancel() {
        router.push('/crm/leads');
    }
    if (leadId)
        loadLead(leadId);
    else
        loadAvailableTags();
    return {
        form,
        errors,
        isSubmitting,
        isEditing,
        sourceOptions,
        statusOptions,
        selectedTagIds,
        handleSubmit,
        cancel
    };
}
