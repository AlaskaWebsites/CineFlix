// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Não importamos os layouts aqui porque eles são resolvidos pelo App.vue via string
// import AuthLayout from '../layouts/AuthLayout/index.vue' // <-- Remova esta importação se não for usá-lo diretamente
// import DefaultLayout from '../layouts/DefaultLayout/index.vue' // <-- Remova esta importação

import AuthView from '../views/AuthView/index.vue'
import DashboardView from '../views/DashboardView/index.vue' // <-- Exemplo para futura rota

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        name: 'Auth',
        component: AuthView, // O componente real da sua view
        meta: {
            layout: 'AuthLayout', // <-- A string exata que você mapeou em App.vue
            // requiresAuth: false // Exemplo de meta
        },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView, // O componente real da sua view
        meta: {
            layout: 'DefaultLayout', // <-- A string exata que você mapeou em App.vue
            // requiresAuth: true // Exemplo de meta
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;