<!-- src/components/layout/BaseTable.vue -->
<template>
  <section class="p-3 sm:p-5">
    <div class="mx-auto">
      <div class="bg-card relative shadow-md sm:rounded-lg overflow-hidden">
        <!-- Header: Busca + Ações -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          <!-- Busca -->
          <div class="w-full md:w-1/2">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar..."
              class="w-full p-2 pl-10 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <!-- Ações em massa -->
          <div class="flex gap-2 items-center">
            <span v-if="selected.length" class="text-sm text-white">
              {{ selected.length }} selecionado(s)
            </span>
            <button
              v-if="selected.length"
              class="btn btn-danger"
              @click="$emit('bulkDelete', selected)"
            >
              Deletar Selecionados
            </button>
          </div>
        </div>

        <!-- Tabela -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-400">
            <thead class="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th class="px-4 py-3">
                  <!-- Checkbox do cabeçalho com BaseCheckbox -->
                  <BaseCheckbox
                    :modelValue="isAllSelected"
                    @update:modelValue="toggleAll"
                    class="accent-zayit-blue"
                  />
                </th>
                <th v-for="header in headers" :key="header.key" class="px-4 py-3">
                  <slot :name="'header:' + header.key">
                    {{ header.label }}
                  </slot>
                </th>
                <th class="px-4 py-3">
                  <span class="sr-only">Ações</span>
                </th>
              </tr>
            </thead>

            <!-- Loading (Skeleton Loader) -->
            <tbody v-if="loading">
              <tr v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse bg-gray-800">
                <td v-for="n in headers.length + 2" :key="n" class="px-4 py-3">
                  <div class="h-4 bg-gray-600 rounded w-full"></div>
                </td>
              </tr>
            </tbody>

            <!-- Conteúdo normal -->
            <tbody v-else>
              <tr
                v-for="item in paginaAtual"
                :key="item.id"
                class="border-b border-gray-700 hover:bg-gray-800"
              >
                <td class="px-4 py-3">
                  <!-- Checkbox da linha -->
                  <BaseCheckbox
                    :modelValue="selected.includes(item.id)"
                    :value="item.id"
                    @update:modelValue="(value) => toggleItem(value as boolean, item.id)"
                    class="accent-zayit-blue"
                  />
                </td>
                <td
                  v-for="header in headers"
                  :key="header.key"
                  class="px-4 py-3 text-white whitespace-nowrap"
                >
                  <slot :name="'cell:' + header.key" :item="item">
                    {{ item[header.key] }}
                  </slot>
                </td>
                <td class="px-4 py-3 flex justify-end">
                  <slot name="actions" :item="item">
                    <button class="text-gray-400 hover:text-white text-sm">...</button>
                  </slot>
                </td>
              </tr>
              <tr v-if="!paginaAtual.length">
                <td colspan="100%" class="px-4 py-6 text-center text-white text-sm">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginação integrada -->
        <div v-if="pages > 1" class="flex justify-end p-4 gap-2">
          <button class="btn" :disabled="pagina === 1" @click="pagina--">Anterior</button>
          <button class="btn" :disabled="pagina === pages" @click="pagina++">Próximo</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed } from 'vue';
import BaseCheckbox from '../ui/forms/BaseCheckbox.vue';

const props = defineProps<{
  items: T[];
  perPage?: number;
  loading?: boolean;
  columns?: { key: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'bulkDelete', ids: (string | number)[]): void;
}>();

// Busca e seleção
const search = ref('');
const selected = ref<(string | number)[]>([]);

// Gerando os cabeçalhos a partir da primeira linha ou usando os fornecidos via prop
const headers = computed(() => {
  if (props.columns) {
    return props.columns;
  }
  
  if (!props.items.length) return [];
  return Object.keys(props.items[0])
    .filter((key) => key !== 'id')
    .map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));
});

// Filtrando os itens conforme a busca
const filteredData = computed(() => {
  return props.items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.value.toLowerCase()),
  );
});

// Paginação
const pagina = ref(1);
const porPagina = computed(() => props.perPage ?? 10);
const inicio = computed(() => (pagina.value - 1) * porPagina.value);
const fim = computed(() => inicio.value + porPagina.value);
const paginaAtual = computed(() => filteredData.value.slice(inicio.value, fim.value));
const pages = computed(() => Math.ceil(filteredData.value.length / porPagina.value));

// Verifica se todos os itens da página estão selecionados
const isAllSelected = computed(
  () =>
    !!(
      paginaAtual.value.length &&
      paginaAtual.value.every((item) => selected.value.includes(item.id))
    ),
);

// Função para alternar a seleção de todos da página
function toggleAll(value: boolean | (string | number)[]) {
  // Se for array, converte para booleano (nesse caso deve ser um booleano mesmo, mas segurança)
  const newVal = typeof value === 'boolean' ? value : Boolean(value);
  if (newVal) {
    selected.value = paginaAtual.value.map((item) => item.id);
  } else {
    selected.value = [];
  }
}

// Função para alternar seleção de um item individual
function toggleItem(newVal: boolean, id: string | number) {
  if (newVal) {
    if (!selected.value.includes(id)) {
      selected.value.push(id);
    }
  } else {
    selected.value = selected.value.filter((item) => item !== id);
  }
}
</script>
