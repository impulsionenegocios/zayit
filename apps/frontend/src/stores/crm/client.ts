import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Lead, Tag, LeadStatus } from '@/types/lead.types';
import * as crmService from '@/services/crm';

export const useLeadStore = defineStore('lead', () => {
  // State
  const leads = ref<Lead[]>([]);
  const selectedLead = ref<Lead | null>(null);
  const isLoading = ref(false);
  const tags = ref<Tag[]>([]);
  
  // Getters
  const leadsByStatus = computed(() => {
    const result: Record<LeadStatus, Lead[]> = {
      lead: [],
      opportunity: [],
      client: [],
      lost: []
    };
    
    leads.value.forEach(lead => {
      result[lead.status].push(lead);
    });
    
    return result;
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
  
  async function createLead(lead: Partial<Lead>) {
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
  
  async function updateLead(id: string, lead: Partial<Lead>) {
    isLoading.value = true;
    try {
      const response = await crmService.updateLead(id, lead);
      
      // Update in the local array too
      const index = leads.value.findIndex(l => l.id === id);
      if (index !== -1) {
        leads.value[index] = { ...leads.value[index], ...lead };
      }
      
      // Update selected lead if it's the current one
      if (selectedLead.value?.id === id) {
        selectedLead.value = { ...selectedLead.value, ...lead };
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteLead(id: string) {
    isLoading.value = true;
    try {
      await crmService.deleteLead(id);
      leads.value = leads.value.filter(lead => lead.id !== id);
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
    
    // Getters
    leadsByStatus,
    
    // Actions
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLead,
    deleteLead,
    fetchTags
  };
});