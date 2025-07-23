// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import { useAuthStore } from './stores/auth';

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const authStore = useAuthStore();
authStore.initializeAuth();

app.use(router)
app.mount('#app')