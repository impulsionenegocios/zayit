<template>
    <nav class="text-sm flex gap-2">
        <span v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-2">
            <RouterLink 
            v-if="crumb.path"
            :to="crumb.path"
            class="hover:underline"
            >
                {{ crumb.label }}
            </RouterLink>
            <span v-else class="text-gray-700 font-medium">
                {{ crumb.label }}
            </span>
            <span v-if="index < breadcrumbs.length - 1">/</span>
        </span>
    </nav>
</template>
<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
    return route.matched.map((r) => {
        return {
            label: r.meta?.breadcrumb ?? r.name,
            path: r.path !== route.path ? r.path : null
        }
    })
})
</script>