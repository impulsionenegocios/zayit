import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useForm, useField } from 'vee-validate';
import { useScriptStore } from '@/stores/crm/scriptStore';

export function useScriptForm(scriptId?: string) {
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const scriptStore = useScriptStore();

  const crmId = route.params.crmId as string;
  
  const loading = ref(false);
  const isEditing = computed(() => !!scriptId);

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
  } = useField<string>('content', 'required');

  async function loadScriptForEditing() {
    if (!scriptId) return;

    loading.value = true;
    try {
      const script = await scriptStore.fetchScriptById(crmId, scriptId);
      
      if (script) {
        setValues({
          name: script.name || '',
          type: script.type || '',
          content: script.content || '',
        });
      }
    } catch (err) {
      toast.error('Error loading script');
      console.error(err);
      router.push({ name: 'CRMManagement', params: { crmId } });
    } finally {
      loading.value = false;
    }
  }

  const save = handleSubmit(async (values) => {
    loading.value = true;

    try {
      if (isEditing.value && scriptId) {
        await scriptStore.updateScript(crmId, scriptId, {
          name: values.name,
          type: values.type,
          content: values.content,
        });
      } else {
        await scriptStore.createScript(crmId, {
          name: values.name,
          type: values.type,
          content: values.content,
        });

        resetForm({
          values: {
            name: '',
            type: '',
            content: '',
          },
        });
      }
      
      router.push({ 
        name: 'CRMManagement', 
        params: { crmId },
        query: { tab: 'scripts' }
      });
    } catch (err) {
      toast.error('Error saving script');
      console.error(err);
    } finally {
      loading.value = false;
    }
  });

  const cancel = () => {
    router.push({ 
      name: 'CRMManagement', 
      params: { crmId },
      query: { tab: 'scripts' }
    });
  };

  onMounted(() => {
    if (scriptId) {
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
