import { ref } from 'vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import BaseCombobox from '@/components/ui/forms/BaseCombobox.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseCheckbox from '@/components/ui/forms/BaseCheckbox.vue';
import BaseSwitch from '@/components/ui/forms/BaseSwitch.vue';
import DocBlock from '@/components/docs/DocBlock.vue';
const nome = ref('');
const usuario = ref(null);
const observacao = ref('');
const aceito = ref(false);
const ativo = ref(true);
const opcoes = [
    { label: 'João Silva', value: 'joao' },
    { label: 'Maria Souza', value: 'maria' },
];
const baseInputCode = '<BaseInput v-model="nome" placeholder="Digite seu nome" />';
const baseSelectCode = '<BaseSelect v-model="usuario" :options="opcoes" placeholder="Selecione um usuário" />';
const baseComboboxCode = '<BaseCombobox v-model="usuario" :options="opcoes" placeholder="Filtre um usuário..." />';
const baseTextareaCode = '<BaseTextarea v-model="observacao" :rows="3" :maxlength="200" autogrow />';
const baseCheckboxCode = '<BaseCheckbox v-model="aceito" label="Aceito os termos de uso" />';
const baseSwitchCode = '<BaseSwitch v-model="ativo" label="Ativo" />';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "p-8 space-y-10 bg-surface min-h-screen" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl text-white font-bold" },
});
/** @type {[typeof FormGrid, typeof FormGrid, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FormGrid, new FormGrid({
    cols: "2",
    gap: "4",
}));
const __VLS_1 = __VLS_0({
    cols: "2",
    gap: "4",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "BaseInput",
    description: "Campo de input básico para textos ou números.",
    code: (__VLS_ctx.baseInputCode),
}));
const __VLS_4 = __VLS_3({
    title: "BaseInput",
    description: "Campo de input básico para textos ou números.",
    code: (__VLS_ctx.baseInputCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_5.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    modelValue: (__VLS_ctx.nome),
    placeholder: "Digite seu nome",
}));
const __VLS_7 = __VLS_6({
    modelValue: (__VLS_ctx.nome),
    placeholder: "Digite seu nome",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
var __VLS_5;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "BaseSelect",
    description: "Select nativo com estilização.",
    code: (__VLS_ctx.baseSelectCode),
}));
const __VLS_10 = __VLS_9({
    title: "BaseSelect",
    description: "Select nativo com estilização.",
    code: (__VLS_ctx.baseSelectCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
/** @type {[typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    modelValue: (__VLS_ctx.usuario),
    options: (__VLS_ctx.opcoes),
    placeholder: "Selecione um usuário",
}));
const __VLS_13 = __VLS_12({
    modelValue: (__VLS_ctx.usuario),
    options: (__VLS_ctx.opcoes),
    placeholder: "Selecione um usuário",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
var __VLS_11;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "BaseCombobox",
    description: "Combobox com busca e opções filtráveis.",
    code: (__VLS_ctx.baseComboboxCode),
}));
const __VLS_16 = __VLS_15({
    title: "BaseCombobox",
    description: "Combobox com busca e opções filtráveis.",
    code: (__VLS_ctx.baseComboboxCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
/** @type {[typeof BaseCombobox, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(BaseCombobox, new BaseCombobox({
    modelValue: (__VLS_ctx.usuario),
    options: (__VLS_ctx.opcoes),
    placeholder: "Filtre um usuário...",
}));
const __VLS_19 = __VLS_18({
    modelValue: (__VLS_ctx.usuario),
    options: (__VLS_ctx.opcoes),
    placeholder: "Filtre um usuário...",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_17;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "BaseTextarea",
    description: "Área de texto com autogrow e limite de caracteres.",
    code: (__VLS_ctx.baseTextareaCode),
}));
const __VLS_22 = __VLS_21({
    title: "BaseTextarea",
    description: "Área de texto com autogrow e limite de caracteres.",
    code: (__VLS_ctx.baseTextareaCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
/** @type {[typeof BaseTextarea, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(BaseTextarea, new BaseTextarea({
    modelValue: (__VLS_ctx.observacao),
    placeholder: "Escreva sua observação...",
    rows: (3),
    maxlength: (200),
    resize: "vertical",
    autogrow: true,
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.observacao),
    placeholder: "Escreva sua observação...",
    rows: (3),
    maxlength: (200),
    resize: "vertical",
    autogrow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_23;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "BaseCheckbox",
    description: "Caixa de seleção simples.",
    code: (__VLS_ctx.baseCheckboxCode),
}));
const __VLS_28 = __VLS_27({
    title: "BaseCheckbox",
    description: "Caixa de seleção simples.",
    code: (__VLS_ctx.baseCheckboxCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
/** @type {[typeof BaseCheckbox, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(BaseCheckbox, new BaseCheckbox({
    modelValue: (__VLS_ctx.aceito),
    label: "Aceito os termos de uso",
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.aceito),
    label: "Aceito os termos de uso",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_29;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "BaseSwitch",
    description: "Switch para toggle de estado.",
    code: (__VLS_ctx.baseSwitchCode),
}));
const __VLS_34 = __VLS_33({
    title: "BaseSwitch",
    description: "Switch para toggle de estado.",
    code: (__VLS_ctx.baseSwitchCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
/** @type {[typeof BaseSwitch, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(BaseSwitch, new BaseSwitch({
    modelValue: (__VLS_ctx.ativo),
    label: "Ativo",
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.ativo),
    label: "Ativo",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_35;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FormGrid: FormGrid,
            BaseInput: BaseInput,
            BaseSelect: BaseSelect,
            BaseCombobox: BaseCombobox,
            BaseTextarea: BaseTextarea,
            BaseCheckbox: BaseCheckbox,
            BaseSwitch: BaseSwitch,
            DocBlock: DocBlock,
            nome: nome,
            usuario: usuario,
            observacao: observacao,
            aceito: aceito,
            ativo: ativo,
            opcoes: opcoes,
            baseInputCode: baseInputCode,
            baseSelectCode: baseSelectCode,
            baseComboboxCode: baseComboboxCode,
            baseTextareaCode: baseTextareaCode,
            baseCheckboxCode: baseCheckboxCode,
            baseSwitchCode: baseSwitchCode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
