<template>
  <div class="flex items-center space-x-4">
    <!-- Original breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="inline-flex items-center justify-center mt-2"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          <template v-if="index === 0">
            <span class="inline-flex items-center text-sm font-medium text-gray-400">
              <template v-if="crumb.path" class="transition-all duration-500">
                <RouterLink
                  :to="crumb.path"
                  class="hover:text-zayit-blue transition-all duration-500"
                >
                  {{ crumb.label }}
                </RouterLink>
              </template>
              <template v-else>
                {{ crumb.label }}
              </template>
            </span>
          </template>

          <!-- Itens subsequentes -->
          <template v-else>
            <div class="flex items-center">
              <span class="text-gray-500">/</span>
              <template v-if="crumb.path">
                <RouterLink
                  :to="crumb.path"
                  class="ms-1 text-sm font-medium md:ms-2 text-gray-100 hover:text-white"
                >
                  {{ crumb.label }}
                </RouterLink>
              </template>
              <template v-else>
                <span class="ms-1 text-sm font-medium text-gray-100 md:ms-2">
                  {{ crumb.label }}
                </span>
              </template>
            </div>
          </template>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import BackButton from '@/components/ui/buttons/BackButton.vue'; // Update this path if needed

interface Breadcrumb {
  label: string;
  path: string | null;
  dynamic?: Record<string, string>;
}

const generateBreadcrumbs = (matched: any[]): Breadcrumb[] => {
  const filteredRoutes = matched.filter((r) => r.meta?.breadcrumb);
  if (filteredRoutes.length === 0) return [];

  return filteredRoutes.map((route, index) => {
    const label = route.meta.breadcrumb ?? route.name ?? 'Página';
    return {
      label: String(label),
      path: index === filteredRoutes.length - 1 ? null : route.path,
      dynamic: route.params,
    };
  });
};

const route = useRoute();

const breadcrumbs = computed<Breadcrumb[]>(() => {
  return generateBreadcrumbs(route.matched);
});
</script>
