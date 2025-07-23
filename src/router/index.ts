// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import AuthView from '../views/AuthView/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        component: AuthView,
        meta: {
            layout: 'AuthLayout',
        },
    },
    // Exemplo de uma futura rota de Dashboard dentro de outro layout
    /*
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: {
            layout: 'DefaultLayout', // Assumindo que você terá um DefaultLayout
            requiresAuth: true // Exemplo de meta para proteção de rota
        },
    },
    */
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;