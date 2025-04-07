// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import AuthRoutes from './Auth';
import AdminRoutes from './Admin';
import CompanyRoutes from './Company';

import NotFoundPage from '@/pages/errors/NotFoundPage.vue';

const routes = [
  ...AuthRoutes,
  ...AdminRoutes,
  ...CompanyRoutes,
  {
    path: '/dashboard',
    name: 'DashboardRedirect',
    redirect: () => {
      const auth = useAuthStore();
      const role = auth.perfil?.role;

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
      const role = auth.perfil?.role;

      if (!auth.user) return '/login';

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

router.beforeEach((to, _, next) => {
  const auth = useAuthStore();
  const isAuth = !!auth.user;
  const requiredRole = to.meta?.role;

  if (to.meta.requiresAuth && !isAuth) {
    return next('/login');
  }

  if (requiredRole && auth.perfil?.role !== requiredRole) {
    return next('/login');
  }

  return next();
});
