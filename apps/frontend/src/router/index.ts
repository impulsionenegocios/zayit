import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import Login from '@/pages/auth/LoginPage.vue'
import Home from '@/pages/HomePage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard com verificação assíncrona do Firebase Auth
router.beforeEach((to, _from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
    unregisterAuthObserver()

    if (requiresAuth && !user) {
      next('/login')
    } else if (to.path === '/login' && user) {
      next('/')
    } else {
      next()
    }
  })
})
