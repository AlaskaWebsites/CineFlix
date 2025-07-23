// src/stores/users.ts
import { defineStore } from 'pinia';
import type { User } from '@/types/User';
import { getFromLocalStorage, saveToLocalStorage } from '@/services/localStorageService';
import { generateUniqueId } from '@/utils/idGenerator';

const USERS_STORAGE_KEY = 'cineflix_users';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: getFromLocalStorage<User>(USERS_STORAGE_KEY),
    }),
    getters: {
        // Retorna todos os usuários ativos
        activeUsers: (state) => state.users.filter(user => user.status === 'active'),
        // Retorna um usuário pelo ID
        getUserById: (state) => (id: string) => state.users.find(user => user.id === id),
    },
    actions: {
        addUser(user: Omit<User, 'id' | 'status'>) { // Recebe o usuário sem ID e status
            const newUser: User = {
                id: generateUniqueId(),
                status: 'active', // Novo usuário é sempre ativo
                ...user,
            };
            this.users.push(newUser);
            saveToLocalStorage(USERS_STORAGE_KEY, this.users);
            return newUser; // Opcional: retorna o usuário com o ID gerado
        },
        updateUser(updatedUser: User) {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
                this.users[index] = updatedUser;
                saveToLocalStorage(USERS_STORAGE_KEY, this.users);
            }
        },
        // Soft delete
        deactivateUser(userId: string) {
            const user = this.users.find(u => u.id === userId);
            if (user) {
                user.status = 'inactive';
                saveToLocalStorage(USERS_STORAGE_KEY, this.users);
            }
        },
        // Exemplo de login (simplificado, sem hash de senha)
        login(document: string, password: string): User | null {
            const user = this.users.find(u => u.document === document && u.password === password && u.status === 'active');
            if (user) {
                // Lógica para marcar usuário como logado (em outra store, talvez 'auth')
                console.log(`Usuário ${user.name} logado com sucesso.`);
                return user;
            }
            console.log('Documento ou senha inválidos ou usuário inativo.');
            return null;
        }
    },
});