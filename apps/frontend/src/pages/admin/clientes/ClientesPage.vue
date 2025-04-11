<template>
  <section class="p-3 sm:p-5">
    <div class="mx-auto">
      <div class="bg-card relative shadow-md sm:rounded-lg overflow-hidden">
        <!-- Header: Busca + Ações -->
        <div
          class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
        >
          <!-- Search -->
          <div class="w-full md:w-1/2">
            <form class="flex items-center">
              <label for="simple-search" class="sr-only">Search</label>
              <div class="relative w-full">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search"
                  required
                />
              </div>
            </form>
          </div>

          <!-- Ações e Filtros -->
          <div
            class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3"
          >
            <!-- Dropdown: Ações -->
            <div class="relative">
              <button
                id="actionsDropdownButton"
                data-dropdown-toggle="actionsDropdown"
                class="flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg class="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
                Ações
              </button>
              <div
                id="actionsDropdown"
                class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a
                      href="#"
                      class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >Edição em Massa</a
                    >
                  </li>
                </ul>
                <div class="py-1">
                  <a
                    href="#"
                    class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Deletar Todos</a
                  >
                </div>
              </div>
            </div>

            <!-- Dropdown: Filtro -->
            <div class="relative">
              <button
                id="filterDropdownButton"
                data-dropdown-toggle="filterDropdown"
                class="flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg class="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clip-rule="evenodd"
                  />
                </svg>
                Filtro
                <svg class="ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
              <div
                id="filterDropdown"
                class="hidden z-10 w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
              >
                <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                  Escolha a Marca
                </h6>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-center">
                    <input
                      id="apple"
                      type="checkbox"
                      class="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="apple"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                      >Apple (56)</label
                    >
                  </li>
                  <!-- demais itens -->
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th class="px-4 py-3">Nome</th>
                <th class="px-4 py-3">Categoria</th>
                <th class="px-4 py-3">Marca</th>
                <th class="px-4 py-3">Descrição</th>
                <th class="px-4 py-3">Preço</th>
                <th class="px-4 py-3"><span class="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b dark:border-gray-700">
                <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Apple iMac 27"
                </td>
                <td class="px-4 py-3">PC</td>
                <td class="px-4 py-3">Apple</td>
                <td class="px-4 py-3">300</td>
                <td class="px-4 py-3">$2999</td>
                <td class="px-4 py-3 flex justify-end">
                  <!-- Ações do item -->
                  <div class="relative">
                    <button
                      id="itemActionsButton"
                      data-dropdown-toggle="itemActions"
                      class="p-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                    </button>
                    <div
                      id="itemActions"
                      class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                    >
                      <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Visualizar
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Editar
                          </a>
                        </li>
                      </ul>
                      <div class="py-1">
                        <a
                          href="#"
                          class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-white"
                        >
                          Deletar
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  












  <section>
    <FormControl label="Cliente" forLabel="cliente">
  <BaseCombobox
    v-model="selectedUser"
    :options="userOptions"
    placeholder="Selecione um cliente"
  />
</FormControl>


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
const form = ref()
const actionButton = useActionButton();

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
]
const selectedUser = ref(null)
</script>
