// src/composables/crm/useLeadForm.ts
import { ref, Ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useForm, useField } from 'vee-validate';

import type {
  LeadSourceType,
  LeadStatusType,
  LeadCreatePayload,
  LeadUpdatePayload,
  Tag,
} from '@/types/lead.types';
import type { Source } from '@/types/source.types';
import type { Status } from '@/types/status.types';
import { createLead, updateLead, getLeadById } from '@/services/crmService';
import { getTags } from '@/services/tagService';
import { useSourceList } from '@/composables/crm/useSourceList';
import { useStatusList } from '@/composables/crm/useStatusList';

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
  
  const { sources, isLoading: isLoadingSources, fetchSources } = useSourceList(crmId);
  const { statuses, isLoading: isLoadingStatuses, fetchStatuses } = useStatusList(crmId);
  
  const sourceOptions = computed(() => {
    return sources.value.map(source => ({
      label: source.name,
      value: source.id
    }));
  });

  const statusOptions = computed(() => {
    return [...statuses.value]
      .sort((a, b) => a.order - b.order)
      .map(status => ({
        label: status.name,
        value: status.id
      }));
  });

  // Setup vee-validate form com valores iniciais
  const { handleSubmit, setValues, resetForm } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      sourceId: undefined as string | undefined,
      statusId: undefined as string | undefined,
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
    value: sourceId,
    errorMessage: sourceError,
    handleBlur: blurSource,
    meta: sourceMeta,
  } = useField<string | undefined>('sourceId');

  const {
    value: statusId,
    errorMessage: statusError,
    handleBlur: blurStatus,
    meta: statusMeta,
  } = useField<string | undefined>('statusId', 'required');

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
      await Promise.all([
        loadAvailableTags(),
        fetchSources(),
        fetchStatuses()
      ]);
      
      const { data: lead } = await getLeadById(crmId, leadId);

      // Garantir que todos os valores são strings ou valores definidos
      setValues({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        address: lead.address || '',
        birthDate: lead.birthDate || '',
        sourceId: lead.sourceId || undefined,
        statusId: lead.statusId || undefined,
      });
      
      if (!lead.statusId && lead.status) {
        const matchingStatus = statuses.value.find(s => s.name.toLowerCase() === lead.status.toLowerCase());
        if (matchingStatus) {
          statusId.value = matchingStatus.id;
        } else if (statuses.value.length > 0) {
          statusId.value = statuses.value[0].id;
        }
      }
      
      if (!lead.sourceId && lead.source) {
        const sourceStr = String(lead.source);
        const matchingSource = sources.value.find(s => s.name.toLowerCase() === sourceStr.toLowerCase());
        if (matchingSource) {
          sourceId.value = matchingSource.id;
        }
      }

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

    const selectedStatus = statuses.value.find(s => s.id === values.statusId);
    const selectedSource = sources.value.find(s => s.id === values.sourceId);

    // Garantir que todos os valores são tratados corretamente
    const payload = {
      name: values.name || '',
      email: values.email || '',
      phone: values.phone || '',
      address: values.address || '',
      birthDate: values.birthDate || '',
      sourceId: values.sourceId,
      source: selectedSource?.name,
      statusId: values.statusId,
      status: selectedStatus?.name || 'lead',
      tags: selectedTagIds.value,
    };

    try {
      if (isEditing.value && leadId) {
        await updateLead(crmId, leadId, payload);
        toast.success('Lead atualizado com sucesso!');
      } else {
        await createLead(crmId, payload);
        toast.success('Lead criado com sucesso!');

        // Limpar o formulário após criar um novo lead
        resetForm({
          values: {
            name: '',
            email: '',
            phone: '',
            address: '',
            birthDate: '',
            sourceId: undefined,
            statusId: undefined,
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

  onMounted(async () => {
    await Promise.all([
      loadAvailableTags(),
      fetchSources(),
      fetchStatuses()
    ]);
    
    if (leadId) {
      carregarLeadParaEdicao();
    } else if (statuses.value.length > 0) {
      statusId.value = statuses.value.find(s => s.order === 1)?.id || statuses.value[0].id;
    }
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

    sourceId,
    sourceError,
    blurSource,
    sourceMeta,

    statusId,
    statusError,
    blurStatus,
    statusMeta,

    // Tags
    selectedTagIds,
    availableTags,

    // Options
    sourceOptions,
    statusOptions,
    
    isLoadingSources,
    isLoadingStatuses,

    // Ações
    salvar,
    carregarLeadParaEdicao,
    carregando,
    isEditing,
    voltar,
  };
}
