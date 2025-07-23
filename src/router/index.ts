// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout/index.vue'
import AuthView from '../views/AuthView/index.vue'

const routes = [
    {
        path: '/auth',
        component: AuthView,
        meta: { layout: AuthLayout },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;