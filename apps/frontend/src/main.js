import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/assets/main.css';
import App from './App.vue';
import { router } from './router';
import { watchAuthToken } from '@/utils/authToken';
import { useAuthStore } from '@/stores/auth';
import { configure } from 'vee-validate';
import { generateValidationMessage } from '@/validations/messages';
import '@/validations/rules'; // Importa e registra todas as regras
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
// 🔥 Depois do pinia, inicializa a store
const auth = useAuthStore();
auth.initAuth();
app.use(router);
watchAuthToken();
configure({
  generateMessage: generateValidationMessage,
});
app.mount('#app');
