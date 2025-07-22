import { createWebHistory, createRouter } from 'vue-router'

import AuthView from '../pages/AuthView/Auth.vue'
import Dashboard from '../pages/DashboardView/Dashboard.vue'

const routes = [
    { path: '/', component: AuthView },
    { path: '/dashboard', component: Dashboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;