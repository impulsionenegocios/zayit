<template>
    <!-- Adicionamos um wrapper para poder detectar clique fora -->
    <div class="combobox-wrapper">
      <Combobox v-model="model" :disabled="disabled">
        <div class="relative">
          <!-- Input -->
          <ComboboxInput
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            :displayValue="displayLabel"
            @change="onInputChange"
            @focus="openDropdown"
            @click="openDropdown"
            :placeholder="placeholder"
          />
    
          <!-- Options dropdown -->
          <ComboboxOptions
            v-show="isOpen"
            class="absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none"
          >
            <template v-if="filteredOptions.length">
              <ComboboxOption
                v-for="option in filteredOptions"
                :key="option.value"
                :value="option"
                class="px-4 py-2 cursor-pointer hover:bg-gray-700 text-white"
              >
                {{ option.label }}
              </ComboboxOption>
            </template>
            <div v-else class="px-4 py-2 text-sm text-white/60">
              Nenhuma opção encontrada
            </div>
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
  } from '@headlessui/vue'
  import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
  
  type Option = {
    label: string
    value: string | number
  }
  
  const props = defineProps<{
    modelValue: Option | null
    options: Option[]
    placeholder?: string
    disabled?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: Option | null): void
  }>()
  
  // Usamos um computed para criar proxy reativo para v-model
  const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })
  
  const query = ref('')
  const isOpen = ref(false)
  
  // Filtra as opções com base no query
  const filteredOptions = computed(() => {
    if (!query.value) return props.options
    return props.options.filter((o) =>
      o.label.toLowerCase().includes(query.value.toLowerCase())
    )
  })
  
  // displayLabel: recebe o item e retorna o label
  const displayLabel = (item: unknown) => {
    const option = item as Option | null
    return option?.label ?? ''
  }
  
  function onInputChange(event: Event) {
    query.value = (event.target as HTMLInputElement).value
  }
  
  function openDropdown() {
    isOpen.value = true
  }
  
  // Fecha o dropdown ao clicar fora do wrapper
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (!target.closest('.combobox-wrapper')) {
      isOpen.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  // Se o model mudar, atualiza o query
  watch(
    () => props.modelValue,
    (val) => {
      query.value = val?.label ?? ''
    },
    { immediate: true }
  )
  </script>
  