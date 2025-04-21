<template>
  <BaseTable
    :items="roles"
    :perPage="10"
    @bulkDelete="handleBulkDelete"
    :loading="tableLoading"
    :columns="columns"
  >
    <template #actions="{ item }">
      <div class="flex gap-2">
        <button
          @click="editarRole(item as Roles)"
          class="btn-primary px-3 py-3 rounded-full text-white cursor-pointer"
          title="Editar role"
        >
          <Icon icon="mdi:pencil" />
        </button>
        <button
          @click="excluirRole(item as Roles)"
          class="btn-danger px-3 py-3 rounded-full text-white cursor-pointer"
          title="Excluir role"
        >
          <Icon icon="mdi:delete" />
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Roles } from '@/types';
import BaseTable from '@/components/layout/BaseTable.vue';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { Icon } from '@iconify/vue';
import { useRolesList } from '@/composables/roles/useRoleList';
import { useModalStore } from '@/stores/layout/modal';
import { deletarRole } from '@/services/rolesService';
import { useToast } from '@/composables/useToast';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';

const tableLoading = ref<boolean>(true);
const router = useRouter();
const modalStore = useModalStore();
const toast = useToast();
const { roles, carregando, fetchRoles } = useRolesList();

// Definição das colunas da tabela
const columns = [{ key: 'name', label: 'Nome' }];

// Função para exclusão em massa
const handleBulkDelete = (ids: (string | number)[]) => {
  if (!ids.length) return;

  modalStore
    .open({
      component: ConfirmModal,
      props: {
        title: 'Excluir Roles',
        message: `Tem certeza que deseja excluir ${ids.length} role(s)? Esta ação não pode ser desfeita.`,
      },
    })
    .then(async (confirmed) => {
      if (confirmed) {
        try {
          // Excluir cada role selecionado
          await Promise.all(ids.map((id) => deletarRole(id.toString())));
          toast.success(`${ids.length} role(s) excluído(s) com sucesso!`);
          // Recarregar a lista
          fetchRoles();
        } catch (error) {
          toast.error('Erro ao excluir roles.');
          console.error(error);
        }
      }
    });
};

// Função para editar role
const editarRole = (item: Roles) => {
  router.push({ name: 'EditarRole', params: { id: item.id } });
};

// Função para excluir role individual
const excluirRole = (item: Roles) => {
  modalStore
    .open({
      component: ConfirmModal,
      props: {
        title: 'Excluir Role',
        message: `Tem certeza que deseja excluir o role "${item.name}"? Esta ação não pode ser desfeita.`,
      },
    })
    .then(async (confirmed) => {
      if (confirmed) {
        try {
          await deletarRole(item.id);
          toast.success('Role excluído com sucesso!');
          // Recarregar a lista
          fetchRoles();
        } catch (error) {
          toast.error('Erro ao excluir role.');
          console.error(error);
        }
      }
    });
};

// Botão de ação para criar role
usePageActionButton(
  {
    title: 'Criar Role',
    variant: 'primary',
    onClick: () => {
      router.push({ name: 'AddRole' });
    },
    loading: false,
  },
  {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
  },
);

// Carregar dados ao montar o componente
onMounted(async () => {
  tableLoading.value = true;
  try {
    await fetchRoles();
  } catch (error) {
    console.error('Erro ao buscar roles:', error);
  } finally {
    tableLoading.value = false;
  }
});
</script>
