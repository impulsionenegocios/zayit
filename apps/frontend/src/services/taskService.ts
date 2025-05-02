import api from '@/lib/axios';
import type { Task, NewTask } from '@/types/task.types';

export async function getTasksByLeadId(crmId: string, leadId: string) {
  const response = await api.get<Task[]>(`/crms/${crmId}/leads/${leadId}/tasks`);
  return response.data;
}

export async function createTask(crmId: string, leadId: string, newTask: NewTask) {
  const response = await api.post<Task>(`/crms/${crmId}/leads/${leadId}/tasks`, newTask);
  return response.data;
}

export async function deleteTaskById(crmId: string, leadId: string, taskId: string) {
  await api.delete(`/crms/${crmId}/leads/${leadId}/tasks/${taskId}`);
}

export async function updateTaskById(
  crmId: string,
  leadId: string,
  taskId: string,
  updatedTask: Partial<Task>,
) {
  const response = await api.put<Task>(
    `/crms/${crmId}/leads/${leadId}/tasks/${taskId}`,
    updatedTask,
  );
  return response.data;
}

export async function toggleTaskCompletion(crmId: string, leadId: string, taskId: string) {
  const response = await api.patch<{ completed: boolean }>(
    `/crms/${crmId}/leads/${leadId}/tasks/${taskId}/toggle`,
  );
  return response.data;
}
