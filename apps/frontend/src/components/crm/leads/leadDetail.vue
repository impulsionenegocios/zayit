<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Lead Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Lead Header -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="h-16 w-16 rounded-full bg-zayit-blue flex items-center justify-center text-white text-xl font-semibold">
                {{ getInitials(lead.name) }}
              </div>
              <div class="ml-4">
                <h1 class="text-2xl font-bold text-white">{{ lead.name }}</h1>
                <div class="flex items-center text-gray-400 mt-1">
                  <span 
                    class="px-2 py-0.5 text-sm rounded-full mr-2" 
                    :class="statusClasses[lead.status]"
                  >
                    {{ formatStatus(lead.status) }}
                  </span>
                  <span class="text-sm">Added {{ formatDate(lead.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex gap-2">
              <DefaultButton
                variant="info"
                size="md" 
                @click="editLead"
              >
                <Icon icon="mdi:pencil" class="mr-1" />
                Editar
              </DefaultButton>
              <DefaultButton
                variant="danger"
                size="md" 
                @click="confirmDelete"
              >
                <Icon icon="mdi:delete" class="mr-1" />
                Apagar
              </DefaultButton>
            </div>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="bg-surface rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Informações de Contato</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <h3 class="text-sm text-gray-400">Email</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:email-outline" class="text-zayit-blue mr-2" />
                <a 
                  :href="`mailto:${lead.email}`" 
                  class="text-white hover:text-zayit-blue transition-colors"
                >
                  {{ lead.email }}
                </a>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-400">Número</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:phone-outline" class="text-zayit-blue mr-2" />
                <a 
                  :href="`tel:${lead.phone}`" 
                  class="text-white hover:text-zayit-blue transition-colors"
                >
                  {{ lead.phone }}
                </a>
                <button 
                  class="ml-2 text-green-700 cursor-pointer  bg-green-400 hover:bg-white/10 transition-colors p-1.5 rounded-full"
                  title="Send WhatsApp message"
                  @click="openWhatsApp(lead.phone)"
                >
                  <Icon icon="mdi:whatsapp" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-400">Data de Nascimento</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:calendar-outline" class="text-zayit-blue mr-2" />
                <span class="text-white">
                  {{ lead.birthDate ? formatDate(lead.birthDate) : 'Not specified' }}
                </span>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-400">Fonte</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:source-branch" class="text-zayit-blue mr-2" />
                <span class="text-white">{{ formatSource(lead.source) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <h3 class="text-sm text-gray-400">Endereço</h3>
            <div class="flex items-start mt-1">
              <Icon icon="mdi:map-marker-outline" class="text-zayit-blue mr-2 mt-0.5" />
              <span class="text-white">{{ lead.address || 'No address specified' }}</span>
            </div>
          </div>
          
          <div class="mt-4">
            <h3 class="text-sm text-gray-400">Tags</h3>
            <LeadTags :tags="lead.tags" />
          </div>
        </div>
        
        <!-- Contact History -->
        <div class="bg-surface rounded-lg p-6">
          <ContactHistory :leadId="leadId" />
        </div>
        
        <!-- Comments -->
        <div class="bg-surface rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Comentários</h2>
          
          <div class="space-y-4">
            <div v-if="!comments.length" class="text-center py-4 text-white/60">
              Sem comentários Ainda
            </div>
            
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="bg-card rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div class="font-medium text-white">{{ comment.userName || 'User' }}</div>
                <div class="text-sm text-gray-400">{{ formatDateTime(comment.createdAt) }}</div>
              </div>
              <p class="mt-1 text-white/80">{{ comment.text }}</p>
            </div>
            
            <div class="pt-4">
              <FormControl label="Add Comment">
                <BaseTextarea 
                  v-model="newComment" 
                  placeholder="Escreva um comentário..." 
                  :rows="3"
                />
              </FormControl>
              
              <div class="flex justify-end mt-2">
                <DefaultButton 
                  variant="primary"
                  size="sm"
                  @click="addComment"
                  :disabled="!newComment.trim()"
                >
                  Post Comment
                </DefaultButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column - Tasks & Files -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-surface rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
          
          <div class="grid grid-cols-2 gap-3">
            <button class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center">
              <Icon icon="mdi:phone" class="mr-2 text-zayit-blue" />
              <span>Ligar</span>
            </button>
            
            <button class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center" @click="openWhatsApp(lead.phone)">
              <Icon icon="mdi:whatsapp" class="mr-2 text-zayit-blue" />
              <span>WhatsApp</span>
            </button>
            
            <button class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center" @click="sendEmail">
              <Icon icon="mdi:email" class="mr-2 text-zayit-blue" />
              <span>Email</span>
            </button>
            
            <button class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center" @click="openTaskModal">
              <Icon icon="mdi:clipboard-check" class="mr-2 text-zayit-blue" />
              <span>Add Tarefa</span>
            </button>
          </div>
        </div>
        
        <!-- Tasks -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-white">Tarefas</h2>
            <DefaultButton
                variant="primary"
                size="sm"
                icon="mdi:plus"
                @click="openTaskModal"
              >
                Nova Tarefa
              </DefaultButton>
          </div>
          
          <div v-if="!tasks.length" class="text-center py-8 text-white/60">
            <Icon icon="mdi:checkbox-marked-circle-outline" class="text-4xl mx-auto mb-2" />
            <p>Sem Tarefas Ainda</p>
            <p class="text-sm">Crie sua primeiria tarefa para esse lead</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="task in tasks" 
              :key="task.id"
              class="bg-card rounded-lg p-3 flex items-start"
            >
              <div class="mt-1 mr-3">
                <input 
                  type="checkbox" 
                  :checked="task.completed" 
                  @change="toggleTaskStatus(task.id)"
                  class="w-4 h-4 rounded-sm bg-white/10 border-white/30 text-zayit-blue focus:ring-zayit-blue"
                />
              </div>
              
              <div class="flex-1">
                <div 
                  class="font-medium"
                  :class="task.completed ? 'text-white/50 line-through' : 'text-white'"
                >
                  {{ task.title }}
                </div>
                
                <div class="flex items-center justify-between mt-1">
                  <div class="text-sm" :class="getTaskDueClass(task.due_date)">
                    <Icon icon="mdi:calendar" class="mr-1" />
                    {{ formatDate(task.due_date) }}
                  </div>
                  
                  <DefaultButton 
                    class="text-zayit-danger"
                    @click="deleteTask(task.id)"
                    title="Delete task"
                  >
                    <Icon icon="mdi:delete" />
                  </DefaultButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Files -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-white">Arquivos</h2>
            <DefaultButton 
              @click="openFileUploader"
              size="sm"
              variant="primary"
            >
              <Icon icon="mdi:upload" class="mr-1" />
              Upload
            </DefaultButton>
          </div>
          
          <div v-if="!files.length" class="text-center py-8 text-white/60">
            <Icon icon="mdi:file-document-outline" class="text-4xl mx-auto mb-2" />
            <p>Sem Arquivos Ainda</p>
            <p class="text-sm">Faça upload de arquivos para esse lead</p>
          </div>
          
          <div v-else class="space-y-2">
            <div 
              v-for="file in files" 
              :key="file.id"
              class="bg-card rounded-lg p-3 flex items-center"
            >
              <div class="mr-3 text-zayit-blue">
                <Icon :icon="getFileIcon(file.type)" class="text-xl" />
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="font-medium text-white truncate">{{ file.name }}</div>
                <div class="text-xs text-gray-400">
                  {{ formatFileSize(file.size) }} · {{ formatDate(file.uploadedAt) }}
                </div>
              </div>
              
              <div class="flex gap-1">
                <DefaultButton 
                  variant="info"
                  size="sm" 
                  @click="viewFile(file)"
                  title="Ver Arquivo"
                >
                  <Icon icon="mdi:eye" />
                </DefaultButton >
                
                <DefaultButton 
                  variant="primary"
                  size="sm" 
                  @click="downloadFile(file)"
                  title="Baixar Arquivo"
                >
                  <Icon icon="mdi:download" />
                </DefaultButton >
                
                <DefaultButton 
                  variant="danger"
                  size="sm" 
                  @click="deleteFile(file.id)"
                  title="Excluir Arquivo"
                >
                  <Icon icon="mdi:delete" />
                </DefaultButton >
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add Contact Modal -->
      <div v-if="showContactModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showContactModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Registro de Contato</h3>
          
          <FormControl label="Tipo de Contato" forLabel="contactType">
            <BaseSelect 
              v-model="newContact.type" 
              :options="[]"
              id="contactType" 
              placeholder="Selecione um tipo de contato" 
            />
          </FormControl>
          
          <FormControl label="Data & Hora" forLabel="contactDate" class="mt-4">
            <BaseInput 
              v-model="newContact.date" 
              id="contactDate" 
              type="datetime-local" 
            />
          </FormControl>
          
          <FormControl label="Descrição" forLabel="contactDescription" class="mt-4">
            <BaseTextarea 
              v-model="newContact.description" 
              id="contactDescription" 
              placeholder="Descreva a Interação" 
              :rows="3"
            />
          </FormControl>
          
          <div class="flex justify-end gap-3 mt-6">
            <DefaultButton 
              variant="default"
              size="sm"
              @click="showContactModal = false"
            >
              Cancelar
            </DefaultButton>
            <DefaultButton 
              variant="primary"
              size="sm"
              @click="addContact"
              :disabled="!newContact.type || !newContact.description"
            >
              Salvar Contato
            </DefaultButton>
          </div>
        </div>
      </div>
      
      <!-- Add Task Modal -->
      <div v-if="showTaskModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showTaskModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Add Task</h3>
          
          <FormControl label="Titulo da Tarefa" forLabel="taskTitle">
            <BaseInput 
              v-model="newTask.title" 
              id="taskTitle" 
              placeholder="Digite o título da tarefa" 
            />
          </FormControl>
          
          <FormControl label="Data Prevista" forLabel="taskDueDate" class="mt-4">
            <BaseInput 
              v-model="newTask.due_date" 
              id="taskDueDate" 
              type="date" 
            />
          </FormControl>
          
          <div class="flex justify-end gap-3 mt-6">
            <DefaultButton
              variant="default"
              size="sm" 
              @click="showTaskModal = false"
            >
              Cancelar
            </DefaultButton>
            <DefaultButton
              variant="primary"
              size="sm" 
              @click="addTask"
              :disabled="!newTask.title || !newTask.due_date"
            >
              Add Tarefa
            </DefaultButton>
          </div>
        </div>
      </div>
      
      <!-- File Upload Modal -->
      <div v-if="showFileModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showFileModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Subir Arquivo</h3>
          
          <BaseFileInput 
            ref="fileInputRef"
            v-model="fileUpload" 
            name="file"
            :multiple="false"
            :auto-upload="false"
          />
          
          <div class="flex justify-end gap-3 mt-6">
            <DefaultButton 
              variant="default"
              size="sm"
              @click="showFileModal = false"
            >
              Cancel
            </DefaultButton>
            <DefaultButton 
              variant="primary"
              size="sm"
              @click="uploadFile"
              :disabled="!fileUpload"
            >
              Upload
            </DefaultButton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLeadStore } from '@/stores/crm/client';
  import { useToast } from '@/composables/useToast';
  import { useModal } from '@/composables/useModal';
  import { Icon } from '@iconify/vue';
  import type { Lead, LeadStatus, Contact, NewContact } from '@/types/client.types';
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
  import LeadTags from './LeadTags.vue';
  import FormControl from '@/components/ui/forms/FormControl.vue';
  import BaseInput from '@/components/ui/forms/BaseInput.vue';
  import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
  import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
  import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
  import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
  import ContactHistory from '../contacts/ContactHistory.vue';
  import { useTaskManager } from '@/composables/crm/useTaskManager';
  import {formatDate, formatDateTime} from '@/utils/dateFormatter'
  import { formatFileSize } from '@/utils/formatFiles'
  import {formatStatus} from '@/utils/statusColors'
  const props = defineProps<{
    leadId: string;
  }>();
  
  const clientStore = useLeadStore();
  const toast = useToast();
  const modal = useModal();
  const router = useRouter();
  const fileInputRef = ref(null);
  
  // Data
  const lead = ref<Lead>({
    id: '',
    name: '',
    email: '',
    phone: '',
    status: 'lead',
    tags: [],
    createdAt: '',
    updatedAt: ''
  });
  
  const contactHistory = ref<Contact[]>([]);
  const comments = ref<any[]>([]);
    const {
  tasks,
  isLoading: isLoadingTasks,
  newTask,
  loadTasks,
  addTask,
  deleteTask,
  toggleTaskStatus
} = useTaskManager(props.leadId);

  const files = ref<any[]>([]);
  
  // Form states
  const newComment = ref('');
  const fileUpload = ref<File | null>(null);
  const showContactModal = ref(false);
  const showTaskModal = ref(false);
  const showFileModal = ref(false);
  
  // New contact form
  const newContact = reactive<NewContact>({
  type: '',
  date: new Date().toISOString().slice(0, 16),
  description: ''
});

  
  // Status styling
  const statusClasses = {
    lead: 'bg-zayit-info/20 text-zayit-info',
    opportunity: 'bg-zayit-warning/20 text-zayit-warning',
    client: 'bg-zayit-blue/20 text-zayit-blue',
    lost: 'bg-zayit-danger/20 text-zayit-danger'
  };
  

  
  // Load data
  onMounted(async () => {
    if (!props.leadId) {
      toast.error('Lead ID is required');
      router.push('/leads');
      return;
    }
    
    const result = await clientStore.fetchLeadById(props.leadId);
    if (result) {
      lead.value = result;
      
      // Load additional data
      await loadComments();
      await loadTasks();
      await loadFiles();
    } else {
      toast.error('Failed to load lead');
      router.push('/leads');
    }
  });
  
  
  function formatSource(source?: string) {
    if (!source) return 'Unknown';
    return source.charAt(0).toUpperCase() + source.slice(1);
  }
  

  
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  

  
  function getTaskDueClass(due_date: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(due_date);
    due.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 ) {
      return 'text-zayit-danger'; // Overdue
    } else if (diffDays === 0) {
      return 'text-zayit-warning'; // Due today
    } else {
      return 'text-gray-400'; // Future
    }
  }
  
  function getFileIcon(type: string) {
    if (type.startsWith('image/')) {
      return 'mdi:file-image';
    } else if (type.includes('pdf')) {
      return 'mdi:file-pdf';
    } else if (type.includes('word') || type.includes('document')) {
      return 'mdi:file-word';
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return 'mdi:file-excel';
    } else if (type.includes('zip') || type.includes('compressed')) {
      return 'mdi:file-zip';
    } else {
      return 'mdi:file-document';
    }
  }
  
  // Action methods
  function editLead(lead: Lead) {
  router.push({ name: 'EditLead', params: { id: props.leadId } });
}

  async function confirmDelete() {
    try {
      const confirmed = await modal.open(ConfirmModal, {
        title: 'Apagar Lead',
        props: {
          message: `Tem certeza que quer deletar ${lead.value.name}? Essa ação não pode ser desfeita.`
        },
        size: 'sm'
      });
      
      if (confirmed) {
        const success = await clientStore.deleteLead(props.leadId);
        if (success) {
          toast.success(`Lead "${lead.value.name}" Apagado com Sucesso!`);
          router.push('/leads');
        } else {
          toast.error('Erro ao tentar apagar esse Lead');
        }
      }
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  }
  
  function openWhatsApp(phone: string) {
    // Remove non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  }
  
  function sendEmail() {
    window.location.href = `mailto:${lead.value.email}`;
  }
  

  
  async function loadComments() {
    // This would normally be an API call
    comments.value = [
      {
        id: '1',
        leadId: props.leadId,
        userId: 'user1',
        userName: 'John Doe',
        text: 'This lead came from our webinar last week. They showed a lot of interest in our premium services.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
  
async function loadFiles() {
  // This would normally be an API call
  files.value = [
    {
      id: '1',
      leadId: props.leadId,
      name: 'Contract_Draft.pdf',
      type: 'application/pdf',
      size: 1258000,
      url: '#',
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}

// Modal actions
function openTaskModal() {
  newTask.title = '';
  newTask.due_date = new Date().toISOString().slice(0, 10);
  newTask.completed = false;
  showTaskModal.value = true;
}

function openFileUploader() {
  fileUpload.value = null;
  showFileModal.value = true;
}

// Data manipulation
async function addComment() {
  if (!newComment.value.trim()) return;
  
  const comment = {
    id: Date.now().toString(),
    leadId: props.leadId,
    userId: 'currentUser', // This would normally come from auth
    userName: 'Current User', // This would normally come from auth
    text: newComment.value,
    createdAt: new Date().toISOString()
  };
  
  // Add to local state (would normally be an API call)
  comments.value.unshift(comment);
  newComment.value = '';
  
  toast.success('Comment added');
}

async function addContact() {
  if (!newContact.type || !newContact.description) return;
  
  const contact = {
    id: Date.now().toString(),
    leadId: props.leadId,
    type: newContact.type,
    description: newContact.description,
    date: newContact.date,
    userId: 'currentUser' // This would normally come from auth
  };
  
  // Add to local state (would normally be an API call)
  contactHistory.value.unshift(contact);
  showContactModal.value = false;
  
  toast.success('Contact history recorded');
}

async function uploadFile() {
  if (!fileUpload.value) return;
  
  // This would normally be an API call to upload the file
  const file = {
    id: Date.now().toString(),
    leadId: props.leadId,
    name: fileUpload.value.name,
    type: fileUpload.value.type,
    size: fileUpload.value.size,
    url: URL.createObjectURL(fileUpload.value),
    uploadedAt: new Date().toISOString()
  };
  
  // Add to local state
  files.value.push(file);
  showFileModal.value = false;
  
  toast.success('File uploaded');
}

function viewFile(file: any) {
  window.open(file.url, '_blank');
}

function downloadFile(file: any) {
  // This would normally trigger a download
  window.open(file.url, '_blank');
}

async function deleteFile(fileId: string) {
  // Update local state (would normally be an API call)
  files.value = files.value.filter(file => file.id !== fileId);
  
  toast.success('File deleted');
}
</script>