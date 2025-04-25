import { ref, computed } from 'vue';
import BaseCheckbox from '../ui/forms/BaseCheckbox.vue';
export default (
  __VLS_props,
  __VLS_ctx,
  __VLS_expose,
  __VLS_setup = (async () => {
    const props = defineProps();
    const emit = defineEmits();
    // Busca e seleção
    const search = ref('');
    const selected = ref([]);
    // Gerando os cabeçalhos a partir da primeira linha ou usando os fornecidos via prop
    const headers = computed(() => {
      if (props.columns) {
        return props.columns;
      }
      if (!props.items.length) return [];
      return Object.keys(props.items[0])
        .filter((key) => key !== 'id')
        .map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }));
    });
    // Filtrando os itens conforme a busca
    const filteredData = computed(() => {
      if (!props.items) return [];
      return props.items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(search.value.toLowerCase()),
      );
    });
    // Paginação
    const pagina = ref(1);
    const porPagina = computed(() => props.perPage ?? 10);
    const inicio = computed(() => (pagina.value - 1) * porPagina.value);
    const fim = computed(() => inicio.value + porPagina.value);
    const paginaAtual = computed(() => filteredData.value.slice(inicio.value, fim.value));
    const pages = computed(() => Math.ceil(filteredData.value.length / porPagina.value));
    // Verifica se todos os itens da página estão selecionados
    const isAllSelected = computed(
      () =>
        !!(
          paginaAtual.value.length &&
          paginaAtual.value.every((item) => selected.value.includes(item.id))
        ),
    );
    // Função para alternar a seleção de todos da página
    function toggleAll(value) {
      // Se for array, converte para booleano (nesse caso deve ser um booleano mesmo, mas segurança)
      const newVal = typeof value === 'boolean' ? value : Boolean(value);
      if (newVal) {
        selected.value = paginaAtual.value.map((item) => item.id);
      } else {
        selected.value = [];
      }
    }
    // Função para alternar seleção de um item individual
    function toggleItem(newVal, id) {
      if (newVal) {
        if (!selected.value.includes(id)) {
          selected.value.push(id);
        }
      } else {
        selected.value = selected.value.filter((item) => item !== id);
      }
    }
    debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
    const __VLS_fnComponent = (await import('vue')).defineComponent({
      __typeEmits: {},
    });
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.section,
      __VLS_intrinsicElements.section,
    )({
      ...{ class: 'p-3 sm:p-5' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'mx-auto' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'bg-card relative shadow-md sm:rounded-lg overflow-hidden' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex flex-col md:flex-row items-center justify-between gap-4 p-4' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'w-full md:w-1/2' },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
      value: __VLS_ctx.search,
      type: 'text',
      placeholder: 'Buscar...',
      ...{
        class:
          'w-full p-2 pl-10 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400',
      },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex gap-2 items-center' },
    });
    if (__VLS_ctx.selected.length) {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.span,
        __VLS_intrinsicElements.span,
      )({
        ...{ class: 'text-sm text-white' },
      });
      __VLS_ctx.selected.length;
    }
    if (__VLS_ctx.selected.length) {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.button,
        __VLS_intrinsicElements.button,
      )({
        ...{
          onClick: (...[$event]) => {
            if (!__VLS_ctx.selected.length) return;
            __VLS_ctx.$emit('bulkDelete', __VLS_ctx.selected);
          },
        },
        ...{ class: 'btn btn-danger' },
      });
    }
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'overflow-x-auto' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.table,
      __VLS_intrinsicElements.table,
    )({
      ...{ class: 'w-full text-sm text-left text-gray-400' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.thead,
      __VLS_intrinsicElements.thead,
    )({
      ...{ class: 'text-xs uppercase bg-gray-700 text-gray-400' },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.th,
      __VLS_intrinsicElements.th,
    )({
      ...{ class: 'px-4 py-3' },
    });
    /** @type {[typeof BaseCheckbox, ]} */ // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(
      BaseCheckbox,
      new BaseCheckbox({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: __VLS_ctx.isAllSelected,
        ...{ class: 'accent-zayit-blue' },
      }),
    );
    const __VLS_1 = __VLS_0(
      {
        ...{ 'onUpdate:modelValue': {} },
        modelValue: __VLS_ctx.isAllSelected,
        ...{ class: 'accent-zayit-blue' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_0),
    );
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
      'onUpdate:modelValue': __VLS_ctx.toggleAll,
    };
    var __VLS_2;
    for (const [header] of __VLS_getVForSourceType(__VLS_ctx.headers)) {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.th,
        __VLS_intrinsicElements.th,
      )({
        key: header.key,
        ...{ class: 'px-4 py-3' },
      });
      var __VLS_7 = {};
      var __VLS_8 = __VLS_tryAsConstant('header:' + header.key);
      header.label;
    }
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.th,
      __VLS_intrinsicElements.th,
    )({
      ...{ class: 'px-4 py-3' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ class: 'sr-only' },
    });
    if (__VLS_ctx.loading) {
      __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
      for (const [i] of __VLS_getVForSourceType(5)) {
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.tr,
          __VLS_intrinsicElements.tr,
        )({
          key: 'skeleton-' + i,
          ...{ class: 'animate-pulse bg-gray-800' },
        });
        for (const [n] of __VLS_getVForSourceType(__VLS_ctx.headers.length + 2)) {
          __VLS_asFunctionalElement(
            __VLS_intrinsicElements.td,
            __VLS_intrinsicElements.td,
          )({
            key: n,
            ...{ class: 'px-4 py-3' },
          });
          __VLS_asFunctionalElement(
            __VLS_intrinsicElements.div,
            __VLS_intrinsicElements.div,
          )({
            ...{ class: 'h-4 bg-gray-600 rounded w-full' },
          });
        }
      }
    } else {
      __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
      for (const [item] of __VLS_getVForSourceType(__VLS_ctx.paginaAtual)) {
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.tr,
          __VLS_intrinsicElements.tr,
        )({
          key: item.id,
          ...{ class: 'border-b border-gray-700 hover:bg-gray-800' },
        });
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.td,
          __VLS_intrinsicElements.td,
        )({
          ...{ class: 'px-4 py-3' },
        });
        /** @type {[typeof BaseCheckbox, ]} */ // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent(
          BaseCheckbox,
          new BaseCheckbox({
            ...{ 'onUpdate:modelValue': {} },
            modelValue: __VLS_ctx.selected.includes(item.id),
            value: item.id,
            ...{ class: 'accent-zayit-blue' },
          }),
        );
        const __VLS_12 = __VLS_11(
          {
            ...{ 'onUpdate:modelValue': {} },
            modelValue: __VLS_ctx.selected.includes(item.id),
            value: item.id,
            ...{ class: 'accent-zayit-blue' },
          },
          ...__VLS_functionalComponentArgsRest(__VLS_11),
        );
        let __VLS_14;
        let __VLS_15;
        let __VLS_16;
        const __VLS_17 = {
          'onUpdate:modelValue': (value) => __VLS_ctx.toggleItem(value, item.id),
        };
        var __VLS_13;
        for (const [header] of __VLS_getVForSourceType(__VLS_ctx.headers)) {
          __VLS_asFunctionalElement(
            __VLS_intrinsicElements.td,
            __VLS_intrinsicElements.td,
          )({
            key: header.key,
            ...{ class: 'px-4 py-3 text-white whitespace-nowrap' },
          });
          var __VLS_18 = {
            item: item,
          };
          var __VLS_19 = __VLS_tryAsConstant('cell:' + header.key);
          item[header.key];
        }
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.td,
          __VLS_intrinsicElements.td,
        )({
          ...{ class: 'px-4 py-3 flex justify-end' },
        });
        var __VLS_22 = {
          item: item,
        };
      }
      if (!__VLS_ctx.paginaAtual.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(
          __VLS_intrinsicElements.td,
          __VLS_intrinsicElements.td,
        )({
          colspan: '100%',
          ...{ class: 'px-4 py-6 text-center text-white text-sm' },
        });
      }
    }
    if (__VLS_ctx.pages > 1) {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.div,
        __VLS_intrinsicElements.div,
      )({
        ...{ class: 'flex justify-end p-4 gap-2' },
      });
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.button,
        __VLS_intrinsicElements.button,
      )({
        ...{
          onClick: (...[$event]) => {
            if (!(__VLS_ctx.pages > 1)) return;
            __VLS_ctx.pagina--;
          },
        },
        ...{ class: 'btn' },
        disabled: __VLS_ctx.pagina === 1,
      });
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.button,
        __VLS_intrinsicElements.button,
      )({
        ...{
          onClick: (...[$event]) => {
            if (!(__VLS_ctx.pages > 1)) return;
            __VLS_ctx.pagina++;
          },
        },
        ...{ class: 'btn' },
        disabled: __VLS_ctx.pagina === __VLS_ctx.pages,
      });
    }
    /** @type {__VLS_StyleScopedClasses['p-3']} */ /** @type {__VLS_StyleScopedClasses['sm:p-5']} */ /** @type {__VLS_StyleScopedClasses['mx-auto']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['shadow-md']} */ /** @type {__VLS_StyleScopedClasses['sm:rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-col']} */ /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['md:w-1/2']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['pl-10']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-700']} */ /** @type {__VLS_StyleScopedClasses['border-gray-600']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['placeholder-gray-400']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-danger']} */ /** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['uppercase']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-700']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['accent-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['sr-only']} */ /** @type {__VLS_StyleScopedClasses['animate-pulse']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-800']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['h-4']} */ /** @type {__VLS_StyleScopedClasses['bg-gray-600']} */ /** @type {__VLS_StyleScopedClasses['rounded']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['border-b']} */ /** @type {__VLS_StyleScopedClasses['border-gray-700']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-gray-800']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['accent-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-3']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-6']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn']} */ // @ts-ignore
    var __VLS_9 = __VLS_8,
      __VLS_10 = __VLS_7,
      __VLS_20 = __VLS_19,
      __VLS_21 = __VLS_18,
      __VLS_23 = __VLS_22;
    var __VLS_dollars;
    const __VLS_self = (await import('vue')).defineComponent({
      setup() {
        return {
          BaseCheckbox: BaseCheckbox,
          search: search,
          selected: selected,
          headers: headers,
          pagina: pagina,
          paginaAtual: paginaAtual,
          pages: pages,
          isAllSelected: isAllSelected,
          toggleAll: toggleAll,
          toggleItem: toggleItem,
        };
      },
      __typeEmits: {},
      __typeProps: {},
    });
    return {};
  })(),
) => ({}); /* PartiallyEnd: #4569/main.vue */
