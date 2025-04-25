import { ref } from 'vue';
import { z } from 'zod';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import PrimaryButton from '@/components/ui/ActionButton.vue';
import { useZodForm } from '@/composables/forms/useZodForm';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const auth = useAuthStore();
const formError = ref(null);
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});
const { form, errors, validate } = useZodForm(loginSchema, {
  email: '',
  password: '',
});
const isSubmitting = ref(false);
const handleLogin = async () => {
  formError.value = null;
  if (!validate()) return;
  isSubmitting.value = true;
  try {
    await auth.login(form.email, form.password);
    router.push('/');
  } catch (err) {
    if (err instanceof Error) {
      formError.value = err.message;
    } else {
      formError.value = 'Erro desconhecido.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.section,
  __VLS_intrinsicElements.section,
)({
  ...{ class: 'bg-gray-900 min-h-screen flex items-center justify-center px-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'w-full sm:max-w-md bg-surface rounded-xl shadow-xl p-6 space-y-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-center' },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
  src: '@/assets/images/logo.png',
  ...{ class: 'h-16' },
  alt: 'Logo',
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h1,
  __VLS_intrinsicElements.h1,
)({
  ...{ class: 'text-2xl font-bold text-white text-center' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.form,
  __VLS_intrinsicElements.form,
)({
  ...{ onSubmit: __VLS_ctx.handleLogin },
  ...{ class: 'space-y-4' },
});
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'E-mail',
    for: 'email',
    error: __VLS_ctx.errors.email,
  }),
);
const __VLS_1 = __VLS_0(
  {
    label: 'E-mail',
    for: 'email',
    error: __VLS_ctx.errors.email,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_0),
);
__VLS_2.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    id: 'email',
    modelValue: __VLS_ctx.form.email,
    placeholder: 'email@empresa.com',
    type: 'email',
    autocomplete: 'current-email',
  }),
);
const __VLS_4 = __VLS_3(
  {
    id: 'email',
    modelValue: __VLS_ctx.form.email,
    placeholder: 'email@empresa.com',
    type: 'email',
    autocomplete: 'current-email',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_3),
);
var __VLS_2;
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Senha',
    for: 'password',
    error: __VLS_ctx.errors.password,
  }),
);
const __VLS_7 = __VLS_6(
  {
    label: 'Senha',
    for: 'password',
    error: __VLS_ctx.errors.password,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_6),
);
__VLS_8.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    id: 'password',
    modelValue: __VLS_ctx.form.password,
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'current-password',
  }),
);
const __VLS_10 = __VLS_9(
  {
    id: 'password',
    modelValue: __VLS_ctx.form.password,
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'current-password',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
var __VLS_8;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex items-center justify-between text-sm text-white/70' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.label,
  __VLS_intrinsicElements.label,
)({
  ...{ class: 'flex items-center gap-2' },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
  type: 'checkbox',
  ...{ class: 'accent-blue-500' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.a,
  __VLS_intrinsicElements.a,
)({
  href: '#',
  ...{ class: 'text-primary-500 hover:underline' },
});
if (__VLS_ctx.formError) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.p,
    __VLS_intrinsicElements.p,
  )({
    ...{ class: 'text-red-500 text-sm text-center' },
  });
  __VLS_ctx.formError;
}
/** @type {[typeof PrimaryButton, ]} */ // @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(
  PrimaryButton,
  new PrimaryButton({
    title: 'Fazer Login',
    ...{ class: 'w-full' },
    type: 'submit',
    loading: __VLS_ctx.isSubmitting,
    disabled: __VLS_ctx.isSubmitting,
  }),
);
const __VLS_13 = __VLS_12(
  {
    title: 'Fazer Login',
    ...{ class: 'w-full' },
    type: 'submit',
    loading: __VLS_ctx.isSubmitting,
    disabled: __VLS_ctx.isSubmitting,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_12),
);
/** @type {__VLS_StyleScopedClasses['bg-gray-900']} */ /** @type {__VLS_StyleScopedClasses['min-h-screen']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['sm:max-w-md']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ /** @type {__VLS_StyleScopedClasses['shadow-xl']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['space-y-6']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['h-16']} */ /** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-white/70']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['accent-blue-500']} */ /** @type {__VLS_StyleScopedClasses['text-primary-500']} */ /** @type {__VLS_StyleScopedClasses['hover:underline']} */ /** @type {__VLS_StyleScopedClasses['text-red-500']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      BaseInput: BaseInput,
      FormControl: FormControl,
      PrimaryButton: PrimaryButton,
      formError: formError,
      form: form,
      errors: errors,
      isSubmitting: isSubmitting,
      handleLogin: handleLogin,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
