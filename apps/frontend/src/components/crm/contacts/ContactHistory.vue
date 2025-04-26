// src/components/crm/contacts/ContactHistory.vue
<template>
  <div class="bg-surface rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-white">Histórico de Contatos</h2>
      <DefaultButton 
        variant="primary"
        size="md"
        @click="showContactModal = true"
      >
        <Icon icon="mdi:plus" class="mr-1" />
        Add Contato
      </DefaultButton>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading && !contacts.length" class="text-center py-8">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zayit-blue border-r-transparent"></div>
      <p class="mt-2 text-white/60">Carregando histórico...</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!contacts.length" class="text-center py-8 text-white/60">
      <Icon icon="mdi:history" class="text-4xl mx-auto mb-2" />
      <p>Sem Histórico de Contatos Ainda</p>
      <p class="text-sm">Grave sua primeira interação com esse lead</p>
    </div>
    
    <!-- Contact List -->
    <div v-else class="space-y-4">
      <div 
        v-for="contact in contacts" 
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

          <button 
            @click="confirmDeleteContact(contact.id)"
            title="Excluir registro"
            class="text-zayit-danger p-2 rounded-full hover:bg-white/10"
          >
            <Icon icon="mdi:delete" />
          </button>
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
            id="contactType" 
            :options="contactTypeOptions" 
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
            @click="handleAddContact"
            :disabled="!newContact.type || !newContact.description"
          >
            Salvar Contato
          </DefaultButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useContactHistory } from '@/composables/crm/useContactHistory';
import { useModal } from '@/composables/useModal';
import { CONTACT_TYPE_OPTIONS } from '@/constants/contactTypes';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

const props = defineProps<{
  leadId: string;
}>();

const modal = useModal();
const showContactModal = ref(false);

// Use our contact history composable
const {
  contacts,
  isLoading,
  newContact,
  loadContacts,
  addContact,
  deleteContact
} = useContactHistory(props.leadId);

// Contact type helpers
function getContactTypeLabel(type: string) {
  switch (type) {
    case 'call': return 'Ligação';
    case 'whatsapp': return 'Whatsapp';
    case 'email': return 'Email';
    default: return 'Contact';
  }
}

function getContactTypeIcon(type: string) {
  switch (type) {
    case 'call': return 'mdi:phone';
    case 'whatsapp': return 'mdi:whatsapp';
    case 'email': return 'mdi:email';
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

// Date formatting
function formatDateTime(date: string) {
  return new Date(date).toLocaleString('pt-BR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
}

// Add contact handler
async function handleAddContact() {
  const success = await addContact();
  if (success) {
    showContactModal.value = false;
  }
}

// Delete contact with confirmation
async function confirmDeleteContact(contactId: string) {
  try {
    const confirmed = await modal.open(ConfirmModal, {
      title: 'Delete Contact',
      props: {
        message: 'Are you sure you want to delete this contact record? This action cannot be undone.'
      },
      size: 'sm'
    });
    
    if (confirmed) {
      await deleteContact(contactId);
    }
  } catch (error) {
    console.error('Error in delete confirmation:', error);
  }
}

// Contact type options for the select dropdown
const contactTypeOptions = CONTACT_TYPE_OPTIONS;
</script>