import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLeadStore } from '@/stores/crm/client';
import { useToast } from '@/composables/useToast';
import { useModal } from '@/composables/useModal';
import { Icon } from '@iconify/vue';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
const props = defineProps();
const clientStore = useLeadStore();
const toast = useToast();
const modal = useModal();
const router = useRouter();
const fileInputRef = ref(null);
// Data
const lead = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  status: 'lead',
  tags: [],
  createdAt: '',
  updatedAt: '',
});
const contactHistory = ref([]);
const comments = ref([]);
const tasks = ref([]);
const files = ref([]);
// Form states
const newComment = ref('');
const fileUpload = ref(null);
const showContactModal = ref(false);
const showTaskModal = ref(false);
const showFileModal = ref(false);
// New contact form
const newContact = reactive({
  type: '',
  date: new Date().toISOString().slice(0, 16),
  description: '',
});
// New task form
const newTask = reactive({
  title: '',
  dueDate: new Date().toISOString().slice(0, 10),
  completed: false,
});
// Status styling
const statusClasses = {
  lead: 'bg-zayit-info/20 text-zayit-info',
  opportunity: 'bg-zayit-warning/20 text-zayit-warning',
  client: 'bg-zayit-blue/20 text-zayit-blue',
  lost: 'bg-zayit-danger/20 text-zayit-danger',
};
// Contact type options
const contactTypeOptions = [
  { label: 'Phone Call', value: 'call' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Email', value: 'email' },
  { label: 'Meeting', value: 'meeting' },
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
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
function formatSource(source) {
  if (!source) return 'Unknown';
  return source.charAt(0).toUpperCase() + source.slice(1);
}
function formatStatus(status) {
  switch (status) {
    case 'lead':
      return 'Lead';
    case 'opportunity':
      return 'Opportunity';
    case 'client':
      return 'Client';
    case 'lost':
      return 'Lost';
    default:
      return 'Unknown';
  }
}
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
function getContactTypeLabel(type) {
  switch (type) {
    case 'call':
      return 'Phone Call';
    case 'whatsapp':
      return 'WhatsApp Message';
    case 'email':
      return 'Email';
    case 'meeting':
      return 'Meeting';
    default:
      return 'Contact';
  }
}
function getContactTypeIcon(type) {
  switch (type) {
    case 'call':
      return 'mdi:phone';
    case 'whatsapp':
      return 'mdi:whatsapp';
    case 'email':
      return 'mdi:email';
    case 'meeting':
      return 'mdi:account-group';
    default:
      return 'mdi:account';
  }
}
function getContactTypeClass(type) {
  switch (type) {
    case 'call':
      return 'bg-green-500/20 text-green-500';
    case 'whatsapp':
      return 'bg-green-500/20 text-green-500';
    case 'email':
      return 'bg-blue-500/20 text-blue-500';
    case 'meeting':
      return 'bg-purple-500/20 text-purple-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
}
function getTaskDueClass(dueDate) {
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
function getFileIcon(type) {
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
        message: `Are you sure you want to delete ${lead.value.name}? This action cannot be undone.`,
      },
      size: 'sm',
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
function openWhatsApp(phone) {
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
      userId: 'user1',
    },
    {
      id: '2',
      leadId: props.leadId,
      type: 'email',
      description: 'Sent follow-up email with our service offerings.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      userId: 'user1',
    },
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
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
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
      completed: false,
    },
    {
      id: '2',
      leadId: props.leadId,
      title: 'Schedule follow-up call',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
    },
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
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
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
    createdAt: new Date().toISOString(),
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
    userId: 'currentUser', // This would normally come from auth
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
    completed: false,
  };
  // Add to local state (would normally be an API call)
  tasks.value.push(task);
  showTaskModal.value = false;
  toast.success('Task added');
}
async function toggleTaskStatus(task) {
  // Update local state (would normally be an API call)
  task.completed = !task.completed;
  toast.success(`Task marked as ${task.completed ? 'completed' : 'incomplete'}`);
}
async function deleteTask(taskId) {
  // Update local state (would normally be an API call)
  tasks.value = tasks.value.filter((task) => task.id !== taskId);
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
    uploadedAt: new Date().toISOString(),
  };
  // Add to local state
  files.value.push(file);
  showFileModal.value = false;
  toast.success('File uploaded');
}
function viewFile(file) {
  window.open(file.url, '_blank');
}
function downloadFile(file) {
  // This would normally trigger a download
  window.open(file.url, '_blank');
}
async function deleteFile(fileId) {
  // Update local state (would normally be an API call)
  files.value = files.value.filter((file) => file.id !== fileId);
  toast.success('File deleted');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'lg:col-span-2 space-y-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-start justify-between' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{
    class:
      'h-16 w-16 rounded-full bg-zayit-blue flex items-center justify-center text-white text-xl font-semibold',
  },
});
__VLS_ctx.getInitials(__VLS_ctx.lead.name);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'ml-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h1,
  __VLS_intrinsicElements.h1,
)({
  ...{ class: 'text-2xl font-bold text-white' },
});
__VLS_ctx.lead.name;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center text-gray-400 mt-1' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'px-2 py-0.5 text-sm rounded-full mr-2' },
  ...{ class: __VLS_ctx.statusClasses[__VLS_ctx.lead.status] },
});
__VLS_ctx.formatStatus(__VLS_ctx.lead.status);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'text-sm' },
});
__VLS_ctx.formatDate(__VLS_ctx.lead.createdAt);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex gap-2' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.editLead },
  ...{ class: 'btn-outline btn-sm' },
});
const __VLS_0 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    icon: 'mdi:pencil',
    ...{ class: 'mr-1' },
  }),
);
const __VLS_2 = __VLS_1(
  {
    icon: 'mdi:pencil',
    ...{ class: 'mr-1' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.confirmDelete },
  ...{ class: 'btn-danger btn-sm' },
});
const __VLS_4 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    icon: 'mdi:delete',
    ...{ class: 'mr-1' },
  }),
);
const __VLS_6 = __VLS_5(
  {
    icon: 'mdi:delete',
    ...{ class: 'mr-1' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'text-lg font-semibold text-white mb-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6' },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-sm text-gray-400' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center mt-1' },
});
const __VLS_8 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  __VLS_8,
  new __VLS_8({
    icon: 'mdi:email-outline',
    ...{ class: 'text-zayit-blue mr-2' },
  }),
);
const __VLS_10 = __VLS_9(
  {
    icon: 'mdi:email-outline',
    ...{ class: 'text-zayit-blue mr-2' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.a,
  __VLS_intrinsicElements.a,
)({
  href: `mailto:${__VLS_ctx.lead.email}`,
  ...{ class: 'text-white hover:text-zayit-blue transition-colors' },
});
__VLS_ctx.lead.email;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-sm text-gray-400' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center mt-1' },
});
const __VLS_12 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(
  __VLS_12,
  new __VLS_12({
    icon: 'mdi:phone-outline',
    ...{ class: 'text-zayit-blue mr-2' },
  }),
);
const __VLS_14 = __VLS_13(
  {
    icon: 'mdi:phone-outline',
    ...{ class: 'text-zayit-blue mr-2' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_13),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.a,
  __VLS_intrinsicElements.a,
)({
  href: `tel:${__VLS_ctx.lead.phone}`,
  ...{ class: 'text-white hover:text-zayit-blue transition-colors' },
});
__VLS_ctx.lead.phone;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{
    onClick: (...[$event]) => {
      __VLS_ctx.openWhatsApp(__VLS_ctx.lead.phone);
    },
  },
  ...{
    class: 'ml-2 text-zayit-blue bg-white/5 hover:bg-white/10 transition-colors p-1.5 rounded-full',
  },
  title: 'Send WhatsApp message',
});
const __VLS_16 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(
  __VLS_16,
  new __VLS_16({
    icon: 'mdi:whatsapp',
  }),
);
const __VLS_18 = __VLS_17(
  {
    icon: 'mdi:whatsapp',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_17),
);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-sm text-gray-400' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center mt-1' },
});
const __VLS_20 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  __VLS_20,
  new __VLS_20({
    icon: 'mdi:calendar-outline',
    ...{ class: 'text-zayit-blue mr-2' },
  }),
);
const __VLS_22 = __VLS_21(
  {
    icon: 'mdi:calendar-outline',
    ...{ class: 'text-zayit-blue mr-2' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'text-white' },
});
__VLS_ctx.lead.birthDate ? __VLS_ctx.formatDate(__VLS_ctx.lead.birthDate) : 'Not specified';
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-sm text-gray-400' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center mt-1' },
});
const __VLS_24 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(
  __VLS_24,
  new __VLS_24({
    icon: 'mdi:source-branch',
    ...{ class: 'text-zayit-blue mr-2' },
  }),
);
const __VLS_26 = __VLS_25(
  {
    icon: 'mdi:source-branch',
    ...{ class: 'text-zayit-blue mr-2' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_25),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'text-white' },
});
__VLS_ctx.formatSource(__VLS_ctx.lead.source);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'mt-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-sm text-gray-400' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-start mt-1' },
});
const __VLS_28 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(
  __VLS_28,
  new __VLS_28({
    icon: 'mdi:map-marker-outline',
    ...{ class: 'text-zayit-blue mr-2 mt-0.5' },
  }),
);
const __VLS_30 = __VLS_29(
  {
    icon: 'mdi:map-marker-outline',
    ...{ class: 'text-zayit-blue mr-2 mt-0.5' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_29),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'text-white' },
});
__VLS_ctx.lead.address || 'No address specified';
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'mt-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-sm text-gray-400' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex flex-wrap gap-2 mt-2' },
});
for (const [tag] of __VLS_getVForSourceType(__VLS_ctx.lead.tags)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    key: tag.id,
    ...{ class: 'px-2 py-0.5 text-sm rounded-full text-white' },
    ...{ style: { backgroundColor: tag.color } },
  });
  tag.name;
}
if (!__VLS_ctx.lead.tags.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'text-white/60' },
  });
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-between items-center mb-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'text-lg font-semibold text-white' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.openNewContactModal },
  ...{ class: 'btn-primary btn-sm' },
});
const __VLS_32 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  __VLS_32,
  new __VLS_32({
    icon: 'mdi:plus',
    ...{ class: 'mr-1' },
  }),
);
const __VLS_34 = __VLS_33(
  {
    icon: 'mdi:plus',
    ...{ class: 'mr-1' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
if (!__VLS_ctx.contactHistory.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'text-center py-8 text-white/60' },
  });
  const __VLS_36 = {}.Icon;
  /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
  const __VLS_37 = __VLS_asFunctionalComponent(
    __VLS_36,
    new __VLS_36({
      icon: 'mdi:history',
      ...{ class: 'text-4xl mx-auto mb-2' },
    }),
  );
  const __VLS_38 = __VLS_37(
    {
      icon: 'mdi:history',
      ...{ class: 'text-4xl mx-auto mb-2' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_37),
  );
  __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({
    ...{ class: 'text-sm' },
  });
} else {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'space-y-4' },
  });
  for (const [contact] of __VLS_getVForSourceType(__VLS_ctx.contactHistory)) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      key: contact.id,
      ...{ class: 'bg-card rounded-lg p-4' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex items-start' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'rounded-full p-2.5 mr-3' },
      ...{ class: __VLS_ctx.getContactTypeClass(contact.type) },
    });
    const __VLS_40 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(
      __VLS_40,
      new __VLS_40({
        icon: __VLS_ctx.getContactTypeIcon(contact.type),
        ...{ class: 'text-lg' },
      }),
    );
    const __VLS_42 = __VLS_41(
      {
        icon: __VLS_ctx.getContactTypeIcon(contact.type),
        ...{ class: 'text-lg' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_41),
    );
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex-1' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex items-center justify-between' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'font-medium text-white' },
    });
    __VLS_ctx.getContactTypeLabel(contact.type);
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'text-sm text-gray-400' },
    });
    __VLS_ctx.formatDateTime(contact.date);
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.p,
      __VLS_intrinsicElements.p,
    )({
      ...{ class: 'mt-1 text-white/80' },
    });
    contact.description;
  }
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'text-lg font-semibold text-white mb-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-4' },
});
if (!__VLS_ctx.comments.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'text-center py-4 text-white/60' },
  });
}
for (const [comment] of __VLS_getVForSourceType(__VLS_ctx.comments)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    key: comment.id,
    ...{ class: 'bg-card rounded-lg p-4' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex justify-between items-start' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'font-medium text-white' },
  });
  comment.userName || 'User';
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'text-sm text-gray-400' },
  });
  __VLS_ctx.formatDateTime(comment.createdAt);
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({
    ...{ class: 'mt-1 text-white/80' },
  });
  comment.text;
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'pt-4' },
});
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Add Comment',
  }),
);
const __VLS_45 = __VLS_44(
  {
    label: 'Add Comment',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_44),
);
__VLS_46.slots.default;
/** @type {[typeof BaseTextarea, ]} */ // @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(
  BaseTextarea,
  new BaseTextarea({
    modelValue: __VLS_ctx.newComment,
    placeholder: 'Write a comment...',
    rows: 3,
  }),
);
const __VLS_48 = __VLS_47(
  {
    modelValue: __VLS_ctx.newComment,
    placeholder: 'Write a comment...',
    rows: 3,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_47),
);
var __VLS_46;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-end mt-2' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.addComment },
  ...{ class: 'btn-primary btn-sm' },
  disabled: !__VLS_ctx.newComment.trim(),
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'text-lg font-semibold text-white mb-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'grid grid-cols-2 gap-3' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ class: 'btn-outline p-3 h-auto text-left flex items-center' },
});
const __VLS_50 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(
  __VLS_50,
  new __VLS_50({
    icon: 'mdi:phone',
    ...{ class: 'mr-2 text-zayit-blue' },
  }),
);
const __VLS_52 = __VLS_51(
  {
    icon: 'mdi:phone',
    ...{ class: 'mr-2 text-zayit-blue' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_51),
);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{
    onClick: (...[$event]) => {
      __VLS_ctx.openWhatsApp(__VLS_ctx.lead.phone);
    },
  },
  ...{ class: 'btn-outline p-3 h-auto text-left flex items-center' },
});
const __VLS_54 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(
  __VLS_54,
  new __VLS_54({
    icon: 'mdi:whatsapp',
    ...{ class: 'mr-2 text-zayit-blue' },
  }),
);
const __VLS_56 = __VLS_55(
  {
    icon: 'mdi:whatsapp',
    ...{ class: 'mr-2 text-zayit-blue' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_55),
);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.sendEmail },
  ...{ class: 'btn-outline p-3 h-auto text-left flex items-center' },
});
const __VLS_58 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(
  __VLS_58,
  new __VLS_58({
    icon: 'mdi:email',
    ...{ class: 'mr-2 text-zayit-blue' },
  }),
);
const __VLS_60 = __VLS_59(
  {
    icon: 'mdi:email',
    ...{ class: 'mr-2 text-zayit-blue' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_59),
);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.openTaskModal },
  ...{ class: 'btn-outline p-3 h-auto text-left flex items-center' },
});
const __VLS_62 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(
  __VLS_62,
  new __VLS_62({
    icon: 'mdi:clipboard-check',
    ...{ class: 'mr-2 text-zayit-blue' },
  }),
);
const __VLS_64 = __VLS_63(
  {
    icon: 'mdi:clipboard-check',
    ...{ class: 'mr-2 text-zayit-blue' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_63),
);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-between items-center mb-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'text-lg font-semibold text-white' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.openTaskModal },
  ...{ class: 'btn-primary btn-sm' },
});
const __VLS_66 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(
  __VLS_66,
  new __VLS_66({
    icon: 'mdi:plus',
    ...{ class: 'mr-1' },
  }),
);
const __VLS_68 = __VLS_67(
  {
    icon: 'mdi:plus',
    ...{ class: 'mr-1' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_67),
);
if (!__VLS_ctx.tasks.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'text-center py-8 text-white/60' },
  });
  const __VLS_70 = {}.Icon;
  /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
  const __VLS_71 = __VLS_asFunctionalComponent(
    __VLS_70,
    new __VLS_70({
      icon: 'mdi:checkbox-marked-circle-outline',
      ...{ class: 'text-4xl mx-auto mb-2' },
    }),
  );
  const __VLS_72 = __VLS_71(
    {
      icon: 'mdi:checkbox-marked-circle-outline',
      ...{ class: 'text-4xl mx-auto mb-2' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_71),
  );
  __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({
    ...{ class: 'text-sm' },
  });
} else {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'space-y-3' },
  });
  for (const [task] of __VLS_getVForSourceType(__VLS_ctx.tasks)) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      key: task.id,
      ...{ class: 'bg-card rounded-lg p-3 flex items-start' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'mt-1 mr-3' },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
      ...{
        onChange: (...[$event]) => {
          if (!!!__VLS_ctx.tasks.length) return;
          __VLS_ctx.toggleTaskStatus(task);
        },
      },
      type: 'checkbox',
      checked: task.completed,
      ...{
        class:
          'w-4 h-4 rounded-sm bg-white/10 border-white/30 text-zayit-blue focus:ring-zayit-blue',
      },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex-1' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'font-medium' },
      ...{ class: task.completed ? 'text-white/50 line-through' : 'text-white' },
    });
    task.title;
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex items-center justify-between mt-1' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'text-sm' },
      ...{ class: __VLS_ctx.getTaskDueClass(task.dueDate) },
    });
    const __VLS_74 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(
      __VLS_74,
      new __VLS_74({
        icon: 'mdi:calendar',
        ...{ class: 'mr-1' },
      }),
    );
    const __VLS_76 = __VLS_75(
      {
        icon: 'mdi:calendar',
        ...{ class: 'mr-1' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_75),
    );
    __VLS_ctx.formatDate(task.dueDate);
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.button,
      __VLS_intrinsicElements.button,
    )({
      ...{
        onClick: (...[$event]) => {
          if (!!!__VLS_ctx.tasks.length) return;
          __VLS_ctx.deleteTask(task.id);
        },
      },
      ...{ class: 'text-white/50 hover:text-zayit-danger p-1' },
      title: 'Delete task',
    });
    const __VLS_78 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(
      __VLS_78,
      new __VLS_78({
        icon: 'mdi:delete',
      }),
    );
    const __VLS_80 = __VLS_79(
      {
        icon: 'mdi:delete',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_79),
    );
  }
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg p-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-between items-center mb-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h2,
  __VLS_intrinsicElements.h2,
)({
  ...{ class: 'text-lg font-semibold text-white' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.openFileUploader },
  ...{ class: 'btn-primary btn-sm' },
});
const __VLS_82 = {}.Icon;
/** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(
  __VLS_82,
  new __VLS_82({
    icon: 'mdi:upload',
    ...{ class: 'mr-1' },
  }),
);
const __VLS_84 = __VLS_83(
  {
    icon: 'mdi:upload',
    ...{ class: 'mr-1' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_83),
);
if (!__VLS_ctx.files.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'text-center py-8 text-white/60' },
  });
  const __VLS_86 = {}.Icon;
  /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
  const __VLS_87 = __VLS_asFunctionalComponent(
    __VLS_86,
    new __VLS_86({
      icon: 'mdi:file-document-outline',
      ...{ class: 'text-4xl mx-auto mb-2' },
    }),
  );
  const __VLS_88 = __VLS_87(
    {
      icon: 'mdi:file-document-outline',
      ...{ class: 'text-4xl mx-auto mb-2' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_87),
  );
  __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({
    ...{ class: 'text-sm' },
  });
} else {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'space-y-2' },
  });
  for (const [file] of __VLS_getVForSourceType(__VLS_ctx.files)) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      key: file.id,
      ...{ class: 'bg-card rounded-lg p-3 flex items-center' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'mr-3 text-zayit-blue' },
    });
    const __VLS_90 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(
      __VLS_90,
      new __VLS_90({
        icon: __VLS_ctx.getFileIcon(file.type),
        ...{ class: 'text-xl' },
      }),
    );
    const __VLS_92 = __VLS_91(
      {
        icon: __VLS_ctx.getFileIcon(file.type),
        ...{ class: 'text-xl' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_91),
    );
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex-1 min-w-0' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'font-medium text-white truncate' },
    });
    file.name;
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'text-xs text-gray-400' },
    });
    __VLS_ctx.formatFileSize(file.size);
    __VLS_ctx.formatDate(file.uploadedAt);
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex gap-1' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.button,
      __VLS_intrinsicElements.button,
    )({
      ...{
        onClick: (...[$event]) => {
          if (!!!__VLS_ctx.files.length) return;
          __VLS_ctx.viewFile(file);
        },
      },
      ...{
        class:
          'text-white/70 hover:text-zayit-blue p-1.5 rounded-full bg-white/5 hover:bg-white/10',
      },
      title: 'View file',
    });
    const __VLS_94 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(
      __VLS_94,
      new __VLS_94({
        icon: 'mdi:eye',
      }),
    );
    const __VLS_96 = __VLS_95(
      {
        icon: 'mdi:eye',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_95),
    );
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.button,
      __VLS_intrinsicElements.button,
    )({
      ...{
        onClick: (...[$event]) => {
          if (!!!__VLS_ctx.files.length) return;
          __VLS_ctx.downloadFile(file);
        },
      },
      ...{
        class:
          'text-white/70 hover:text-zayit-blue p-1.5 rounded-full bg-white/5 hover:bg-white/10',
      },
      title: 'Download file',
    });
    const __VLS_98 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(
      __VLS_98,
      new __VLS_98({
        icon: 'mdi:download',
      }),
    );
    const __VLS_100 = __VLS_99(
      {
        icon: 'mdi:download',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_99),
    );
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.button,
      __VLS_intrinsicElements.button,
    )({
      ...{
        onClick: (...[$event]) => {
          if (!!!__VLS_ctx.files.length) return;
          __VLS_ctx.deleteFile(file.id);
        },
      },
      ...{
        class:
          'text-white/70 hover:text-zayit-danger p-1.5 rounded-full bg-white/5 hover:bg-white/10',
      },
      title: 'Delete file',
    });
    const __VLS_102 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(
      __VLS_102,
      new __VLS_102({
        icon: 'mdi:delete',
      }),
    );
    const __VLS_104 = __VLS_103(
      {
        icon: 'mdi:delete',
      },
      ...__VLS_functionalComponentArgsRest(__VLS_103),
    );
  }
}
if (__VLS_ctx.showContactModal) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'fixed inset-0 flex items-center justify-center z-50' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showContactModal) return;
        __VLS_ctx.showContactModal = false;
      },
    },
    ...{ class: 'absolute inset-0 bg-black/50' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'bg-card rounded-lg p-6 w-full max-w-md relative z-10' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.h3,
    __VLS_intrinsicElements.h3,
  )({
    ...{ class: 'text-lg font-medium text-white mb-4' },
  });
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_106 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Contact Type',
      forLabel: 'contactType',
    }),
  );
  const __VLS_107 = __VLS_106(
    {
      label: 'Contact Type',
      forLabel: 'contactType',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_106),
  );
  __VLS_108.slots.default;
  /** @type {[typeof BaseSelect, ]} */ // @ts-ignore
  const __VLS_109 = __VLS_asFunctionalComponent(
    BaseSelect,
    new BaseSelect({
      modelValue: __VLS_ctx.newContact.type,
      id: 'contactType',
      options: __VLS_ctx.contactTypeOptions,
      placeholder: 'Select contact type',
    }),
  );
  const __VLS_110 = __VLS_109(
    {
      modelValue: __VLS_ctx.newContact.type,
      id: 'contactType',
      options: __VLS_ctx.contactTypeOptions,
      placeholder: 'Select contact type',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_109),
  );
  var __VLS_108;
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_112 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Date & Time',
      forLabel: 'contactDate',
      ...{ class: 'mt-4' },
    }),
  );
  const __VLS_113 = __VLS_112(
    {
      label: 'Date & Time',
      forLabel: 'contactDate',
      ...{ class: 'mt-4' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_112),
  );
  __VLS_114.slots.default;
  /** @type {[typeof BaseInput, ]} */ // @ts-ignore
  const __VLS_115 = __VLS_asFunctionalComponent(
    BaseInput,
    new BaseInput({
      modelValue: __VLS_ctx.newContact.date,
      id: 'contactDate',
      type: 'datetime-local',
    }),
  );
  const __VLS_116 = __VLS_115(
    {
      modelValue: __VLS_ctx.newContact.date,
      id: 'contactDate',
      type: 'datetime-local',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_115),
  );
  var __VLS_114;
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_118 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Description',
      forLabel: 'contactDescription',
      ...{ class: 'mt-4' },
    }),
  );
  const __VLS_119 = __VLS_118(
    {
      label: 'Description',
      forLabel: 'contactDescription',
      ...{ class: 'mt-4' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_118),
  );
  __VLS_120.slots.default;
  /** @type {[typeof BaseTextarea, ]} */ // @ts-ignore
  const __VLS_121 = __VLS_asFunctionalComponent(
    BaseTextarea,
    new BaseTextarea({
      modelValue: __VLS_ctx.newContact.description,
      id: 'contactDescription',
      placeholder: 'Describe the interaction',
      rows: 3,
    }),
  );
  const __VLS_122 = __VLS_121(
    {
      modelValue: __VLS_ctx.newContact.description,
      id: 'contactDescription',
      placeholder: 'Describe the interaction',
      rows: 3,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_121),
  );
  var __VLS_120;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex justify-end gap-3 mt-6' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showContactModal) return;
        __VLS_ctx.showContactModal = false;
      },
    },
    type: 'button',
    ...{ class: 'btn-secondary' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{ onClick: __VLS_ctx.addContact },
    type: 'button',
    ...{ class: 'btn-primary' },
    disabled: !__VLS_ctx.newContact.type || !__VLS_ctx.newContact.description,
  });
}
if (__VLS_ctx.showTaskModal) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'fixed inset-0 flex items-center justify-center z-50' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showTaskModal) return;
        __VLS_ctx.showTaskModal = false;
      },
    },
    ...{ class: 'absolute inset-0 bg-black/50' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'bg-card rounded-lg p-6 w-full max-w-md relative z-10' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.h3,
    __VLS_intrinsicElements.h3,
  )({
    ...{ class: 'text-lg font-medium text-white mb-4' },
  });
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_124 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Task Title',
      forLabel: 'taskTitle',
    }),
  );
  const __VLS_125 = __VLS_124(
    {
      label: 'Task Title',
      forLabel: 'taskTitle',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_124),
  );
  __VLS_126.slots.default;
  /** @type {[typeof BaseInput, ]} */ // @ts-ignore
  const __VLS_127 = __VLS_asFunctionalComponent(
    BaseInput,
    new BaseInput({
      modelValue: __VLS_ctx.newTask.title,
      id: 'taskTitle',
      placeholder: 'Enter task title',
    }),
  );
  const __VLS_128 = __VLS_127(
    {
      modelValue: __VLS_ctx.newTask.title,
      id: 'taskTitle',
      placeholder: 'Enter task title',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_127),
  );
  var __VLS_126;
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_130 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Due Date',
      forLabel: 'taskDueDate',
      ...{ class: 'mt-4' },
    }),
  );
  const __VLS_131 = __VLS_130(
    {
      label: 'Due Date',
      forLabel: 'taskDueDate',
      ...{ class: 'mt-4' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_130),
  );
  __VLS_132.slots.default;
  /** @type {[typeof BaseInput, ]} */ // @ts-ignore
  const __VLS_133 = __VLS_asFunctionalComponent(
    BaseInput,
    new BaseInput({
      modelValue: __VLS_ctx.newTask.dueDate,
      id: 'taskDueDate',
      type: 'date',
    }),
  );
  const __VLS_134 = __VLS_133(
    {
      modelValue: __VLS_ctx.newTask.dueDate,
      id: 'taskDueDate',
      type: 'date',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_133),
  );
  var __VLS_132;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex justify-end gap-3 mt-6' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showTaskModal) return;
        __VLS_ctx.showTaskModal = false;
      },
    },
    type: 'button',
    ...{ class: 'btn-secondary' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{ onClick: __VLS_ctx.addTask },
    type: 'button',
    ...{ class: 'btn-primary' },
    disabled: !__VLS_ctx.newTask.title || !__VLS_ctx.newTask.dueDate,
  });
}
if (__VLS_ctx.showFileModal) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'fixed inset-0 flex items-center justify-center z-50' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showFileModal) return;
        __VLS_ctx.showFileModal = false;
      },
    },
    ...{ class: 'absolute inset-0 bg-black/50' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'bg-card rounded-lg p-6 w-full max-w-md relative z-10' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.h3,
    __VLS_intrinsicElements.h3,
  )({
    ...{ class: 'text-lg font-medium text-white mb-4' },
  });
  /** @type {[typeof BaseFileInput, ]} */ // @ts-ignore
  const __VLS_136 = __VLS_asFunctionalComponent(
    BaseFileInput,
    new BaseFileInput({
      ref: 'fileInputRef',
      modelValue: __VLS_ctx.fileUpload,
      name: 'file',
      multiple: false,
      autoUpload: false,
    }),
  );
  const __VLS_137 = __VLS_136(
    {
      ref: 'fileInputRef',
      modelValue: __VLS_ctx.fileUpload,
      name: 'file',
      multiple: false,
      autoUpload: false,
    },
    ...__VLS_functionalComponentArgsRest(__VLS_136),
  );
  /** @type {typeof __VLS_ctx.fileInputRef} */ var __VLS_139 = {};
  var __VLS_138;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex justify-end gap-3 mt-6' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showFileModal) return;
        __VLS_ctx.showFileModal = false;
      },
    },
    type: 'button',
    ...{ class: 'btn-secondary' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{ onClick: __VLS_ctx.uploadFile },
    type: 'button',
    ...{ class: 'btn-primary' },
    disabled: !__VLS_ctx.fileUpload,
  });
}
/** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ /** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ /** @type {__VLS_StyleScopedClasses['gap-6']} */ /** @type {__VLS_StyleScopedClasses['lg:col-span-2']} */ /** @type {__VLS_StyleScopedClasses['space-y-6']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['h-16']} */ /** @type {__VLS_StyleScopedClasses['w-16']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['bg-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-xl']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['ml-4']} */ /** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['px-2']} */ /** @type {__VLS_StyleScopedClasses['py-0.5']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['btn-outline']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['btn-danger']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ /** @type {__VLS_StyleScopedClasses['gap-y-4']} */ /** @type {__VLS_StyleScopedClasses['gap-x-6']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['ml-2']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['transition-colors']} */ /** @type {__VLS_StyleScopedClasses['p-1.5']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mt-4']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['mt-0.5']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mt-4']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ /** @type {__VLS_StyleScopedClasses['px-2']} */ /** @type {__VLS_StyleScopedClasses['py-0.5']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-white/60']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['py-8']} */ /** @type {__VLS_StyleScopedClasses['text-white/60']} */ /** @type {__VLS_StyleScopedClasses['text-4xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['mb-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['p-2.5']} */ /** @type {__VLS_StyleScopedClasses['mr-3']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['flex-1']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-white/80']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['py-4']} */ /** @type {__VLS_StyleScopedClasses['text-white/60']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-white/80']} */ /** @type {__VLS_StyleScopedClasses['pt-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['space-y-6']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['btn-outline']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['h-auto']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['btn-outline']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['h-auto']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['btn-outline']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['h-auto']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['btn-outline']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['h-auto']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mr-2']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['py-8']} */ /** @type {__VLS_StyleScopedClasses['text-white/60']} */ /** @type {__VLS_StyleScopedClasses['text-4xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['mb-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['space-y-3']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['mr-3']} */ /** @type {__VLS_StyleScopedClasses['w-4']} */ /** @type {__VLS_StyleScopedClasses['h-4']} */ /** @type {__VLS_StyleScopedClasses['rounded-sm']} */ /** @type {__VLS_StyleScopedClasses['bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['border-white/30']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['focus:ring-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['flex-1']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['text-white/50']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-danger']} */ /** @type {__VLS_StyleScopedClasses['p-1']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-semibold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['py-8']} */ /** @type {__VLS_StyleScopedClasses['text-white/60']} */ /** @type {__VLS_StyleScopedClasses['text-4xl']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['mb-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['space-y-2']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['mr-3']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['text-xl']} */ /** @type {__VLS_StyleScopedClasses['flex-1']} */ /** @type {__VLS_StyleScopedClasses['min-w-0']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['truncate']} */ /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-1']} */ /** @type {__VLS_StyleScopedClasses['text-white/70']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['p-1.5']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['text-white/70']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['p-1.5']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['text-white/70']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-danger']} */ /** @type {__VLS_StyleScopedClasses['p-1.5']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ /** @type {__VLS_StyleScopedClasses['bg-white/5']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-white/10']} */ /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['bg-black/50']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['max-w-md']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['z-10']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['mt-4']} */ /** @type {__VLS_StyleScopedClasses['mt-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['mt-6']} */ /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['bg-black/50']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['max-w-md']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['z-10']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['mt-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['mt-6']} */ /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['bg-black/50']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['max-w-md']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['z-10']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['mt-6']} */ /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ // @ts-ignore
var __VLS_140 = __VLS_139;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Icon: Icon,
      FormControl: FormControl,
      BaseInput: BaseInput,
      BaseTextarea: BaseTextarea,
      BaseSelect: BaseSelect,
      BaseFileInput: BaseFileInput,
      fileInputRef: fileInputRef,
      lead: lead,
      contactHistory: contactHistory,
      comments: comments,
      tasks: tasks,
      files: files,
      newComment: newComment,
      fileUpload: fileUpload,
      showContactModal: showContactModal,
      showTaskModal: showTaskModal,
      showFileModal: showFileModal,
      newContact: newContact,
      newTask: newTask,
      statusClasses: statusClasses,
      contactTypeOptions: contactTypeOptions,
      formatDate: formatDate,
      formatDateTime: formatDateTime,
      formatSource: formatSource,
      formatStatus: formatStatus,
      formatFileSize: formatFileSize,
      getInitials: getInitials,
      getContactTypeLabel: getContactTypeLabel,
      getContactTypeIcon: getContactTypeIcon,
      getContactTypeClass: getContactTypeClass,
      getTaskDueClass: getTaskDueClass,
      getFileIcon: getFileIcon,
      editLead: editLead,
      confirmDelete: confirmDelete,
      openWhatsApp: openWhatsApp,
      sendEmail: sendEmail,
      openNewContactModal: openNewContactModal,
      openTaskModal: openTaskModal,
      openFileUploader: openFileUploader,
      addComment: addComment,
      addContact: addContact,
      addTask: addTask,
      toggleTaskStatus: toggleTaskStatus,
      deleteTask: deleteTask,
      uploadFile: uploadFile,
      viewFile: viewFile,
      downloadFile: downloadFile,
      deleteFile: deleteFile,
    };
  },
  __typeProps: {},
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
}); /* PartiallyEnd: #4569/main.vue */
