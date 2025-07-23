// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts';

// Views de Autenticação
import AuthView from '@/views/Auth/index.vue'
import RegisterView from '@/views/Register/index.vue'

// Importação do novo DashboardHomeView
import DashboardHomeView from '@/views/DashboardHome/index.vue' // <-- NOVA IMPORTAÇÃO AQUI

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        children: [
            {
                path: '',
                name: 'Auth',
                component: AuthView,
                meta: {
                    layout: 'Auth',
                    requiresAuth: false,
                },
            },
            {
                path: 'register',
                name: 'Register',
                component: RegisterView,
                meta: {
                    layout: 'Auth',
                    requiresAuth: false,
                },
            },
        ],
    },
    {
        path: '/dashboard',
        // O DashboardView agora é o componente pai que contém o <router-view> para seus filhos
        component: () => import('@/views/Dashboard/index.vue'), // Importação dinâmica do DashboardView (o container)
        meta: {
            layout: 'Default',
            requiresAuth: true,
        },
        children: [ // Rotas filhas para os módulos da Dashboard
            {
                path: '', // Rota padrão da Dashboard (/dashboard)
                name: 'DashboardHome',
                component: DashboardHomeView, // <-- AGORA APONTA PARA O DashboardHomeView
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'users', // Rota para gerenciar usuários: /dashboard/users
                name: 'Users',
                component: () => import('@/views/Users/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            // Rotas de CRUD para Usuários (Cadastro/Edição)
            {
                path: 'users/new',
                name: 'UserNew',
                component: () => import('@/views/UserForm/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'users/:id/edit',
                name: 'UserEdit',
                component: () => import('@/views/UserForm/index.vue'),
                props: true,
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'clients', // Rota para gerenciar clientes: /dashboard/clients
                name: 'Clients',
                component: () => import('@/views/Clients/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            // Rotas de CRUD para Clientes (Cadastro/Edição)
            {
                path: 'clients/new',
                name: 'ClientNew',
                component: () => import('@/views/ClientForm/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'clients/:id/edit',
                name: 'ClientEdit',
                component: () => import('@/views/ClientForm/index.vue'),
                props: true,
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'movies', // Rota para gerenciar filmes: /dashboard/movies
                name: 'Movies',
                component: () => import('@/views/Movies/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'rentals', // Rota para gerenciar locações: /dashboard/rentals
                name: 'Rentals',
                component: () => import('@/views/Rentals/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            // Rotas de CRUD para Locações (Nova Locação)
            {
                path: 'rentals/new',
                name: 'RentalNew',
                component: () => import('@/views/RentalForm/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'rentals/:id/edit',
                name: 'RentalEdit',
                component: () => import('@/views/RentalForm/index.vue'),
                props: true,
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
        ],
    },
    {
        path: '/:catchAll(.*)',
        redirect: (_to) => {
            const authStore = useAuthStore();
            if (authStore.isLoggedIn) {
                return { name: 'DashboardHome' };
            }
            return { name: 'Auth' };
        },
        meta: { requiresAuth: false }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        next({ name: 'Auth' });
    }
    else if ((to.name === 'Auth' || to.name === 'Register') && authStore.isLoggedIn) {
        next({ name: 'DashboardHome' });
    }
    else {
        next();
    }
});

export default router;