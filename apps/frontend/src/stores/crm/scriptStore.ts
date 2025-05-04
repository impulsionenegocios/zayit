import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Script, ScriptCreatePayload, ScriptUpdatePayload } from '@/types/script.types';
import * as crmService from '@/services/crmService';

export const useScriptStore = defineStore('scripts', () => {
  const scripts = ref<Script[]>([]);
  const isLoading = ref(false);

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
      return response.data;
    } catch (error) {
      console.error('Error creating script:', error);
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
      
      return response.data;
    } catch (error) {
      console.error(`Error updating script ${scriptId}:`, error);
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
      return true;
    } catch (error) {
      console.error(`Error deleting script ${scriptId}:`, error);
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
