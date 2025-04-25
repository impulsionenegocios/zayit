import { useClienteForm } from '@/composables/clientes/useClienteForm';
import { ref } from 'vue';
const fileInputRef = ref();
// Componentes visuais
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
// Lógica do formulário
const { name, nameError, blurName, nameMeta, email, emailError, blurEmail, emailMeta, password, passwordError, blurPassword, passwordMeta, role, roleError, roleMeta, blurRole, logo, salvar, carregando, roles, voltar, } = useClienteForm(undefined, fileInputRef);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof FormSection, typeof FormSection, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FormSection, new FormSection({
    title: "Cadastrar Cliente",
    ...{ class: "px-8" },
}));
const __VLS_1 = __VLS_0({
    title: "Cadastrar Cliente",
    ...{ class: "px-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.salvar) },
});
/** @type {[typeof FormGrid, typeof FormGrid, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(FormGrid, new FormGrid({
    cols: ({ base: 1, md: 2 }),
    gap: (4),
}));
const __VLS_5 = __VLS_4({
    cols: ({ base: 1, md: 2 }),
    gap: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Nome do Cliente",
    forLabel: "name",
    error: (__VLS_ctx.nameError),
    touched: (__VLS_ctx.nameMeta.touched),
    valid: (__VLS_ctx.nameMeta.valid),
    showSuccess: (true),
}));
const __VLS_8 = __VLS_7({
    label: "Nome do Cliente",
    forLabel: "name",
    error: (__VLS_ctx.nameError),
    touched: (__VLS_ctx.nameMeta.touched),
    valid: (__VLS_ctx.nameMeta.valid),
    showSuccess: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.name),
    name: "name",
    id: "name",
    placeholder: "Digite o nome",
}));
const __VLS_11 = __VLS_10({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.name),
    name: "name",
    id: "name",
    placeholder: "Digite o nome",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onBlur: (__VLS_ctx.blurName)
};
var __VLS_12;
var __VLS_9;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Email do Cliente",
    forLabel: "email",
    error: (__VLS_ctx.emailError),
    touched: (__VLS_ctx.emailMeta.touched),
    valid: (__VLS_ctx.emailMeta.valid),
    showSuccess: (true),
}));
const __VLS_18 = __VLS_17({
    label: "Email do Cliente",
    forLabel: "email",
    error: (__VLS_ctx.emailError),
    touched: (__VLS_ctx.emailMeta.touched),
    valid: (__VLS_ctx.emailMeta.valid),
    showSuccess: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.email),
    name: "email",
    type: "email",
    id: "email",
    placeholder: "Digite o email",
}));
const __VLS_21 = __VLS_20({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.email),
    name: "email",
    type: "email",
    id: "email",
    placeholder: "Digite o email",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onBlur: (__VLS_ctx.blurEmail)
};
var __VLS_22;
var __VLS_19;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Senha do Cliente",
    forLabel: "password",
    error: (__VLS_ctx.passwordError),
    touched: (__VLS_ctx.passwordMeta.touched),
    valid: (__VLS_ctx.passwordMeta.valid),
    showSuccess: (true),
}));
const __VLS_28 = __VLS_27({
    label: "Senha do Cliente",
    forLabel: "password",
    error: (__VLS_ctx.passwordError),
    touched: (__VLS_ctx.passwordMeta.touched),
    valid: (__VLS_ctx.passwordMeta.valid),
    showSuccess: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.password),
    name: "password",
    type: "password",
    id: "password",
    placeholder: "Digite a senha",
}));
const __VLS_31 = __VLS_30({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.password),
    name: "password",
    type: "password",
    id: "password",
    placeholder: "Digite a senha",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onBlur: (__VLS_ctx.blurPassword)
};
var __VLS_32;
var __VLS_29;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Escolha a permissão",
    forLabel: "role",
    error: (__VLS_ctx.roleError),
    touched: (__VLS_ctx.roleMeta.touched),
    valid: (__VLS_ctx.roleMeta.valid),
    showSuccess: (true),
}));
const __VLS_38 = __VLS_37({
    label: "Escolha a permissão",
    forLabel: "role",
    error: (__VLS_ctx.roleError),
    touched: (__VLS_ctx.roleMeta.touched),
    valid: (__VLS_ctx.roleMeta.valid),
    showSuccess: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
/** @type {[typeof BaseSelect, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(BaseSelect, new BaseSelect({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.role),
    name: "role",
    options: (__VLS_ctx.roles),
    placeholder: "selecione uma role",
}));
const __VLS_41 = __VLS_40({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.role),
    name: "role",
    options: (__VLS_ctx.roles),
    placeholder: "selecione uma role",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
let __VLS_45;
const __VLS_46 = {
    onBlur: (__VLS_ctx.blurRole)
};
var __VLS_42;
var __VLS_39;
var __VLS_6;
/** @type {[typeof FormGrid, typeof FormGrid, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(FormGrid, new FormGrid({
    cols: (1),
}));
const __VLS_48 = __VLS_47({
    cols: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Logo",
}));
const __VLS_51 = __VLS_50({
    label: "Logo",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
/** @type {[typeof BaseFileInput, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(BaseFileInput, new BaseFileInput({
    ref: "fileInputRef",
    modelValue: (__VLS_ctx.logo),
    name: "logo",
    multiple: (false),
    autoUpload: (false),
    uploadUrl: "/uploads/avatar",
    uploadFieldName: "avatar",
}));
const __VLS_54 = __VLS_53({
    ref: "fileInputRef",
    modelValue: (__VLS_ctx.logo),
    name: "logo",
    multiple: (false),
    autoUpload: (false),
    uploadUrl: "/uploads/avatar",
    uploadFieldName: "avatar",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
/** @type {typeof __VLS_ctx.fileInputRef} */ ;
var __VLS_56 = {};
var __VLS_55;
var __VLS_52;
var __VLS_49;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end mt-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.voltar) },
    type: "button",
    ...{ class: "btn-default btn" },
    disabled: (__VLS_ctx.carregando),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn-success btn" },
    disabled: (__VLS_ctx.carregando),
});
if (__VLS_ctx.carregando) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-default']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
// @ts-ignore
var __VLS_57 = __VLS_56;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            fileInputRef: fileInputRef,
            FormSection: FormSection,
            FormGrid: FormGrid,
            FormControl: FormControl,
            BaseInput: BaseInput,
            BaseFileInput: BaseFileInput,
            BaseSelect: BaseSelect,
            name: name,
            nameError: nameError,
            blurName: blurName,
            nameMeta: nameMeta,
            email: email,
            emailError: emailError,
            blurEmail: blurEmail,
            emailMeta: emailMeta,
            password: password,
            passwordError: passwordError,
            blurPassword: blurPassword,
            passwordMeta: passwordMeta,
            role: role,
            roleError: roleError,
            roleMeta: roleMeta,
            blurRole: blurRole,
            logo: logo,
            salvar: salvar,
            carregando: carregando,
            roles: roles,
            voltar: voltar,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
