// src/router/docs.ts
import SuperAdminLayout from '@/layouts/AdminLayout.vue'

export default [
  {
    path: '/docs',
    component: SuperAdminLayout,
    meta: { requiresAuth: true, role: 'superadmin', breadcrumb: 'Documentação' },
    children: [
      {
        path: 'upload',
        name: 'Docs Upload',
        component: () => import('@/pages/docs/upload.vue'),
        meta: { breadcrumb: 'Upload de Arquivos' },
      },
      {
        path: 'inputs',
        name: 'Docs Inputs',
        component: () => import('@/pages/docs/inputs.vue'),
        meta: { breadcrumb: 'Inputs' },
      },
      {
        path: 'layout',
        name: 'Docs Layout',
        component: () => import('@/pages/docs/layout.vue'),
        meta: { breadcrumb: 'Layout e Containers' },
      },
      // Adicione outras páginas aqui
    ],
  },
]
