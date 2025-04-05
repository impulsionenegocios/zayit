// src/router/Admin.ts
import SuperAdminLayout from '@/layouts/AdminLayout.vue'

export default [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin' },
    children: [
      {
        path: '',
        name: 'SuperAdminDashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
    ],
  },
]
