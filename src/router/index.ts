// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'; // Importe sua store de autenticação

import Auth from '../views/Auth/index.vue' // Renomeado de 'Auth' para 'Auth' para consistência
import Dashboard from '../views/Dashboard/index.vue' // Renomeado de 'Dashboard' para 'Dashboard'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
        meta: {
            layout: 'Auth',
            requiresAuth: false, // Esta rota NÃO requer autenticação
        },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            layout: 'Default',
            requiresAuth: true, // Esta rota REQUER autenticação
        },
    },
    // Rota catch-all para redirecionar para o login se não encontrar nada ou for rota protegida
    {
        path: '/:catchAll(.*)', // Captura qualquer caminho não definido
        redirect: (to) => { // Redirecionamento dinâmico
            const authStore = useAuthStore();
            if (authStore.isLoggedIn) {
                return { name: 'Dashboard' }; // Se logado, vai pro dashboard
            }
            return { name: 'Auth' }; // Se não logado, vai pro login
        },
        meta: { requiresAuth: false } // Esta rota coringa não precisa de auth para funcionar o redirect
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation Guard (Proteção de Rotas)
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // Cenário 1: Tentando acessar rota protegida sem estar logado
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        next({ name: 'Auth' }); // Redireciona para a tela de login
    }
    // Cenário 2: Tentando acessar a rota de login/autenticação já estando logado
    else if (to.name === 'Auth' && authStore.isLoggedIn) {
        next({ name: 'Dashboard' }); // Redireciona para o dashboard
    }
    // Cenário 3: Permite a navegação
    else {
        next();
    }
});

export default router;