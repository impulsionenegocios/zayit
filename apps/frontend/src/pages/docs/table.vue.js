import BaseTable from '@/components/layout/BaseTable.vue';
import DocBlock from '@/components/docs/DocBlock.vue';
import { Icon } from '@iconify/vue';
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
];
function editar(item) {
    alert(`Editando ${item.name}`);
}
function handleDelete(ids) {
    alert(`Deletar IDs: ${ids.join(', ')}`);
}
// Code blocks
const baseCode = `
  <BaseTable :items="produtos" :perPage="2" @bulkDelete="handleDelete">
    <template #actions="{ item }">
      <button @click="editar(item)">Editar</button>
    </template>
  </BaseTable>
  `.trim();
const cellSlotCode = `
  <BaseTable :items="produtos">
    <template #cell:price="{ item }">
      <span class="text-green-400 font-bold">{{ item.price }}</span>
    </template>
  </BaseTable>
  `.trim();
const headerSlotCode = `
  <BaseTable :items="produtos">
    <template #header:brand>
      <div class="flex items-center gap-2 text-white">
        <Icon icon="mdi:tag" class="w-4 h-4" />
        Marca
      </div>
    </template>
  </BaseTable>
  `.trim();
const loadingCode = `
  <BaseTable :items="produtos" :loading="true" />
  `.trim();
const avatarCellCode = `
  <BaseTable :items="produtos">
    <template #cell:name="{ item }">
      <div class="flex items-center gap-2">
        <img :src="item.avatar" class="w-8 h-8 rounded-full" />
        <span>{{ item.name }}</span>
      </div>
    </template>
  </BaseTable>
  `.trim();
const dropdownActionsCode = `
  <BaseTable :items="produtos">
    <template #actions="{ item }">
      <div class="relative">
        <button class="btn btn-sm">⋮</button>
      </div>
    </template>
  </BaseTable>
  `.trim();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "p-8 space-y-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl text-white font-bold" },
});
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Tabela básica com ações",
    description: "Tabela com seleção múltipla, busca, slots de ação por linha e botão de exclusão em massa.",
    code: (__VLS_ctx.baseCode),
}));
const __VLS_1 = __VLS_0({
    title: "Tabela básica com ações",
    description: "Tabela com seleção múltipla, busca, slots de ação por linha e botão de exclusão em massa.",
    code: (__VLS_ctx.baseCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    ...{ 'onBulkDelete': {} },
    items: (__VLS_ctx.produtos),
    perPage: (2),
}));
const __VLS_4 = __VLS_3({
    ...{ 'onBulkDelete': {} },
    items: (__VLS_ctx.produtos),
    perPage: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onBulkDelete: (__VLS_ctx.handleDelete)
};
__VLS_5.slots.default;
{
    const { actions: __VLS_thisSlot } = __VLS_5.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.editar(item);
            } },
        ...{ class: "btn btn-outline" },
    });
}
var __VLS_5;
var __VLS_2;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Slot por célula",
    description: "Customizando a coluna de preço usando o slot #cell:price.",
    code: (__VLS_ctx.cellSlotCode),
}));
const __VLS_11 = __VLS_10({
    title: "Slot por célula",
    description: "Customizando a coluna de preço usando o slot #cell:price.",
    code: (__VLS_ctx.cellSlotCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    items: (__VLS_ctx.produtos),
    perPage: (2),
}));
const __VLS_14 = __VLS_13({
    items: (__VLS_ctx.produtos),
    perPage: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
{
    const { 'cell:price': __VLS_thisSlot } = __VLS_15.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-green-400 font-bold" },
    });
    (item.price);
}
var __VLS_15;
var __VLS_12;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Slot por cabeçalho",
    description: "Customizando o título da coluna 'brand' com um ícone.",
    code: (__VLS_ctx.headerSlotCode),
}));
const __VLS_17 = __VLS_16({
    title: "Slot por cabeçalho",
    description: "Customizando o título da coluna 'brand' com um ícone.",
    code: (__VLS_ctx.headerSlotCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    items: (__VLS_ctx.produtos),
    perPage: (2),
}));
const __VLS_20 = __VLS_19({
    items: (__VLS_ctx.produtos),
    perPage: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
{
    const { 'header:brand': __VLS_thisSlot } = __VLS_21.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2 text-white" },
    });
    const __VLS_22 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        icon: "mdi:tag",
        ...{ class: "w-4 h-4" },
    }));
    const __VLS_24 = __VLS_23({
        icon: "mdi:tag",
        ...{ class: "w-4 h-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
}
var __VLS_21;
var __VLS_18;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Estado de loading",
    description: "Mostrando esqueleto de carregamento enquanto os dados são carregados.",
    code: (__VLS_ctx.loadingCode),
}));
const __VLS_27 = __VLS_26({
    title: "Estado de loading",
    description: "Mostrando esqueleto de carregamento enquanto os dados são carregados.",
    code: (__VLS_ctx.loadingCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
/** @type {[typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    items: (__VLS_ctx.produtos),
    loading: (true),
}));
const __VLS_30 = __VLS_29({
    items: (__VLS_ctx.produtos),
    loading: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_28;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Slot com avatar",
    description: "Renderizando uma célula com imagem + nome do produto.",
    code: (__VLS_ctx.avatarCellCode),
}));
const __VLS_33 = __VLS_32({
    title: "Slot com avatar",
    description: "Renderizando uma célula com imagem + nome do produto.",
    code: (__VLS_ctx.avatarCellCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    items: (__VLS_ctx.produtos),
}));
const __VLS_36 = __VLS_35({
    items: (__VLS_ctx.produtos),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
{
    const { 'cell:name': __VLS_thisSlot } = __VLS_37.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (item.avatar),
        ...{ class: "w-8 h-8 rounded-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.name);
}
var __VLS_37;
var __VLS_34;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Ações com dropdown",
    description: "Exibindo um menu suspenso com ações por linha.",
    code: (__VLS_ctx.dropdownActionsCode),
}));
const __VLS_39 = __VLS_38({
    title: "Ações com dropdown",
    description: "Exibindo um menu suspenso com ações por linha.",
    code: (__VLS_ctx.dropdownActionsCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    items: (__VLS_ctx.produtos),
}));
const __VLS_42 = __VLS_41({
    items: (__VLS_ctx.produtos),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { actions: __VLS_thisSlot } = __VLS_43.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ class: "btn btn-sm" },
    });
}
var __VLS_43;
var __VLS_40;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseTable: BaseTable,
            DocBlock: DocBlock,
            Icon: Icon,
            produtos: produtos,
            editar: editar,
            handleDelete: handleDelete,
            baseCode: baseCode,
            cellSlotCode: cellSlotCode,
            headerSlotCode: headerSlotCode,
            loadingCode: loadingCode,
            avatarCellCode: avatarCellCode,
            dropdownActionsCode: dropdownActionsCode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
