// router/index.ts
import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts';

// Views de Autenticação
import AuthView from '@/views/Auth/index.vue'
import RegisterView from '@/views/Register/index.vue'

// Views da Dashboard (importadas dinamicamente)
// import DashboardView from '@/views/Dashboard/index.vue' // Não é necessário importar aqui se for lazy-loaded
// import UsersView from '@/views/Users/index.vue' // Exemplo para clareza, mas serão importadas no componente

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
        component: () => import('@/views/Dashboard/index.vue'), // Importação dinâmica do DashboardView
        meta: {
            layout: 'Default',
            requiresAuth: true,
        },
        children: [ // Rotas filhas para os módulos da Dashboard
            {
                path: '', // Rota padrão da Dashboard (/dashboard)
                name: 'DashboardHome', // Nome mais específico para evitar conflito com 'Dashboard' pai
                component: () => import('@/views/Dashboard/index.vue'), // Pode ser um overview, por exemplo
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'users', // Rota para gerenciar usuários: /dashboard/users
                name: 'Users',
                component: () => import('@/views/Users/index.vue'), // Componente da listagem de usuários
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            // Rotas de CRUD para Usuários (Exemplo: Cadastro/Edição)
            {
                path: 'users/new', // Rota para cadastro de novo usuário: /dashboard/users/new
                name: 'UserNew',
                component: () => import('@/views/UserForm/index.vue'), // Componente de formulário de usuário
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'users/:id/edit', // Rota para edição de usuário: /dashboard/users/123/edit
                name: 'UserEdit',
                component: () => import('@/views/UserForm/index.vue'), // Reutiliza o formulário de usuário
                props: true, // Permite passar o ID como prop para o componente
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'clients', // Rota para gerenciar clientes: /dashboard/clients
                name: 'Clients',
                component: () => import('@/views/Clients/index.vue'), // Componente da listagem de clientes
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            // Rotas de CRUD para Clientes (Exemplo: Cadastro/Edição)
            {
                path: 'clients/new', // Rota para cadastro de novo cliente: /dashboard/clients/new
                name: 'ClientNew',
                component: () => import('@/views/ClientForm/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'clients/:id/edit', // Rota para edição de cliente: /dashboard/clients/123/edit
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
                component: () => import('@/views/Movies/index.vue'), // Componente da listagem de filmes
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'rentals', // Rota para gerenciar locações: /dashboard/rentals
                name: 'Rentals',
                component: () => import('@/views/Rentals/index.vue'), // Componente da listagem de locações
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            // Rotas de CRUD para Locações (Exemplo: Nova Locação)
            {
                path: 'rentals/new', // Rota para nova locação: /dashboard/rentals/new
                name: 'RentalNew',
                component: () => import('@/views/RentalForm/index.vue'),
                meta: {
                    layout: 'Default',
                    requiresAuth: true,
                },
            },
            {
                path: 'rentals/:id/edit', // Opcional: Edição de Locação
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
                return { name: 'DashboardHome' }; // Redireciona para a home da Dashboard
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
        next({ name: 'DashboardHome' }); // Redireciona para a home da Dashboard
    }
    else {
        next();
    }
});

export default router;