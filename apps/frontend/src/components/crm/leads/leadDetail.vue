<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column - Lead Information -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Lead Header -->
      <div class="bg-surface rounded-lg p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <div
              class="h-16 w-16 rounded-full bg-zayit-blue flex items-center justify-center text-white text-xl font-semibold"
            >
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
                <span class="text-sm">Criado {{ formatDate(lead.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <DefaultButton variant="info" size="md" @click="editLead">
              <Icon icon="mdi:pencil" class="mr-1" />
              Editar
            </DefaultButton>
            <DefaultButton variant="danger" size="md" @click="confirmDelete">
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
                class="ml-2 text-green-700 cursor-pointer bg-green-400 hover:bg-white/10 transition-colors p-1.5 rounded-full"
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
            <span class="text-white">{{ lead.address || 'Nenhum Endereço' }}</span>
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

          <div v-for="comment in comments" :key="comment.id" class="bg-card rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div class="font-medium text-white">{{ comment.userName || 'User' }}</div>
              <div class="text-sm text-gray-400">{{ formatDateTime(comment.createdAt) }}</div>
            </div>
            <p class="mt-1 text-white/80">{{ comment.text }}</p>
          </div>

          <div class="pt-4">
            <FormControl label="Add Comment">
              <BaseTextarea v-model="newComment" placeholder="Escreva um comentário..." :rows="3" />
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
          <button
            class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center"
          >
            <Icon icon="mdi:phone" class="mr-2 text-zayit-blue" />
            <span>Ligar</span>
          </button>

          <button
            class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center"
            @click="openWhatsApp(lead.phone)"
          >
            <Icon icon="mdi:whatsapp" class="mr-2 text-zayit-blue" />
            <span>WhatsApp</span>
          </button>

          <button
            class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center"
            @click="sendEmail"
          >
            <Icon icon="mdi:email" class="mr-2 text-zayit-blue" />
            <span>Email</span>
          </button>

          <button
            class="btn-outline hover:bg-black/60 transition-all duration-500 cursor-pointer rounded-lg p-3 h-auto text-left flex items-center"
            @click=""
          >
            <Icon icon="mdi:clipboard-check" class="mr-2 text-zayit-blue" />
            <span>Add Tarefa</span>
          </button>
        </div>
      </div>
      <!-- Tasks -->
      <Tasks :leadId="leadId" />
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLeadStore } from '@/stores/crm/lead';
import { useToast } from '@/composables/useToast';
import { useModal } from '@/composables/useModal';
import { Icon } from '@iconify/vue';
import type { Lead } from '@/types/client.types';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import LeadTags from './LeadTags.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ContactHistory from '../contacts/ContactHistory.vue';
import { formatDate, formatDateTime } from '@/utils/dateFormatter';
import { formatFileSize } from '@/utils/formatFiles';
import { formatStatus } from '@/utils/statusColors';
import Tasks from '@/components/crm/tasks/TaskList.vue';

const props = defineProps<{
  leadId: string;
}>();

const clientStore = useLeadStore();
const toast = useToast();
const modal = useModal();
const router = useRouter();

// Data
const lead = ref<Lead>({
  id: '',
  name: '',
  email: '',
  phone: '',
  status: 'lead',
  tags: [],
  created_at: '',
  updated_at: '',
});

const comments = ref<any[]>([]);

const files = ref<any[]>([]);

// Form states
const newComment = ref('');

// Status styling
const statusClasses = {
  lead: 'bg-zayit-info/20 text-zayit-info',
  opportunity: 'bg-zayit-warning/20 text-zayit-warning',
  client: 'bg-zayit-blue/20 text-zayit-blue',
  lost: 'bg-zayit-danger/20 text-zayit-danger',
};

// Load data
onMounted(async () => {
  if (!props.leadId) {
    toast.error('Lead ID is required');
    router.push({ name: 'LeadList' });
    return;
  }

  const result = await clientStore.fetchLeadById(props.leadId);
  if (result) {
    lead.value = result;
    // Load additional data
    await loadComments();
  } else {
    toast.error('Failed to load lead');
    router.push({ name: 'LeadList', params: { id: props.leadId } });
  }
});

function formatSource(source?: string) {
  if (!source) return 'Unknown';
  return source.charAt(0).toUpperCase() + source.slice(1);
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Action methods
function editLead() {
  router.push({ name: 'EditLead', params: { id: props.leadId } });
}
async function confirmDelete() {
  try {
    const confirmed = await modal.open(ConfirmModal, {
      title: 'Apagar Lead',
      props: {
        message: `Tem certeza que quer deletar ${lead.value.name}? Essa ação não pode ser desfeita.`,
      },
      size: 'sm',
    });

    if (confirmed) {
      const success = await clientStore.deleteLead(props.leadId);
      if (success) {
        toast.success(`Lead "${lead.value.name}" Apagado com Sucesso!`);
        router.push({ name: 'LeadList' });
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
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
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

  toast.success('Comentário Criado');
}
</script>
