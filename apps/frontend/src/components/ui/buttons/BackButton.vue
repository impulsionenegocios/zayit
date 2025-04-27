<template>
  <button
    @click="goBack"
    class="flex items-center space-x-2 px-4 py-2 rounded-md bg-zayit-warning cursor-pointer hover:bg-zayit-warning/80 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zayit-blue"
    :aria-label="ariaLabel"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="text-sm font-medium">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  label?: string;
  ariaLabel?: string;
  route?: string;
  fallbackRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Back',
  ariaLabel: 'Go back to previous page',
  route: '',
  fallbackRoute: '/',
});

const router = useRouter();

const goBack = () => {
  if (window.history.length > 2) {
    router.go(-1);
  } else if (props.route) {
    router.push(props.route);
  } else {
    router.push(props.fallbackRoute);
  }
};
</script>
