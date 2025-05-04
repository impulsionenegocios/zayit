import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useForm, useField } from 'vee-validate';
import { useScriptStore } from '@/stores/crm/scriptStore';
import { validatePlaceholders } from '@/utils/placeholderUtils';

export function useScriptForm(scriptId?: string) {
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const scriptStore = useScriptStore();

  const crmId = route.params.crmId as string;
  
  const loading = ref(false);
  const isEditing = computed(() => !!scriptId);

  const validateContent = (value: string): string | boolean => {
    if (!value || value.trim() === '') {
      return 'O conteúdo é obrigatório';
    }
    
    const { isValid, error } = validatePlaceholders(value);
    if (!isValid) {
      return error || 'Erro de validação de placeholders';
    }
    
    return true;
  };

  const { handleSubmit, setValues, resetForm } = useForm({
    initialValues: {
      name: '',
      type: '',
      content: '',
    },
  });

  const {
    value: name,
    errorMessage: nameError,
    handleBlur: blurName,
    meta: nameMeta,
  } = useField<string>('name', 'required');

  const {
    value: type,
    errorMessage: typeError,
    handleBlur: blurType,
    meta: typeMeta,
  } = useField<string>('type', 'required');

  const {
    value: content,
    errorMessage: contentError,
    handleBlur: blurContent,
    meta: contentMeta,
  } = useField<string>('content', validateContent);

  async function loadScriptForEditing() {
    if (!scriptId) return;

    loading.value = true;
    try {
      console.log('Loading script for editing, ID:', scriptId);
      console.log('CRM ID:', crmId);
      const script = await scriptStore.fetchScriptById(crmId, scriptId);
      console.log('Script loaded:', script);
      
      if (script) {
        setValues({
          name: script.name || '',
          type: script.type || '',
          content: script.content || '',
        });
      } else {
        toast.error('Script não encontrado');
        router.push({ 
          name: 'CRMScripts', 
          params: { crmId }
        });
      }
    } catch (err) {
      console.error('Error loading script:', err);
      toast.error('Erro ao carregar script');
      router.push({ 
        name: 'CRMScripts', 
        params: { crmId }
      });
    } finally {
      loading.value = false;
    }
  }

  const save = handleSubmit(async (values) => {
    loading.value = true;

    try {
      if (isEditing.value && scriptId) {
        console.log('Updating script:', scriptId, values);
        await scriptStore.updateScript(crmId, scriptId, {
          name: values.name,
          type: values.type,
          content: values.content,
        });
        toast.success('Script atualizado com sucesso');
      } else {
        console.log('Creating new script:', values);
        await scriptStore.createScript(crmId, {
          name: values.name,
          type: values.type,
          content: values.content,
        });
        toast.success('Script criado com sucesso');

        resetForm({
          values: {
            name: '',
            type: '',
            content: '',
          },
        });
      }
      
      router.push({ 
        name: 'CRMScripts', 
        params: { crmId }
      });
    } catch (err) {
      console.error('Error saving script:', err);
      toast.error('Erro ao salvar script');
    } finally {
      loading.value = false;
    }
  });

  const cancel = () => {
    router.push({ 
      name: 'CRMScripts', 
      params: { crmId }
    });
  };

  onMounted(() => {
    // Verificar se o scriptId está vindo tanto das props quanto da rota
    const routeScriptId = route.params.scriptId as string;
    const effectiveScriptId = scriptId || routeScriptId;
    
    console.log('Component mounted with scriptId from props:', scriptId);
    console.log('Component mounted with scriptId from route:', routeScriptId);
    
    if (effectiveScriptId) {
      loadScriptForEditing();
    }
  });

  return {
    name,
    nameError,
    blurName,
    nameMeta,

    type,
    typeError,
    blurType,
    typeMeta,

    content,
    contentError,
    blurContent,
    contentMeta,

    save,
    loading,
    isEditing,
    cancel,
  };
}
