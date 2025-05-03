import { ref } from 'vue';
import { getStatuses, deleteStatus } from '@/services/statusService';
import { useToast } from '@/composables/useToast';
import type { Status } from '@/types/status.types';

export function useStatusList(crmId: string) {
  const toast = useToast();
  const statuses = ref<Status[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fetchStatuses = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await getStatuses(crmId);
      statuses.value = response.data;
      return response;
    } catch (err) {
      console.error('Error fetching statuses:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error fetching statuses');
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  const removeStatus = async (id: string) => {
    isLoading.value = true;
    try {
      await deleteStatus(crmId, id);
      toast.success('Status deleted successfully');
      await fetchStatuses(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting status');
      console.error('Error deleting status:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const bulkDeleteStatuses = async (ids: string[]) => {
    isLoading.value = true;
    try {
      await Promise.all(ids.map((id) => deleteStatus(crmId, id)));
      toast.success(`${ids.length} statuses deleted successfully`);
      await fetchStatuses(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting statuses');
      console.error('Error deleting statuses:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    statuses,
    isLoading,
    error,
    fetchStatuses,
    removeStatus,
    bulkDeleteStatuses,
  };
}
