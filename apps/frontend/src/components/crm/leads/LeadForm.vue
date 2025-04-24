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
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="tag in availableTags" 
            :key="tag.id"
            @click="toggleTag(tag.id)"
            class="px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-300"
            :class="isTagSelected(tag.id) ? 'text-white' : 'text-white/50 bg-white/5'"
            :style="isTagSelected(tag.id) ? { backgroundColor: tag.color } : {}"
          >
            {{ tag.name }}
          </div>
          
          <div 
            class="px-3 py-1 rounded-full text-sm cursor-pointer bg-white/5 text-white/50 hover:bg-white/10 transition-all"
            @click="showAddTagModal = true"
          >
            + Add Tag
          </div>
        </div>
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
    
    <!-- Add Tag Modal -->
    <div v-if="showAddTagModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black/50" @click="showAddTagModal = false"></div>
      <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
        <h3 class="text-lg font-medium text-white mb-4">Add New Tag</h3>
        
        <FormControl label="Tag Name" forLabel="tagName">
          <BaseInput 
            v-model="newTag.name" 
            id="tagName" 
            placeholder="Enter tag name" 
          />
        </FormControl>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-white mb-2">Color</label>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="color in tagColors" 
              :key="color"
              class="w-8 h-8 rounded-full cursor-pointer"
              :style="{ backgroundColor: color }"
              :class="{ 'ring-2 ring-white': newTag.color === color }"
              @click="newTag.color = color"
            ></div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            class="btn-secondary" 
            @click="showAddTagModal = false"
          >
            Cancel
          </button>
          <button 
            type="button" 
            class="btn-primary"
            @click="addNewTag"
            :disabled="!newTag.name || !newTag.color"
          >
            Add Tag
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useLeadForm } from '@/composables/crm/useLeadForm';
import { Icon } from '@iconify/vue';
import type { Tag } from '@/types/lead.types';

import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';

const props = defineProps<{
  leadId?: string;
}>();

const toast = useToast();
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
  statusOptions 
} = useLeadForm(props.leadId);

// Tag management
const availableTags = ref<Tag[]>([]);
const showAddTagModal = ref(false);
const newTag = reactive<{name: string; color: string}>({
  name: '',
  color: ''
});

const tagColors = [
  '#F87171', // Red
  '#FB923C', // Orange
  '#FBBF24', // Amber
  '#A3E635', // Lime
  '#34D399', // Emerald
  '#2DD4BF', // Teal
  '#22D3EE', // Cyan
  '#60A5FA', // Blue
  '#818CF8', // Indigo
  '#A78BFA', // Violet
  '#E879F9', // Fuchsia
  '#F472B6'  // Pink
];

// Load tags
onMounted(async () => {
  try {
    // This would normally come from an API call
    availableTags.value = [
      { id: '1', name: 'High Value', color: '#60A5FA' },
      { id: '2', name: 'Hot Lead', color: '#F87171' },
      { id: '3', name: 'Need Follow-up', color: '#FB923C' },
      { id: '4', name: 'Enterprise', color: '#A78BFA' }
    ];
  } catch (error) {
    console.error('Error loading tags:', error);
  }
});

// Check if tag is selected
function isTagSelected(tagId: string) {
  return form.tags.includes(tagId);
}

// Toggle tag selection
function toggleTag(tagId: string) {
  const index = form.tags.indexOf(tagId);
  if (index === -1) {
    form.tags.push(tagId);
  } else {
    form.tags.splice(index, 1);
  }
}

// Add new tag
function addNewTag() {
  if (!newTag.name || !newTag.color) return;
  
  const newTagId = Date.now().toString();
  availableTags.value.push({
    id: newTagId,
    name: newTag.name,
    color: newTag.color
  });
  
  // Auto-select the new tag
  form.tags.push(newTagId);
  
  // Reset form and close modal
  newTag.name = '';
  newTag.color = '';
  showAddTagModal.value = false;
  
  toast.success('Tag created and added');
}
</script>