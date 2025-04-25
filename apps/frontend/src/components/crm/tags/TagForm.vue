<template>
  <FormSection :title="tagId ? 'Edit Tag' : 'Create Tag'" class="px-8">
    <form @submit.prevent="submitForm">
      <FormGrid :cols="1" :gap="4">
        <FormControl
          label="Tag Name"
          forLabel="name"
          :error="nameError"
          :touched="nameMeta.touched"
          :valid="nameMeta.valid"
          :showSuccess="true"
        >
          <BaseInput
            v-model="name"
            name="name"
            id="name"
            placeholder="Enter tag name"
            @blur="blurName"
          />
        </FormControl>

        <FormControl
          label="Tag Color"
          forLabel="color"
          :error="colorError"
          :touched="colorMeta.touched"
          :valid="colorMeta.valid"
          :showSuccess="true"
        >
          <div class="flex items-center space-x-3">
            <input
              type="color"
              v-model="color"
              class="h-10 w-10 rounded cursor-pointer"
              @blur="blurColor"
            />
            <BaseInput
              v-model="color"
              name="color"
              id="color"
              placeholder="#000000"
              @blur="blurColor"
            />
          </div>

          <!-- Color Preview -->
          <div class="mt-2 flex space-x-2 items-center">
            <span class="text-sm text-white/70">Preview:</span>
            <div
              class="px-2 py-1 text-xs font-medium rounded"
              :style="{ backgroundColor: color, color: getContrastColor(color) }"
            >
              {{ name || 'Tag Preview' }}
            </div>
          </div>
        </FormControl>
      </FormGrid>

      <div class="flex justify-end mt-6 space-x-3">
        <button type="button" class="btn-default btn" :disabled="isLoading" @click="goBack">
          Cancel
        </button>
        <button type="submit" class="btn-success btn" :disabled="isLoading">
          <span v-if="isLoading">{{ tagId ? 'Updating...' : 'Creating...' }}</span>
          <span v-else>{{ tagId ? 'Update Tag' : 'Create Tag' }}</span>
        </button>
      </div>
    </form>
  </FormSection>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTagForm } from '@/composables/crm/useTagForm';

// UI Components
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';

const route = useRoute();
const tagId = route.params.id as string;

// Use tag form composable
const {
  name,
  nameError,
  blurName,
  nameMeta,
  color,
  colorError,
  blurColor,
  colorMeta,
  submitForm,
  loadTagData,
  isLoading,
  goBack,
} = useTagForm(tagId);

// Helper function to get contrasting text color for a background color
function getContrastColor(hexColor: string): string {
  // If no color selected, default to white text
  if (!hexColor) return '#ffffff';

  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Load tag data if editing existing tag
onMounted(() => {
  if (tagId) {
    loadTagData();
  }
});
</script>
