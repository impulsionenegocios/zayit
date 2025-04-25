<template>
  <div class="bg-surface rounded-lg shadow p-6 space-y-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-white">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl label="Name" forLabel="name" :error="errors.name" :touched="true">
            <BaseInput 
              v-model="form.name" 
              id="name" 
              placeholder="Full name" 
              :error="!!errors.name"
            />
          </FormControl>
          
          <FormControl label="Email" forLabel="email" :error="errors.email" :touched="true">
            <BaseInput 
              v-model="form.email" 
              id="email" 
              type="email" 
              placeholder="Email address" 
              :error="!!errors.email"
            />
          </FormControl>
          
          <FormControl label="Phone" forLabel="phone" :error="errors.phone" :touched="true">
            <BaseInput 
              v-model="form.phone" 
              id="phone" 
              placeholder="Phone number" 
              :error="!!errors.phone"
            />
          </FormControl>
          
          <FormControl label="Birth Date" forLabel="birthDate">
            <BaseInput 
              v-model="form.birthDate" 
              id="birthDate" 
              type="date" 
              placeholder="Birth date (optional)"
            />
          </FormControl>
        </div>
      </div>
      
      <!-- Address -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-white">Address</h3>
        <FormControl label="Address" forLabel="address">
          <BaseTextarea 
            v-model="form.address" 
            id="address" 
            placeholder="Full address (optional)" 
            :rows="3"
          />
        </FormControl>
      </div>
      
      <!-- Lead Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-white">Lead Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl label="Source" forLabel="source">
            <BaseSelect 
              v-model="form.source" 
              id="source" 
              :options="sourceOptions" 
              placeholder="Select source"
            />
          </FormControl>
          
          <FormControl label="Status" forLabel="status" :error="errors.status" :touched="true">
            <BaseSelect 
              v-model="form.status" 
              id="status" 
              :options="statusOptions" 
              placeholder="Select status" 
              :error="!!errors.status"
            />
          </FormControl>
        </div>
      </div>
      
      <!-- Tags -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-white">Tags</h3>
        <TagSelector 
          v-model="selectedTagIds" 
          :canCreateTags="true"
        />
      </div>
      
      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          class="btn-secondary" 
          @click="cancel"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn-primary"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <Icon icon="mdi:loading" class="animate-spin mr-1" />
            Saving...
          </span>
          <span v-else>
            {{ isEditing ? 'Update Lead' : 'Create Lead' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useLeadForm } from '@/composables/crm/useLeadForm';
import { Icon } from '@iconify/vue';

import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import TagSelector from '@/components/crm/tags/TagSelector.vue';

const props = defineProps<{
  leadId?: string;
}>();

const router = useRouter();

// Use our lead form composable
const { 
  form, 
  errors, 
  isSubmitting, 
  isEditing, 
  handleSubmit,
  cancel,
  sourceOptions,
  statusOptions,
  selectedTagIds // Get the selectedTagIds from the composable
} = useLeadForm(props.leadId);

// The TagSelector component now handles all tag-related functionality:
// - Fetching available tags from the backend
// - Searching and filtering tags
// - Creating new tags
// - Selecting/deselecting tags
// - Managing the selected tags state
</script>