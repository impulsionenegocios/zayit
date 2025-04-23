import SuperAdminLayout from '@/layouts/AdminLayout.vue';

export default [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin', breadcrumb: 'Dashboard' },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
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
        path: 'roles',
        meta: { breadcrumb: 'Roles' },
        children: [
          {
            path: '',
            name: 'VerRoles',
            component: () => import('@/pages/admin/roles/RolesPage.vue'),
          },
          {
            path: 'novo',
            name: 'AddRole',
            component: () => import('@/pages/admin/roles/AddRole.vue'),
            meta: { breadcrumb: 'Criar Role' },
          },
          {
            path: 'editar/:id',
            name: 'EditarRole',
            component: () => import('@/pages/admin/roles/EditRole.vue'),
            meta: { breadcrumb: 'Editar Role' },
          },
        ],
      },
      {
        path: 'Crm',
        meta: { breadcrumb: 'Crm' },
        children: [
          {
            path: '',
            name: 'Ver Kanban',
            component: () => import('@/pages/admin/crm/KanbanPage.vue'),
            meta: { breadcrumb: 'Ver Leads' },
          },
          {
            path: '',
            name: 'Ver Tags',
            component: () => import('@/pages/admin/crm/TagsPage.vue'),
            meta: { breadcrumb: 'Ver Tags' },
          },
        ],
      },
    ],
  },
];
