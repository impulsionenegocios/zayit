<!-- src/components/kanban/EditCardModal.vue -->
<template>
  <BaseModal :title="'Editar Card'" size="xl">
    <div class="space-y-4 w-full">
      <!-- Título -->
      <div>
        <FormControl label="Titulo" :forLabel="form.title">
        <BaseInput
          v-model="form.title"
        />
        </FormControl>
      </div>

      <!-- Descrição -->
      <div>
        <FormControl label="Descrição" :forLabel="form.description">
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

      <!-- Tags -->
      <div>
        <FormControl label="Tags" forLabel="tags">
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="(tag, i) in form.tags"
            :key="i"
            class="bg-zayit-blue text-white text-xs px-2 py-1 rounded flex justify-center items-center gap-1"
          >
            {{ tag }}
            <Icon icon="material-symbols:close" class="bg-zayit-danger rounded-full mt-[2px] cursor-pointer" @click="form.tags.splice(i, 1)"/>
          </span>
        </div>
        <BaseInput
          v-model="newTag"
          placeholder="Adicionar tag e teclar Enter"
          @keydown.enter.prevent="addTag"
        />
        </FormControl>
      </div>

      <!-- Checklist -->
     <!-- Checklist -->
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

    <!-- Lista de tarefas -->
    <ul class="space-y-4">
      <li
        v-for="(item, index) in form.checklist"
        :key="item.id"
        class="flex items-center gap-2"
      >
        <BaseCheckbox v-model="item.done" />
        <span
          :class="[
            'flex-1 text-sm',
            item.done ? 'line-through text-gray-400' : 'text-white'
          ]"
        >
          {{ item.text }}
        </span>
        <button @click="form.checklist.splice(index, 1)">🗑️</button>
      </li>
    </ul>
  </div>

  <!-- Adicionar novo item -->
  <div v-if="isAddingItem" class="flex-col items-center gap-2 px-6">
    <BaseInput
      v-model="newChecklistItem"
      placeholder="Nova tarefa..."
      @keydown.enter.prevent="addChecklistItem"
    />
    <div class="flex gap-2 mt-2">
      <button class="bg-zayit-blue px-8 py-2 text-white cursor-pointer  rounded-3xl" @click="addChecklistItem">Salvar</button>
      <button class="bg-gray-800 px-8 py-2 text-white cursor-pointer  rounded-3xl" @click="isAddingItem = false">Cancelar</button>
    </div>
  </div>
  <button
    v-else
    class="text-xs text-white mt-4 bg-zayit-blue px-4 py-2 rounded cursor-pointer hover:bg-zayit-blue/80 transition-all duration-500"
    @click="isAddingItem = true"
  >
    + Adicionar item
  </button>
</div>

      <!-- Ações -->
      <div class="flex justify-end gap-2 pt-4">
        <button class="bg-gray-800 px-6 py-2 rounded-3xl text-white cursor-pointer transition-all duration-500 hover:bg-gray-900" @click="emit('close', false)">Cancelar</button>
        <button class="bg-zayit-blue px-6 py-2 rounded-3xl text-white cursor-pointer transition-all duration-500 hover:bg-zayit-blue/80" @click="emit('close', form)">Salvar</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import BaseModal from '@/components/ui/modals/BaseModal.vue';
import BaseInput from '../forms/BaseInput.vue';
import BaseTextarea from '../forms/BaseTextarea.vue';
import FormControl from '../forms/FormControl.vue';
import BaseCheckbox from '../forms/BaseCheckbox.vue';
import { Icon } from '@iconify/vue';
const emit = defineEmits<{
  (e: 'close', result?: any): void;
}>();

const props = defineProps<{
  card: {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
    checklist?: { id: string; text: string; done: boolean }[];
  };
}>();

const form = reactive({
  ...props.card,
  tags: [...(props.card.tags || [])],
  checklist: [...(props.card.checklist || [])],
});

const newTag = ref('');

function addTag() {
  const trimmed = newTag.value.trim();
  if (trimmed && !form.tags.includes(trimmed)) {
    form.tags.push(trimmed);
  }
  newTag.value = '';
}

const newChecklistItem = ref('');
const isAddingItem = ref(false);

const completedCount = computed(() => form.checklist.filter((i) => i.done).length);
const totalCount = computed(() => form.checklist.length);
const progressPercent = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
);

function addChecklistItem() {
  if (!newChecklistItem.value.trim()) return;
  form.checklist.push({
    id: crypto.randomUUID(),
    text: newChecklistItem.value.trim(),
    done: false,
  });
  newChecklistItem.value = '';
  isAddingItem.value = false;
}

</script>
