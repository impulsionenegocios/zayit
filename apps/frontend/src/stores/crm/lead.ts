// src/stores/crm/lead.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Lead,
  Tag,
  LeadStatus,
  LeadCreatePayload,
  LeadUpdatePayload,
} from '@/types/lead.types';
import * as crmService from '@/services/crm';

export const useLeadStore = defineStore('lead', () => {
  // State
  const leads = ref<Lead[]>([]);
  const selectedLead = ref<Lead | null>(null);
  const isLoading = ref(false);
  const tags = ref<Tag[]>([]);
  const dragInProgress = ref(false);

  // Getters
  const leadsByStatus = computed(() => {
    const result: Record<LeadStatus, Lead[]> = {
      lead: [],
      opportunity: [],
      client: [],
      lost: [],
    };
    leads.value.forEach((lead) => {
      result[lead.status].push(lead);
    });
    return result;
  });

  const kanbanColumns = computed(() => {
    const statuses: LeadStatus[] = ['lead', 'opportunity', 'client', 'lost'];
    return statuses.map((status) => ({
      status,
      leads: leads.value.filter((lead) => lead.status === status),
    }));
  });

  // Actions
  async function fetchLeads(crmId: string) {
    isLoading.value = true;
    try {
      const response = await crmService.getLeads(crmId);
      leads.value = response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchLeadById(crmId: string, id: string) {
    isLoading.value = true;
    try {
      const response = await crmService.getLeadById(crmId, id);
      selectedLead.value = response.data;
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createLead(crmId: string, payload: LeadCreatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.createLead(crmId, payload);
      await fetchLeads(crmId);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateLead(
    crmId: string,
    id: string,
    payload: LeadUpdatePayload
  ) {
    isLoading.value = true;
    try {
      const response = await crmService.updateLead(crmId, id, payload);
      const updated = response.data as Lead;
      const idx = leads.value.findIndex((l) => l.id === id);
      if (idx !== -1) leads.value[idx] = updated;
      if (selectedLead.value?.id === id) selectedLead.value = updated;
      return updated;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateLeadStatus(
    crmId: string,
    id: string,
    newStatus: LeadStatus
  ) {
    const idx = leads.value.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    const original = leads.value[idx].status;
    leads.value[idx].status = newStatus;
    dragInProgress.value = true;
    try {
      const result = await updateLead(crmId, id, { status: newStatus });
      return !!result;
    } catch (error) {
      console.error(`Error updating status for ${id}:`, error);
      leads.value[idx].status = original;
      return false;
    } finally {
      dragInProgress.value = false;
    }
  }

  async function deleteLead(crmId: string, id: string) {
    isLoading.value = true;
    try {
      await crmService.deleteLead(crmId, id);
      leads.value = leads.value.filter((l) => l.id !== id);
      if (selectedLead.value?.id === id) selectedLead.value = null;
      return true;
    } catch (error) {
      console.error(`Error deleting lead ${id}:`, error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTags(crmId: string) {
    try {
      const response = await crmService.getTags(crmId);
      tags.value = response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  return {
    // state
    leads,
    selectedLead,
    isLoading,
    tags,
    dragInProgress,

    // getters
    leadsByStatus,
    kanbanColumns,

    // actions
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    fetchTags,
  };
});
