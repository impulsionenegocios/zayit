<!-- src/components/kanban/TagsBoard.vue -->
<template>
    <div class="p-4 bg-surface rounded-lg shadow">
      <h3 class="text-xl font-bold mb-4">Gerenciar Etiquetas</h3>
  
      <!-- Lista de etiquetas -->
      <div class="mb-6">
        <ul>
          <li
            v-for="tag in tags"
            :key="tag.name"
            class="flex items-center justify-between mb-2 p-2 bg-gray-800 rounded"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: tag.color }"
              ></span>
              <span class="text-white">{{ tag.name }}</span>
            </div>
            <div class="flex gap-2">
              <button
                @click="startEdit(tag)"
                class="btn btn-sm btn-outline"
              >
                Editar
              </button>
              <button
                @click="(tag.name)"
                class="btn btn-sm btn-outline text-red-400 hover:text-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        </ul>
        <p v-if="tags.length === 0" class="text-gray-400 text-sm mt-2">
          Ainda não há etiquetas cadastradas.
        </p>
      </div>
  
      <!-- Formulário criar / editar -->
      <div class="space-y-2">
        <h4 class="font-medium text-white">
          {{ editingTag ? 'Editar Etiqueta' : 'Criar Nova Etiqueta' }}
        </h4>
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            v-model="tagName"
            placeholder="Nome da etiqueta"
            class="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-900 text-white"
          />
          <div class="flex gap-2">
            <button
              v-for="color in availableColors"
              :key="color"
              @click="selectColor(color)"
              class="w-6 h-6 rounded-full border-2"
              :class="selectedColor === color ? 'border-white' : 'border-transparent'"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="editingTag ? updateTag() : createTag()"
            class="btn btn-sm btn-primary flex-1"
          >
            {{ editingTag ? 'Salvar' : 'Criar' }}
          </button>
          <button
            v-if="editingTag"
            @click="cancelEdit"
            class="btn btn-sm btn-secondary flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  
  interface Tag {
    name: string
    color: string
  }
  
  // Props: recebe lista inicial
  const props = defineProps<{
    initialTags: Tag[]
  }>()
  
  // Emite lista sempre que muda
  const emit = defineEmits<{
    (e: 'tags-updated', tags: Tag[]): void
  }>()
  
  // Cores disponíveis
  const availableColors = [
    '#F87171',
    '#60A5FA',
    '#34D399',
    '#FBBF24',
    '#A78BFA',
    '#F472B6',
    '#FCD34D',
  ]
  
  // Estado local das tags
  const tags = ref<Tag[]>([])
  // Tag em edição (ou null se criando)
  const editingTag = ref<Tag | null>(null)
  // Novo nome e cor selecionada
  const newTagName = ref('')
  const selectedColor = ref(availableColors[0])
  
  // Computed para v-model unificado
  const tagName = computed<string>({
    get() {
      return editingTag.value ? editingTag.value.name : newTagName.value
    },
    set(val: string) {
      if (editingTag.value) {
        editingTag.value.name = val
      } else {
        newTagName.value = val
      }
    },
  })
  
  // Inicializa `tags` a partir da prop
  onMounted(() => {
    tags.value = props.initialTags.map(t => ({ ...t }))
    emit('tags-updated', tags.value)
  })
  
  // Seleciona cor (também atualiza cor no editingTag caso haja)
  function selectColor(color: string) {
    selectedColor.value = color
    if (editingTag.value) {
      editingTag.value.color = color
    }
  }
  
  // Inicia edição de uma tag existente
  function startEdit(tag: Tag) {
    editingTag.value = { ...tag }
    selectedColor.value = tag.color
  }
  
  // Cancela edição
  function cancelEdit() {
    editingTag.value = null
    newTagName.value = ''
    selectedColor.value = availableColors[0]
  }
  
  // Cria uma nova tag em memória
  function createTag() {
    const name = newTagName.value.trim()
    if (!name) return
    const tag: Tag = {
      name,
      color: selectedColor.value,
    }
    tags.value.push(tag)
    // limpa form
    newTagName.value = ''
    selectedColor.value = availableColors[0]
    emit('tags-updated', tags.value)
  }
  
  // Salva alterações na tag em edição
  function updateTag() {
    if (!editingTag.value) return
    const idx = tags.value.findIndex(t => t.name === editingTag.value!.name)
    if (idx === -1) return
    tags.value[idx] = { ...editingTag.value }
    cancelEdit()
    emit('tags-updated', tags.value)
  }
  

  </script>
  
  <style scoped>
  /* Ajustes adicionais, se necessário */
  </style>
  