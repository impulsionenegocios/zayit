// src/router/Admin.ts
import SuperAdminLayout from '@/layouts/AdminLayout.vue';

export default [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin', Breadcrumb: 'Dashboard' },
    children: [
      {
        path: '',
        name: 'SuperAdminDashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
      {
        path: 'clientes',
        name: 'Clientes',
        component: () => import('@/pages/admin/clientes/ClientesPage.vue'),
      },
    ],
  },
];
