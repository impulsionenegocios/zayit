// src/composables/crm/useLeadForm.ts
import { ref, Ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useForm, useField } from 'vee-validate';

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

  const carregando = ref(false);
  const isEditing = computed(() => !!leadId);

  // tags selecionadas e disponíveis
  const selectedTagIds = ref<string[]>([]);
  const availableTags = ref<Tag[]>([]);

  const sourceOptions = [
    { label: 'Organic', value: 'organic' },
    { label: 'Advertisement', value: 'advertisement' },
    { label: 'Referral', value: 'referral' },
    { label: 'Social Media', value: 'social' },
    { label: 'Other', value: 'other' },
  ] as { label: string; value: LeadSource }[];

  const statusOptions = [
    { label: 'Lead', value: 'lead' },
    { label: 'Opportunity', value: 'opportunity' },
    { label: 'Client', value: 'client' },
    { label: 'Lost', value: 'lost' },
  ] as { label: string; value: LeadStatus }[];

  // Setup vee-validate form com valores iniciais
  const { handleSubmit, setValues, resetForm } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      source: undefined as LeadSource | undefined,
      status: 'lead' as LeadStatus,
    },
  });

  // Define os campos com validação
  const {
    value: name,
    errorMessage: nameError,
    handleBlur: blurName,
    meta: nameMeta,
  } = useField<string>('name', 'required');

  const {
    value: email,
    errorMessage: emailError,
    handleBlur: blurEmail,
    meta: emailMeta,
  } = useField<string>('email', 'required|email');

  const {
    value: phone,
    errorMessage: phoneError,
    handleBlur: blurPhone,
    meta: phoneMeta,
  } = useField<string>('phone', 'required');

  const {
    value: address,
    errorMessage: addressError,
    handleBlur: blurAddress,
    meta: addressMeta,
  } = useField<string>('address');

  const {
    value: birthDate,
    errorMessage: birthDateError,
    handleBlur: blurBirthDate,
    meta: birthDateMeta,
  } = useField<string>('birthDate');

  const {
    value: source,
    errorMessage: sourceError,
    handleBlur: blurSource,
    meta: sourceMeta,
  } = useField<LeadSource | undefined>('source');

  const {
    value: status,
    errorMessage: statusError,
    handleBlur: blurStatus,
    meta: statusMeta,
  } = useField<LeadStatus>('status', 'required');

  // carrega todas as tags
  async function loadAvailableTags() {
    try {
      const { data } = await getTags(crmId);
      availableTags.value = data;
    } catch (err) {
      toast.error('Erro ao carregar tags');
      console.error('Error loading tags', err);
    }
  }

  // carrega um lead existente para edição
  async function carregarLeadParaEdicao() {
    if (!leadId) return;

    carregando.value = true;
    try {
      await loadAvailableTags();
      const { data: lead } = await getLeadById(crmId, leadId);

      // Garantir que todos os valores são strings ou valores definidos
      setValues({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        address: lead.address || '',
        birthDate: lead.birthDate || '',
        source: lead.source || undefined,
        status: lead.status || 'lead',
      });

      selectedTagIds.value = lead.tags?.map((t: Tag) => t.id) || [];
    } catch (err) {
      toast.error('Erro ao carregar lead');
      console.error(err);
      router.push({ name: 'CRMManagement', params: { crmId } });
    } finally {
      carregando.value = false;
    }
  }

  const salvar = handleSubmit(async (values) => {
    carregando.value = true;

    // Garantir que todos os valores são tratados corretamente
    const payload = {
      name: values.name || '',
      email: values.email || '',
      phone: values.phone || '',
      address: values.address || '',
      birthDate: values.birthDate || '',
      source: values.source,
      status: values.status || 'lead',
      tags: selectedTagIds.value,
    };

    try {
      if (isEditing.value && leadId) {
        await updateLead(crmId, leadId, payload as LeadUpdatePayload);
        toast.success('Lead atualizado com sucesso!');
      } else {
        await createLead(crmId, payload as LeadCreatePayload);
        toast.success('Lead criado com sucesso!');

        // Limpar o formulário após criar um novo lead
        resetForm({
          values: {
            name: '',
            email: '',
            phone: '',
            address: '',
            birthDate: '',
            source: undefined,
            status: 'lead',
          },
        });
        selectedTagIds.value = [];
      }
      // volta pra lista de leads desse CRM
      router.push({ name: 'CRMManagement', params: { crmId } });
    } catch (err) {
      toast.error('Erro ao salvar lead');
      console.error(err);
    } finally {
      carregando.value = false;
    }
  });

  const voltar = () => {
    router.push({ name: 'CRMManagement', params: { crmId } });
  };

  onMounted(() => {
    loadAvailableTags();
    if (leadId) carregarLeadParaEdicao();
  });

  return {
    // Campos
    name,
    nameError,
    blurName,
    nameMeta,

    email,
    emailError,
    blurEmail,
    emailMeta,

    phone,
    phoneError,
    blurPhone,
    phoneMeta,

    address,
    addressError,
    blurAddress,
    addressMeta,

    birthDate,
    birthDateError,
    blurBirthDate,
    birthDateMeta,

    source,
    sourceError,
    blurSource,
    sourceMeta,

    status,
    statusError,
    blurStatus,
    statusMeta,

    // Tags
    selectedTagIds,
    availableTags,

    // Options
    sourceOptions,
    statusOptions,

    // Ações
    salvar,
    carregarLeadParaEdicao,
    carregando,
    isEditing,
    voltar,
  };
}
