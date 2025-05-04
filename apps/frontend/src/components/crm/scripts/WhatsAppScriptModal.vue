<template>
  <BaseModal
    title="Enviar Mensagem via WhatsApp"
    :persistent="false"
    size="md"
    @close="cancel"
  >
    <div class="space-y-4">
      <!-- Escolha entre script existente ou personalizado -->
      <div class="space-y-2">
        <div class="flex gap-3">
          <DefaultButton
            variant="default"
            size="md"
            :class="messageType === 'script' ? 'bg-zayit-blue text-white' : ''"
            @click="messageType = 'script'"
          >
            Usar Script
          </DefaultButton>
          <DefaultButton
            variant="default"
            size="md"
            :class="messageType === 'custom' ? 'bg-zayit-blue text-white' : ''"
            @click="messageType = 'custom'"
          >
            Mensagem Personalizada
          </DefaultButton>
        </div>
      </div>

      <!-- Script selector -->
      <div v-if="messageType === 'script'" class="space-y-3">
        <div v-if="loadingScripts" class="flex justify-center items-center p-4">
          <Icon icon="mdi:loading" class="animate-spin mr-2" />
          Carregando scripts...
        </div>
        
        <div v-else-if="scripts.length === 0" class="text-center text-white/60 p-4">
          Nenhum script disponível. Crie um script ou escolha uma mensagem personalizada.
        </div>
        
        <div v-else>
          <FormControl label="Selecione um Script" forLabel="script-select">
            <BaseSelect
              v-model="selectedScriptId"
              :options="scriptOptions"
              placeholder="Escolha um script..."
              id="script-select"
            />
          </FormControl>
        </div>
      </div>

      <!-- Custom message with placeholders -->
      <div v-if="messageType === 'custom'" class="space-y-3">
        <FormControl label="Mensagem Personalizada" forLabel="custom-message">
          <!-- Placeholder buttons -->
          <PlaceholderButtons textareaId="custom-message" />
          
          <!-- WhatsApp formatting tools -->
          <WhatsAppFormatter textareaId="custom-message" />
          
          <BaseTextarea
            v-model="customMessage"
            id="custom-message"
            placeholder="Digite sua mensagem..."
            :rows="5"
            :error="customMessageError"
          />
          
          <p v-if="customMessageError" class="text-xs text-red-500 mt-1">
            {{ customMessageError }}
          </p>
        </FormControl>
      </div>

      <!-- Preview section -->
      <div class="space-y-2">
        <h3 class="text-white font-medium">Preview:</h3>
        <div
          class="p-4 bg-card border border-white/10 rounded-lg min-h-[100px] text-white whatsapp-preview"
          v-html="messagePreview"
        >
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <DefaultButton variant="default" size="md" @click="cancel">
          Cancelar
        </DefaultButton>
        <DefaultButton
          variant="primary"
          size="md"
          @click="sendMessage"
          :disabled="!canSendMessage"
        >
          <Icon icon="mdi:whatsapp" class="mr-2" />
          Enviar via WhatsApp
        </DefaultButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useScriptStore } from '@/stores/crm/scriptStore';
import { replacePlaceholders, validatePlaceholders, formatWhatsAppPreview } from '@/utils/placeholderUtils';
import type { Lead, Tag } from '@/types';
import type { Script } from '@/types/script.types';
import BaseModal from '@/components/ui/modals/BaseModal.vue';
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import PlaceholderButtons from '@/components/ui/editors/PlaceholderButtons.vue';
import WhatsAppFormatter from '@/components/ui/editors/WhatsAppFormatter.vue';

const props = defineProps<{
  lead: Lead;
  tags: Tag[];
  crmId: string;
  phone?: string;
}>();

const emit = defineEmits<{
  (e: 'close', result: { sent: boolean }): void;
}>();

const scriptStore = useScriptStore();

// UI state
const messageType = ref<'script' | 'custom'>('script');
const selectedScriptId = ref<string | null>(null);
const customMessage = ref('');
const customMessageError = ref('');
const loadingScripts = ref(true);

// Scripts
const scripts = computed(() => scriptStore.sortedScripts);

// Script options for select
const scriptOptions = computed(() => {
  return scripts.value.map(script => ({
    value: script.id,
    label: script.name
  }));
});

// Selected script
const selectedScript = computed(() => {
  if (!selectedScriptId.value) return null;
  return scripts.value.find(script => script.id === selectedScriptId.value) || null;
});

// Message content (from script or custom)
const messageContent = computed(() => {
  if (messageType.value === 'script') {
    return selectedScript.value?.content || '';
  } else {
    return customMessage.value;
  }
});

// Preview with placeholders replaced and formatting applied
const messagePreview = computed(() => {
  // Get the message with placeholders replaced
  const replaced = replacePlaceholders(messageContent.value, props.lead, props.tags);
  // Format the preview with WhatsApp formatting applied
  return formatWhatsAppPreview(replaced);
});

// Can send message if there's content and it's valid
const canSendMessage = computed(() => {
  if (messageType.value === 'script') {
    return !!selectedScriptId.value;
  } else {
    return !!customMessage.value && !customMessageError.value;
  }
});

// Load scripts on mount
onMounted(async () => {
  loadingScripts.value = true;
  await scriptStore.fetchScripts(props.crmId);
  loadingScripts.value = false;
  
  // Select first script if available
  if (scripts.value.length > 0) {
    selectedScriptId.value = scripts.value[0].id;
  }
});

// Validate custom message when it changes
watch(customMessage, (newValue) => {
  const { isValid, error } = validatePlaceholders(newValue);
  customMessageError.value = isValid ? '' : (error || '');
});

// Send message
function sendMessage() {
  if (!canSendMessage.value) return;
  
  // Get the message with placeholders replaced
  const finalMessage = replacePlaceholders(messageContent.value, props.lead, props.tags);
  
  // Get the phone number, either from props or from lead
  const phone = props.phone || props.lead.phone;
  
  // Clean the phone number
  const cleanPhone = phone.replace(/\D/g, '');
  
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(finalMessage);
  
  // Open WhatsApp link
  window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  
  // Close the modal
  emit('close', { sent: true });
}

// Cancel
function cancel() {
  emit('close', { sent: false });
}
</script>
