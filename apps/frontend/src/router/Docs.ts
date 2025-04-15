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
      {
        path: 'toast',
        name: 'Docs Toasts',
        component: () => import('@/pages/docs/toast.vue'),
        meta: { breadcrumb: 'Toast' },
      },
      {
        path: 'modal',
        name: 'Docs Modal',
        component: () => import('@/pages/docs/modal.vue'),
        meta: { breadcrumb: 'Modal' },
      },
      {
        path: 'tables',
        name: 'Docs Table',
        component: () => import('@/pages/docs/table.vue'),
        meta: { breadcrumb: 'Modal' },
      },
      // Adicione outras páginas aqui
    ],
  },
]
