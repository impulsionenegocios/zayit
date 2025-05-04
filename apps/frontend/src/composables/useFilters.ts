import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export function useFilters<T>(items: Ref<T[]>, filterFn: (item: T, filters: any) => boolean) {
  const filters = ref({});
  
  const filteredItems = computed(() => {
    return items.value.filter(item => filterFn(item, filters.value));
  });
  
  const setFilter = (key: string, value: any) => {
    filters.value = {
      ...filters.value,
      [key]: value
    };
  };
  
  const resetFilters = () => {
    filters.value = {};
  };
  
  return {
    filters,
    filteredItems,
    setFilter,
    resetFilters
  };
}
