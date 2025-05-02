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
        meta: { breadcrumb: 'CRMs' },
        children: [
          {
            path: '',
            name: 'CRMList',
            component: () => import('@/pages/crm/CRMListPage.vue'),
          },
          {
            path: 'create',
            name: 'CRMCreate',
            component: () => import('@/pages/crm/CRMCreatePage.vue'),
          },
          {
            path: ':crmId',
            props: true,
            meta: { breadcrumb: 'CRM Detail' },
            children: [
              { path: '', redirect: { name: 'CRMDashboard' } },
              {
                path: 'dashboard',
                name: 'CRMDashboard',
                component: () => import('@/pages/crm/CRMDashboardPage.vue'),
              },
              // {
              //   path: 'leads',
              //   name: 'CRMLeadList',
              //   component: () => import('@/pages/crm/leads/LeadListView.vue'),
              // },
              {
                path: 'leads/new',
                name: 'CRMLeadCreate',
                component: () => import('@/pages/crm/leads/LeadFormView.vue'),
              },
              {
                path: 'leads/manage',
                name: 'CRMManagement',
                component: () => import('@/pages/crm/CRMManagementPage.vue'),
              },
              {
                path: 'leads/:leadId',
                name: 'CRMLeadDetail',
                component: () => import('@/pages/crm/leads/LeadDetailView.vue'),
              },
              {
                path: 'leads/:leadId/edit',
                name: 'CRMLeadEdit',
                component: () => import('@/pages/crm/leads/LeadFormView.vue'),
              },
              {
                path: 'tags',
                name: 'CRMTags',
                component: () => import('@/pages/crm/tags/TagsPage.vue'),
              },
              {
                path: 'settings',
                name: 'CRMEdit',
                component: () => import('@/pages/crm/CRMEditPage.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
];
