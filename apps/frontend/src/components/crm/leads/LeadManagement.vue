<template>
  <div>
    <!-- View switcher tabs -->
    <div class="flex border-b border-white/10 mb-4">
      <button
        @click="activeView = 'list'"
        class="px-4 py-2 font-medium text-sm transition-colors"
        :class="
          activeView === 'list'
            ? 'text-zayit-blue border-b-2 border-zayit-blue -mb-px'
            : 'text-gray-400 hover:text-white'
        "
      >
        <Icon icon="mdi:format-list-bulleted" class="mr-2" />
        List View
      </button>
      <button
        @click="activeView = 'kanban'"
        class="px-4 py-2 font-medium text-sm transition-colors ml-4"
        :class="
          activeView === 'kanban'
            ? 'text-zayit-blue border-b-2 border-zayit-blue -mb-px'
            : 'text-gray-400 hover:text-white'
        "
      >
        <Icon icon="mdi:view-column" class="mr-2" />
        Kanban View
      </button>
    </div>

    <!-- View components -->
    <KeepAlive>
      <component
        :is="activeView === 'list' ? LeadList : LeadKanban"
        :crmId="props.crmId"
        :initialViewMode="activeView"
        @view-change="handleViewChange"
      />

    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import LeadList from './LeadList.vue';
import LeadKanban from './LeadKanban.vue';
const props = defineProps<{
  crmId: string;
  initialViewMode?: 'list' | 'kanban';
}>();
// Tenta pegar o modo salvo no localStorage
const savedView = localStorage.getItem('activeView');
const activeView = ref<'list' | 'kanban'>(
  savedView === 'kanban' || savedView === 'list' ? savedView : 'list'
);


// Toda vez que mudar o activeView, salva no localStorage
watch(activeView, (newValue) => {
  localStorage.setItem('activeView', newValue);
});

// Permite que o filho mude a view
function handleViewChange(mode: 'list' | 'kanban') {
  activeView.value = mode;
}
</script>
