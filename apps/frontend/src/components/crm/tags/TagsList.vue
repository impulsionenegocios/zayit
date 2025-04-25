<template>
    <BaseTable
      :items="tags"
      :perPage="10"
      @bulkDelete="handleBulkDelete"
      :loading="isLoading"
      :columns="columns"
    >
      <!-- Tag Name Column with Color Display -->
      <template #cell:name="{ item }">
        <div class="flex items-center space-x-2">
          <div 
            class="w-4 h-4 rounded-full" 
            :style="{ backgroundColor: item.color }"
          ></div>
          <span>{{ item.name }}</span>
        </div>
      </template>
  
      <!-- Color Column with Preview and Hex Code -->
      <template #cell:color="{ item }">
        <div class="flex items-center space-x-2">
          <div 
            class="px-2 py-1 text-xs rounded" 
            :style="{ backgroundColor: item.color, color: getContrastColor(item.color) }"
          >
            Sample
          </div>
          <span class="text-sm">{{ item.color }}</span>
        </div>
      </template>
  
      <!-- Actions Column -->
      <template #actions="{ item }">
        <div class="flex gap-2">
          <button
            @click="editTag(item)"
            class="btn-primary px-3 py-3 rounded-full text-white cursor-pointer"
            title="Edit tag"
          >
            <Icon icon="mdi:pencil" />
          </button>
          <button
            @click="confirmDeleteTag(item)"
            class="btn-danger px-3 py-3 rounded-full text-white cursor-pointer"
            title="Delete tag"
          >
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </template>
    </BaseTable>
  </template>
  
  <script setup lang="ts">
  import { h, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Icon } from '@iconify/vue';
  import { useTagList } from '@/composables/crm/useTagList';
  import { usePageActionButton } from '@/composables/usePageActionButton';
  import { useModal } from '@/composables/useModal';
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
  import BaseTable from '@/components/layout/BaseTable.vue';
  import type { Tag } from '@/types';
  
  const router = useRouter();
  const modal = useModal();
  const { tags, isLoading, fetchTags, removeTag, bulkDeleteTags } = useTagList();
  
  // Table columns definition
  const columns = [
    { key: 'name', label: 'Tag Name' },
    { key: 'color', label: 'Color' },
    { key: 'created_at', label: 'Created' },
  ];
  
  // Navigate to edit page
  const editTag = (tag: Tag) => {
    router.push({ name: 'EditTag', params: { id: tag.id } });
  };
  
  // Confirm and delete a tag
  const confirmDeleteTag = async (tag: Tag) => {
    try {
      const confirmed = await modal.open(ConfirmModal, {
        title: 'Delete Tag',
        props: {
          message: `Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`
        },
        size: 'sm'
      });
      
      if (confirmed) {
        await removeTag(tag.id);
      }
    } catch (error) {
      // Modal was dismissed
      console.log('Delete operation cancelled');
    }
  };
  
  // Handle bulk delete
  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!ids.length) return;
    
    try {
      const confirmed = await modal.open(ConfirmModal, {
        title: 'Delete Tags',
        props: {
          message: `Are you sure you want to delete ${ids.length} tag(s)? This action cannot be undone.`
        },
        size: 'sm'
      });
      
      if (confirmed) {
        await bulkDeleteTags(ids.map(id => id.toString()));
      }
    } catch (error) {
      // Modal was dismissed
      console.log('Bulk delete operation cancelled');
    }
  };
  
  // Helper function for text contrast
  function getContrastColor(hexColor: string): string {
    if (!hexColor) return '#ffffff';
    
    const hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
  
  // Add "Create Tag" action button
  usePageActionButton(
    {
      title: 'Create Tag',
      variant: 'primary',
      onClick: () => {
        router.push({ name: 'CreateTag' });
      },
      loading: false,
    },
    {
      icon: () => h(Icon, { icon: 'mdi:plus' }),
    },
  );
  
  // Load tags on component mount
  onMounted(async () => {
    await fetchTags();
  });
  </script>