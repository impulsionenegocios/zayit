import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import AuthRoutes from './Auth';
import AdminRoutes from './Admin';
import CompanyRoutes from './Company';
import Docs from './Docs';
import NotFoundPage from '@/pages/errors/NotFoundPage.vue';

const routes = [
  ...AuthRoutes,
  ...AdminRoutes,
  ...CompanyRoutes,
  ...Docs,
  {
    path: '/dashboard',
    name: 'DashboardRedirect',
    redirect: () => {
      const auth = useAuthStore();
      // Usar a computed property getRole em vez de acessar diretamente o perfil
      const role = auth.getRole;

      if (role === 'superadmin') return '/superadmin';
      if (role === 'company') return '/company';
      if (role === 'user') return '/user';
      return '/login';
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore();
      // Usar a computed property getRole em vez de acessar diretamente o perfil
      const role = auth.getRole;

      if (!auth.isAuthenticated) return '/login';

      if (role === 'superadmin') return '/superadmin';
      if (role === 'company') return '/company';
      if (role === 'user') return '/user';

      return '/login'; // fallback
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Função auxiliar para aguardar a inicialização da autenticação
const waitForAuthInit = async () => {
  const auth = useAuthStore();

  if (auth.authInitialized) return;

  // Esperar até que a autenticação seja inicializada (máx 3 segundos)
  let count = 0;
  const maxCount = 30; // 30 x 100ms = 3 segundos

  while (!auth.authInitialized && count < maxCount) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    count++;
  }

  // Se ainda estiver carregando após o tempo limite, continuar mesmo assim
  if (!auth.authInitialized) {
    console.warn('Tempo limite excedido aguardando inicialização da autenticação');
  }
};

// Guardiões de rotas para autenticação e autorização
router.beforeEach(async (to, from, next) => {
  // Esperar pela inicialização da autenticação
  await waitForAuthInit();

  const auth = useAuthStore();
  // Usar a computed property em vez de verificar o user diretamente
  const isAuth = auth.isAuthenticated;
  const requiredRole = to.meta?.role as string | undefined;

  // Rotas públicas não exigem verificação
  if (!to.meta.requiresAuth) {
    return next();
  }

  // Se a rota exige autenticação mas o usuário não está logado
  if (!isAuth) {
    // Armazena a rota original para redirecionamento após login
    localStorage.setItem('redirectAfterLogin', to.fullPath);
    return next('/login');
  }

  // Se a rota tem requisito de role específica
  if (requiredRole) {
    // Usar a computed property getRole
    const userRole = auth.getRole;

    // Permitir acesso a superadmin em todas as rotas
    if (userRole === 'superadmin') {
      return next();
    }

    if (userRole !== requiredRole) {
      console.warn(`Acesso negado: Role requerida ${requiredRole}, usuário tem ${userRole}`);
      return next('/unauthorized');
    }
  }

  return next();
});

export default router;
