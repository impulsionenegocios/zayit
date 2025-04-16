import SuperAdminLayout from '@/layouts/AdminLayout.vue'


export default [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin', breadcrumb: 'Dashboard' },
    children: [
      {
        path: 'clientes',
        meta: { breadcrumb: 'Clientes' },
        children: [
          {
            path: '',
            name: 'Clientes',
            component: () => import('@/pages/admin/clientes/ClientesPage.vue'),
          },
          {
            path: 'novo',
            name: 'AddCliente',
            component: () => import('@/pages/admin/clientes/AddCliente.vue'),
            meta: { breadcrumb: 'Criar Cliente' },
          },
        ],
      },
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
    ],
  },
]
