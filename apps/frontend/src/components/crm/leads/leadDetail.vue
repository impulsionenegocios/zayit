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
        <ContactHistory :crmId="crmId" :leadId="leadId" />
      </div>

      <!-- Comments -->
      <div class="bg-surface rounded-lg p-6">
        <CommentList :crmId="crmId" :leadId="leadId" />
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
            @click="addTask"
          >
            <Icon icon="mdi:clipboard-check" class="mr-2 text-zayit-blue" />
            <span>Add Tarefa</span>
          </button>
        </div>
      </div>
      <!-- Tasks -->
      <Tasks class="lg:pr-16 lg:pl-8 px-8 pb-8" :crmId="crmId" :leadId="leadId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLeadStore } from '@/stores/crm/lead';
import { useToast } from '@/composables/useToast';
import { useModal } from '@/composables/useModal';
import { Icon } from '@iconify/vue';
import * as crmService from '@/services/crm'; // Mantém o mesmo nome do serviço
import type { Lead } from '@/types/client.types';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import LeadTags from './LeadTags.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ContactHistory from '../contacts/ContactHistory.vue';
import { formatDate, formatDateTime } from '@/utils/dateFormatter';
import { formatStatus } from '@/utils/statusColors';
import Tasks from '@/components/crm/tasks/TaskList.vue';
import CommentList from '@/components/crm/comments/CommentList.vue';

const route = useRoute();
const leadId = route.params.leadId as string;

const router = useRouter();
const crmId = route.params.crmId as string;

const clientStore = useLeadStore();
const toast = useToast();
const modal = useModal();

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

// Status styling
const statusClasses = {
  lead: 'bg-zayit-info/20 text-zayit-info',
  opportunity: 'bg-zayit-warning/20 text-zayit-warning',
  client: 'bg-zayit-blue/20 text-zayit-blue',
  lost: 'bg-zayit-danger/20 text-zayit-danger',
};

// Load data
onMounted(async () => {
  if (!leadId || !crmId) {
    toast.error('Lead ou CRM ID ausente');
    router.push({ name: 'CRMLeadList', params: { crmId } });
    return;
  }

  const result = await clientStore.fetchLeadById(crmId, leadId);
  if (result) {
    lead.value = result;
    await loadComments();
  } else {
    toast.error('Falha ao carregar lead');
    router.push({ name: 'CRMLeadList', params: { crmId } });
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

// Actions
function editLead() {
  router.push({ name: 'CRMLeadEdit', params: { crmId, leadId: leadId } });
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
      const success = await clientStore.deleteLead(crmId, leadId);
      if (success) {
        toast.success(`Lead "${lead.value.name}" apagado com sucesso`);
        router.push({ name: 'CRMLeadList', params: { crmId } });
      } else {
        toast.error('Erro ao tentar apagar esse Lead');
      }
    }
  } catch (error) {
    console.error('Erro ao confirmar exclusão:', error);
  }
}

function openWhatsApp(phone: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}`, '_blank');
}

function sendEmail() {
  window.location.href = `mailto:${lead.value.email}`;
}

function addTask() {
  // Implementar abertura de modal para adicionar tarefa
  toast.info('Funcionalidade de adicionar tarefa será implementada');
  // Exemplo:
  // modal.open(TaskFormModal, {
  //   title: 'Nova Tarefa',
  //   props: { leadId, crmId },
  // });
}

async function loadComments() {
  try {
    const response = await crmService.getLeadComments(crmId, leadId);
    comments.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
    // Dados de exemplo como fallback
    comments.value = [
      {
        id: '1',
        leadId: leadId,
        userId: 'user1',
        userName: 'John Doe',
        text: 'Este lead veio do nosso webinar da semana passada.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}
</script>
