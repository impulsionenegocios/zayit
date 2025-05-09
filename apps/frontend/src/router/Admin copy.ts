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
        path: 'leads',
        meta: { breadcrumb: 'CRM' },
        children: [
          {
            path: '',
            name: 'LeadList',
            component: () => import('@/pages/crm/leads/LeadListView.vue'),
            meta: { breadcrumb: 'Leads & Clients' },
          },
          {
            path: 'new',
            name: 'CreateLead',
            component: () => import('@/pages/crm/leads/LeadFormView.vue'),
            meta: { breadcrumb: 'Create Lead' },
          },
          {
            path: ':id',
            name: 'LeadDetail',
            component: () => import('@/pages/crm/leads/LeadDetailView.vue'),
            meta: { breadcrumb: 'Lead Details' },
          },
          {
            path: ':id/edit',
            name: 'EditLead',
            component: () => import('@/pages/crm/leads/LeadFormView.vue'),
            meta: { breadcrumb: 'Edit Lead' },
          },
        ],
      },
      {
        path: 'tags',
        meta: { breadcrumb: 'Tags' },
        children: [
          {
            path: '',
            name: 'TagsList',
            component: () => import('@/pages/crm/tags/TagsPage.vue'),
          },
          {
            path: 'new',
            name: 'CreateTag',
            component: () => import('@/pages/crm/tags/CreateTag.vue'),
            meta: { breadcrumb: 'Create Tag' },
          },
          {
            path: 'editar/:id',
            name: 'EditTag',
            component: () => import('@/pages/crm/tags/EditTag.vue'),
            meta: { breadcrumb: 'Edit Tag' },
          },
        ],
      },
      {
        path: 'crms',
        meta: { breadcrumb: 'Crms' },
        children: [
          {
            path: ':id',
            name: 'CRMDashboard',
            component: () => import('@/pages/crm/CRMDashboardPage.vue'),
          },
          {
            path: 'list',
            name: 'CRMList',
            component: () => import('@/pages/crm/CRMListPage.vue'),
          },
          {
            path: 'create',
            name: 'CRMCreate',
            component: () => import('@/pages/crm/CRMCreatePage.vue'),
          },
          {
            path: ':id/edit',
            name: 'CRMEdit',
            component: () => import('@/pages/crm/CRMEditPage.vue'),
          },
        ],
      },
    ],
  },
];
