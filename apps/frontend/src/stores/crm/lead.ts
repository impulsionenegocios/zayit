import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Lead, Tag, LeadStatus, LeadCreatePayload, LeadUpdatePayload } from '@/types/lead.types';
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

  // For Kanban view - returns array of column data
  const kanbanColumns = computed(() => {
    const statuses: LeadStatus[] = ['lead', 'opportunity', 'client', 'lost'];
    
    return statuses.map(status => ({
      status,
      leads: leads.value.filter(lead => lead.status === status)
    }));
  });

  // Actions
  async function fetchLeads() {
    isLoading.value = true;
    try {
      const response = await crmService.getLeads();
      leads.value = response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchLeadById(id: string) {
    isLoading.value = true;
    try {
      const response = await crmService.getLeadById(id);
      selectedLead.value = response.data;
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createLead(lead: LeadCreatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.createLead(lead);
      await fetchLeads(); // Refresh the list
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateLead(id: string, lead: LeadUpdatePayload) {
    isLoading.value = true;
    try {
      const response = await crmService.updateLead(id, lead);
  
      // Update using the response
      const updatedLead = response.data as Lead;
  
      const index = leads.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        leads.value[index] = updatedLead;
      }
  
      if (selectedLead.value?.id === id) {
        selectedLead.value = updatedLead;
      }
  
      return updatedLead;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Update lead status directly (for drag-and-drop in Kanban)
  async function updateLeadStatus(id: string, newStatus: LeadStatus) {
    // Optimistically update the UI first
    const leadIndex = leads.value.findIndex(lead => lead.id === id);
    if (leadIndex === -1) return false;

    // Store the original status in case we need to revert
    const originalStatus = leads.value[leadIndex].status;
    
    // Update local state immediately
    leads.value[leadIndex].status = newStatus;
    dragInProgress.value = true;

    try {
      // Then send to backend
      const result = await updateLead(id, { status: newStatus });
      return !!result;
    } catch (error) {
      // If failed, revert the optimistic update
      console.error(`Error updating lead status for ${id}:`, error);
      leads.value[leadIndex].status = originalStatus;
      return false;
    } finally {
      dragInProgress.value = false;
    }
  }
  
  async function deleteLead(id: string) {
    isLoading.value = true;
    try {
      await crmService.deleteLead(id);
      leads.value = leads.value.filter((lead) => lead.id !== id);
      if (selectedLead.value?.id === id) {
        selectedLead.value = null;
      }
      return true;
    } catch (error) {
      console.error(`Error deleting lead ${id}:`, error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTags() {
    try {
      const response = await crmService.getTags();
      tags.value = response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  return {
    // State
    leads,
    selectedLead,
    isLoading,
    tags,
    dragInProgress,

    // Getters
    leadsByStatus,
    kanbanColumns,

    // Actions
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    fetchTags,
  };
});