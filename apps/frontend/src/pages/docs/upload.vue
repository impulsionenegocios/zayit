<template>
  <section class="p-8 space-y-10 bg-surface min-h-screen">
    <h1 class="text-2xl text-white font-bold">📤 Upload de Arquivos</h1>

    <DocBlock
      title="Upload manual no submit"
      description="O envio só acontece quando você chamar manualmente `uploadAll()` ou submeter o formulário."
      :code="manualCode"
    >
      <BaseFileInput
        v-model="avatar"
        :multiple="false"
        :auto-upload="false"
        :upload-url="'/uploads/avatar'"
        :upload-field-name="'avatar'"
      />
    </DocBlock>

    <DocBlock
      title="Upload automático ao selecionar"
      description="Assim que a imagem for selecionada, ela será automaticamente compactada e enviada para o backend."
      :code="autoCode"
    >
      <BaseFileInput
        v-model="avatarTemp"
        :auto-upload="true"
        :upload-url="'/uploads/temp'"
        :upload-field-name="'avatar'"
      />
    </DocBlock>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
import DocBlock from '@/components/docs/DocBlock.vue';

const avatar = ref<File | null>(null);
const avatarTemp = ref<File | null>(null);

const manualCode = `<BaseFileInput
    v-model="avatar"
    :multiple="false"
    :auto-upload="false"
    :upload-url="'/uploads/avatar'"
    :upload-field-name="'avatar'"
  />`;

const autoCode = `<BaseFileInput
    v-model="avatarTemp"
    :auto-upload="true"
    :upload-url="'/uploads/temp'"
    :upload-field-name="'avatar'"
  />`;
</script>
