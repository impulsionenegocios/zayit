<!-- src/pages/Login.vue -->
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />
    <button type="submit">Entrar</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value)
    router.push('/') // redireciona pro painel ou home
  } catch (err) {
    console.error('Erro no login', err)
    // mostrar erro na UI se quiser
  }
}
</script>
