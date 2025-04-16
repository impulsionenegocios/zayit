<template>
  <section class="p-8 space-y-10 bg-surface min-h-screen">
    <h1 class="text-2xl font-bold text-white">📐 Layout e Containers</h1>

    <!-- Bloco de formulário -->
    <DocBlock
      title="FormSection + FormGrid + FormControl"
      description="Exemplo de estrutura de formulário completa com grid e controles individuais."
      :code="layoutCode"
    >
      <FormSection
        title="Cadastro de Cliente"
        description="Formulário com grid dinâmico e componentes reutilizáveis."
      >
        <FormGrid :cols="{ base: 1, md: 2, xl: 3 }" :gap="4">
          <FormControl label="Nome completo" forLabel="nome">
            <BaseInput v-model="nome" id="nome" placeholder="Digite o nome" />
          </FormControl>
          <FormControl label="Email" forLabel="email">
            <BaseInput v-model="email" id="email" placeholder="exemplo@email.com" />
          </FormControl>
          <FormControl label="Status">
            <BaseSwitch v-model="ativo" label="Ativo" />
          </FormControl>
        </FormGrid>
      </FormSection>
    </DocBlock>

    <!-- Bloco de ação -->
    <DocBlock
      title="Botão de Ação com usePageActionButton"
      description="Demonstração de como adicionar um botão de ação na barra superior da página."
      :code="actionCode"
    >
      <div class="text-sm text-white/60">
        Veja o botão “Salvar Cliente” na barra superior (via <code>usePageActionButton</code>).
      </div>
    </DocBlock>
  </section>
</template>

<script setup lang="ts">
import { ref, onUnmounted, h } from 'vue';
import { useActionButton } from '@/stores/layout/actionButton';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { Icon } from '@iconify/vue';

// Components
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseSwitch from '@/components/ui/forms/BaseSwitch.vue';
import DocBlock from '@/components/docs/DocBlock.vue';

// Form state
const nome = ref('');
const email = ref('');
const ativo = ref(true);

// Botão de ação (top bar)
const actionButton = useActionButton();
usePageActionButton(
  {
    title: 'Salvar Cliente',
    variant: 'primary',
    onClick: () => alert('Salvando cliente...'),
    loading: false,
  },
  {
    icon: () => h(Icon, { icon: 'mdi:content-save' }),
  },
);

onUnmounted(() => {
  actionButton.component = null;
});

// Códigos para exibição na doc
const layoutCode = `
  <FormSection title="Cadastro de Cliente" description="Formulário com grid dinâmico e componentes reutilizáveis.">
    <FormGrid :cols="{ base: 1, md: 2, xl: 3 }" :gap="4">
      <FormControl label="Nome completo" forLabel="nome">
        <BaseInput v-model="nome" id="nome" placeholder="Digite o nome" />
      </FormControl>
      <FormControl label="Email" forLabel="email">
        <BaseInput v-model="email" id="email" placeholder="exemplo@email.com" />
      </FormControl>
      <FormControl label="Status">
        <BaseSwitch v-model="ativo" label="Ativo" />
      </FormControl>
    </FormGrid>
  </FormSection>
  `.trim();

const actionCode = `
  usePageActionButton(
    {
      title: 'Salvar Cliente',
      variant: 'primary',
      onClick: () => alert('Salvando cliente...'),
      loading: false,
    },
    {
      icon: () => h(Icon, { icon: 'mdi:content-save' }),
    }
  )
  `.trim();
</script>
