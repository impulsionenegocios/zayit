<template>
  <section class="p-8 space-y-10 bg-surface min-h-screen">
    <h1 class="text-2xl text-white font-bold">🧩 Campos de Formulário</h1>

    <FormGrid :cols="2" :gap="4">
      <DocBlock
        title="BaseInput"
        description="Campo de input básico para textos ou números."
        :code="baseInputCode"
      >
        <BaseInput v-model="nome" placeholder="Digite seu nome" />
      </DocBlock>

      <DocBlock
        title="BaseSelect"
        description="Select nativo com estilização."
        :code="baseSelectCode"
      >
        <BaseSelect v-model="usuario" :options="opcoes" placeholder="Selecione um usuário" />
      </DocBlock>

      <DocBlock
        title="BaseCombobox"
        description="Combobox com busca e opções filtráveis."
        :code="baseComboboxCode"
      >
        <BaseCombobox v-model="usuario" :options="opcoes" placeholder="Filtre um usuário..." />
      </DocBlock>

      <DocBlock
        title="BaseTextarea"
        description="Área de texto com autogrow e limite de caracteres."
        :code="baseTextareaCode"
      >
        <BaseTextarea
          v-model="observacao"
          placeholder="Escreva sua observação..."
          :rows="3"
          :maxlength="200"
          resize="vertical"
          autogrow
        />
      </DocBlock>

      <DocBlock
        title="BaseCheckbox"
        description="Caixa de seleção simples."
        :code="baseCheckboxCode"
      >
        <BaseCheckbox v-model="aceito" label="Aceito os termos de uso" />
      </DocBlock>

      <DocBlock
        title="BaseSwitch"
        description="Switch para toggle de estado."
        :code="baseSwitchCode"
      >
        <BaseSwitch v-model="ativo" label="Ativo" />
      </DocBlock>
    </FormGrid>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import BaseCombobox from '@/components/ui/forms/BaseCombobox.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseCheckbox from '@/components/ui/forms/BaseCheckbox.vue';
import BaseSwitch from '@/components/ui/forms/BaseSwitch.vue';
import DocBlock from '@/components/docs/DocBlock.vue';

const nome = ref('');
const usuario = ref(null);
const observacao = ref('');
const aceito = ref(false);
const ativo = ref(true);

const opcoes = [
  { label: 'João Silva', value: 'joao' },
  { label: 'Maria Souza', value: 'maria' },
];

const baseInputCode = '<BaseInput v-model="nome" placeholder="Digite seu nome" />';
const baseSelectCode =
  '<BaseSelect v-model="usuario" :options="opcoes" placeholder="Selecione um usuário" />';
const baseComboboxCode =
  '<BaseCombobox v-model="usuario" :options="opcoes" placeholder="Filtre um usuário..." />';
const baseTextareaCode =
  '<BaseTextarea v-model="observacao" :rows="3" :maxlength="200" autogrow />';
const baseCheckboxCode = '<BaseCheckbox v-model="aceito" label="Aceito os termos de uso" />';
const baseSwitchCode = '<BaseSwitch v-model="ativo" label="Ativo" />';
</script>
