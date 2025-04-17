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
            name: 'VerClientes',
            component: () => import('@/pages/admin/clientes/ClientesPage.vue'),
          },
          {
            path: 'novo',
            name: 'AddCliente',
            component: () => import('@/pages/admin/clientes/AddCliente.vue'),
            meta: { breadcrumb: 'Criar Cliente' },
          },
          {
            path: 'editar/:id',
            name: 'EditarCliente',
            component: () => import('@/pages/admin/clientes/EditCliente.vue'),
            meta: { breadcrumb: 'Editar Cliente' },
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
