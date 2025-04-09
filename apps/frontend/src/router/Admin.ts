// src/router/Admin.ts
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import SuperAdminLayout from '@/layouts/AdminLayout.vue';

export default [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin', breadcrumb: 'Dashboard' },
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
        meta: { breadcrumb: 'Clientes' }
      },
    ],
  },
];
