<!-- src/components/crm/contacts/ContactHistory.vue -->
<template>
  <div class="bg-surface rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-white">Histórico de Contatos</h2>
      <DefaultButton variant="primary" size="md" @click="showContactModal = true">
        <Icon icon="mdi:plus" class="mr-1" />
        Add Contato
      </DefaultButton>
    </div>
    <!-- Contact List -->
    <ContactList :contacts="contacts" @delete="confirmDeleteContact" />
    <!-- Add Contact Modal -->
    <div v-if="showContactModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black/50" @click="showContactModal = false"></div>
      <ContactForm
          :show="showContactModal"
          :form="newContact"
          @submit="handleAddContact"
          @cancel="() => (showContactModal = false)"
        />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useContactHistory } from '@/composables/crm/useContactHistory';
import { useModal } from '@/composables/useModal';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import ContactForm from '@/components/crm/contacts/ContactForm.vue'; // <-- Importa o novo form
import ContactList from '@/components/crm/contacts/ContactList.vue';
const props = defineProps<{
  leadId: string;
}>();

const modal = useModal();
const showContactModal = ref(false);

const { contacts, isLoading, newContact, loadContacts, addContact, deleteContact } =
  useContactHistory(props.leadId);


async function handleAddContact() {
  const success = await addContact();
  if (success) {
    showContactModal.value = false;
  }
}

async function confirmDeleteContact(contactId: string) {
  try {
    const confirmed = await modal.open(ConfirmModal, {
      title: 'Deletar Contato',
      props: {
        message: 'Tem certeza que deseja deletar esse registro de contato?',
      },
      size: 'sm',
    });

    if (confirmed) {
      await deleteContact(contactId);
    }
  } catch (error) {
    console.error('Error confirming delete:', error);
  }
}
</script>
