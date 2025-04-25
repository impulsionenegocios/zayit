<template>
  <div class="space-y-2">
    <!-- Selected Tags -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-2">
      <Tag 
        v-for="tag in selectedTags" 
        :key="tag.id" 
        :tag="tag" 
        deletable
        @delete="removeTag(tag)"
      />
    </div>

    <div class="relative">
      <!-- Search Input -->
      <BaseInput
        v-model="searchQuery"
        placeholder="Search tags..."
        @focus.native="showDropdown = true"
        @blur.native="handleBlur"
      >
        <template #icon>
          <Icon icon="mdi:magnify" class="text-gray-400" />
        </template>
      </BaseInput>

      <!-- Dropdown Menu -->
      <div 
        v-if="showDropdown && filteredTags.length > 0" 
        class="absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <div 
          v-for="tag in filteredTags" 
          :key="tag.id"
          class="p-2 hover:bg-zayit-blue/30 cursor-pointer"
          @mousedown.prevent="addTag(tag)"
        >
          <Tag :tag="tag" />
        </div>
        
        <!-- Create New Tag Option -->
        <div 
          v-if="canCreateTags && searchQuery && !tagExists"
          class="p-2 hover:bg-zayit-blue/30 cursor-pointer border-t border-gray-700"
          @mousedown.prevent="createNewTag"
        >
          <div class="flex items-center text-zayit-blue">
            <Icon icon="mdi:plus" class="mr-1" />
            <span>Create tag "{{ searchQuery }}"</span>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div 
        v-else-if="showDropdown && searchQuery && filteredTags.length === 0" 
        class="absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-400"
      >
        No tags found
        <div 
          v-if="canCreateTags"
          class="mt-2 text-zayit-blue cursor-pointer"
          @mousedown.prevent="createNewTag"
        >
          <Icon icon="mdi:plus" class="mr-1" />
          <span>Create tag "{{ searchQuery }}"</span>
        </div>
      </div>
    </div>
  </div>

  <!-- New Tag Modal -->
  <BaseModal 
    v-if="showCreateModal"
    title="Create New Tag"
    size="sm"
    @close="showCreateModal = false"
  >
    <div class="space-y-4">
      <FormControl label="Tag Name" forLabel="newTagName">
        <BaseInput v-model="newTagName" id="newTagName" placeholder="Enter tag name" />
      </FormControl>

      <FormControl label="Tag Color" forLabel="newTagColor">
        <div class="flex items-center space-x-3">
          <input
            type="color"
            v-model="newTagColor"
            class="h-10 w-10 rounded cursor-pointer"
          />
          <BaseInput v-model="newTagColor" id="newTagColor" placeholder="#000000" />
        </div>

        <!-- Color Preview -->
        <div class="mt-2 flex space-x-2 items-center">
          <span class="text-sm text-white/70">Preview:</span>
          <div
            class="px-2 py-1 text-xs font-medium rounded"
            :style="{ backgroundColor: newTagColor, color: getContrastColor(newTagColor) }"
          >
            {{ newTagName || 'Tag Preview' }}
          </div>
        </div>
      </FormControl>

      <div class="flex justify-end space-x-3 pt-4">
        <button 
          class="btn btn-secondary" 
          @click="showCreateModal = false"
          :disabled="isCreating"
        >
          Cancel
        </button>
        <button 
          class="btn btn-primary" 
          @click="saveNewTag"
          :disabled="isCreating"
        >
          {{ isCreating ? 'Creating...' : 'Create Tag' }}
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useToast } from '@/composables/useToast';
import { getTags, createTag } from '@/services/tagService';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseModal from '@/components/ui/modals/BaseModal.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import Tag from './Tag.vue';
import type { Tag as TagType } from '@/types';

const props = defineProps<{
  modelValue: string[];
  canCreateTags?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

// State
const allTags = ref<TagType[]>([]);
const searchQuery = ref('');
const showDropdown = ref(false);
const showCreateModal = ref(false);
const newTagName = ref('');
const newTagColor = ref('#6366F1');
const isCreating = ref(false);
const toast = useToast();

// Compute selected and filtered
const selectedTags = computed(() =>
  allTags.value.filter(tag => props.modelValue.includes(tag.id))
);

const filteredTags = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return allTags.value.filter(
    tag => tag.name.toLowerCase().includes(q) && !props.modelValue.includes(tag.id)
  );
});

const tagExists = computed(() => {
  if (!searchQuery.value) return true;
  return allTags.value.some(tag => tag.name.toLowerCase() === searchQuery.value.toLowerCase());
});

// Handlers
function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
}

function addTag(tag: TagType) {
  emit('update:modelValue', [...props.modelValue, tag.id]);
  searchQuery.value = '';
}

function removeTag(tag: TagType) {
  emit('update:modelValue', props.modelValue.filter(id => id !== tag.id));
}

function createNewTag() {
  if (!searchQuery.value.trim()) return;
  showCreateModal.value = true;
  newTagName.value = searchQuery.value;
  searchQuery.value = '';
}

async function saveNewTag() {
  if (!newTagName.value.trim()) return;
  isCreating.value = true;

  try {
    const { data } = await createTag({ name: newTagName.value, color: newTagColor.value });
    const tag: TagType = {
      id: data.id,
      name: newTagName.value,
      color: newTagColor.value,
      created_at: new Date().toISOString()
    };
    allTags.value.push(tag);
    addTag(tag);
    toast.success('Tag created successfully');
    showCreateModal.value = false;
    newTagName.value = '';
    newTagColor.value = '#6366F1';
  } catch {
    toast.error('Error creating tag');
  } finally {
    isCreating.value = false;
  }
}

function getContrastColor(hex: string) {
  const [r,g,b] = hex.replace('#','').match(/.{2}/g)!.map(c => parseInt(c,16));
  return (0.299*r+0.587*g+0.114*b)/255 > 0.5 ? '#000' : '#fff';
}

// Load tags
async function loadTags() {
  try {
    const { data } = await getTags();
    allTags.value = data;
  } catch {
    console.error('Error loading tags');
  }
}

onMounted(loadTags);
</script>
