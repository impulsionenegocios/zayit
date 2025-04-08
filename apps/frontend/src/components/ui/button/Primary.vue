<template>
    <button class="px-8 py-3 min-w-36 rounded-3xl bg-linear-to-t from-[#bd8aff] from-20% to-zayit-blue">{{ title }}</button>
</template>
<script setup lang="ts">
const props = defineProps({
    title: String
})
</script>
<style scoped>

</style>