// src/stores/crm/crmStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CRM, CRMCreatePayload, CRMUpdatePayload } from '@/types/crm.types';
import * as crmService from '@/services/crmService';

export const useCRMStore = defineStore('crm', () => {
  // State
  const crms = ref<CRM[]>([]);
  const selectedCRM = ref<CRM | null>(null);
  const isLoading = ref(false);

  // Getters
  const sortedCRMs = computed(() => {
    return [...crms.value].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  });

  const crmById = computed(() => {
    return (id: string) => crms.value.find((crm) => crm.id === id) || null;
  });

  // Actions
  async function fetchCRMs() {
    isLoading.value = true;
    try {
      const response = await crmService.getCRMs();
      crms.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching CRMs:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCRMById(id: string) {
    isLoading.value = true;
    try {
      const response = await crmService.getCRMById(id);
      selectedCRM.value = response.data;
      return response.data;
    } catch (error) {
      console.error(`Error fetching CRM ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createCRM(crm: CRMCreatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.createCRM(crm);
      await fetchCRMs(); // Refresh the list
      return response.data;
    } catch (error) {
      console.error('Error creating CRM:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCRM(id: string, crm: CRMUpdatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.updateCRM(id, crm);

      // Update using the response
      const updatedCRM = response.data as CRM;

      const index = crms.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        crms.value[index] = updatedCRM;
      }

      if (selectedCRM.value?.id === id) {
        selectedCRM.value = updatedCRM;
      }

      return updatedCRM;
    } catch (error) {
      console.error(`Error updating CRM ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCRM(id: string) {
    isLoading.value = true;
    try {
      await crmService.deleteCRM(id);
      crms.value = crms.value.filter((crm) => crm.id !== id);
      if (selectedCRM.value?.id === id) {
        selectedCRM.value = null;
      }
      return true;
    } catch (error) {
      console.error(`Error deleting CRM ${id}:`, error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    crms,
    selectedCRM,
    isLoading,

    // Getters
    sortedCRMs,
    crmById,

    // Actions
    fetchCRMs,
    fetchCRMById,
    createCRM,
    updateCRM,
    deleteCRM,
  };
});
