import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/assets/main.css';
import App from './App.vue';
import { router } from './router';
import { watchAuthToken } from '@/utils/authToken';
import VueApexCharts from 'vue3-apexcharts';
import { useAuthStore } from '@/stores/auth';
import { configure } from 'vee-validate';
import { generateValidationMessage } from '@/validations/messages';
import '@/validations/rules';
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(VueApexCharts)
// 🔥 Depois do pinia, inicializa a store e AGUARDA a inicialização
const auth = useAuthStore();
// Inicializar auth de forma assíncrona - não bloqueia a montagem da aplicação
auth.initAuth();

app.use(router);
watchAuthToken();

configure({
  generateMessage: generateValidationMessage,
});
app.mount('#app');
