<!-- src/components/kanban/EditCardModal.vue -->
<template>
  <div class="relative">
    <!-- Modal principal de edição de card -->
    <BaseModal :title="null" size="xl">
      <div class="flex flex-row-reverse relative">
        <!-- Botão de abrir modal de tags -->
        <div class="absolute h-full w-36 -right-2 -bottom-6">
          <button
            class="bg-zayit-blue w-full rounded-3xl py-2 text-white cursor-pointer"
            @click="openTagModal"
          >
            Etiquetas
          </button>
        </div>

        <div class="space-y-4 w-full mr-40">
          <!-- Título -->
          <div>
            <KanbanBaseInput class="text-2xl" v-model="form.title" />
            <span class="text-gray-500">criado em {{ form.created_at }}</span>
          </div>

          <!-- Tags atuais do card -->
          <div class="flex flex-col gap-2 mb-2">
            <div>
              <span class="text-white font-medium">Etiquetas</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(tag, i) in form.tags"
                :key="tag.id"
                class="flex items-center gap-1 px-6 py-1 text-xs rounded"
                :style="{ backgroundColor: tag.color, color: 'white' }"
              >
                {{ tag.name }}
                <button class="ml-1" @click="removeTag(i)">✕</button>
              </span>
              <span v-if="form.tags.length === 0" class="text-gray-400 text-sm">
                Nenhuma etiqueta selecionada
              </span>
            </div>
          </div>

          <!-- Descrição -->
          <div class="mt-4">
            <FormControl label="Descrição" forLabel="description">
              <BaseTextarea
                v-model="form.description"
                placeholder="Escreva sua observação..."
                :rows="3"
                :maxlength="800"
                resize="vertical"
                autogrow
              />
            </FormControl>
          </div>

          <!-- Checklist e progresso -->
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-white block mb-1">Checklist</label>

              <!-- Barra de progresso -->
              <div class="w-full bg-gray-700 rounded h-2 overflow-hidden mb-2">
                <div
                  :class="[
                    'h-2 transition-all duration-300',
                    progressPercent === 100 ? 'bg-zayit-success' : 'bg-zayit-blue'
                  ]"
                  :style="{ width: progressPercent + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-400 mb-2">{{ progressPercent }}% completo</p>

              <!-- Itens -->
              <ul class="space-y-4">
                <li
                  v-for="(item, idx) in form.checklist"
                  :key="item.id"
                  class="flex items-center gap-2"
                >
                  <BaseCheckbox v-model="item.done" />
                  <span
                    :class="[item.done ? 'line-through text-gray-400' : 'text-white', 'flex-1']"
                  >
                    {{ item.text }}
                  </span>
                  <button @click="removeChecklistItem(idx)">🗑️</button>
                </li>
              </ul>
            </div>

            <!-- Adicionar item -->
            <div v-if="isAddingItem" class="flex flex-col gap-2">
              <KanbanBaseInput
                v-model="newChecklistItem"
                placeholder="Nova tarefa..."
                @keydown.enter.prevent="addChecklistItem"
              />
              <div class="flex gap-2">
                <button class="btn btn-sm btn-primary" @click="addChecklistItem">Salvar</button>
                <button class="btn btn-sm btn-secondary" @click="isAddingItem = false">
                  Cancelar
                </button>
              </div>
            </div>
            <button
              v-else
              class="text-xs text-white bg-zayit-blue px-4 py-2 rounded hover:bg-zayit-blue/80 transition"
              @click="isAddingItem = true"
            >
              + Adicionar item
            </button>
          </div>

          <!-- Ações finais -->
          <div class="flex justify-end gap-2 pt-4">
            <button class="btn btn-secondary" @click="emit('close', false)">Cancelar</button>
            <button class="btn btn-primary" @click="emit('close', form)">Salvar</button>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de CRUD e seleção de etiquetas -->
    <BaseModal
      v-if="showTagModal"
      title="Gerenciar Etiquetas"
      size="md"
      class="!absolute -right-8 !bg-surface top-4 z-[99999] shadow-3xl"
      @close="showTagModal = false"
    >
      <div class="space-y-4">
        <!-- Componente de CRUD -->
        <TagsBoard :initial-tags="minhasEtiquetas" />

        <!-- Seleção de quais etiquetas aplicar ao card -->
        <div>
          <h4 class="text-white font-medium mb-2">Selecione as etiquetas</h4>
          <div class="max-h-48 overflow-y-auto flex flex-wrap gap-2">
            <label
              v-for="tag in allTags"
              :key="tag.id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="tag"
                v-model="selectedTags"
                class="form-checkbox"
              />
              <span
                class="px-2 py-0.5 text-xs rounded"
                :style="{ backgroundColor: tag.color, color: 'white' }"
              >
                {{ tag.name }}
              </span>
            </label>
            <p v-if="allTags.length === 0" class="text-gray-400 text-sm">
              Não há etiquetas cadastradas ainda
            </p>
          </div>
        </div>

        <button class="btn btn-primary w-full" @click="applyTagSelection">
          Aplicar
        </button>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import BaseModal from '@/components/ui/modals/BaseModal.vue'
