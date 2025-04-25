import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "h-screen flex w-full place-content-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "place-self-center place-content-center text-3xl flex flex-col" },
});
(__VLS_ctx.auth.user?.displayName);
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    ...{ class: "mt-4" },
    src: "https://i.pinimg.com/originals/ea/15/ad/ea15ad63ccc62fc94b077ad8761a7cc7.gif",
    alt: "Cachorro e menino rebolando",
});
/** @type {__VLS_StyleScopedClasses['h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['place-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['place-self-center']} */ ;
/** @type {__VLS_StyleScopedClasses['place-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            auth: auth,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
