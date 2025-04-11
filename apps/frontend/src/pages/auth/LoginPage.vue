<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import PrimaryButton from '@/components/ui/ActionButton.vue';
import { useZodForm } from '@/composables/forms/useZodForm';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const formError = ref<string | null>(null);
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});

const { form, errors, validate } = useZodForm(loginSchema, {
  email: '',
  password: '',
});
const isSubmitting = ref(false);

const handleLogin = async () => {
  formError.value = null;
  if (!validate()) return;

  isSubmitting.value = true;

  try {
    await auth.login(form.email, form.password);
    router.push('/');
  } catch (err) {
    if (err instanceof Error) {
      formError.value = err.message;
    } else {
      formError.value = 'Erro desconhecido.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="bg-gray-900 min-h-screen flex items-center justify-center px-4">
    <div class="w-full sm:max-w-md bg-surface rounded-xl shadow-xl p-6 space-y-6">
      <div class="flex justify-center">
        <img src="@/assets/images/logo.png" class="h-16" alt="Logo" />
      </div>

      <h1 class="text-2xl font-bold text-white text-center">Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <FormControl label="E-mail" for="email" :error="errors.email">
          <BaseInput
            id="email"
            v-model="form.email"
            placeholder="email@empresa.com"
            type="email"
            autocomplete="current-email"
          />
        </FormControl>

        <FormControl label="Senha" for="password" :error="errors.password">
          <BaseInput
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </FormControl>

        <div class="flex items-center justify-between text-sm text-white/70">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="accent-blue-500" />
            Lembrar de mim
          </label>
          <a href="#" class="text-primary-500 hover:underline">Esqueceu a senha?</a>
        </div>
        <p v-if="formError" class="text-red-500 text-sm text-center">
          {{ formError }}
        </p>
        <PrimaryButton
          title="Fazer Login"
          class="w-full"
          type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        />
      </form>    </div>
  </section>
</template>
