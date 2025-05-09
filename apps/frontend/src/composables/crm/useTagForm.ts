import { useForm, useField } from 'vee-validate';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { createTag, updateTag, getTagById } from '@/services/tagService';
import { useToast } from '@/composables/useToast';
import type { TagCreate } from '@/types';

export function useTagForm(tagId?: string) {
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();
  const isLoading = ref(false);

  // Obter o ID do CRM da rota
  const crmId = route.params.crmId as string;

  // Initialize form with vee-validate
  const { handleSubmit, setValues, resetForm } = useForm<TagCreate>();

  // Form fields
  const {
    value: name,
    errorMessage: nameError,
    handleBlur: blurName,
    meta: nameMeta,
  } = useField<string>('name', 'required');

  const {
    value: color,
    errorMessage: colorError,
    handleBlur: blurColor,
    meta: colorMeta,
  } = useField<string>('color', 'required');

  // Load tag data if editing an existing tag
  async function loadTagData() {
    if (!tagId) return;

    isLoading.value = true;
    try {
      const { data } = await getTagById(crmId, tagId);
      setValues({
        name: data.name,
        color: data.color,
      });
    } catch (error) {
      toast.error('Error loading tag data');
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }

  // Submit form handler
  const submitForm = handleSubmit(async (values) => {
    isLoading.value = true;
    try {
      if (tagId) {
        // Update existing tag
        await updateTag(crmId, tagId, values);
        toast.success('Tag updated successfully');
      } else {
        // Create new tag
        await createTag(crmId, values);
        toast.success('Tag created successfully');
        resetForm();
      }
    } catch (error) {
      toast.error(tagId ? 'Error updating tag' : 'Error creating tag');
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  });

  // Go back to tags list
  const goBack = () => {
    router.push({ name: 'CRMTags', params: { crmId } });
  };

  return {
    // Form fields
    name,
    nameError,
    blurName,
    nameMeta,
    color,
    colorError,
    blurColor,
    colorMeta,

    // Actions
    submitForm,
    loadTagData,
    isLoading,
    goBack,
  };
}