import KanbanBaseInput from '@/components/ui/forms/kanban/KanbanBaseInput.vue'
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue'
import FormControl from '@/components/ui/forms/FormControl.vue'
import BaseCheckbox from '@/components/ui/forms/BaseCheckbox.vue'
import TagsBoard from '@/components/ui/kanban/TagsBoard.vue'

// Emitir close para o pai
const emit = defineEmits<{
  (e: 'close', result?: any): void
}>()

// Props do card
const props = defineProps<{
  card: {
    id: string
    title: string
    description?: string
    etiquetas?: { id: string; name: string; color: string }[]
    checklist?: { id: string; text: string; done: boolean }[]
    created_at?: string
  }
}>()

// Formulário reativo
const form = reactive({
  ...props.card,
  tags: [...(props.card.etiquetas || [])] as { id: string; name: string; color: string }[],
  checklist: [...(props.card.checklist || [])] as { id: string; text: string; done: boolean }[],
})

const minhasEtiquetas = ref([
  { id: '1', name: 'Urgente', color: '#F87171' },
  { id: '2', name: 'Planejamento', color: '#60A5FA' },
])
// Controle do modal de tags
const showTagModal = ref(false)
function openTagModal() {
  showTagModal.value = true
}

// Todas as tags do sistema + seleção temporária
const allTags = ref<{ id: string; name: string; color: string }[]>([
  ...(props.card.etiquetas || []),
])
const selectedTags = ref<typeof allTags.value>([...form.tags])

// Quando o TagsBoard atualiza (cria/edita/exclui), atualizo allTags e reseto seleção
function onTagsUpdated(tags: typeof allTags.value) {
  allTags.value = tags
  selectedTags.value = [...form.tags]
}

// Aplica seleção ao form e fecha modal
function applyTagSelection() {
  form.tags = [...selectedTags.value]
  console.log(form.tags)
  showTagModal.value = false
}

// Checklist / progresso
const newChecklistItem = ref('')
const isAddingItem = ref(false)
const completedCount = computed(() => form.checklist.filter((i) => i.done).length)
const totalCount = computed(() => form.checklist.length)
const progressPercent = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
)

function addChecklistItem() {
  if (!newChecklistItem.value.trim()) return
  form.checklist.push({
    id: crypto.randomUUID(),
    text: newChecklistItem.value.trim(),
    done: false,
  })
  newChecklistItem.value = ''
  isAddingItem.value = false
}

function removeChecklistItem(i: number) {
  form.checklist.splice(i, 1)
}

// Remover etiqueta diretamente no card
function removeTag(i: number) {
  form.tags.splice(i, 1)
}
</script>

<style scoped>
/* Qualquer ajuste de estilo extra aqui */
</style>
