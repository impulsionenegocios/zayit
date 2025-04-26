<template>
    <div class="bg-surface rounded-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-white">Tarefas</h2>
        <DefaultButton 
          variant="primary"
          size="md"
          @click="showTaskModal = true"
        >
          <Icon icon="mdi:plus" class="mr-1" />
          Nova Tarefa
        </DefaultButton>
      </div>
  
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block h-8 w-8 animate-spin border-4 border-zayit-blue border-t-transparent rounded-full"></div>
      </div>
  
      <div v-else-if="!tasks.length" class="text-center py-8 text-white/60">
        <Icon icon="mdi:clipboard-check-outline" class="text-4xl mb-2" />
        <p>Nenhuma tarefa criada</p>
      </div>
  
      <div v-else class="space-y-4">
        <div v-for="task in tasks" :key="task.id" class="bg-card p-4 rounded-lg flex items-center">
          <input
            type="checkbox"
            :checked="task.completed"
            @change="() => toggleTaskStatus(task.id)"
            class="mr-3 w-5 h-5 text-zayit-blue rounded focus:ring-zayit-blue"
          />
          <div class="flex-1">
            <div :class="task.completed ? 'text-white/50 line-through' : 'text-white'">
              {{ task.title }}
            </div>
            <div class="text-sm text-gray-400">
              Vence em: {{ formatDate(task.dueDate) }}
            </div>
          </div>
          <button @click="() => confirmDeleteTask(task.id)" class="text-zayit-danger p-2 hover:bg-white/10 rounded-full">
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>
  
      <!-- Modal Nova Tarefa -->
      <div v-if="showTaskModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showTaskModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Nova Tarefa</h3>
  
          <FormControl label="Título da Tarefa" forLabel="taskTitle">
            <BaseInput
              id="taskTitle"
              v-model="newTask.title"
              placeholder="Ex: Enviar Proposta"
            />
          </FormControl>
  
          <FormControl label="Data de Vencimento" forLabel="taskDueDate" class="mt-4">
            <BaseInput
              id="taskDueDate"
              type="date"
              v-model="newTask.dueDate"
            />
          </FormControl>
  
          <div class="flex justify-end gap-3 mt-6">
            <DefaultButton variant="default" size="sm" @click="showTaskModal = false">
              Cancelar
            </DefaultButton>
            <DefaultButton variant="primary" size="sm" @click="handleAddTask" :disabled="!newTask.title || !newTask.dueDate">
              Salvar
            </DefaultButton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { Icon } from '@iconify/vue';
  import { useTaskManager } from '@/composables/crm/useTaskManager';
  import { useModal } from '@/composables/useModal';
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
  import FormControl from '@/components/ui/forms/FormControl.vue';
  import BaseInput from '@/components/ui/forms/BaseInput.vue';
  import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
  
  const props = defineProps<{
    leadId: string;
  }>();
  
  const showTaskModal = ref(false);
  const modal = useModal();
  
  const {
    tasks,
    isLoading,
    newTask,
    loadTasks,
    addTask,
    deleteTask,
    toggleTaskStatus
  } = useTaskManager(props.leadId);
  
  // Formata data bonita
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  
  // Confirmar exclusão
  async function confirmDeleteTask(taskId: string) {
    const confirmed = await modal.open(ConfirmModal, {
      title: 'Excluir Tarefa',
      props: { message: 'Tem certeza que deseja excluir esta tarefa?' },
      size: 'sm',
    });
  
    if (confirmed) {
      await deleteTask(taskId);
    }
  }
  
  // Handle salvar task
  async function handleAddTask() {
    const success = await addTask();
    if (success) {
      showTaskModal.value = false;
    }
  }
  
  // Carrega tasks ao montar
  loadTasks();
  </script>
  