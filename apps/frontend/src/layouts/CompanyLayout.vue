<template>
    <div class="h-screen flex w-full place-content-center">
        <div class="place-self-center place-content-center text-3xl flex flex-col">
            Esse usuário ({{ auth.user?.displayName }}) é um cliente né safadhenho 😏
            <img class="mt-4" src="https://i.pinimg.com/originals/ea/15/ad/ea15ad63ccc62fc94b077ad8761a7cc7.gif" alt="Cachorro e menino rebolando" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { userFormSchema } from '@shared/schemas/user';
const auth = useAuthStore()

</script>