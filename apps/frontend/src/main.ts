import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/assets/main.css';
import App from './App.vue';
import { router } from './router';

import { useAuthStore } from '@/stores/auth';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

// 🔥 Depois do pinia, inicializa a store
const auth = useAuthStore();
auth.initAuth();

app.use(router);

app.mount('#app');
