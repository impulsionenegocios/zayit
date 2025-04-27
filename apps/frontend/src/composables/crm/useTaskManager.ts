import { ref, reactive } from 'vue';
import type { Task, NewTask } from '@/types/task.types';
import { useToast } from '@/composables/useToast';
import {
  getTasksByLeadId,
  createTask,
  deleteTaskById,
  toggleTaskCompletion,
} from '@/services/taskService';

export function useTaskManager(leadId: string) {
  const toast = useToast();
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);

  const newTask = reactive<NewTask>({
    title: '',
    due_date: new Date().toISOString().slice(0, 10),
    completed: false,
  });

  async function loadTasks() {
    isLoading.value = true;
    try {
      tasks.value = await getTasksByLeadId(leadId);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      isLoading.value = false;
    }
  }

  async function addTask() {
    if (!newTask.title || !newTask.due_date) return false;
    isLoading.value = true;
    try {
      const createdTask = await createTask(leadId, newTask);
      tasks.value.push(createdTask);
      toast.success('Task criada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Failed to create task');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await deleteTaskById(leadId, taskId);
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
      toast.success('Task excluída');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  }

  async function toggleTaskStatus(taskId: string) {
    try {
      const { completed } = await toggleTaskCompletion(taskId);
      const task = tasks.value.find((t) => t.id === taskId);
      if (task) {
        task.completed = completed;
        if (completed) {
          toast.success('Task marcada como concluída');
        } else {
          toast.warning('Task marcada como pendente');
        }
      }
    } catch (error) {
      toast.error('Falha ao alterar o status da task');
    }
  }
  

  return {
    tasks,
    isLoading,
    newTask,
    loadTasks,
    addTask,
    deleteTask,
    toggleTaskStatus,
  };
}
