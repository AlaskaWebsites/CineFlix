// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts';

import AuthView from '@/views/Auth/index.vue' // Renomeado para 'AuthView' para clareza
import RegisterView from '@/views/Register/index.vue' // <-- NOVA IMPORTAÇÃO
import DashboardView from '@/views/Dashboard/index.vue' // Renomeado para 'DashboardView'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        // O componente principal para '/auth' não é mais o AuthView diretamente,
        // mas sim um wrapper para agrupar as rotas filhas que usam o AuthLayout
        // Como o App.vue já lida com o layout, podemos usar um componente vazio ou apenas as children
        children: [
            {
                path: '', // Rota padrão para /auth (ou seja, /auth)
                name: 'Auth',
                component: AuthView,
                meta: {
                    layout: 'Auth',
                    requiresAuth: false, // Esta rota NÃO requer autenticação
                },
            },
            {
                path: 'register', // Rota para /auth/register
                name: 'Register', // <-- NOVA ROTA: nome para navegação
                component: RegisterView, // <-- NOVO COMPONENTE: sua view de registro
                meta: {
                    layout: 'Auth', // Usa o mesmo AuthLayout
                    requiresAuth: false, // Esta rota NÃO requer autenticação
                },
            },
        ],
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: {
            layout: 'Default',
            requiresAuth: true, // Esta rota REQUER autenticação
        },
    },
    // Rota catch-all para redirecionar para o login se não encontrar nada ou for rota protegida
    {
        path: '/:catchAll(.*)', // Captura qualquer caminho não definido
        redirect: (_to) => { // Redirecionamento dinâmico
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
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    // Cenário 1: Tentando acessar rota protegida sem estar logado
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        next({ name: 'Auth' }); // Redireciona para a tela de login
    }
    // Cenário 2: Tentando acessar a rota de login/autenticação ou registro já estando logado
    else if ((to.name === 'Auth' || to.name === 'Register') && authStore.isLoggedIn) { // <-- Lógica atualizada para incluir 'Register'
        next({ name: 'Dashboard' }); // Redireciona para o dashboard
    }
    // Cenário 3: Permite a navegação
    else {
        next();
    }
});

export default router;