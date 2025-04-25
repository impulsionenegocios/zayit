import { ref, onUnmounted, h } from 'vue';
import { useActionButton } from '@/stores/layout/actionButton';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { Icon } from '@iconify/vue';
// Components
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseSwitch from '@/components/ui/forms/BaseSwitch.vue';
import DocBlock from '@/components/docs/DocBlock.vue';
// Form state
const nome = ref('');
const email = ref('');
const ativo = ref(true);
// Botão de ação (top bar)
const actionButton = useActionButton();
usePageActionButton({
    title: 'Salvar Cliente',
    variant: 'primary',
    onClick: () => alert('Salvando cliente...'),
    loading: false,
}, {
    icon: () => h(Icon, { icon: 'mdi:content-save' }),
});
onUnmounted(() => {
    actionButton.component = null;
});
// Códigos para exibição na doc
const layoutCode = `
  <FormSection title="Cadastro de Cliente" description="Formulário com grid dinâmico e componentes reutilizáveis.">
    <FormGrid :cols="{ base: 1, md: 2, xl: 3 }" :gap="4">
      <FormControl label="Nome completo" forLabel="nome">
        <BaseInput v-model="nome" id="nome" placeholder="Digite o nome" />
      </FormControl>
      <FormControl label="Email" forLabel="email">
        <BaseInput v-model="email" id="email" placeholder="exemplo@email.com" />
      </FormControl>
      <FormControl label="Status">
        <BaseSwitch v-model="ativo" label="Ativo" />
      </FormControl>
    </FormGrid>
  </FormSection>
  `.trim();
const actionCode = `
  usePageActionButton(
    {
      title: 'Salvar Cliente',
      variant: 'primary',
      onClick: () => alert('Salvando cliente...'),
      loading: false,
    },
    {
      icon: () => h(Icon, { icon: 'mdi:content-save' }),
    }
  )
  `.trim();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "p-8 space-y-10 bg-surface min-h-screen" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold text-white" },
});
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "FormSection + FormGrid + FormControl",
    description: "Exemplo de estrutura de formulário completa com grid e controles individuais.",
    code: (__VLS_ctx.layoutCode),
}));
const __VLS_1 = __VLS_0({
    title: "FormSection + FormGrid + FormControl",
    description: "Exemplo de estrutura de formulário completa com grid e controles individuais.",
    code: (__VLS_ctx.layoutCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof FormSection, typeof FormSection, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(FormSection, new FormSection({
    title: "Cadastro de Cliente",
    description: "Formulário com grid dinâmico e componentes reutilizáveis.",
}));
const __VLS_4 = __VLS_3({
    title: "Cadastro de Cliente",
    description: "Formulário com grid dinâmico e componentes reutilizáveis.",
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
/** @type {[typeof FormGrid, typeof FormGrid, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(FormGrid, new FormGrid({
    cols: ({ base: 1, md: 2, xl: 3 }),
    gap: (4),
}));
const __VLS_7 = __VLS_6({
    cols: ({ base: 1, md: 2, xl: 3 }),
    gap: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Nome completo",
    forLabel: "nome",
}));
const __VLS_10 = __VLS_9({
    label: "Nome completo",
    forLabel: "nome",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.nome),
    id: "nome",
    placeholder: "Digite o nome",
}));
const __VLS_13 = __VLS_12({
    modelValue: (__VLS_ctx.nome),
    id: "nome",
    placeholder: "Digite o nome",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
var __VLS_11;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Email",
    forLabel: "email",
}));
const __VLS_16 = __VLS_15({
    label: "Email",
    forLabel: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.email),
    id: "email",
    placeholder: "exemplo@email.com",
}));
const __VLS_19 = __VLS_18({
    modelValue: (__VLS_ctx.email),
    id: "email",
    placeholder: "exemplo@email.com",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_17;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Status",
}));
const __VLS_22 = __VLS_21({
    label: "Status",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
/** @type {[typeof BaseSwitch, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(BaseSwitch, new BaseSwitch({
    modelValue: (__VLS_ctx.ativo),
    label: "Ativo",
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.ativo),
    label: "Ativo",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_23;
var __VLS_8;
var __VLS_5;
var __VLS_2;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Botão de Ação com usePageActionButton",
    description: "Demonstração de como adicionar um botão de ação na barra superior da página.",
    code: (__VLS_ctx.actionCode),
}));
const __VLS_28 = __VLS_27({
    title: "Botão de Ação com usePageActionButton",
    description: "Demonstração de como adicionar um botão de ação na barra superior da página.",
    code: (__VLS_ctx.actionCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-sm text-white/60" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({});
var __VLS_29;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/60']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FormSection: FormSection,
            FormGrid: FormGrid,
            FormControl: FormControl,
            BaseInput: BaseInput,
            BaseSwitch: BaseSwitch,
            DocBlock: DocBlock,
            nome: nome,
            email: email,
            ativo: ativo,
            layoutCode: layoutCode,
            actionCode: actionCode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
