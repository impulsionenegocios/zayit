<template>
  <section>
    <FormSection title="Demonstração Formulário" description="Descrição Formulário" class="px-8">
      <FormGrid cols="2" gap="4">
        <FormControl label="Base Input">
          <BaseInput
            v-model="selectedUser"
            :options="userOptions"
            placeholder="Selecione um cliente"
          />
        </FormControl>
        <FormControl label="Base Select">
          <BaseSelect
            v-model="selectedUser"
            :options="userOptions"
            placeholder="Selecione um cliente"
          />
        </FormControl>
        <FormControl label="Combo Box">
          <BaseCombobox
            v-model="selectedUser"
            :options="userOptions"
            placeholder="Selecione um cliente"
          />
        </FormControl>
        <FormControl label="Text area Box">
          <BaseTextarea
              v-model="text"
              placeholder="Digite sua observação..."
              :rows="3"
              :maxlength="300"
              resize="vertical"
              autogrow
            />
        </FormControl>
        <FormControl label="Aceitar termos" forLabel="termos" :error="errors">
          <BaseCheckbox v-model="bool" label="Li e aceito os termos de uso" />
        </FormControl>
        <FormControl label="Ativo" forLabel="ativo" :error="errors.ativo">
          <BaseSwitch v-model="bool" label="Status ativo" />
        </FormControl>
      </FormGrid>
      <FormControl label="Upload Manual no Submit" forLabel="avatar" :error="errors.avatar">
        <BaseFileInput
          v-model="form"
          :multiple="false"
          :auto-upload="false"
          :upload-url="'/uploads/avatar'"
          :upload-field-name="'avatar'"
        />
        </FormControl>
        <FormControl label="Upload imediato ao selecionar" forLabel="avatar" :error="errors.avatar">
          <BaseFileInput
            v-model="form"
            :auto-upload="true"
            :upload-url="'/uploads/temp'"
            :upload-field-name="'avatar'"
          />
        </FormControl>
    </FormSection>
  </section>
</template>
<script setup lang="ts">
import { ref, onUnmounted, h } from 'vue';
import { useActionButton } from '@/stores/layout/actionButton';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { Icon } from '@iconify/vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import FormSection from '@/components/ui/forms/FormSection.vue';
import BaseCombobox from '@/components/ui/forms/BaseCombobox.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue'
import BaseCheckbox from '@/components/ui/forms/BaseCheckbox.vue'
import BaseSwitch from '@/components/ui/forms/BaseSwitch.vue'
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue'

const form = ref();
const actionButton = useActionButton();
const text = ref('');
const bool = ref(false);
const errors = ref('');
usePageActionButton(
  {
    title: 'Adicionar Cliente',
    variant: 'primary',
    onClick: () => alert('clicou'),
    loading: false,
  },
  {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
  },
);
onUnmounted(() => {
  actionButton.component = null;
});

const userOptions = [
  { label: 'João Silva', value: 'joao' },
  { label: 'Maria Souza', value: 'maria' },
];
const selectedUser = ref(null);
</script>
