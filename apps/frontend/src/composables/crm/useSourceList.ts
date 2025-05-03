import { ref } from 'vue';
import { getSources, deleteSource } from '@/services/sourceService';
import { useToast } from '@/composables/useToast';
import type { Source } from '@/types/source.types';

export function useSourceList(crmId: string) {
  const toast = useToast();
  const sources = ref<Source[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fetchSources = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await getSources(crmId);
      sources.value = response.data;
      return response;
    } catch (err) {
      console.error('Error fetching sources:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error fetching sources');
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  const removeSource = async (id: string) => {
    isLoading.value = true;
    try {
      await deleteSource(crmId, id);
      toast.success('Source deleted successfully');
      await fetchSources(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting source');
      console.error('Error deleting source:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const bulkDeleteSources = async (ids: string[]) => {
    isLoading.value = true;
    try {
      await Promise.all(ids.map((id) => deleteSource(crmId, id)));
      toast.success(`${ids.length} sources deleted successfully`);
      await fetchSources(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting sources');
      console.error('Error deleting sources:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    sources,
    isLoading,
    error,
    fetchSources,
    removeSource,
    bulkDeleteSources,
  };
}
