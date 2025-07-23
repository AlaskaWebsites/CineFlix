// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


import Auth from '../views/Auth/index.vue'
import Dashboard from '../views/Dashboard/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
        meta: {
            layout: 'Auth',
            // requiresAuth: false // Exemplo de meta
        },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            layout: 'Default',
            // requiresAuth: true // Exemplo de meta
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;