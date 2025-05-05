import SuperAdminLayout from '@/layouts/AdminLayout.vue';

export default [
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin', breadcrumb: 'Dashboard' },
    children: [
      // Dashboard
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },

      // Clientes
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

      // Roles
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

      // CRMs e tudo que é scoped por CRM, incluindo Tags dentro de cada CRM
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
                meta: { breadcrumb: 'Tags' },
                children: [
                  {
                    path: '',
                    name: 'CRMTags',
                    component: () => import('@/pages/crm/CRMManagementPage.vue'),
                  },
                  {
                    path: 'new',
                    name: 'CreateTag',
                    component: () => import('@/pages/crm/tags/CreateTag.vue'),
                    meta: { breadcrumb: 'Criar Tag' },
                  },
                  {
                    path: 'editar/:id',
                    name: 'EditTag',
                    component: () => import('@/pages/crm/tags/EditTag.vue'),
                    meta: { breadcrumb: 'Editar Tag' },
                  },
                ],
              },
              // Scripts
              {
                path: 'scripts',
                meta: { breadcrumb: 'Scripts' },
                children: [
                  {
                    path: '',
                    name: 'CRMScripts',
                    component: () => import('@/pages/crm/CRMManagementPage.vue'),
                    props: (route: any) => ({ tab: 'scripts' }),
                  },
                  {
                    path: 'new',
                    name: 'ScriptForm',
                    component: () => import('@/pages/crm/scripts/ScriptFormPage.vue'),
                    meta: { breadcrumb: 'Criar Script' },
                  },
                  {
                    path: ':scriptId/edit',
                    name: 'ScriptEdit',
                    component: () => import('@/pages/crm/scripts/ScriptFormPage.vue'),
                    meta: { breadcrumb: 'Editar Script' },
                  },
                ],
              },
              
              {
                path: 'settings',
                name: 'CRMEdit',
                component: () => import('@/pages/crm/CRMManagementPage.vue'),
              },
          // relatórios
              
            ],
            
          },          
        ],
      },
      {
        path: 'reports',
        meta: { breadcrumb: 'Relatórios' },
        children: [
          {
            path: 'teste',
            name: 'teste',
            component: () => import('@/components/reports/metaAds/teste.vue'),
            props: true,
          },
        ],
      },
    ],
  },
]
