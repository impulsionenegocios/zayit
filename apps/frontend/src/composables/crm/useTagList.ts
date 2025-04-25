import { ref } from 'vue';
import { getTags, deleteTag } from '@/services/tagService';
import { useToast } from '@/composables/useToast';
import type { Tag } from '@/types';

export function useTagList() {
  const toast = useToast();
  const tags = ref<Tag[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  // Fetch all tags
  const fetchTags = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await getTags();
      tags.value = response.data;
      return response;
    } catch (err) {
      console.error('Error fetching tags:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error fetching tags');
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a tag
  const removeTag = async (id: string) => {
    isLoading.value = true;
    try {
      await deleteTag(id);
      toast.success('Tag deleted successfully');
      await fetchTags(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting tag');
      console.error('Error deleting tag:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Delete multiple tags
  const bulkDeleteTags = async (ids: string[]) => {
    isLoading.value = true;
    try {
      await Promise.all(ids.map(id => deleteTag(id)));
      toast.success(`${ids.length} tags deleted successfully`);
      await fetchTags(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting tags');
      console.error('Error deleting tags:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tags,
    isLoading,
    error,
    fetchTags,
    removeTag,
    bulkDeleteTags
  };
}