import  api  from '@/lib/axios'; // seu axios instance
import type { Task, NewTask } from '@/types/task.types';

export async function getTasksByLeadId(leadId: string) {
  const response = await api.get<Task[]>(`/leads/${leadId}/tasks`);
  return response.data;
}

export async function createTask(leadId: string, newTask: NewTask) {
  const response = await api.post<Task>(`/leads/${leadId}/tasks`, newTask);
  return response.data;
}

export async function deleteTaskById(leadId: string, taskId: string) {
  await api.delete(`/leads/${leadId}/tasks/${taskId}`);
}

export async function toggleTaskCompletion(taskId: string) {
  const response = await api.patch<{ completed: boolean }>(`/tasks/${taskId}/toggle`);
  return response.data;
}
