// src/stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from '@/types/User';
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/services/localStorageService';

const AUTH_STORAGE_KEY = 'cineflix_auth_user';

// Defina a interface para o estado da store
interface AuthState {
    currentUser: User | null; // explicitly allow null
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({ // Explicitly type the state function
        currentUser: getFromLocalStorage<User>(AUTH_STORAGE_KEY)[0] || null,
        isAuthenticated: !!(getFromLocalStorage<User>(AUTH_STORAGE_KEY)[0]),
    }),
    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        user: (state) => state.currentUser,
    },
    actions: {
        setAuthenticatedUser(user: User) {
            this.currentUser = user;
            this.isAuthenticated = true;
            saveToLocalStorage(AUTH_STORAGE_KEY, [user]);
        },
        logout() {
            this.currentUser = null;
            this.isAuthenticated = false;
            removeFromLocalStorage(AUTH_STORAGE_KEY);
        },
        initializeAuth() {
            const storedUser = getFromLocalStorage<User>(AUTH_STORAGE_KEY)[0];
            if (storedUser) {
                this.currentUser = storedUser;
                this.isAuthenticated = true;
            }
        }
    },
});