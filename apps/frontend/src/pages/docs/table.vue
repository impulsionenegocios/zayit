<template>
    <section class="p-8 space-y-10">
      <h1 class="text-2xl text-white font-bold">📊 BaseTable - Tabela parruda</h1>
  
      <!-- Uso básico -->
      <DocBlock
        title="Tabela básica com ações"
        description="Tabela com seleção múltipla, busca, slots de ação por linha e botão de exclusão em massa."
        :code="baseCode"
      >
        <BaseTable :items="produtos" :perPage="2" @bulkDelete="handleDelete">
          <template #actions="{ item }">
            <button class="btn btn-outline" @click="editar(item)">Editar</button>
          </template>
        </BaseTable>
      </DocBlock>
  
      <!-- Slot por célula -->
      <DocBlock
        title="Slot por célula"
        description="Customizando a coluna de preço usando o slot #cell:price."
        :code="cellSlotCode"
      >
        <BaseTable :items="produtos" :perPage="2">
          <template #cell:price="{ item }">
            <span class="text-green-400 font-bold">{{ item.price }}</span>
          </template>
        </BaseTable>
      </DocBlock>
  
      <!-- Slot por cabeçalho -->
      <DocBlock
        title="Slot por cabeçalho"
        description="Customizando o título da coluna 'brand' com um ícone."
        :code="headerSlotCode"
      >
        <BaseTable :items="produtos" :perPage="2">
          <template #header:brand>
            <div class="flex items-center gap-2 text-white">
              <Icon icon="mdi:tag" class="w-4 h-4" />
              Marca
            </div>
          </template>
        </BaseTable>
      </DocBlock>
  
      <!-- Skeleton loading -->
      <DocBlock
        title="Estado de loading"
        description="Mostrando esqueleto de carregamento enquanto os dados são carregados."
        :code="loadingCode"
      >
        <BaseTable :items="produtos" :loading="true" />
      </DocBlock>
  
      <!-- Avatar personalizado -->
      <DocBlock
        title="Slot com avatar"
        description="Renderizando uma célula com imagem + nome do produto."
        :code="avatarCellCode"
      >
        <BaseTable :items="produtos">
          <template #cell:name="{ item }">
            <div class="flex items-center gap-3">
              <img :src="item.avatar" class="w-8 h-8 rounded-full" />
              <span>{{ item.name }}</span>
            </div>
          </template>
        </BaseTable>
      </DocBlock>
  
      <!-- Dropdown de ações -->
      <DocBlock
        title="Ações com dropdown"
        description="Exibindo um menu suspenso com ações por linha."
        :code="dropdownActionsCode"
      >
        <BaseTable :items="produtos">
          <template #actions="{ item }">
            <div class="relative">
              <button class="btn btn-sm">⋮</button>
              <!-- Aqui poderia ter um dropdown real -->
            </div>
          </template>
        </BaseTable>
      </DocBlock>
    </section>
  </template>
  
  <script setup lang="ts">
  import BaseTable from '@/components/layout/BaseTable.vue'
  import DocBlock from '@/components/docs/DocBlock.vue'
  import { Icon } from '@iconify/vue'
  
  const produtos = [
    {
      id: 1,
      name: 'iMac 27"',
      category: 'PC',
      brand: 'Apple',
      description: 'Alta performance',
      price: 'R$ 12.999',
      avatar: 'https://placehold.co/40x40',
    },
    {
      id: 2,
      name: 'Notebook XPS 13',
      category: 'Notebook',
      brand: 'Dell',
      description: 'Leve e potente',
      price: 'R$ 8.499',
      avatar: 'https://placehold.co/40x40',
    },
    {
      id: 3,
      name: 'Galaxy Tab S8',
      category: 'Tablet',
      brand: 'Samsung',
      description: 'Tablet premium',
      price: 'R$ 5.999',
      avatar: 'https://placehold.co/40x40',
    },
  ]
  
  function editar(item: any) {
    alert(`Editando ${item.name}`)
  }
  
  function handleDelete(ids: (string | number)[]) {
    alert(`Deletar IDs: ${ids.join(', ')}`)
  }
  
  // Code blocks
  const baseCode = `
  <BaseTable :items="produtos" :perPage="2" @bulkDelete="handleDelete">
    <template #actions="{ item }">
      <button @click="editar(item)">Editar</button>
    </template>
  </BaseTable>
  `.trim()
  
  const cellSlotCode = `
  <BaseTable :items="produtos">
    <template #cell:price="{ item }">
      <span class="text-green-400 font-bold">{{ item.price }}</span>
    </template>
  </BaseTable>
  `.trim()
  
  const headerSlotCode = `
  <BaseTable :items="produtos">
    <template #header:brand>
      <div class="flex items-center gap-2 text-white">
        <Icon icon="mdi:tag" class="w-4 h-4" />
        Marca
      </div>
    </template>
  </BaseTable>
  `.trim()
  
  const loadingCode = `
  <BaseTable :items="produtos" :loading="true" />
  `.trim()
  
  const avatarCellCode = `
  <BaseTable :items="produtos">
    <template #cell:name="{ item }">
      <div class="flex items-center gap-2">
        <img :src="item.avatar" class="w-8 h-8 rounded-full" />
        <span>{{ item.name }}</span>
      </div>
    </template>
  </BaseTable>
  `.trim()
  
  const dropdownActionsCode = `
  <BaseTable :items="produtos">
    <template #actions="{ item }">
      <div class="relative">
        <button class="btn btn-sm">⋮</button>
      </div>
    </template>
  </BaseTable>
  `.trim()
  </script>
  