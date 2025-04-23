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
              <button 
                @click="editLead"
                class="btn-outline btn-sm"
              >
                <Icon icon="mdi:pencil" class="mr-1" />
                Edit
              </button>
              <button 
                @click="confirmDelete"
                class="btn-danger btn-sm"
              >
                <Icon icon="mdi:delete" class="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="bg-surface rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Contact Information</h2>
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
              <h3 class="text-sm text-gray-400">Phone</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:phone-outline" class="text-zayit-blue mr-2" />
                <a 
                  :href="`tel:${lead.phone}`" 
                  class="text-white hover:text-zayit-blue transition-colors"
                >
                  {{ lead.phone }}
                </a>
                <button 
                  class="ml-2 text-zayit-blue bg-white/5 hover:bg-white/10 transition-colors p-1.5 rounded-full"
                  title="Send WhatsApp message"
                  @click="openWhatsApp(lead.phone)"
                >
                  <Icon icon="mdi:whatsapp" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-400">Birth Date</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:calendar-outline" class="text-zayit-blue mr-2" />
                <span class="text-white">
                  {{ lead.birthDate ? formatDate(lead.birthDate) : 'Not specified' }}
                </span>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm text-gray-400">Source</h3>
              <div class="flex items-center mt-1">
                <Icon icon="mdi:source-branch" class="text-zayit-blue mr-2" />
                <span class="text-white">{{ formatSource(lead.source) }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <h3 class="text-sm text-gray-400">Address</h3>
            <div class="flex items-start mt-1">
              <Icon icon="mdi:map-marker-outline" class="text-zayit-blue mr-2 mt-0.5" />
              <span class="text-white">{{ lead.address || 'No address specified' }}</span>
            </div>
          </div>
          
          <div class="mt-4">
            <h3 class="text-sm text-gray-400">Tags</h3>
            <div class="flex flex-wrap gap-2 mt-2">
              <span 
                v-for="tag in lead.tags" 
                :key="tag.id" 
                class="px-2 py-0.5 text-sm rounded-full text-white"
                :style="{ backgroundColor: tag.color }"
              >
                {{ tag.name }}
              </span>
              <span v-if="!lead.tags.length" class="text-white/60">No tags</span>
            </div>
          </div>
        </div>
        
        <!-- Contact History -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-white">Contact History</h2>
            <button 
              @click="openNewContactModal"
              class="btn-primary btn-sm"
            >
              <Icon icon="mdi:plus" class="mr-1" />
              Add Contact
            </button>
          </div>
          
          <div v-if="!contactHistory.length" class="text-center py-8 text-white/60">
            <Icon icon="mdi:history" class="text-4xl mx-auto mb-2" />
            <p>No contact history yet</p>
            <p class="text-sm">Record your first interaction with this lead</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="contact in contactHistory" 
              :key="contact.id"
              class="bg-card rounded-lg p-4"
            >
              <div class="flex items-start">
                <div 
                  class="rounded-full p-2.5 mr-3" 
                  :class="getContactTypeClass(contact.type)"
                >
                  <Icon :icon="getContactTypeIcon(contact.type)" class="text-lg" />
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="font-medium text-white">{{ getContactTypeLabel(contact.type) }}</div>
                    <div class="text-sm text-gray-400">{{ formatDateTime(contact.date) }}</div>
                  </div>
                  <p class="mt-1 text-white/80">{{ contact.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Comments -->
        <div class="bg-surface rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Comments</h2>
          
          <div class="space-y-4">
            <div v-if="!comments.length" class="text-center py-4 text-white/60">
              No comments yet
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
                  placeholder="Write a comment..." 
                  :rows="3"
                />
              </FormControl>
              
              <div class="flex justify-end mt-2">
                <button 
                  @click="addComment"
                  class="btn-primary btn-sm"
                  :disabled="!newComment.trim()"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column - Tasks & Files -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-surface rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          
          <div class="grid grid-cols-2 gap-3">
            <button class="btn-outline p-3 h-auto text-left flex items-center">
              <Icon icon="mdi:phone" class="mr-2 text-zayit-blue" />
              <span>Call</span>
            </button>
            
            <button class="btn-outline p-3 h-auto text-left flex items-center" @click="openWhatsApp(lead.phone)">
              <Icon icon="mdi:whatsapp" class="mr-2 text-zayit-blue" />
              <span>WhatsApp</span>
            </button>
            
            <button class="btn-outline p-3 h-auto text-left flex items-center" @click="sendEmail">
              <Icon icon="mdi:email" class="mr-2 text-zayit-blue" />
              <span>Email</span>
            </button>
            
            <button class="btn-outline p-3 h-auto text-left flex items-center" @click="openTaskModal">
              <Icon icon="mdi:clipboard-check" class="mr-2 text-zayit-blue" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
        
        <!-- Tasks -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-white">Tasks</h2>
            <button 
              @click="openTaskModal"
              class="btn-primary btn-sm"
            >
              <Icon icon="mdi:plus" class="mr-1" />
              New Task
            </button>
          </div>
          
          <div v-if="!tasks.length" class="text-center py-8 text-white/60">
            <Icon icon="mdi:checkbox-marked-circle-outline" class="text-4xl mx-auto mb-2" />
            <p>No tasks yet</p>
            <p class="text-sm">Create your first task for this lead</p>
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
                  @change="toggleTaskStatus(task)"
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
                  <div class="text-sm" :class="getTaskDueClass(task.dueDate)">
                    <Icon icon="mdi:calendar" class="mr-1" />
                    {{ formatDate(task.dueDate) }}
                  </div>
                  
                  <button 
                    @click="deleteTask(task.id)"
                    class="text-white/50 hover:text-zayit-danger p-1"
                    title="Delete task"
                  >
                    <Icon icon="mdi:delete" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Files -->
        <div class="bg-surface rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-white">Files</h2>
            <button 
              @click="openFileUploader"
              class="btn-primary btn-sm"
            >
              <Icon icon="mdi:upload" class="mr-1" />
              Upload
            </button>
          </div>
          
          <div v-if="!files.length" class="text-center py-8 text-white/60">
            <Icon icon="mdi:file-document-outline" class="text-4xl mx-auto mb-2" />
            <p>No files yet</p>
            <p class="text-sm">Upload documents related to this lead</p>
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
                <button 
                  @click="viewFile(file)"
                  class="text-white/70 hover:text-zayit-blue p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                  title="View file"
                >
                  <Icon icon="mdi:eye" />
                </button>
                
                <button 
                  @click="downloadFile(file)"
                  class="text-white/70 hover:text-zayit-blue p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                  title="Download file"
                >
                  <Icon icon="mdi:download" />
                </button>
                
                <button 
                  @click="deleteFile(file.id)"
                  class="text-white/70 hover:text-zayit-danger p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                  title="Delete file"
                >
                  <Icon icon="mdi:delete" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add Contact Modal -->
      <div v-if="showContactModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showContactModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Record Contact</h3>
          
          <FormControl label="Contact Type" forLabel="contactType">
            <BaseSelect 
              v-model="newContact.type" 
              id="contactType" 
              :options="contactTypeOptions" 
              placeholder="Select contact type" 
            />
          </FormControl>
          
          <FormControl label="Date & Time" forLabel="contactDate" class="mt-4">
            <BaseInput 
              v-model="newContact.date" 
              id="contactDate" 
              type="datetime-local" 
            />
          </FormControl>
          
          <FormControl label="Description" forLabel="contactDescription" class="mt-4">
            <BaseTextarea 
              v-model="newContact.description" 
              id="contactDescription" 
              placeholder="Describe the interaction" 
              :rows="3"
            />
          </FormControl>
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              class="btn-secondary" 
              @click="showContactModal = false"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn-primary"
              @click="addContact"
              :disabled="!newContact.type || !newContact.description"
            >
              Save Contact
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add Task Modal -->
      <div v-if="showTaskModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showTaskModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Add Task</h3>
          
          <FormControl label="Task Title" forLabel="taskTitle">
            <BaseInput 
              v-model="newTask.title" 
              id="taskTitle" 
              placeholder="Enter task title" 
            />
          </FormControl>
          
          <FormControl label="Due Date" forLabel="taskDueDate" class="mt-4">
            <BaseInput 
              v-model="newTask.dueDate" 
              id="taskDueDate" 
              type="date" 
            />
          </FormControl>
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              class="btn-secondary" 
              @click="showTaskModal = false"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn-primary"
              @click="addTask"
              :disabled="!newTask.title || !newTask.dueDate"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
      
      <!-- File Upload Modal -->
      <div v-if="showFileModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/50" @click="showFileModal = false"></div>
        <div class="bg-card rounded-lg p-6 w-full max-w-md relative z-10">
          <h3 class="text-lg font-medium text-white mb-4">Upload File</h3>
          
          <BaseFileInput 
            ref="fileInputRef"
            v-model="fileUpload" 
            name="file"
            :multiple="false"
            :auto-upload="false"
          />
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              class="btn-secondary" 
              @click="showFileModal = false"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn-primary"
              @click="uploadFile"
              :disabled="!fileUpload"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useClientStore } from '@/stores/crm/client';
  import { useToast } from '@/composables/useToast';
  import { useModal } from '@/composables/useModal';
  import { Icon } from '@iconify/vue';
  import type { Lead, LeadStatus, Contact } from '@/types/client.types';
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
  
  import FormControl from '@/components/ui/forms/FormControl.vue';
  import BaseInput from '@/components/ui/forms/BaseInput.vue';
  import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
  import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
  import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
  
  const props = defineProps<{
    leadId: string;
  }>();
  
  const clientStore = useClientStore();
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
  const tasks = ref<any[]>([]);
  const files = ref<any[]>([]);
  
  // Form states
  const newComment = ref('');
  const fileUpload = ref<File | null>(null);
  const showContactModal = ref(false);
  const showTaskModal = ref(false);
  const showFileModal = ref(false);
  
  // New contact form
  const newContact = reactive({
    type: '',
    date: new Date().toISOString().slice(0, 16),
    description: ''
  });
  
  // New task form
  const newTask = reactive({
    title: '',
    dueDate: new Date().toISOString().slice(0, 10),
    completed: false
  });
  
  // Status styling
  const statusClasses = {
    lead: 'bg-zayit-info/20 text-zayit-info',
    opportunity: 'bg-zayit-warning/20 text-zayit-warning',
    client: 'bg-zayit-blue/20 text-zayit-blue',
    lost: 'bg-zayit-danger/20 text-zayit-danger'
  };
  
  // Contact type options
  const contactTypeOptions = [
    { label: 'Phone Call', value: 'call' },
    { label: 'WhatsApp', value: 'whatsapp' },
    { label: 'Email', value: 'email' },
    { label: 'Meeting', value: 'meeting' }
  ];
  
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
      await loadContactHistory();
      await loadComments();
      await loadTasks();
      await loadFiles();
    } else {
      toast.error('Failed to load lead');
      router.push('/leads');
    }
  });
  
  // Format methods
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  function formatDateTime(date: string) {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }
  
  function formatSource(source?: string) {
    if (!source) return 'Unknown';
    return source.charAt(0).toUpperCase() + source.slice(1);
  }
  
  function formatStatus(status: LeadStatus) {
    switch (status) {
      case 'lead': return 'Lead';
      case 'opportunity': return 'Opportunity';
      case 'client': return 'Client';
      case 'lost': return 'Lost';
      default: return 'Unknown';
    }
  }
  
  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  function getContactTypeLabel(type: string) {
    switch (type) {
      case 'call': return 'Phone Call';
      case 'whatsapp': return 'WhatsApp Message';
      case 'email': return 'Email';
      case 'meeting': return 'Meeting';
      default: return 'Contact';
    }
  }
  
  function getContactTypeIcon(type: string) {
    switch (type) {
      case 'call': return 'mdi:phone';
      case 'whatsapp': return 'mdi:whatsapp';
      case 'email': return 'mdi:email';
      case 'meeting': return 'mdi:account-group';
      default: return 'mdi:account';
    }
  }
  
  function getContactTypeClass(type: string) {
    switch (type) {
      case 'call': return 'bg-green-500/20 text-green-500';
      case 'whatsapp': return 'bg-green-500/20 text-green-500';
      case 'email': return 'bg-blue-500/20 text-blue-500';
      case 'meeting': return 'bg-purple-500/20 text-purple-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  }
  
  function getTaskDueClass(dueDate: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
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
  function editLead() {
    router.push(`/leads/${props.leadId}/edit`);
  }
  
  async function confirmDelete() {
    try {
      const confirmed = await modal.open(ConfirmModal, {
        title: 'Delete Lead',
        props: {
          message: `Are you sure you want to delete ${lead.value.name}? This action cannot be undone.`
        },
        size: 'sm'
      });
      
      if (confirmed) {
        const success = await clientStore.deleteLead(props.leadId);
        if (success) {
          toast.success(`Lead "${lead.value.name}" deleted successfully`);
          router.push('/leads');
        } else {
          toast.error('Failed to delete lead');
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
  
  // Load additional data
  async function loadContactHistory() {
    // This would normally be an API call
    contactHistory.value = [
      {
        id: '1',
        leadId: props.leadId,
        type: 'call',
        description: 'Initial contact call. Discussed potential partnership.',
        date: new Date().toISOString(),
        userId: 'user1'
      },
      {
        id: '2',
        leadId: props.leadId,
        type: 'email',
        description: 'Sent follow-up email with our service offerings.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId: 'user1'
      }
    ];
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
  
  async function loadTasks() {
  // This would normally be an API call
  tasks.value = [
    {
      id: '1',
      leadId: props.leadId,
      title: 'Send proposal document',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '2',
      leadId: props.leadId,
      title: 'Schedule follow-up call',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false
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
function openNewContactModal() {
  newContact.type = '';
  newContact.date = new Date().toISOString().slice(0, 16);
  newContact.description = '';
  showContactModal.value = true;
}

function openTaskModal() {
  newTask.title = '';
  newTask.dueDate = new Date().toISOString().slice(0, 10);
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

async function addTask() {
  if (!newTask.title || !newTask.dueDate) return;
  
  const task = {
    id: Date.now().toString(),
    leadId: props.leadId,
    title: newTask.title,
    dueDate: newTask.dueDate,
    completed: false
  };
  
  // Add to local state (would normally be an API call)
  tasks.value.push(task);
  showTaskModal.value = false;
  
  toast.success('Task added');
}

async function toggleTaskStatus(task: any) {
  // Update local state (would normally be an API call)
  task.completed = !task.completed;
  
  toast.success(`Task marked as ${task.completed ? 'completed' : 'incomplete'}`);
}

async function deleteTask(taskId: string) {
  // Update local state (would normally be an API call)
  tasks.value = tasks.value.filter(task => task.id !== taskId);
  
  toast.success('Task deleted');
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