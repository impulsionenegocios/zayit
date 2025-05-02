<template>
  <div class="bg-card rounded-lg p-3 flex items-start">
    <div class="mt-1 mr-3">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle-status', task.id)"
        class="w-4 h-4 rounded-sm bg-white/10 border-white/30 text-zayit-blue focus:ring-zayit-blue"
      />
    </div>

    <div class="flex-1">
      <div
        :class="task.completed ? 'text-white/50 line-through' : 'text-white'"
        class="font-medium"
      >
        {{ task.title }}
      </div>

      <div class="flex items-center justify-between mt-1">
        <div class="text-sm" :class="getTaskDueClass(task.due_date)">
          <Icon icon="mdi:calendar" class="mr-1" />
          {{ formatDate(task.due_date) }}
        </div>

        <DefaultButton
          size="sm"
          variant="danger"
          @click="$emit('delete-task', task.id)"
          title="Excluir tarefa"
        >
          <Icon icon="mdi:delete" />
        </DefaultButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import { formatDate } from '@/utils/dateFormatter';
import type { Task } from '@/types/task.types';
import TaskFilter from './TaskFilter.vue';

const props = defineProps<{
  task: Task;
}>();

function getTaskDueClass(due_date: string) {
  // If the task is completed, return the default class
  if (props.task.completed) {
    return 'text-zayit-default';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(due_date);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-zayit-danger';
  if (diffDays === 0) return 'text-zayit-warning';
  return 'text-gray-400';
}
</script>
