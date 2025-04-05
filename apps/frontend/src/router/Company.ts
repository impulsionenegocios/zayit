// src/router/Company.ts
import CompanyLayout from '@/layouts/CompanyLayout.vue'

export default [
  {
    path: '/company',
    component: CompanyLayout,
    meta: { requiresAuth: true, role: 'company' },
    children: [
      {
        path: '',
        name: 'CompanyHome',
        component: () => import('@/pages/company/HomePage.vue'),
      },
    ],
  },
]
