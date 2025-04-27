<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-white">Tarefas</h2>
      <DefaultButton variant="primary" size="sm" icon="mdi:plus" @click="openTaskModal">
        Nova Tarefa
      </DefaultButton>
    </div>

    <div v-if="!tasks.length" class="text-center py-8 text-white/60">
      <Icon icon="mdi:checkbox-marked-circle-outline" class="text-4xl mx-auto mb-2" />
      <p>Sem Tarefas Ainda</p>
      <p class="text-sm">Crie sua primeira tarefa para esse lead</p>
    </div>

    <div v-else>
  <TransitionGroup name="list" tag="div" class="space-y-3">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle-status="toggleTaskStatus"
      @delete-task="deleteTask"
    />
  </TransitionGroup>
</div>


    <!-- Modal de adicionar tarefa -->
    <div v-if="showTaskModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black/50" @click="showTaskModal = false"></div>

      <TaskForm
        :title="newTask.title"
        :dueDate="newTask.due_date"
        @submit="handleTaskSubmit"
        @cancel="showTaskModal = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTaskManager } from '@/composables/crm/useTaskManager';
import TaskCard from './TaskCard.vue';
import TaskForm from './TaskForm.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  leadId: string;
}>();

const {
  tasks,
  isLoading: isLoadingTasks,
  newTask,
  loadTasks,
  addTask,
  deleteTask,
  toggleTaskStatus,
} = useTaskManager(props.leadId);

const showTaskModal = ref(false);

async function handleTaskSubmit(payload: { title: string; dueDate: string }) {
  newTask.title = payload.title;
  newTask.due_date = payload.dueDate;

  const success = await addTask();
  if (success) {
    showTaskModal.value = false;
  }
}

function openTaskModal() {
  newTask.title = '';
  newTask.due_date = new Date().toISOString().slice(0, 10);
  newTask.completed = false;
  showTaskModal.value = true;
}
onMounted(() => {
  loadTasks()
})
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

</style>