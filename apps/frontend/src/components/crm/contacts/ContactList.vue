<!-- src/components/crm/contacts/ContactList.vue -->
<template>
    <div v-if="contacts.length" class="space-y-4">
      <div v-for="contact in contacts" :key="contact.id" class="bg-card rounded-lg p-4">
        <div class="flex items-start">
          <div class="rounded-full p-2.5 mr-3" :class="getContactTypeClass(contact.type)">
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
            @click="$emit('delete', contact.id)"
            title="Excluir registro"
            class="text-zayit-danger px-2 py-1 rounded-full hover:bg-white/10 cursor-pointer mr-2"
          >
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>
    </div>
  
    <div v-else class="text-center py-8 text-white/60">
      <Icon icon="mdi:history" class="text-4xl mx-auto mb-2" />
      <p>Sem Histórico de Contatos Ainda</p>
      <p class="text-sm">Grave sua primeira interação com esse lead</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import {getContactTypeLabel, getContactTypeIcon, getContactTypeClass } from '@/utils/contactUtils'
  import { formatDateTime } from '@/utils/dateFormatter'
  const props = defineProps<{
    contacts: Array<{
      id: string;
      type: string;
      description: string;
      date: string;
    }>;
  }>();
  
  const emit = defineEmits(['delete']);
  </script>
  