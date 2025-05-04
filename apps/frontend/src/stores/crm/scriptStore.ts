import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Script, ScriptCreatePayload, ScriptUpdatePayload } from '@/types/script.types';
import * as crmService from '@/services/crmService';
import { useToast } from '@/composables/useToast';

export const useScriptStore = defineStore('scripts', () => {
  const scripts = ref<Script[]>([]);
  const isLoading = ref(false);
  const toast = useToast();

  const sortedScripts = computed(() => {
    return [...scripts.value].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  });

  const scriptById = computed(() => {
    return (id: string) => scripts.value.find((script) => script.id === id) || null;
  });

  async function fetchScripts(crmId: string) {
    isLoading.value = true;
    try {
      const response = await crmService.getScripts(crmId);
      scripts.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching scripts:', error);
      toast.error('Error fetching scripts');
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchScriptById(crmId: string, scriptId: string) {
    isLoading.value = true;
    try {
      const response = await crmService.getScriptById(crmId, scriptId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching script ${scriptId}:`, error);
      toast.error('Error fetching script');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createScript(crmId: string, script: ScriptCreatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.createScript(crmId, script);
      await fetchScripts(crmId); // Refresh the list
      toast.success('Script created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating script:', error);
      toast.error('Error creating script');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateScript(crmId: string, scriptId: string, script: ScriptUpdatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.updateScript(crmId, scriptId, script);
      
      const index = scripts.value.findIndex((s) => s.id === scriptId);
      if (index !== -1) {
        scripts.value[index] = response.data as Script;
      }
      
      toast.success('Script updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating script ${scriptId}:`, error);
      toast.error('Error updating script');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteScript(crmId: string, scriptId: string) {
    isLoading.value = true;
    try {
      await crmService.deleteScript(crmId, scriptId);
      scripts.value = scripts.value.filter((script) => script.id !== scriptId);
      toast.success('Script deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting script ${scriptId}:`, error);
      toast.error('Error deleting script');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    scripts,
    isLoading,

    sortedScripts,
    scriptById,

    fetchScripts,
    fetchScriptById,
    createScript,
    updateScript,
    deleteScript,
  };
});
