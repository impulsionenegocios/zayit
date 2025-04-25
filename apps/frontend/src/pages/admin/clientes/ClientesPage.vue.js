import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseTable from '@/components/layout/BaseTable.vue';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { Icon } from '@iconify/vue';
import { useClienteList } from '@/composables/clientes/useClienteList';
import { useModalStore } from '@/stores/layout/modal';
import { deletarCliente } from '@/services/clienteService';
import { useToast } from '@/composables/useToast';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
const tableLoading = ref(true);
const router = useRouter();
const modalStore = useModalStore();
const toast = useToast();
const { clientes, carregando, fetchClientes } = useClienteList();
// Definição das colunas da tabela
const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Função' },
];
// Função para exclusão em massa
const handleBulkDelete = (ids) => {
    if (!ids.length)
        return;
    modalStore
        .open({
        component: ConfirmModal,
        props: {
            title: 'Excluir Clientes',
            message: `Tem certeza que deseja excluir ${ids.length} cliente(s)? Esta ação não pode ser desfeita.`,
        },
    })
        .then(async (confirmed) => {
        if (confirmed) {
            try {
                // Excluir cada cliente selecionado
                await Promise.all(ids.map((id) => deletarCliente(id.toString())));
                toast.success(`${ids.length} cliente(s) excluído(s) com sucesso!`);
                // Recarregar a lista
                fetchClientes();
            }
            catch (error) {
                toast.error('Erro ao excluir clientes.');
                console.error(error);
            }
        }
    });
};
// Função para editar cliente
const editarCliente = (item) => {
    router.push({ name: 'EditarCliente', params: { id: item.id } });
};
// Função para excluir cliente individual
const excluirCliente = (item) => {
    modalStore
        .open({
        component: ConfirmModal,
        props: {
            title: 'Excluir Cliente',
            message: `Tem certeza que deseja excluir o cliente "${item.name}"? Esta ação não pode ser desfeita.`,
        },
    })
        .then(async (confirmed) => {
        if (confirmed) {
            try {
                await deletarCliente(item.id);
                toast.success('Cliente excluído com sucesso!');
                // Recarregar a lista
                fetchClientes();
            }
            catch (error) {
                toast.error('Erro ao excluir cliente.');
                console.error(error);
            }
        }
    });
};
// Botão de ação para criar cliente
usePageActionButton({
    title: 'Criar Cliente',
    variant: 'primary',
    onClick: () => {
        router.push({ name: 'AddCliente' });
    },
    loading: false,
}, {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
});
// Carregar dados ao montar o componente
onMounted(async () => {
    tableLoading.value = true;
    try {
        await fetchClientes();
    }
    catch (error) {
        console.error('Erro ao buscar clientes:', error);
    }
    finally {
        tableLoading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    ...{ 'onBulkDelete': {} },
    items: (__VLS_ctx.clientes),
    perPage: (10),
    loading: (__VLS_ctx.tableLoading),
    columns: (__VLS_ctx.columns),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onBulkDelete': {} },
    items: (__VLS_ctx.clientes),
    perPage: (10),
    loading: (__VLS_ctx.tableLoading),
    columns: (__VLS_ctx.columns),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onBulkDelete: (__VLS_ctx.handleBulkDelete)
};
var __VLS_7 = {};
__VLS_2.slots.default;
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.editarCliente(item);
            } },
        ...{ class: "btn-primary px-3 py-3 rounded-full text-white cursor-pointer" },
        title: "Editar cliente",
    });
    const __VLS_8 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        icon: "mdi:pencil",
    }));
    const __VLS_10 = __VLS_9({
        icon: "mdi:pencil",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.excluirCliente(item);
            } },
        ...{ class: "btn-danger px-3 py-3 rounded-full text-white cursor-pointer" },
        title: "Excluir cliente",
    });
    const __VLS_12 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        icon: "mdi:delete",
    }));
    const __VLS_14 = __VLS_13({
        icon: "mdi:delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseTable: BaseTable,
            Icon: Icon,
            tableLoading: tableLoading,
            clientes: clientes,
            columns: columns,
            handleBulkDelete: handleBulkDelete,
            editarCliente: editarCliente,
            excluirCliente: excluirCliente,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
