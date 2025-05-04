import { ref, computed } from 'vue';
import type { Ref } from 'vue';

export function usePagination<T>(items: Ref<T[]>, itemsPerPage = 20) {
  const currentPage = ref(1);
  
  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.value.slice(startIndex, endIndex);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage);
  });
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  return {
    currentPage,
    paginatedItems,
    totalPages,
    goToPage,
    nextPage,
    prevPage
  };
}
